import type { ScanStopType } from '@iheartradio/web.analytics';
import * as Playback from '@iheartradio/web.playback';
import { useCallback } from 'react';

import {
  AdsTargetingState,
  useTargetingReady,
} from '~app/contexts/monetization';
import { playback } from '~app/playback/playback';

import { useIsCurrentStation } from './use-is-current-station';
import { usePlay } from './use-play';

export type UseScanPlayProps = Omit<
  Playback.ScanStation,
  'type' | 'targeting'
> & { onStartScan: () => void; onStopScan: (stopType: ScanStopType) => void };

export function useScanPlay(props: UseScanPlayProps) {
  const player = playback.usePlayer<Playback.ScanStation>();
  const current = useIsCurrentStation({
    ...props,
    type: Playback.StationType.Scan,
  });
  const checkReadyToLoad = useTargetingReady();

  const { status, isScanning } = player.getState().deserialize();

  const doLoadAndPlay = useCallback(
    async ({ toggleScan = false }: { toggleScan?: boolean }) => {
      if (!current) {
        await player.load({
          ...props,
          type: Playback.StationType.Scan,
          targeting: AdsTargetingState.get('targetingParams'),
        });
        player.play();
        props.onStartScan();
      } else {
        if ([Playback.Status.Idle, Playback.Status.Paused].includes(status)) {
          const resolverState = player._get();
          // If the user presses "Scan Stations", we always want to reset the iteration counter to zero
          if (resolverState) {
            resolverState.set('iterations', 0);
          }
          player.play();
          props.onStartScan();
        } else {
          // If the user presses "Scan Stations" (vs. the stop button in the player bar), we want
          // to just stop the scan, not playback
          if (toggleScan) {
            const nowIsScanning = !isScanning;
            if (!nowIsScanning) {
              props.onStopScan('stop_scan_button');
            }
          } else if (!toggleScan) {
            player.stop();
            props.onStopScan('miniplayer');
          }
        }
      }
    },
    [player, props, status, current, isScanning],
  );

  const play = usePlay({
    ...props,
    type: Playback.StationType.Scan,
  });

  const doPlay = useCallback(
    ({ toggleScan }: { toggleScan: boolean }) => {
      if (checkReadyToLoad()) {
        doLoadAndPlay({ toggleScan });
      } else {
        (function doCheck() {
          globalThis.window.setTimeout(() => {
            if (checkReadyToLoad()) {
              doLoadAndPlay({ toggleScan });
            } else {
              doCheck();
            }
          }, 100);
        })();
      }
    },
    [checkReadyToLoad, doLoadAndPlay],
  );

  return {
    ...play,
    doPlay,
    isScanning,
  } as const;
}
