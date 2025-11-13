import { memo, useEffect } from 'react';

import { useConfig } from '~app/contexts/config';

import { useAnalytics } from './create-analytics';
import { sendIglooEvent } from './send-igloo-event';

export const Igloo = memo(function Igloo() {
  const config = useConfig();
  const analytics = useAnalytics();

  useEffect(() => {
    const unsubscribe = analytics.subscribe({
      async track(payload) {
        if (!config.urls.iglooUrl) {
          console.error(`'config.urls.iglooUrl' is not set`);
          return;
        }

        return await sendIglooEvent(config.urls.iglooUrl, payload);
      },
    });
    return unsubscribe;
  }, [analytics, config.urls?.iglooUrl]);

  return null;
});
