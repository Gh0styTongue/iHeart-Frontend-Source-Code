import {
  breakpoints,
  ThemeEnum,
  useTheme,
  vars,
} from '@iheartradio/web.accomplice';
import { Box } from '@iheartradio/web.accomplice/components/box';
import { HomeAdContainer } from '@iheartradio/web.accomplice/components/display-ads';
import { Flex } from '@iheartradio/web.accomplice/components/flex';
import { Text } from '@iheartradio/web.accomplice/components/text';
import { useEffect, useMemo, useReducer, useRef } from 'react';
import { isDeepEqual, isNonNullish } from 'remeda';
import { useMediaQuery } from 'usehooks-ts';

import {
  setIsTakeover,
  useDisplayAdsContext,
  useSlotRegistry,
} from '~app/ads/display/ads';
import {
  type DisplaySlot,
  addSlot,
  displayStateInitializer,
  displayStateReducer,
  removeSlot,
} from '~app/ads/display/state';
import { useDisplayTargeting } from '~app/ads/display/targeting';
import { useAdUnit } from '~app/ads/display/use-ad-unit';
import { useDisplayAd } from '~app/ads/display/use-display-ad';

import { CCRPOS } from './constants';

const DESKTOP_AD_SIZE = [4, 1] as [number, number];
const MOBILE_AD_SIZE = [2, 1] as [number, number];

export function HeroAdvert({ hasAdvert }: { hasAdvert?: boolean }) {
  useSlotRegistry();
  const targeting = useDisplayTargeting();
  const adUnitPath = useAdUnit({ ccrpos: CCRPOS.Hero });
  const theme = useTheme();

  const { display } = useDisplayAd(true);
  const { enabled: displayAdsEnabled } = useDisplayAdsContext();

  const isMedium = useMediaQuery(breakpoints.shmedium);

  // This is a custom breakpoint to figure out when we need to show "Ad" tag within image as screen can be wider than image (expected image dimension 1416 x 344)
  const showAdTag = useMediaQuery('screen and (min-width: 1730px)');

  const [displayState, dispatch] = useReducer(
    displayStateReducer,
    { display, displayAdsEnabled },
    displayStateInitializer,
  );

  const adPropsRef = useRef<{
    adUnitPath: string | null;
    targeting: { [k: string]: unknown };
  }>(null);

  useEffect(() => {
    if (isNonNullish(hasAdvert)) {
      setIsTakeover(hasAdvert);
    } else {
      setIsTakeover(false);
    }

    return () => {
      setIsTakeover(false);
    };
  }, [hasAdvert]);

  useEffect(() => {
    if (isNonNullish(adUnitPath)) {
      const adProps: Pick<DisplaySlot, 'adUnitPath' | 'targeting'> = {
        adUnitPath,
        targeting,
      };
      if (
        displayState.display === 'ad' &&
        isNonNullish(adUnitPath) &&
        !isDeepEqual(adProps, adPropsRef.current)
      ) {
        adPropsRef.current = { ...adProps };
        setTimeout(() => {
          dispatch({
            type: 'set_slot',
            payload: {
              ...adProps,
              ccrpos: '2013',
              slotId: 'hero',
              size: isMedium ? DESKTOP_AD_SIZE : MOBILE_AD_SIZE,
            },
          });
        }, 0);
      }
    }
  }, [adUnitPath, displayState.display, isMedium, targeting]);

  useEffect(() => {
    if (
      isNonNullish(displayState.slot) &&
      isNonNullish(displayState.slot.adUnitPath)
    ) {
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

  return useMemo(
    () =>
      displayAdsEnabled ?
        <HomeAdContainer data-test="hero-ad-container" hasAdvert={hasAdvert}>
          <>
            <Box
              background={
                theme === ThemeEnum.light ? vars.color.gray100 : '#000000'
              }
              height="100%"
              left="0"
              opacity={hasAdvert ? 1 : 0}
              pointerEvents="none"
              position="absolute"
              width="100%"
            />
            <Flex
              alignContent="center"
              flexDirection="column"
              height="100%"
              justifyContent="center"
              opacity={hasAdvert ? 1 : 0}
              position="absolute"
              top="0"
              transition="opacity .3s linear"
            >
              <Flex
                alignItems="center"
                data-test="hero-ad-slot"
                id="hero"
                zIndex={vars.zIndex[0]}
              />
              {showAdTag ?
                <AdTag hasAdvert />
              : null}
            </Flex>
          </>
          {!showAdTag ?
            <AdTag hasAdvert />
          : null}
        </HomeAdContainer>
      : null,
    [displayAdsEnabled, hasAdvert, showAdTag, theme],
  );
}

function AdTag({ hasAdvert }: { hasAdvert: boolean }) {
  return (
    <Box
      backgroundColor={vars.color.gray500}
      borderRadius={vars.space[4]}
      color={vars.color.brandWhite}
      left={vars.space[16]}
      opacity={hasAdvert ? 1 : 0}
      padding={`${vars.space[4]} ${vars.space[12]}`}
      position="absolute"
      top={vars.space[12]}
      transition="opacity .3s linear"
      zIndex={vars.zIndex[0]}
    >
      <Text as="div" kind="button-2">
        Ad
      </Text>
    </Box>
  );
}
