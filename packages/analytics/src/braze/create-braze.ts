import { loadScript, waitUntil } from '@iheartradio/web.utilities';
import { createEmitter } from '@iheartradio/web.utilities/create-emitter';
import { createLogger } from '@iheartradio/web.utilities/create-logger';

import type { Braze, BrazeEmitter, BrazeMethods, GlobalData } from './types.js';

declare global {
  interface Window {
    braze?: Braze;
  }
}

export function createBrazeSDK(options?: {
  enableLogger: boolean;
}): BrazeEmitter {
  const logger = createLogger({
    enabled: options?.enableLogger ?? false,
    namespace: '@iheartradio/web.analytics-braze',
    pretty: true,
  });

  const brazeSDK = createEmitter<BrazeMethods>({
    async initialize({ user, apiKey, ...globalData }: GlobalData) {
      if (!apiKey) {
        logger.error('Braze SDK NOT initialized. Missing API key');
        return;
      }

      try {
        await waitUntil(() => !!globalThis.window);
        await loadScript('https://js.appboycdn.com/web-sdk/5.4/braze.min.js', {
          async: true,
          id: 'braze-script',
          replace: true,
          target: globalThis.document.head,
        });
        await waitUntil(() => !!globalThis.window.braze);
        const braze = globalThis.window.braze;

        braze?.initialize(apiKey, globalData);
        // we set session timeout in seconds to either 1 for debugging or 30 minutes, which is brazes default
        braze?.setLogger(logger.info);

        braze
          ?.getUser()
          ?.setCustomUserAttribute(
            'Most Recent Web Version',
            globalData.appVersion,
          );

        // optionally set the current user's external ID before starting a new session
        // you can also call `braze.changeUser` later in the session after the user logs in
        if (user.isAnonymous) {
          braze?.changeUser(String(user.profileId));
          braze?.getUser()?.setEmail(null);
        } else {
          braze?.changeUser(String(user.profileId));
          braze?.getUser()?.setEmail(user.email!);
        }

        logger.info('Braze SDK initialized');
      } catch (error) {
        const brazeError = error as Error;
        logger.error(brazeError.message);
      }
    },

    async track({ event, properties }) {
      const braze = globalThis.window.braze;
      braze?.logCustomEvent(event, properties);
    },
  });

  return brazeSDK;
}
