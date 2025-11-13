import { waitUntil } from '@iheartradio/web.utilities';
import { createEmitter } from '@iheartradio/web.utilities/create-emitter';
import type { Logger } from '@iheartradio/web.utilities/create-logger';
import { isEmpty } from 'remeda';

import type { GPT } from './types.js';

interface GooglePublisherTag extends GPT {
  initialize: () => Promise<boolean>;
}

export type RegisteredSlot = {
  adUnitPath: string;
  slot: googletag.Slot;
};

export const createGooglePublisherTag = ({ logger }: { logger: Logger }) => {
  return createEmitter<GooglePublisherTag>({
    async initialize(): Promise<boolean> {
      if (!globalThis.window) return false;
      await waitUntil(
        () => globalThis.window?.googletag?.defineSlot !== undefined,
      );
      logger.info('GPT Initialized');
      return true;
    },
    async defineSlot(
      adUnitPath: string,
      size: googletag.GeneralSize,
      div: string,
    ) {
      logger.info(`Registering new slot for container: ${div}`);
      const slot = globalThis.window?.googletag?.defineSlot?.(
        adUnitPath,
        size,
        div,
      );

      if (slot && !isEmpty(slot)) {
        logger.info(
          `Slot "${slot.getSlotId()}" registered for container: ${div}`,
          { slot },
        );
        const pubads = globalThis.window?.googletag?.pubads;
        if (typeof pubads === 'function') {
          slot.addService(pubads());
        } else {
          logger.warn('pubads is not a function and cannot be called.');
        }
      } else {
        logger.warn(`Unable to register slot for container: ${div}`);
      }

      return slot;
    },
    async destroySlots(slots?: googletag.Slot[]) {
      const names = slots?.map(slot => slot.getSlotElementId()) ?? [];
      if (names.length > 0) {
        logger.info(`Destroying slots: ${names.join(', ')}`);
        for (const name of names) {
          const containerElement =
            globalThis.window.document.querySelector<HTMLDivElement>(
              `#${name}`,
            );
          if (containerElement && containerElement.dataset) {
            containerElement.dataset.show = 'false';
          }
        }
        return globalThis.window?.googletag?.destroySlots(slots);
      } else {
        logger.warn(`destroySlots called but no registered slots matched!`);
        return false;
      }
    },
    async enableServices() {
      return globalThis.window?.googletag?.enableServices();
    },
    async openConsole() {
      return globalThis.window?.googletag?.openConsole();
    },

    async addEventListener<K extends keyof googletag.events.EventTypeMap>(
      eventType: K,
      listener: (event: googletag.events.EventTypeMap[K]) => void,
    ) {
      logger.info(`Registering event listener for event: ${eventType}`);
      return globalThis.window?.googletag
        ?.pubads?.()
        .addEventListener(eventType, listener);
    },
    async getSlotIdMap() {
      return globalThis.window?.googletag?.pubads?.().getSlotIdMap();
    },
    async getSlots() {
      return globalThis.window?.googletag?.pubads?.().getSlots();
    },
    async removeEventListener<K extends keyof googletag.events.EventTypeMap>(
      eventType: K,
      listener: (event: googletag.events.EventTypeMap[K]) => void,
    ) {
      logger.info(`Removing event listener for event: ${eventType}`);
      return globalThis.window?.googletag
        ?.pubads?.()
        .removeEventListener<K>(eventType, listener);
    },
    async clear(slots?: googletag.Slot[]) {
      return globalThis.window?.googletag?.pubads?.().clear(slots);
    },
    async clearCategoryExclusions() {
      return globalThis.window?.googletag?.pubads?.().clearCategoryExclusions();
    },
    async clearTargeting(key?: string) {
      return globalThis.window?.googletag?.pubads?.().clearTargeting(key);
    },
    async collapseEmptyDivs(collapseBeforeAdFetch?: boolean) {
      return globalThis.window?.googletag
        ?.pubads?.()
        .collapseEmptyDivs(collapseBeforeAdFetch);
    },
    async disableInitialLoad() {
      return globalThis.window?.googletag?.pubads?.().disableInitialLoad();
    },
    async enableLazyLoad(config?: {
      fetchMarginPercent?: number;
      renderMarginPercent?: number;
      mobileScaling?: number;
    }) {
      return globalThis.window?.googletag?.pubads?.().enableLazyLoad(config);
    },
    async enableSingleRequest() {
      return globalThis.window?.googletag?.pubads?.().enableSingleRequest();
    },
    async enableVideoAds() {
      return globalThis.window?.googletag?.pubads?.().enableVideoAds();
    },
    async get(key: googletag.adsense.AttributeName) {
      return globalThis.window?.googletag?.pubads?.().get(key);
    },
    async getAttributeKeys() {
      return globalThis.window?.googletag?.pubads?.().getAttributeKeys();
    },
    async getCorrelator() {
      return globalThis.window?.googletag?.pubads?.().getCorrelator();
    },
    async getImaContent() {
      return globalThis.window?.googletag?.pubads?.().getImaContent();
    },
    async getTagSessionCorrelator() {
      return globalThis.window?.googletag?.pubads?.().getTagSessionCorrelator();
    },
    async getVideoContent() {
      return globalThis.window?.googletag?.pubads?.().getVideoContent();
    },
    async getTargeting(key: string) {
      return globalThis.window?.googletag?.pubads?.().getTargeting(key);
    },
    async getTargetingKeys() {
      return globalThis.window?.googletag?.pubads?.().getTargetingKeys();
    },
    async isInitialLoadDisabled() {
      return globalThis.window?.googletag?.pubads?.().isInitialLoadDisabled();
    },
    async isSRA() {
      return globalThis.window?.googletag?.pubads?.().isSRA();
    },
    pubadsReady() {
      return !!globalThis.window?.googletag?.pubadsReady;
    },
    async refresh(
      slots?: googletag.Slot[] | null,
      options?: { changeCorrelator: boolean },
    ) {
      return globalThis.window?.googletag?.pubads?.().refresh(slots, options);
    },
    async set(key: googletag.adsense.AttributeName, value: string) {
      return globalThis.window?.googletag?.pubads?.().set(key, value);
    },
    async setCategoryExclusion(categoryExclusion: string) {
      return globalThis.window?.googletag
        ?.pubads?.()
        .setCategoryExclusion(categoryExclusion);
    },
    async setCentering(centerAds: boolean) {
      return globalThis.window?.googletag?.pubads?.().setCentering(centerAds);
    },
    async setForceSafeFrame(forceSafeFrame: boolean) {
      return globalThis.window?.googletag
        ?.pubads?.()
        .setForceSafeFrame(forceSafeFrame);
    },
    async setImaContent(imaContentId: string, imaCmsId: string) {
      return globalThis.window?.googletag
        ?.pubads?.()
        .setImaContent(imaContentId, imaCmsId);
    },
    async setLocation(address: string) {
      return globalThis.window?.googletag?.pubads?.().setLocation(address);
    },
    async setPrivacySettings(privacySettings: googletag.PrivacySettingsConfig) {
      return globalThis.window?.googletag
        ?.pubads?.()
        .setPrivacySettings(privacySettings);
    },
    async setPublisherProvidedId(ppid: string) {
      return globalThis.window?.googletag
        ?.pubads?.()
        .setPublisherProvidedId(ppid);
    },
    async setSafeFrameConfig(config: googletag.SafeFrameConfig) {
      return globalThis.window?.googletag
        ?.pubads?.()
        .setSafeFrameConfig(config);
    },
    async setTargeting(key: string, value: string | string[]) {
      return globalThis.window?.googletag?.pubads?.().setTargeting(key, value);
    },
    async setVideoContent(videoContentId: string, videoCmsId: string) {
      return globalThis.window?.googletag
        ?.pubads?.()
        .setVideoContent(videoContentId, videoCmsId);
    },
  });
};
