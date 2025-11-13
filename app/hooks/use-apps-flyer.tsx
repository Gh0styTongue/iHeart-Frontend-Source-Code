import {
  type CampaignKey,
  type IHeartAppsFlyerSDK,
  IHeartAppsFlyer,
} from '@iheartradio/web.appsflyer-sdk';
import type {
  LogFn,
  Logger,
  Type as LogType,
} from '@iheartradio/web.utilities/create-logger';
import type { ReactNode } from 'react';
import {
  createContext,
  use,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { logger } from '~app/utilities/logger';

const AppsFlyerContext = createContext<IHeartAppsFlyerSDK | null>(null);

// 1️⃣ The logging mechanism method signature inside of `appsflyer-sdk` does not exactly match
// our logger, so create a Proxy that will rearrange the arguments to match
// This is the `get` trap, Proxy is down below 👇🏻 at 2️⃣
const loggerProxyHandler = {
  get(
    target: typeof logger,
    prop: keyof typeof logger,
    receiver: typeof Proxy<Logger>,
  ) {
    const value = target[prop] as LogFn<
      LogType.Info | LogType.Error | LogType.Log | LogType.Warn
    >;
    const that = this as ThisParameterType<typeof receiver>;
    if (value instanceof Function) {
      return function (...args: unknown[]) {
        const [concatenated, rest] = args.reduce(
          (accumulator: [string[], unknown[]], currentValue) => {
            if (typeof currentValue === 'string') {
              accumulator[0].push(currentValue);
            } else {
              accumulator[1].push(currentValue);
            }
            return accumulator;
          },
          [[], []] as [string[], unknown[]],
        );
        return value.apply(that === receiver ? target : that, [
          concatenated.join(' '),
          rest,
        ]);
      };
    }
    return value;
  },
} as const;

export const AF_CampaignIds: Record<string, CampaignKey> = {
  ListenOnTheApp: 'ListenOnTheApp' as CampaignKey,
} as const;

const AF_Config = {
  [AF_CampaignIds.ListenOnTheApp]: {
    oneLinkURL: 'https://iheart.onelink.me/Ff5B/ListenGetTheApp',
    afParameters: {
      mediaSource: {
        // outgoing paramKey gets set as PID
        keys: ['utm_source'],
        defaultValue: 'Web-Listen',
      },
      // outgoing paramKey gets set as C
      campaign: {
        keys: ['utm_campaign'],
        defaultValue: 'Listen Get The App (US)',
      },
    },
  },
};

export function AppsFlyerSdkProvider({ children }: { children: ReactNode }) {
  const [appsFlyerInstance, setAppsFlyerInstance] =
    useState<IHeartAppsFlyerSDK | null>(null);

  useEffect(() => {
    // 2️⃣ Using a revocable proxy so that when this component unmounts, the Proxy can be revoked
    // so that it will not stay around in memory any longer than necessary
    const appsFlyerLogger = Proxy.revocable<typeof logger>(
      logger,
      loggerProxyHandler,
    );

    const { searchParams } =
      URL.canParse(window.location.href) ?
        new URL(window.location.href)
      : { searchParams: new URLSearchParams() };

    const debug = searchParams.get('debug') ?? '';
    const instance = new IHeartAppsFlyer();

    instance.init({
      debug: ['appsflyer', 'true'].includes(debug),
      logger: appsFlyerLogger.proxy,
      config: AF_Config,
    });

    setAppsFlyerInstance(instance);

    return () => {
      appsFlyerLogger.revoke();
    };
  }, []);

  return (
    <AppsFlyerContext.Provider
      value={useMemo(() => appsFlyerInstance, [appsFlyerInstance])}
    >
      {children}
    </AppsFlyerContext.Provider>
  );
}

export function useAppsFlyer() {
  const sdkInstance = use(AppsFlyerContext);

  const generateLink = useCallback(
    (campaign: CampaignKey = AF_CampaignIds.ListenOnTheApp, open = true) => {
      const url = sdkInstance?.generateClickURL({
        campaign,
        afParameters: {
          afSub1: document.referrer,
        },
      });

      if (url) {
        if (open) {
          window.open(url, 'iHeartAppsFlyerWindow');
        } else {
          return url;
        }
      }
    },
    [sdkInstance],
  );

  const generateQrCode = useCallback(
    (
      containerId: string,
      options?: {
        campaign?: CampaignKey;
        size?: number;
      },
    ) => {
      const { campaign = AF_CampaignIds.ListenOnTheApp, size = 240 } =
        options ?? {};
      sdkInstance?.generateQRCode(containerId, { campaign }, { size });
    },
    [sdkInstance],
  );

  const clearQrCode = useCallback(
    (containerId: string) => {
      sdkInstance?.clearQRCode(containerId);
    },
    [sdkInstance],
  );

  return {
    clearQrCode,
    generateLink,
    generateQrCode,
  };
}
