import { type Analytics, eventType } from '@iheartradio/web.analytics';
import { useEffect, useMemo } from 'react';
import { debounce } from 'remeda';

const { call: doAppOpen } = debounce(
  (
    track: Analytics.Analytics['track'],
    initializationTime: number,
    appVersion: string,
  ) => {
    track({
      type: eventType.enum.AppOpen,
      data: {
        remote: {
          location: `web|listen|${appVersion}`,
        },
        session: {
          initializationTime,
        },
      },
    });
  },
  { timing: 'trailing', waitMs: 500 },
);

const { call: doAppClose } = debounce(
  (track: Analytics.Analytics['track'], appName: string, pageName: string) =>
    track({
      type: eventType.enum.AppClose,
      data: {
        event: {
          location: `web|${appName}|${pageName}|app_close|exit_app`,
        },
      },
    }),
  { timing: 'trailing', waitMs: 500 },
);

export function useAppOpenClose(
  analytics: Analytics.Analytics,
  appName: string,
  appVersion: string,
  pageName: string,
) {
  const fireAppOpenEvent = useMemo(
    () => () => {
      doAppOpen(
        analytics.track,
        Number(document?.timeline.currentTime),
        appVersion,
      );
    },
    [analytics.track, appVersion],
  );

  const fireAppCloseEvent = useMemo(
    () => () => {
      doAppClose(analytics.track, appName, pageName);
    },
    [analytics.track, appName, pageName],
  );

  useEffect(() => {
    // If load event already happened then just need to fire app open event
    if (window.document.readyState === 'complete') {
      fireAppOpenEvent();
    } else {
      window.addEventListener('load', fireAppOpenEvent, { once: true });
    }
  }, [fireAppOpenEvent]);

  // 2024/11/30
  // Refactored to use `visibilitychange` instead of `beforeunload` in order to preserve BFCache
  // functionality
  useEffect(() => {
    function fireOnUnload() {
      if (document.hidden) {
        fireAppCloseEvent();
      }
    }

    window.addEventListener('visibilitychange', fireOnUnload);

    return () => window.removeEventListener('visibilitychange', fireOnUnload);
  }, [fireAppCloseEvent]);
}
