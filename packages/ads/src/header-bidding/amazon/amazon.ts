import { waitUntil } from '@iheartradio/web.utilities';
import { createEmitter } from '@iheartradio/web.utilities/create-emitter';
import type { Logger } from '@iheartradio/web.utilities/create-logger';
import { isEmpty } from 'remeda';

import type { HeaderBiddingConfig } from '../types.js';
import type { AmazonHeaderBidderMethods, ApsSlot } from './types.js';

export const createAmazonHeaderBidder = ({ logger }: { logger: Logger }) => {
  let isReady = false;

  return createEmitter<AmazonHeaderBidderMethods>({
    async initialize(options?: HeaderBiddingConfig) {
      const pubID = options?.pubId;

      const bidderEnabled = options?.enabledBidders.includes('amazon') ?? false;

      if (bidderEnabled) {
        logger.info('Initializing Amazon Header Bidder');
        try {
          await waitUntil(() => !!globalThis.window.apstagLOADED);

          isReady = true;
        } catch {
          return;
        }
      } else {
        logger.info('Amazon Header Bidder not enabled');
      }

      if (isReady && pubID && !isEmpty(pubID)) {
        logger.info('Calling apstag.init');
        globalThis.window.apstag?.init({ pubID, adServer: 'googletag' });
      }
    },
    async fetchBids(slots = []) {
      if (isReady) {
        logger.info('Fetching Amazon Header bids');
        const apsSlots: ApsSlot[] = [];
        for (const slot of slots) {
          const sizes = (slot.getSizes() as googletag.Size[]).reduce(
            (accumulator, size) => {
              accumulator.push([size.width, size.height]);
              return accumulator;
            },
            [] as [number, number][],
          );
          apsSlots.push({
            slotID: slot.getSlotElementId(),
            slotName: slot.getAdUnitPath(),
            sizes,
          });
        }

        if (apsSlots.length === 0) {
          logger.warn(`No valid slots passed to Amazon fetchBids`);
          return false;
        }

        return new Promise<boolean>(resolve => {
          globalThis.window.apstag?.fetchBids(
            { slots: apsSlots, timeout: 5000 },
            () => {
              globalThis.window.apstag?.setDisplayBids();
              logger.info('Amazon Header bids set');
              resolve(true);
            },
          );
        });
      } else {
        logger.warn('Amazon Header Bidder not ready!');
        return false;
      }
    },
  });
};
