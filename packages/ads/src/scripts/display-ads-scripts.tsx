import type { BaseConfig } from '@iheartradio/web.config';
import { loadScript } from '@iheartradio/web.utilities';
import { useMemo } from 'react';
import { isDefined, isEmpty } from 'remeda';

import type { ScriptDescriptor } from './types.js';

export type DisplayAdsScriptsConfig = {
  enabled?: boolean;
  enabledBidders?: BaseConfig['ads']['headerBidding']['enabledBidders'];
  sdks?: Pick<
    BaseConfig['sdks'],
    'amazon' | 'indexExchange' | 'liveramp' | 'moat' | 'rubicon'
  >;
  language?: string;
  parentOverride?: HTMLBodyElement | HTMLHeadElement;
  privacyOptOut?: boolean;
};

const buildScriptDescriptors = (
  enabledBidders: DisplayAdsScriptsConfig['enabledBidders'],
  sdks: DisplayAdsScriptsConfig['sdks'],
  language: DisplayAdsScriptsConfig['language'] = 'en',
  privacyOptOut: DisplayAdsScriptsConfig['privacyOptOut'] = false,
  parentOverride?: DisplayAdsScriptsConfig['parentOverride'],
): ScriptDescriptor[] => {
  const scriptDescriptors: ScriptDescriptor[] = [];

  if (
    enabledBidders &&
    !isEmpty(enabledBidders) &&
    sdks &&
    !isEmpty(sdks) &&
    !isEmpty(language) &&
    !privacyOptOut
  ) {
    for (const bidder of enabledBidders) {
      switch (bidder) {
        case 'amazon': {
          if (sdks.amazon && !isEmpty(sdks.amazon.script)) {
            scriptDescriptors.push({
              async: true,
              src: sdks.amazon.script,
              id: 'aps',
              'data-test': 'ads-script-aps',
              target: parentOverride ?? document.body,
            });
          }
          break;
        }
        case 'indexExchange': {
          if (
            language.toLocaleLowerCase() === 'en' &&
            sdks.indexExchange?.en &&
            !isEmpty(sdks.indexExchange.en)
          ) {
            scriptDescriptors.push({
              async: true,
              'data-test': 'ads-script-indexExchangeEN',
              id: 'indexExchangeEN',
              src: sdks.indexExchange.en,
              target: parentOverride ?? document.body,
            });
            break;
          }

          if (
            language.toLocaleLowerCase() === 'fr' &&
            sdks.indexExchange?.fr &&
            !isEmpty(sdks.indexExchange.fr)
          ) {
            scriptDescriptors.push({
              async: true,
              'data-test': 'ads-script-indexExchangeFR',
              id: 'indexExchangeFR',
              src: sdks.indexExchange.fr,
              target: parentOverride ?? document.body,
            });
            break;
          }
          break;
        }
        case 'liveRamp': {
          if (sdks.liveramp?.script && !isEmpty(sdks.liveramp.script)) {
            scriptDescriptors.push({
              async: true,
              src: sdks.liveramp.script,
              id: 'liveRamp',
              'data-test': 'ads-script-liveRamp',
              target: document.body,
            });
          }
          break;
        }
        case 'rubicon': {
          if (sdks.rubicon?.script && !isEmpty(sdks.rubicon.script)) {
            scriptDescriptors.push({
              async: true,
              'data-test': 'ads-script-rubicon',
              id: 'rubicon',
              src: sdks.rubicon.script,
              target: parentOverride ?? document.body,
            });
          }
        }
      }
    }
  }

  scriptDescriptors.push({
    async: true,
    'data-test': 'ads-script-gpt',
    id: 'gpt',
    src: 'https://securepubads.g.doubleclick.net/tag/js/gpt.js',
    target: parentOverride ?? document.body,
  });

  return scriptDescriptors;
};

export const DisplayAdsScripts = ({
  enabled = true,
  enabledBidders,
  sdks,
  language,
  parentOverride,
  privacyOptOut = false,
}: DisplayAdsScriptsConfig) => {
  const isBrowser = isDefined(globalThis.window?.document);

  useMemo(() => {
    if (!isBrowser || !enabled) return;

    const scripts = buildScriptDescriptors(
      enabledBidders,
      sdks,
      language,
      privacyOptOut,
      parentOverride,
    );

    for (const script of scripts) {
      const { src, ...rest } = script;
      loadScript(src, rest);
    }
  }, [
    isBrowser,
    enabled,
    enabledBidders,
    language,
    sdks,
    parentOverride,
    privacyOptOut,
  ]);

  return null;
};
