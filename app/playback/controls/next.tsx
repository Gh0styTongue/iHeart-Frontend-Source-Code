import { lightDark, vars } from '@iheartradio/web.accomplice';
import { Button } from '@iheartradio/web.accomplice/components/button';
import { Flex } from '@iheartradio/web.accomplice/components/flex';
import type { IconProps } from '@iheartradio/web.accomplice/components/icon';
import { PlayerTooltip } from '@iheartradio/web.accomplice/components/player';
import { Text } from '@iheartradio/web.accomplice/components/text';
import {
  addToast,
  UpgradeCTANotification,
} from '@iheartradio/web.accomplice/components/toast';
import { SkipForward } from '@iheartradio/web.accomplice/icons/skip-forward';
import * as Playback from '@iheartradio/web.playback';
import { useCallback, useMemo } from 'react';
import { isNullish } from 'remeda';

import type { RegGateContext } from '~app/analytics/data';
import { useInAppMessage } from '~app/analytics/in-app-message';
import { useUser } from '~app/contexts/user';
import { useSubscribeUrl } from '~app/hooks/auth-urls';
import { usePageDataAsset } from '~app/hooks/use-page-data-asset';
import {
  ANALYTICS_LOCATION,
  ANALYTICS_ORIGIN,
  PAYLOAD_TRIGGER_TYPES,
  UPSELL_MESSAGE_TYPE,
} from '~app/utilities/constants';
import { isPremiumUser } from '~app/utilities/user';

import { playback } from '../../playback/playback';

/**
 * A user generally won't have this much, but this upper limit is to make sure we don't show the
 * Number.MAX_SAFE_INTEGER amount that Amp will return by default in some cases.
 */
const MAX_SKIPS = 100;

export function Next({
  size,
  isInMiniplayer = false,
}: {
  size?: IconProps['size'];
  isInMiniplayer?: boolean;
}) {
  const player = playback.usePlayer();
  const { adBreak } = playback.useAds();
  const state = playback.useState();
  const isPremium = isPremiumUser(useUser());

  const { onInAppMessageOpen } = useInAppMessage();

  const pageName = state.pageName ?? '';

  const asset = usePageDataAsset();

  const globalStation = useMemo(() => {
    return {
      id:
        asset?.sub?.id?.toString() ||
        asset?.id?.toString() ||
        `${state.station.type}|${state.station.id?.toString()}`,
      name: asset?.sub?.name || asset?.name || state.station.name,
    };
  }, [asset, state.station.id, state.station.name, state.station.type]);

  const context = {
    trigger: PAYLOAD_TRIGGER_TYPES.SKIP,
    origin: ANALYTICS_ORIGIN.LISTEN,
    pageName,
    assetId: globalStation.id,
    assetName: globalStation.name ?? '',
  } satisfies RegGateContext;

  const subscribeUrl = useSubscribeUrl({ context });
  const isPodcast = state.station?.type === Playback.StationType.Podcast;

  const next = useCallback(() => {
    if (
      !isPremium &&
      state.skips <= 0 &&
      state.station?.type !== Playback.StationType.Podcast
    ) {
      onInAppMessageOpen({
        ...(globalStation?.id && globalStation?.name ?
          {
            globalStation: {
              id: globalStation.id,
              name: globalStation.name,
            },
          }
        : {}),
        messageType: UPSELL_MESSAGE_TYPE.SKIP,
        pageName,
        location:
          isInMiniplayer ?
            ANALYTICS_LOCATION.MINIPLAYER_BUTTON
          : ANALYTICS_LOCATION.PROFILE_PLAYER,
        userTriggered: true,
      });

      addToast(
        UpgradeCTANotification({
          title: "You've reached your skip limit",
          text: 'Want to listen on demand with unlimited skips?',
          size: { xsmall: 'small', medium: 'large' },
          path: subscribeUrl?.toString(),
        }),
      );
    } else {
      player.next();
    }
  }, [
    isPremium,
    player,
    state.skips,
    state.station?.type,
    pageName,
    onInAppMessageOpen,
    globalStation,
    subscribeUrl,
    isInMiniplayer,
  ]);

  const skips =
    (
      !isPremium &&
      state.skips < MAX_SKIPS &&
      state?.station?.type !== Playback.StationType.Podcast
    ) ?
      state.skips
    : undefined;

  const tooltipContent =
    isNullish(skips) ? 'Next' : (
      `Next (${skips} ${skips === 1 ? 'skip' : 'skips'} left)`
    );

  const isDisabled = adBreak;

  return (
    <>
      <PlayerTooltip content={tooltipContent}>
        <Flex
          isHidden={
            isInMiniplayer ? { mobile: true, 'container-medium': false } : false
          }
        >
          <Button
            color="default"
            data-test="next-player-button"
            isDisabled={
              isDisabled || (isPodcast && state.station.isLastEpisode)
            }
            kind="tertiary"
            onPress={() => {
              next();
            }}
            size="icon"
          >
            <SkipForward size={size ?? 32} />
            {isNullish(skips) ? null : (
              <Text
                css={{
                  color:
                    isDisabled ?
                      lightDark(vars.color.gray300, vars.color.gray400)
                    : undefined,
                  left: '50%',
                  position: 'absolute',
                  top: '0',
                  transform: 'translateX(-50%)',
                  zIndex: '$1',
                }}
                kind="caption-3"
              >
                {skips}
              </Text>
            )}
          </Button>
        </Flex>
      </PlayerTooltip>
    </>
  );
}
