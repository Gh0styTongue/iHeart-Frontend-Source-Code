import { breakpoints } from '@iheartradio/web.accomplice';
import { NavAdContainer } from '@iheartradio/web.accomplice/components/display-ads';
import { StationType, Status } from '@iheartradio/web.playback';
import type { ReactNode } from 'react';
import { memo, useEffect, useMemo, useReducer, useRef } from 'react';
import { isDeepEqual, isNonNullish, isNullish } from 'remeda';
import { useMediaQuery } from 'usehooks-ts';

import { handler } from '~app/ads/display/handler';
import type { DisplaySlot } from '~app/ads/display/state';
import {
  adClickHandler,
  addSlot,
  createSlotId,
  displayStateInitializer,
  displayStateReducer,
  removeSlot,
} from '~app/ads/display/state';
import { useDisplayTargeting } from '~app/ads/display/targeting';
import { playback } from '~app/playback/playback';

import { useDisplayAdsContext, useSlotRegistry } from './ads';
import { CompanionAd } from './companion-ad';
import { CCRPOS } from './constants';
import { DefaultNavAd } from './default';
import { useAdUnit } from './use-ad-unit';
import { useDisplayAd } from './use-display-ad';

export const NAV_AD_SIZES = [
  [300, 250],
  // [300, 600], TODO: disabling until "See what's new" button goes away
] as [number, number][];

export function NavAd() {
  const isLargeScreen = useMediaQuery(breakpoints.large);
  const { display } = useDisplayAd(isLargeScreen);
  const { enabled: displayAdsEnabled } = useDisplayAdsContext();

  return useMemo(
    () =>
      displayAdsEnabled ?
        <NavAdSlot display={display} displayAdsEnabled={displayAdsEnabled} />
      : null,
    [display, displayAdsEnabled],
  );
}

function NavAdSlot({
  display,
  displayAdsEnabled,
}: {
  display: boolean;
  displayAdsEnabled: boolean;
}) {
  useSlotRegistry();
  const adUnitPath = useAdUnit({ ccrpos: CCRPOS.LeftNav });

  const playerAdsState = playback.useAds();
  const { station, status } = playback.useState();

  const allowAdRefresh = useMemo(
    () =>
      !(
        station.type === StationType.Scan &&
        [Status.Playing, Status.Buffering, Status.Restart].includes(status)
      ),
    [station.type, status],
  );

  const [displayState, dispatch] = useReducer(
    displayStateReducer,
    { display, displayAdsEnabled },
    displayStateInitializer,
  );

  const targeting = useDisplayTargeting();

  const adPropsRef = useRef<{
    adUnitPath: string | null;
    targeting: { [k: string]: unknown };
  }>(null);

  /**
   * This `useEffect` checks that `displayState.display` is set to `ad`
   * and that we have an adUnitPath and that `{ adUnitPath, targeting }` is
   * not deeply equal to what was set previously set.
   *
   * If all of that is true, a state dispatch is triggered to set all the
   * relevant information required to create an ad slot
   */
  useEffect(() => {
    if (isNonNullish(adUnitPath)) {
      const adProps: Pick<DisplaySlot, 'adUnitPath' | 'targeting'> = {
        adUnitPath,
        targeting,
      };
      if (
        displayState.display === 'ad' &&
        !isDeepEqual(adProps, adPropsRef.current) &&
        allowAdRefresh
      ) {
        adPropsRef.current = { ...adProps };
        setTimeout(() => {
          dispatch({
            type: 'set_slot',
            payload: {
              ...adProps,
              ccrpos: '2000',
              slotId: createSlotId(4),
              size: NAV_AD_SIZES[0],
            },
          });
        }, 0);
      }
    }
  }, [
    adUnitPath,
    displayState.display,
    targeting,
    station.type,
    allowAdRefresh,
  ]);

  // When we have a new slot to add, this effect adds it
  useEffect(() => {
    if (isNonNullish(displayState.slot)) {
      const { slotId, adUnitPath, targeting, ccrpos, size } = displayState.slot;

      addSlot({
        adUnitPath,
        targeting,
        ccrpos,
        size,
        slotId,
      });

      return () => {
        removeSlot(slotId);
      };
    }
  }, [displayState]);

  /*
  The below code is added to capture the ad click event
  As an advert is rendering in the iframe, we can't capture the click event. `blur` event fired when the element/window loses focus
  (on iframe click or link opens in a new tab/window), we are capturing that, plus we are making sure that active element was advert.
  If the clicked element is an advert, then we are firing click event to advert container so that we can do any action (ex: firing analytics event).
  We are ensuring `blur` event *will* fire by focusing the window with `window.focus()`. Throttle is added to prevent multiple taps/clicks.
  */
  useEffect(() => {
    const abortController = new AbortController();

    const thisHandler = handler({ containerId: displayState.slot?.slotId });

    window.focus();
    window.addEventListener('blur', thisHandler, {
      signal: abortController.signal,
    });

    return () => {
      abortController.abort();
    };
  }, [displayState.slot?.slotId]);

  const currentCompanion = useMemo(
    () =>
      playerAdsState.current?.companions?.find(companion => {
        return (
          companion.height === NAV_AD_SIZES[0][1] &&
          companion.width === NAV_AD_SIZES[0][0]
        );
      }) ?? null,
    [playerAdsState],
  );

  useEffect(() => {
    if (isNonNullish(currentCompanion)) {
      dispatch({
        type: 'set_companion',
        payload: <CompanionAd companion={currentCompanion} />,
      });
    } else if (isNullish(currentCompanion)) {
      dispatch({ type: 'set_companion', payload: null });
    }
  }, [currentCompanion]);

  return useMemo(
    () => (
      <NavAdInner
        isCompanion={displayState.display === 'companion'}
        key={displayState.slot?.slotId}
        slotId={displayState.slot?.slotId}
      >
        <DefaultNavAd />
        {displayState.companionAd}
      </NavAdInner>
    ),
    [displayState.companionAd, displayState.display, displayState.slot?.slotId],
  );
}

const NavAdInner = memo(function NavAdInner({
  children,
  isCompanion,
  slotId,
}: {
  children: ReactNode;
  isCompanion: boolean;
  slotId?: string;
}) {
  return (
    <NavAdContainer
      data-test={isCompanion ? 'nav-ad-companion' : 'nav-ad-slot'}
      data-type={isCompanion ? 'companion' : 'ad'}
      height={NAV_AD_SIZES[0][1]}
      id={isCompanion ? 'nav-companion' : slotId}
      onClick={isCompanion ? undefined : adClickHandler}
      width={NAV_AD_SIZES[0][0]}
    >
      {children}
    </NavAdContainer>
  );
});
