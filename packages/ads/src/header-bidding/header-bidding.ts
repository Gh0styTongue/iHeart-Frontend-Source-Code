import { createEmitter } from '@iheartradio/web.utilities/create-emitter';
import type { Logger } from '@iheartradio/web.utilities/create-logger';

import { createAmazonHeaderBidder } from './amazon/index.js';
import { createLiveRampHeaderBidder } from './live-ramp/index.js';
import { createRubiconHeaderBidder } from './rubicon/index.js';
import type { HeaderBiddingConfig } from './types.js';

export const createHeaderBidding = ({ logger }: { logger: Logger }) => {
  let optOutStatus = false;
  /**
   * As more header bidders come online, instantiate them here and then call the appropriate methods
   * in the emitter below
   */
  const headerBidders = [
    createAmazonHeaderBidder({ logger }),
    createLiveRampHeaderBidder({ logger }),
    createRubiconHeaderBidder({ logger }),
  ];

  return createEmitter({
    async initialize(config: HeaderBiddingConfig) {
      logger.info('Initializing Header Bidding');
      if (config.privacyOptOut) {
        optOutStatus = true;
      }
      if (!optOutStatus) {
        await Promise.allSettled(
          headerBidders.map(bidder => bidder.initialize(config)),
        );
        logger.info('Header Bidding initialized');
      } else {
        logger.info('Privacy opt out enabled, skipping header bidding');
      }
    },
    async fetchBids(slots: googletag.Slot[]) {
      if (!optOutStatus) {
        logger.info('Header Bidding - fetching bids...');
        await Promise.allSettled(
          headerBidders.map(bidder => bidder.fetchBids?.(slots)),
        );
        logger.info('Header Bidding - bids fetched');
      } else {
        logger.info('Privacy opt out enabled, skipping header bids fetching');
      }
    },
  });
};
