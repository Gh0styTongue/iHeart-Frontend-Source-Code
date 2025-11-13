import * as Analytics from '@iheartradio/web.analytics';
import { useEffect } from 'react';

export function useTrackVisibilityChange(
  analytics: Analytics.Analytics.Analytics,
) {
  useEffect(() => {
    const abortController = new AbortController();

    function trackVisibility() {
      if (document.visibilityState === 'hidden') {
        analytics.track({
          type: Analytics.eventType.enum.Background,
        });
      } else {
        analytics.track({
          type: Analytics.eventType.enum.Foreground,
        });
      }
    }

    window.document.addEventListener('visibilitychange', trackVisibility, {
      signal: abortController.signal,
    });

    return () => {
      abortController.abort();
    };
  }, [analytics]);
}
