import { waitUntil } from '@iheartradio/web.utilities';
import { createEmitter } from '@iheartradio/web.utilities/create-emitter';
import type { Logger } from '@iheartradio/web.utilities/create-logger';
import { isEmpty } from 'remeda';

import type { HeaderBidderMethods, HeaderBiddingConfig } from '../types.js';

type LiveRampBidderMethods = HeaderBidderMethods;

declare global {
  interface Window {
    ats?: {
      start: (options: {
        placementID: number;
        storageType: 'localStorage';
        logging: 'error';
        email: string;
        emailHashes: string[];
      }) => void;
    };
  }
}

export const createLiveRampHeaderBidder = ({ logger }: { logger: Logger }) => {
  let isReady = false;

  return createEmitter<LiveRampBidderMethods>({
    async initialize(options: HeaderBiddingConfig) {
      const bidderEnabled = options.enabledBidders.includes('liveRamp');

      if (bidderEnabled) {
        logger.info('Initializing LiveRamp Header Bidder');
        try {
          await waitUntil(() => !!globalThis.window.ats);
          isReady = true;
          logger.info('LiveRamp Header Bidder initialized');
        } catch (error) {
          logger.warn('Unable to initialize LiveRamp Header Bidder', { error });
        }
      }

      if (
        isReady &&
        !isEmpty(options.email) &&
        options.emailHashes &&
        !isEmpty(options.emailHashes)
      ) {
        const { email, emailHashes } = options;

        logger.info('LiveRamp ats.start()');
        window.ats?.start({
          placementID: 2102,
          storageType: 'localStorage',
          logging: 'error',
          email,
          emailHashes,
        });
      }
    },
  });
};
