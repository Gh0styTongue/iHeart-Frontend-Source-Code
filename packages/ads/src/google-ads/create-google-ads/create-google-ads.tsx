import type { Analytics } from '@iheartradio/web.analytics';
import { eventType } from '@iheartradio/web.analytics';
import { waitUntil } from '@iheartradio/web.utilities';
import { createEmitter } from '@iheartradio/web.utilities/create-emitter';
import {
  type Logger,
  createLogger,
  Level,
} from '@iheartradio/web.utilities/create-logger';
import { debounce } from '@iheartradio/web.utilities/timing';
import {
  type ReactElement,
  type ReactNode,
  createContext,
  useContext,
  useEffect,
  useMemo,
} from 'react';
import { isDeepEqual, isDefined, isEmpty } from 'remeda';

import {
  type HeaderBiddingConfig,
  createHeaderBidding,
} from '../../header-bidding/index.js';
import { createGooglePublisherTag } from '../gpt/index.js';
import { SlotRegistry } from './slot-registry.js';

type DisplayAdClick = Extract<
  Analytics.Event,
  { type: typeof eventType.enum.DisplayAdClick }
>;

type DisplayAdError = Extract<
  Analytics.Event,
  { type: typeof eventType.enum.DisplayAdError }
>;

export const DisplayAdsContext = createContext({ enabled: false });

export const createSlotRenderEndedHandler = ({
  logger,
}: {
  logger: Logger;
}) => {
  return async (event: googletag.events.SlotRenderEndedEvent) => {
    const elementId = event.slot.getSlotElementId();
    const containerElement = globalThis.document.querySelector<HTMLDivElement>(
      `#${elementId}`,
    );

    const adIframe = containerElement?.querySelector('iframe');
    if (adIframe) {
      try {
        await waitUntil(
          () =>
            adIframe?.dataset.loadComplete === 'true' ||
            adIframe?.dataset.isSafeframe === 'true',
          5000,
        );
        logger.info(`Slot Render Ended: ${elementId}`, event);
      } catch {
        return logger.warn(`Slot Render Ended Timeout: ${elementId}`, event);
      }
    }
  };
};

const { call: doAdImpression } = debounce(
  async (
    track: Analytics.Analytics['track'],
    event: googletag.events.SlotOnloadEvent,
  ) => {
    const { slot: googleSlot, serviceName: googleServiceName } = event;
    const size = googleSlot.getSizes()?.[0];

    return track({
      type: eventType.enum.DisplayAdImpression,
      data: {
        ad: {
          advertiserId: googleSlot?.getResponseInformation()?.advertiserId ?? 0,
          targeting: googleSlot?.getTargetingMap(),
          campaignId: googleSlot?.getResponseInformation()?.campaignId ?? 0,
          clickthroughUrl: googleSlot?.getClickUrl(),
          client: 'googima',
          creativeId: googleSlot?.getResponseInformation()?.creativeId ?? 0,
          lineItemId: googleSlot?.getResponseInformation()?.lineItemId ?? 0,
          position: googleSlot?.getSlotElementId(),
          serviceName: googleServiceName,
          size: {
            width:
              typeof size === 'object' && 'width' in size ? size['width'] : 0,
            height:
              typeof size === 'object' && 'height' in size ? size['height'] : 0,
          },
          tag: googleSlot?.getContentUrl()?.toString(),
          viewable:
            globalThis.window?.document?.visibilityState === 'visible' ? 1 : 0,
        },
      },
    });
  },
  { timing: 'trailing', waitMs: 1000 },
);

export const createGoogleAds = ({
  analytics,
  logger = createLogger({
    enabled: false,
    level: Level.Info,
    namespace: 'web.ads',
    pretty: true,
  }),
}: {
  analytics: Analytics.Analytics;
  logger?: Logger;
}) => {
  const AdSlotRegistry = new SlotRegistry(logger);

  if (isDefined(globalThis.window?.location)) {
    const locationUrl = new URL(globalThis.window.location.href);
    const debugValue = locationUrl.searchParams.get('debug');

    if (debugValue === 'true' || debugValue === 'ads') {
      logger.enable();
    }
  }
  const GPT = createGooglePublisherTag({ logger });
  const HeaderBidding = createHeaderBidding({ logger });

  const slotRenderEndedEventHandler = createSlotRenderEndedHandler({
    logger,
  });

  const errorHandler = (error: Error, rest: Record<string, unknown>) => {
    logger.error('GoogleAds error', { error });
    analytics.track<DisplayAdError>({
      type: eventType.enum.DisplayAdError,
      data: {
        ad: {
          error: error.message,
          ...rest,
        },
      },
    });
  };

  const slotOnloadEventHandler = (event: googletag.events.SlotOnloadEvent) => {
    const slotId = event.slot.getSlotElementId();
    logger.info(`Slot Onload: "${slotId}"`);

    doAdImpression(analytics.track, event);
    GoogleAds.slotOnLoad(slotId);
  };

  const targeting = new Map<string, string | string[]>();
  let previousTargetingParams: { [k: string]: unknown } = {};

  const GoogleAds = createEmitter({
    async initialize(headerBiddingConfig: HeaderBiddingConfig) {
      await GPT.initialize();
      await HeaderBidding.initialize(headerBiddingConfig);
      logger.info('Google Ads Initialized');
    },
    async ready() {
      return GPT.pubadsReady();
    },
    async addSlot(
      adUnitPath: string,
      size: googletag.GeneralSize,
      div: string,
      slotTargeting?: Record<string, string | string[]>,
    ) {
      const divElement = globalThis.document.querySelector<HTMLDivElement>(
        `#${div}`,
      );
      if (divElement) {
        const slot = await GPT.defineSlot(adUnitPath, size, div);

        if (slot) {
          logger.info('Slot Added', slot);
          if (slotTargeting && !isEmpty(slotTargeting)) {
            for (const [key, value] of Object.entries(slotTargeting!)) {
              slot.setTargeting(key, value);
            }
            logger.info(`Targeting added for slot: "${slot.getSlotId()}"`, {
              slotTargeting,
            });

            logger.info(`Slot displayed for slot: "${slot.getSlotId()}"`, {});
            AdSlotRegistry.addSlot(div);
            if (AdSlotRegistry.addedSize === AdSlotRegistry.registeredSize) {
              GoogleAds.refresh();
            }
          }
        } else {
          errorHandler(new Error('Slot not added'), { position: div });
        }
      } else {
        logger.warn(`Unable to find div element with id: ${div}`);
      }
    },
    async removeSlot(div: string) {
      const slot = (await GPT.getSlots())?.find(
        slot => slot.getSlotElementId() === div,
      );
      if (slot) {
        const success = await GPT.destroySlots([slot]);
        AdSlotRegistry.removeSlot(div);
        if (success) {
          logger.info('Slot removed', { slot });
        } else {
          logger.warn(`Unable to remove slot for div "${div}"`);
        }
        return div;
      }
    },
    async receiveTargeting(targetingParams: { [k: string]: unknown }) {
      if (!isDeepEqual(targetingParams, previousTargetingParams)) {
        logger.info('Setting targeting', { targeting: targetingParams });

        previousTargetingParams = targetingParams;
        targeting.clear();
        for (const [key, value] of Object.entries(targetingParams)) {
          if (key === 'childDirected') {
            logger.info(
              `Setting privacy settings, childDirectedTreatment: ${String(
                value,
              )}`,
            );
            if (typeof value === 'boolean') {
              await GPT.setPrivacySettings({ childDirectedTreatment: value });
            }
          } else {
            targeting.set(key, String(value));
          }
        }
      } else {
        logger.info(`Targeting not changed, skipping.`);
      }
    },
    async refresh() {
      const slots = await GPT.getSlots();
      if (slots.length > 0) {
        const containers = slots.map(slot => slot.getSlotElementId());

        if (containers.length > 0) {
          targeting.set('ts', String(Date.now()));
          targeting.set('ord', String(Math.floor(Math.random() * Date.now())));

          logger.info(`Setting GPT Targeting`);

          await GPT.clearTargeting();
          for (const [key, value] of targeting.entries()) {
            await GPT.setTargeting(key, value);
          }
          await HeaderBidding.fetchBids(slots);

          logger.info('Refreshing slots');
          await GPT.refresh(slots);
        } else {
          logger.warn('No slots to refresh');
        }
      } else {
        logger.warn('No slots to refresh');
      }
    },
    slotOnLoad: async (slotId: string) => slotId,
    async start() {
      if (globalThis.window) {
        logger.info('GoogleAds.start()');

        await GPT.enableLazyLoad({
          // The minimum distance from the current viewport a slot. A value of 0 means "when the slot enters the viewport"
          fetchMarginPercent: 0,
          // The minimum distance from the current viewport a slot must be before we render an ad
          renderMarginPercent: 0,
          mobileScaling: 1,
        });
        await GPT.disableInitialLoad();
        await GPT.enableSingleRequest();
        await GPT.setPrivacySettings({ restrictDataProcessing: true });

        await GPT.addEventListener<'slotRenderEnded'>(
          'slotRenderEnded',
          slotRenderEndedEventHandler,
        );

        await GPT.addEventListener<'slotOnload'>(
          'slotOnload',
          slotOnloadEventHandler,
        );

        await GPT.enableServices();

        await waitUntil(() => GPT.pubadsReady());
      }
    },
    async stop() {
      logger.info('GoogleAds.stop()');
      GPT.removeEventListener<'slotRenderEnded'>(
        'slotRenderEnded',
        slotRenderEndedEventHandler,
      );
      GPT.removeEventListener<'slotOnload'>(
        'slotOnload',
        slotOnloadEventHandler,
      );
    },
    async visibilityChange() {
      const state = globalThis.window?.document?.visibilityState;
      logger.info(`Document visibility changed to ${state}`);
      if (state === 'visible') {
        if (!AdSlotRegistry.isTakeover) {
          logger.info('Document visible, refreshing ads...');
          GoogleAds.refresh();
        } else {
          logger.info(
            'Document visible - takeover is active, skipping refresh',
          );
        }
      }
    },
    async click(event: MouseEvent) {
      const googleSlot = (await GPT.getSlots())?.find(
        slot => slot.getSlotElementId() === (event.target as HTMLDivElement).id,
      );

      if (!googleSlot) {
        return;
      }

      const googleServiceName = googleSlot.getServices().at(0)?.getName();
      const size = googleSlot.getSizes().at(0);

      analytics.track<DisplayAdClick>({
        type: eventType.enum.DisplayAdClick,
        data: {
          ad: {
            advertiserId:
              googleSlot.getResponseInformation()?.advertiserId ?? 0,
            targeting: googleSlot.getTargetingMap(),
            campaignId: googleSlot.getResponseInformation()?.campaignId ?? 0,
            clickthroughUrl: googleSlot.getClickUrl(),
            client: 'googima',
            creativeId: googleSlot?.getResponseInformation()?.creativeId ?? 0,
            lineItemId: googleSlot?.getResponseInformation()?.lineItemId ?? 0,
            position: googleSlot?.getSlotElementId(),
            serviceName: googleServiceName ?? '',
            size: {
              width:
                typeof size === 'object' && 'width' in size ? size['width'] : 0,
              height:
                typeof size === 'object' && 'height' in size ?
                  size['height']
                : 0,
            },
            tag: googleSlot?.getContentUrl()?.toString(),
            viewable:
              globalThis.window?.document?.visibilityState === 'visible' ?
                1
              : 0,
          },
        },
      });
    },
  });

  return {
    GoogleAds,
    slotOnloadEventHandler,
    GoogleAdsProvider: ({
      children,
      headerBiddingConfig,
      enabled = true,
    }: {
      children: ReactNode;
      headerBiddingConfig: HeaderBiddingConfig;
      enabled: boolean;
    }): ReactElement => {
      useMemo(() => {
        if (isDefined(globalThis.window) && !GoogleAds.initialized && enabled) {
          logger.info('Ads enabled, initializing GoogleAds');
          GoogleAds.initialize(headerBiddingConfig);
        } else if (!enabled) {
          logger.info('Ads not enabled, skipping GoogleAds.initialize');
        }
      }, [headerBiddingConfig, enabled]);

      useEffect(() => {
        if (enabled && !GPT.pubadsReady()) {
          logger.info('Ads enabled, starting GoogleAds');
          globalThis.window.addEventListener(
            'visibilitychange',
            GoogleAds.visibilityChange,
          );
          GoogleAds.start();

          return () => {
            GoogleAds.stop();
            globalThis.window.removeEventListener(
              'visibilitychange',
              GoogleAds.visibilityChange,
            );
          };
        } else {
          logger.info('Ads not enabled, skipping GoogleAds.start');
        }
      }, [enabled]);

      return (
        <DisplayAdsContext.Provider
          value={useMemo(() => ({ enabled }), [enabled])}
        >
          {children}
        </DisplayAdsContext.Provider>
      );
    },
    setIsTakeover: (isTakeover: boolean) => {
      AdSlotRegistry.isTakeover = isTakeover;
    },
    useDisplayAdsContext: () => {
      return useContext(DisplayAdsContext);
    },
    /**
     * A custom hook that registers an ad slot to the AdSlotRegistry when the component mounts
     * and unregisters it when the component unmounts.
     *
     * This hook ensures proper registration and cleanup of ad slots, which helps prevent memory leaks
     * or unexpected behavior due to lingering slots.
     *
     * Additionally, this hook ensures coordination between all ad slots present in the DOM.
     */
    useSlotRegistry: () => {
      useEffect(() => {
        // Register the slot with the AdSlotRegistry when the component mounts
        const slot = AdSlotRegistry.registerSlot();

        // Unregister the slot from the AdSlotRegistry when the component unmounts
        return () => {
          AdSlotRegistry.unregisterSlot(slot);
        };
      }, []);
    },
  };
};
