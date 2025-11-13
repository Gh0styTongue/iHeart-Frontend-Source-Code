import { ThemeEnum, useTheme } from '@iheartradio/web.accomplice';
import * as Analytics from '@iheartradio/web.analytics';
import { createBrazeSDK } from '@iheartradio/web.analytics/braze';
import { waitUntil } from '@iheartradio/web.utilities';
import { useEffect } from 'react';

import { useConfig } from '~app/contexts/config';
import { useUser } from '~app/contexts/user';
import { useRootLoaderData } from '~app/hooks/use-root-loader-data';

import { useAnalytics } from '../create-analytics';
import { eventKeyMap } from './helpers';

export const brazeSDK = createBrazeSDK();

export function Braze() {
  const { appVersion } = useRootLoaderData();
  const analytics = useAnalytics();
  const config = useConfig();
  const user = useUser();
  const theme = useTheme();

  useEffect(() => {
    if (!user?.profileId || brazeSDK.initialized) {
      return;
    }

    const unsubscribe = analytics.subscribe({
      async initialize() {
        await brazeSDK.initialize({
          apiKey: config.sdks.braze?.apiKey,
          appVersion,
          user: {
            profileId: user.profileId.toString(),
            email: user.email,
            isAnonymous: user.isAnonymous,
            genreIsDefault: false,
            genreSelected: [],
            isTrialEligible: user.subscription?.isTrialEligible ?? false,
            privacyOptOut: user.privacy?.hasOptedOut ?? false,
            subscriptionTier: user.subscription?.type ?? 'NONE',
          },
          baseUrl: config.sdks.braze?.baseUrl || '',
          allowUserSuppliedJavascript: true,
          enableLogging: config.sdks.braze?.enableLogging || true,
          manageServiceWorkerExternally: !config.sdks.braze?.enableLogging,
          minimumIntervalBetweenTriggerActionsInSeconds: 1,
          sessionTimeoutInSeconds: config.sdks.braze?.enableLogging ? 1 : 1800,
          serviceWorkerLocation:
            'https://www.iheart.com/public/listen/serviceWorker.js',
        });

        await waitUntil(() => !!window.braze);

        window.braze?.subscribeToInAppMessage(inAppMessage => {
          const braze = window.braze!;

          let shouldDisplay = true;
          let isPushPrimer = false;
          let currentPathIsNotButtonUri = true;

          if ('extras' in inAppMessage) {
            isPushPrimer = inAppMessage.extras['msg-id'] === 'push-primer';
          }

          // FullScreen and ModalMessages inherit from InAppMessage, but have buttons attribute
          if (
            inAppMessage instanceof braze.FullScreenMessage ||
            inAppMessage instanceof braze.ModalMessage
          ) {
            // if the button redirects to the page we're already on, we don't want to show the inAppMessage
            currentPathIsNotButtonUri = (inAppMessage.buttons ?? []).every(
              button =>
                (button.clickAction === braze.InAppMessage.ClickAction.URI &&
                  !document.location.href.includes(String(button.uri))) ||
                isPushPrimer,
            );
            if (isPushPrimer && inAppMessage.buttons[0] != null) {
              inAppMessage.buttons[0].subscribeToClickedEvent(() => {
                braze.requestPushPermission();
              });
            }
          }

          if (inAppMessage instanceof braze.InAppMessage) {
            const isNotBlacklisted =
              inAppMessage.extras.suppress_on_page ?
                inAppMessage.extras.suppress_on_page
                  .split(',')
                  .map((url: string) => url.trim())
                  .every((url: string) => !document.location.href.includes(url))
              : true;

            if (
              isPushPrimer &&
              (!braze.isPushSupported() ||
                braze.isPushPermissionGranted() ||
                braze.isPushBlocked())
            ) {
              shouldDisplay = false;
            }

            shouldDisplay =
              shouldDisplay &&
              inAppMessage.message !== 'COPY' &&
              !inAppMessage.extras.suppress_on_web &&
              currentPathIsNotButtonUri &&
              isNotBlacklisted;

            if (shouldDisplay) {
              braze.showInAppMessage(inAppMessage);
            }
          }
        });

        window.braze?.openSession();
        window.braze?.logCustomEvent('prime-for-push');
      },

      async track(event) {
        switch (event.type) {
          case Analytics.eventType.enum.PageView: {
            brazeSDK.track({
              event: eventKeyMap[event.type],
              properties: {
                name: window.location.pathname,
                dark_mode: theme === ThemeEnum.dark,
              },
            });
            break;
          }
          case Analytics.eventType.enum.StreamStart: {
            const { asset } = event.data.station;
            const useSubdata =
              asset.type === 'artist' &&
              asset.subtype !== 'radio' &&
              asset.subid;
            const [streamType, id] =
              useSubdata ? String(asset.subid).split('|') : asset.id.split('|');

            brazeSDK.track({
              event: eventKeyMap[event.type],
              properties: {
                identifier: id,
                name: useSubdata ? asset.subname : asset.name,
                subscriptionType: user.subscription?.type ?? 'NONE',
                type: useSubdata ? streamType : asset.type,
              },
            });
            break;
          }
          default: {
            break;
          }
        }
      },
    });

    return unsubscribe;
  }, [user?.profileId]);

  return null;
}
