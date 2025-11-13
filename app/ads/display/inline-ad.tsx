import { breakpoints } from '@iheartradio/web.accomplice';
import {
  InlineAdContainer,
  InlineAdWrapper,
} from '@iheartradio/web.accomplice/components/display-ads';
import * as Playback from '@iheartradio/web.playback';
import type { ReactNode } from 'react';
import { memo, useEffect, useMemo, useReducer, useRef } from 'react';
import { isDeepEqual, isNonNullish } from 'remeda';
import { useMediaQuery } from 'usehooks-ts';

import { CompanionAd } from '~app/ads/display/companion-ad';
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
import { CCRPOS } from './constants';
import { DefaultLeaderboardAd } from './default';
import { handler } from './handler';
import { useAdUnit } from './use-ad-unit';
import { useDisplayAd } from './use-display-ad';

const MOBILE_INLINE_AD_SIZES = [320, 50] as [number, number];
const DESKTOP_INLINE_AD_SIZES = [728, 90] as [number, number];

type InlineAdSlotProps = {
  isGrid?: boolean;
};

export function InlineAd({ isGrid = false }: InlineAdSlotProps) {
  const isMedium = useMediaQuery(breakpoints.medium);
  const { display } = useDisplayAd(true);
  const { enabled: displayAdsEnabled } = useDisplayAdsContext();

  return useMemo(
    () =>
      displayAdsEnabled ?
        <InlineAdSlot
          display={display}
          displayAdsEnabled={displayAdsEnabled}
          isGrid={isGrid}
          isMedium={isMedium}
        />
      : null,
    [display, displayAdsEnabled, isGrid, isMedium],
  );
}

function InlineAdSlot({
  isGrid,
  isMedium,
  display,
  displayAdsEnabled,
}: {
  isGrid: boolean;
  isMedium: boolean;
  display: boolean;
  displayAdsEnabled: boolean;
}) {
  useSlotRegistry();

  const adUnitPath = useAdUnit({ ccrpos: CCRPOS.Inline });
  const playerAdsState = playback.useAds();
  const { station, status } = playback.useState();

  const allowAdRefresh = useMemo(
    () =>
      !(
        station.type === Playback.StationType.Scan &&
        [
          Playback.Status.Playing,
          Playback.Status.Buffering,
          Playback.Status.Restart,
        ].includes(status)
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
    size: [number, number];
  }>(null);

  useEffect(() => {
    if (isNonNullish(adUnitPath)) {
      const adProps: Pick<DisplaySlot, 'adUnitPath' | 'targeting' | 'size'> = {
        adUnitPath,
        targeting,
        size: isMedium ? DESKTOP_INLINE_AD_SIZES : MOBILE_INLINE_AD_SIZES,
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
              ccrpos: CCRPOS.Inline,
              slotId: createSlotId(4),
            },
          });
        }, 0);
      }
    }
  }, [adUnitPath, displayState.display, targeting, isMedium, allowAdRefresh]);

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
  }, [displayState.slot]);

  /*
    Below code is added to capture the ad click event
    As advert is rendering in the iframe, we can't capture the click event. `blur` event fired when element/window loses focus
    (on iframe click or link opens in new tab/window), we are capturing that plus we are making sure that active element was advert.
    If the clicked element is advert then we are firing click event to advert container so that we can do any action(ex: firing analytics event).
    We are ensuring `blur` event *will* fire by focusing window with `window.focus()`. Throttle is added to prevent multiple taps/clicks.
    */
  useEffect(() => {
    const abortController = new AbortController();

    window.focus();
    window.addEventListener(
      'blur',
      handler({ containerId: displayState.slot?.slotId }),
      { signal: abortController.signal },
    );

    return () => {
      abortController.abort();
    };
  }, [displayState.slot?.slotId]);

  const currentCompanion = useMemo(
    () =>
      playerAdsState.current?.companions?.find(companion => {
        return isMedium ?
            companion.height === DESKTOP_INLINE_AD_SIZES[1] &&
              companion.width === DESKTOP_INLINE_AD_SIZES[0]
          : companion.height === MOBILE_INLINE_AD_SIZES[1] &&
              companion.width === MOBILE_INLINE_AD_SIZES[0];
      }) ?? null,
    [playerAdsState, isMedium],
  );

  useEffect(() => {
    if (isNonNullish(currentCompanion)) {
      dispatch({
        type: 'set_companion',
        payload: <CompanionAd companion={currentCompanion} />,
      });
    } else if (isNonNullish(displayState.companionAd)) {
      dispatch({ type: 'set_companion', payload: null });
    }
  }, [currentCompanion, displayState.companionAd]);

  return useMemo(
    () => (
      <InlineAdWrapper isGrid={isGrid} key={displayState.slot?.slotId}>
        <InlineAdInner
          isCompanion={displayState.display === 'companion'}
          slotId={displayState.slot?.slotId}
        >
          <DefaultLeaderboardAd isMedium={isMedium} />
          {displayState.companionAd}
        </InlineAdInner>
      </InlineAdWrapper>
    ),
    [
      displayState.companionAd,
      displayState.display,
      displayState.slot?.slotId,
      isGrid,
      isMedium,
    ],
  );
}

const InlineAdInner = memo(function InlineAdInner({
  children,
  isCompanion,
  slotId,
}: {
  children: ReactNode;
  isCompanion: boolean;
  slotId?: string;
}) {
  return (
    <InlineAdContainer
      data-test={isCompanion ? 'inline-ad-companion' : 'inline-ad-slot'}
      data-type={isCompanion ? 'companion' : 'ad'}
      id={isCompanion ? 'inline-companion' : slotId}
      onClick={isCompanion ? undefined : adClickHandler}
    >
      {children}
    </InlineAdContainer>
  );
});
