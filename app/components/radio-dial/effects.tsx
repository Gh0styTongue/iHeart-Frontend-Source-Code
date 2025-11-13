import type { ScanStopType } from '@iheartradio/web.analytics';
import { StationType } from '@iheartradio/web.playback';
import { use, useEffect, useRef } from 'react';
import { useLocation, useNavigation } from 'react-router';

import { playback } from '~app/playback/playback';

import { ScanContext } from './scan-context';
import { useRadioDialData } from './state/radio-dial-data';

export function RadioDialEffects({
  getCurrentScanStation,
  onStopScan,
  unsetAllActiveIndicators,
  updateRecentlyPlayed,
  visibilityChangeHandler,
}: {
  getCurrentScanStation: () => void;
  onStopScan: (stopType: ScanStopType) => void;
  unsetAllActiveIndicators: () => void;
  updateRecentlyPlayed: () => void;
  visibilityChangeHandler: () => void;
}) {
  const player = playback.usePlayer();
  const state = player.getState();
  const [liveRadioDialData] = useRadioDialData();
  const navigation = useNavigation();
  const location = useLocation();
  const { stopScan } = use(ScanContext);

  const stationsRef = useRef(liveRadioDialData.stations);

  useEffect(() => {
    return state.subscribe({
      set(_, key, value) {
        const { station } = state.deserialize();

        if (
          station.type === StationType.Scan &&
          key === 'isScanning' &&
          typeof value === 'boolean' &&
          !value
        ) {
          updateRecentlyPlayed();
        }
      },
    });
  }, [state, updateRecentlyPlayed]);

  useEffect(
    () =>
      player.subscribe({
        next() {
          getCurrentScanStation();
        },
        play() {
          getCurrentScanStation();
        },
        stop() {
          unsetAllActiveIndicators();
        },
      }),
    [getCurrentScanStation, player, unsetAllActiveIndicators],
  );

  useEffect(() => {
    const controller = new AbortController();

    document.addEventListener('visibilitychange', visibilityChangeHandler, {
      signal: controller.signal,
    });

    return () => {
      controller.abort();
    };
  }, [visibilityChangeHandler]);

  useEffect(() => {
    const stopScanOnNavigation =
      navigation.state !== 'idle' &&
      navigation.location.pathname !== location.pathname;
    if (stopScanOnNavigation && liveRadioDialData.isScanning) {
      stopScan();
      onStopScan('nav_away');
    }
  }, [
    liveRadioDialData.isScanning,
    stopScan,
    onStopScan,
    navigation.state,
    navigation.location?.pathname,
    location.pathname,
  ]);

  useEffect(() => {
    if (!Object.is(liveRadioDialData.stations, stationsRef.current)) {
      stationsRef.current = liveRadioDialData.stations;
      if (liveRadioDialData.isScanning) {
        onStopScan('filter_change');
      }
    }
  }, [liveRadioDialData.stations, onStopScan, liveRadioDialData.isScanning]);

  return null;
}
