import { eventType } from '@iheartradio/web.analytics';
import { ImageEmitter } from '@iheartradio/web.remix-shared/client';
import { loadScript, waitUntil } from '@iheartradio/web.utilities';
import { debounce } from '@iheartradio/web.utilities/timing';
import { memo, useEffect } from 'react';

import { useConfig } from '~app/contexts/config';
import { useUser } from '~app/contexts/user';

import { useAnalytics } from './create-analytics';

type BeaconPayload = {
  c1: '2';
  c2: string;
  cs_xi?: string;
  cs_ucfr?: '0' | '1';
  options?: {
    enableFirstPartyCookie: boolean;
    bypassUserConsentRequirementFor1PCookie: boolean;
  };
};

type Beacon = (payload: BeaconPayload) => void;

declare global {
  interface Window {
    COMSCORE: {
      beacon: Beacon;
    };
  }
}

const pageviewCandidate = () => {
  const pageviewCandidateUrl = new URL('/api/comscore', window.location.origin);
  window.fetch(pageviewCandidateUrl, {
    method: 'GET',
    mode: 'same-origin',
    cache: 'no-store',
  });
};

// Wrapping this in `debounce` is (hopefully) only temporary
// The entire app is getting re-mounted several times, so in order to avoid
// multiple calls, wrapping this in a debounce
const { call: beacon } = debounce(
  (payload: BeaconPayload) => {
    if (!window.COMSCORE || !window.COMSCORE.beacon) {
      console.warn('COMSCORE not initialized');
      return;
    }

    window.COMSCORE.beacon(payload);
  },
  { timing: 'trailing', waitMs: 1000 },
);

export const Comscore = memo(function Comscore() {
  const analytics = useAnalytics();
  const config = useConfig();
  const user = useUser();

  const comscoreId = config.sdks.comScore?.customerId;

  useEffect(() => {
    if (comscoreId) {
      const imageEmitterUnsubscribe = ImageEmitter.subscribe({
        set({ property, value }) {
          if (
            property === 'src' &&
            typeof value === 'string' &&
            value.includes('https://sb.scorecardresearch.com/b?c1=2')
          ) {
            // Call `pageviewCandidate` with setTimeout so that it goes to the end of the
            // task queue. This ensures that the Image actually loads before the Pageview Candidate
            // payload is requested.
            setTimeout(pageviewCandidate, 0);
          }
        },
      });

      const analyticsUnsubscribe = analytics.subscribe({
        async initialize() {
          if (window.COMSCORE) return;

          await loadScript(
            `https://sb.scorecardresearch.com/cs/${comscoreId}/beacon.js`,
            { async: true },
          );

          await waitUntil(() => !!window.COMSCORE);
        },

        async track(data) {
          if (data.type !== eventType.enum.PageView) {
            return;
          }

          const payload: BeaconPayload = {
            c1: '2',
            c2: comscoreId,
            cs_xi: String(user?.profileId),
            cs_ucfr: user?.privacy?.hasOptedOut ? '0' : '1',
            options: {
              enableFirstPartyCookie: true,
              bypassUserConsentRequirementFor1PCookie:
                user?.privacy?.hasOptedOut ? false : true,
            },
          };

          // window.COMSCORE.beacon(payload);
          beacon(payload);
        },
      });

      return () => {
        analyticsUnsubscribe();
        imageEmitterUnsubscribe();
      };
    } else {
      return () => {};
    }
  }, [analytics, comscoreId, user?.privacy?.hasOptedOut, user?.profileId]);

  return null;
});
