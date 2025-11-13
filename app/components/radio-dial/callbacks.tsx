import { vars } from '@iheartradio/web.accomplice';
import type { ScanStopType } from '@iheartradio/web.analytics';
import { StationEnum } from '@iheartradio/web.api/amp';
import { StationType, Status } from '@iheartradio/web.playback';
import { use, useCallback, useMemo, useRef } from 'react';
import { isNonNullish } from 'remeda';

import { analytics } from '~app/analytics/create-analytics';
import type { RegGateContext } from '~app/analytics/data';
import { useInAppMessage } from '~app/analytics/in-app-message';
import { addRegGateToast } from '~app/analytics/reg-gate-toast';
import { useUser } from '~app/contexts/user';
import { useLoginUrl, useSignUpUrl } from '~app/hooks/auth-urls';
import { useGetPageName } from '~app/hooks/use-get-page-name';
import { useScanPlay } from '~app/playback/controls/play/use-scan-play';
import { playback } from '~app/playback/playback';
import { useUpdateRecentlyPlayed } from '~app/queries/recently-played';
import {
  ANALYTICS_LOCATION,
  ANALYTICS_ORIGIN,
  PAYLOAD_TRIGGER_TYPES,
  REG_GATE_TOAST_EXIT_TYPE,
  REG_GATE_TOAST_MESSAGE_TYPE,
  SCAN_AUTHENTICATION_MESSAGE,
} from '~app/utilities/constants';
import { isAnonymousUser } from '~app/utilities/user';

import { ScanContext } from './scan-context';
import { useRadioDialData } from './state/radio-dial-data';

export function useRadioDialCallbacks() {
  const [liveRadioDialData, dispatch] = useRadioDialData();
  const player = playback.usePlayer();
  const state = player.getState();
  const pageName = useGetPageName();
  const { stopScan } = use(ScanContext);
  const userIsAnonymous = isAnonymousUser(useUser());
  const { onInAppMessageOpen, onInAppMessageExit } = useInAppMessage();
  const { addToRecentlyPlayed } = useUpdateRecentlyPlayed();

  const stationIds = useMemo(
    () =>
      liveRadioDialData.stations
        .map(station => station.id)
        .filter((stationId): stationId is number => isNonNullish(stationId)),
    [liveRadioDialData.stations],
  );

  const regGateContext = useMemo(
    () =>
      ({
        trigger: PAYLOAD_TRIGGER_TYPES.SCAN,
        origin: ANALYTICS_ORIGIN.LISTEN,
        pageName,
      }) satisfies RegGateContext,
    [pageName],
  );

  const loginUrl = useLoginUrl({ context: regGateContext });
  const signUpUrl = useSignUpUrl({ context: regGateContext });

  const unsetAllActiveIndicators = useCallback(() => {
    dispatch({
      type: 'batch',
      payload: {
        updateCurrentIndex: { index: undefined },
        updateCurrentStation: { id: undefined },
      },
    });
  }, [dispatch]);

  const getCurrentScanStation = useCallback(() => {
    const { status, index, station, queue } = player.getState().deserialize();
    if (
      [Status.Playing, Status.Buffering].includes(status) &&
      station.type === StationType.Scan
    ) {
      dispatch({
        type: 'batch',
        payload: {
          updateCurrentIndex: { index },
          updateCurrentStation: { id: Number(queue[index].id) },
        },
      });
    } else {
      unsetAllActiveIndicators();
    }
  }, [dispatch, player, unsetAllActiveIndicators]);

  const onStartScan = useCallback(() => {
    dispatch({
      type: 'updateIsScanning',
      payload: { isScanning: true },
    });
    player.setScanning({ isScanning: true });
    analytics.track({
      type: 'scan_started',
      data: {
        view: {
          pageName,
        },
        filter: {
          location: liveRadioDialData.location,
          genre: liveRadioDialData.genre,
        },
      },
    });
  }, [
    pageName,
    liveRadioDialData.location,
    liveRadioDialData.genre,
    dispatch,
    player,
  ]);

  const onStopScan = useCallback(
    (stopType: ScanStopType) => {
      dispatch({
        type: 'updateIsScanning',
        payload: { isScanning: false },
      });
      player.setScanning({ isScanning: false });
      analytics.track({
        type: 'scan_stopped',
        data: {
          view: {
            pageName,
          },
          scan: {
            stopType,
          },
        },
      });
    },
    [pageName, dispatch, player],
  );

  const visibilityChangeHandler = useCallback(() => {
    if (document.visibilityState === 'hidden') {
      stopScan();
      onStopScan('background');
    }
  }, [stopScan, onStopScan]);

  const context = useMemo(
    () => ({
      pageName,
      playedFrom: 1009,
      eventLocation: ANALYTICS_LOCATION.CAROUSEL,
    }),
    [pageName],
  );

  const analyticsEvents = useRef({
    onStartScan,
    onStopScan,
  });

  const { doPlay: play } = useScanPlay({
    id: stationIds,
    location: liveRadioDialData.location,
    genre: liveRadioDialData.genre,
    context,
    ...analyticsEvents.current,
  });

  const doPlay = useCallback(
    ({ toggleScan }: { toggleScan: boolean }) => {
      if (userIsAnonymous) {
        addRegGateToast({
          kind: 'info',
          text: SCAN_AUTHENTICATION_MESSAGE,
          onInAppMessageOpen,
          onInAppMessageExit,
          messageType: REG_GATE_TOAST_MESSAGE_TYPE.SCAN,
          userTriggered: true,
          pageName,
          actions: [
            {
              kind: 'tertiary',
              color: 'gray',
              textColor: vars.color.gray600,
              content: 'Log in',
              size: { xsmall: 'small', medium: 'large' },
              href: loginUrl.toString(),
              onPress: () => {
                onInAppMessageExit({
                  messageType: REG_GATE_TOAST_MESSAGE_TYPE.SCAN,
                  exitType: REG_GATE_TOAST_EXIT_TYPE.CLICK_SUCCESS,
                  pageName,
                });
              },
            },
            {
              kind: 'tertiary',
              color: 'gray',
              textColor: vars.color.gray600,
              content: 'Sign up',
              size: { xsmall: 'small', medium: 'large' },
              href: signUpUrl.toString(),
              onPress: () => {
                onInAppMessageExit({
                  messageType: REG_GATE_TOAST_MESSAGE_TYPE.SCAN,
                  exitType: REG_GATE_TOAST_EXIT_TYPE.CLICK_SUCCESS,
                  pageName,
                });
              },
            },
          ],
        });
      } else {
        play({ toggleScan });
      }
    },
    [
      userIsAnonymous,
      onInAppMessageOpen,
      onInAppMessageExit,
      pageName,
      loginUrl,
      signUpUrl,
      play,
    ],
  );

  const updateRecentlyPlayed = useCallback(async () => {
    const { status, queue, index, station } = state.deserialize();
    if (status === Status.Playing) {
      const currentLiveStation = queue[index];
      await addToRecentlyPlayed({
        stationType: StationEnum.LIVE,
        playedFrom: station.context.playedFrom,
        contentId: Number(currentLiveStation.id),
      });
    }
  }, [addToRecentlyPlayed, state]);

  return {
    doPlay,
    getCurrentScanStation,
    onStartScan,
    onStopScan,
    unsetAllActiveIndicators,
    updateRecentlyPlayed,
    visibilityChangeHandler,
  };
}
