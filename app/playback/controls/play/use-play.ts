import * as Playback from '@iheartradio/web.playback';
import { useCallback, useMemo } from 'react';
import { isEmpty } from 'remeda';

import {
  AdsTargetingState,
  useTargetingReady,
} from '~app/contexts/monetization';
import { playback } from '~app/playback/playback';

import type { PlayerEvents } from './common';
import { useIsCurrentStation } from './use-is-current-station';

export type UsePlayProps = Omit<Playback.Station, 'targeting'> & {
  isControlSet?: boolean;
  isScanStation?: boolean;
  itemId?: string | number | null;
};

export type DoPlayProps = {
  toggleScan?: boolean;
} & PlayerEvents;

export function usePlay(props: UsePlayProps) {
  const isCurrentStation = useIsCurrentStation(props);
  const checkReadyToLoad = useTargetingReady();

  const doLoadAndPlay = useCallback(
    async (player: Playback.Player<Playback.Station>, props: UsePlayProps) => {
      await player.load({
        ...props,
        targeting: AdsTargetingState.get('targetingParams'),
      });
      await player.play(props.context);
    },
    [],
  );

  const player = playback.usePlayer<Playback.Station>();
  const { status: adsStatus } = playback.useAds();
  const { index, isScanning, queue, status, station } = playback.useState();

  const currentItem = useMemo(() => queue[index]?.id, [index, queue]);
  const isCurrentItem = useMemo(
    () => currentItem === props.itemId,
    [currentItem, props.itemId],
  );

  const adBreak = ![
    Playback.AdPlayerStatus.Done,
    Playback.AdPlayerStatus.Idle,
    Playback.AdPlayerStatus.Streaming, // Don't disable player buttons if we're listening to a live stream ad
  ].includes(adsStatus);

  const stoppable = queue[index]?.type === Playback.QueueItemType.Stream;

  return {
    async doPlay(doPlayProps?: DoPlayProps) {
      const { toggleScan = false, onPause, onPlay, onStop } = doPlayProps ?? {};
      if (!isEmpty(props) && !isCurrentStation) {
        if (checkReadyToLoad()) {
          doLoadAndPlay(player, props);
          onPlay?.();
        } else {
          (function doCheck() {
            globalThis?.window?.setTimeout(() => {
              if (checkReadyToLoad()) {
                doLoadAndPlay(player, props);
                onPlay?.();
              } else {
                doCheck();
              }
            }, 100);
          })();
        }
      } else {
        if ([Playback.Status.Idle, Playback.Status.Paused].includes(status)) {
          const resolverState = player._get();
          // If the user presses "Scan Stations", we always want to reset the iteration counter to zero
          if (resolverState) {
            resolverState.set('iterations', 0);
          }
          player.play(props.context);
          onPlay?.();
        } else if (station.type === Playback.StationType.Scan) {
          // If the user presses "Scan Stations" (vs. the stop button in the player bar), we want
          // to just stop the scan, not playback
          if (toggleScan) {
            player.setScanning({ isScanning: !isScanning });
          } else if (!toggleScan) {
            player.stop();
            onStop?.();
          }
        } else {
          if (stoppable) {
            player.stop();
            onStop?.();
          } else {
            player.pause();
            onPause?.();
          }
        }
      }
    },
    buffering:
      (status === Playback.Status.Buffering && isCurrentStation && !adBreak) ||
      adsStatus === Playback.AdPlayerStatus.Buffering,
    currentItem,
    disabled: !isCurrentStation && adBreak,
    isCurrent: isCurrentStation || isCurrentItem,
    playing:
      (status === Playback.Status.Buffering ||
        status === Playback.Status.Playing) &&
      (isCurrentStation || isCurrentItem),
    stoppable: stoppable && !adBreak,
    tooltip:
      isCurrentStation || isCurrentItem ?
        {
          [Playback.Status.Buffering]: 'Buffering',
          [Playback.Status.Idle]: 'Play',
          [Playback.Status.Paused]: adBreak ? 'Resume Ad' : 'Play',
          [Playback.Status.Playing]:
            stoppable ?
              adBreak ? 'Pause Ad'
              : 'Stop'
            : 'Pause',
          // This status only appears for a split second when restarting content, and will never be visible in the tooltip
          // Needed to be present here to satisfy TS
          [Playback.Status.Restart]: 'Play',
        }[status]
      : 'Play',
    adBreak,
  } as const;
}
