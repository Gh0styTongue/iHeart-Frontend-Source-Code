import {
  addToast,
  UpgradeCTANotification,
} from '@iheartradio/web.accomplice/components/toast';
import * as Playback from '@iheartradio/web.playback';
import { useCallback } from 'react';

import type { RegGateContext } from '~app/analytics/data';
import { useInAppMessage } from '~app/analytics/in-app-message';
import {
  AdsTargetingState,
  useTargetingReady,
} from '~app/contexts/monetization';
import { useUser } from '~app/contexts/user';
import { useSubscribeUrl } from '~app/hooks/auth-urls';
import { usePageDataAsset } from '~app/hooks/use-page-data-asset';
import {
  ANALYTICS_ORIGIN,
  PAYLOAD_TRIGGER_TYPES,
  UPSELL_MESSAGE_TYPE,
} from '~app/utilities/constants';
import { isPremiumUser } from '~app/utilities/user';

import { playback } from '../../playback';
import type { DoPlayProps } from './use-play';
import { usePlay } from './use-play';

export type UseTopSongsPlayProps = Omit<
  Playback.TopSongsStation,
  'type' | 'targeting'
> & { artistName?: string; trackTitle?: string };

export function useTopSongsPlay(props: UseTopSongsPlayProps) {
  const isPremium = isPremiumUser(useUser());
  const player = playback.usePlayer<
    Playback.TopSongsStation | Playback.ArtistStation
  >();
  const checkReadyToLoad = useTargetingReady();

  const { onInAppMessageOpen } = useInAppMessage();

  const asset = usePageDataAsset();

  const globalStation = {
    id: asset?.sub?.id?.toString() || asset?.id?.toString(),
    name: asset?.sub?.name || asset?.name,
  };

  const pageName = props.context.pageName;

  const context = {
    trigger: PAYLOAD_TRIGGER_TYPES.PREMIUM,
    origin: ANALYTICS_ORIGIN.LISTEN,
    pageName,
    assetId: globalStation.id,
    assetName: globalStation.name,
    stationId: `Artist|${props.artistId}`,
    stationName: props.artistName,
    stationSubId: `song|${props.seed ?? props.id}`,
    stationSubName: props.trackTitle ?? props.name ?? '',
  } satisfies RegGateContext;

  const subscribeUrl = useSubscribeUrl({ context });

  const doLoadAndPlay = useCallback(async () => {
    await player.load({
      ...props,
      type: Playback.StationType.Artist,
      targeting: AdsTargetingState.get('targetingParams'),
    });
    await player.play();
  }, [player, props]);

  const play = usePlay({ ...props, type: Playback.StationType.TopSongs });

  async function doPlay(doPlayProps?: DoPlayProps) {
    if (isPremium) {
      play.doPlay(doPlayProps);
      return;
    }

    onInAppMessageOpen({
      ...(globalStation?.id && globalStation?.name ?
        {
          globalStation: {
            id: globalStation.id,
            name: globalStation.name,
          },
        }
      : {}),
      messageType: UPSELL_MESSAGE_TYPE.PRIMIUM,
      pageName: props.context.pageName ?? '',
      ...(props.context?.sectionName || props.context?.eventLocation ?
        { location: props.context.sectionName ?? props.context.eventLocation }
      : {}),
      userTriggered: true,
    });

    addToast(
      UpgradeCTANotification({
        size: { xsmall: 'small', medium: 'large' },
        path: subscribeUrl?.toString(),
      }),
    );

    if (checkReadyToLoad()) {
      doLoadAndPlay();
      doPlayProps?.onPlay?.();
    } else {
      (function doCheck() {
        globalThis.window.setTimeout(() => {
          if (checkReadyToLoad()) {
            doLoadAndPlay();
            doPlayProps?.onPlay?.();
          } else {
            doCheck();
          }
        }, 100);
      })();
    }
  }

  return { ...play, doPlay } as const;
}
