import { waitUntil } from '@iheartradio/web.utilities';
import { createEmitter } from '@iheartradio/web.utilities/create-emitter';
import type { Logger } from '@iheartradio/web.utilities/create-logger';
import { isEmpty } from 'remeda';

import type { HeaderBidderMethods, HeaderBiddingConfig } from '../types.js';

type RubiconBidderMethods = HeaderBidderMethods;

export const createRubiconHeaderBidder = ({ logger }: { logger: Logger }) => {
  let isReady = false;

  return createEmitter<RubiconBidderMethods>({
    async initialize(options: HeaderBiddingConfig) {
      const bidderEnabled = options.enabledBidders.includes('rubicon');

      if (bidderEnabled) {
        logger.info('Initializing Rubicon Header Bidder');
        try {
          await waitUntil(() => !!globalThis.window.pbjs);
          isReady = true;
          logger.info('Rubicon Header Bidder initialized');
        } catch (error) {
          logger.warn('Unable to initialize Rubicon Header Bidder', { error });
        }
      }
    },
    async fetchBids(slots = []) {
      if (isEmpty(slots) || !isReady) {
        logger.warn('Unable to fetch Rubicon bids!');
        return false;
      }

      logger.info('Fetching Rubicon header bids');
      return new Promise<boolean>(resolve => {
        globalThis.window.pbjs?.que.push(() => {
          globalThis.window.pbjs?.rp.requestBids({
            callback: () => {
              logger.info('Rubicon header bids fetched');
              resolve(true);
            },
            gptSlotObjects: slots,
          });
        });
      });
    },
  });
};
