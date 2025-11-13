import { createEmitter } from '@iheartradio/web.utilities/create-emitter';
import { createLogger } from '@iheartradio/web.utilities/create-logger';
import cookie from 'js-cookie';
import { mergeDeep } from 'remeda';
import type { PartialDeep } from 'type-fest';
import { v4 as uuid } from 'uuid';
import type { SafeParseReturnType } from 'zod';

import {
  analyticsData as analyticsDataSchema,
  globalData as globalDataSchema,
} from './schemas.js';
import type {
  Analytics,
  AnalyticsData,
  AnalyticsMethods,
  Event,
  GlobalData,
  UncontrolledGlobalData,
} from './types.js';

export function getScreenOrientation() {
  return window.matchMedia('(orientation: portrait)').matches ?
      'portrait'
    : 'landscape';
}

export function createAnalytics(options?: { debug: boolean }): {
  analytics: Analytics;
  useAnalytics: () => Analytics;
} {
  const logger = createLogger({
    enabled: true,
    namespace: '@iheartradio/web.analytics',
    pretty: true,
  });

  async function validate<Payload, Name = string>(
    name: Name,
    data: Payload,
    fn: () => SafeParseReturnType<unknown, Payload>,
  ) {
    const result = fn();

    if (result.error) {
      logger.error(`Failed Schema Validation: ${name}`, {
        issues: result.error.issues,
        formatted: result.error.format(),
      });

      return data;
    }

    return result.data;
  }

  let globalData = {
    device: {},
    event: {},
    session: {},
    view: {},
  } as GlobalData;

  const analytics = createEmitter<AnalyticsMethods>({
    async initialize(uncontrolledGlobalData: UncontrolledGlobalData) {
      const DEVICE_ID_KEY = 'iheart-analytics-device-id';

      let id = uncontrolledGlobalData.device.id ?? cookie.get(DEVICE_ID_KEY);

      if (id === undefined) {
        id = uuid();
        cookie.set(DEVICE_ID_KEY, id, { expires: 365 });
      }

      const date = new Date();
      const now = Date.now();

      const dayOfWeek = date
        .toLocaleString('en-us', { weekday: 'long' })
        .toLowerCase() as GlobalData['device']['dayOfWeek'];

      const timezone = new Intl.DateTimeFormat(undefined, {
        timeZoneName: 'short',
      })
        .formatToParts()
        .find(part => part.type === 'timeZoneName')?.value as string;

      const gpcEnabled =
        'globalPrivacyControl' in window.navigator ?
          (window.navigator.globalPrivacyControl as boolean)
        : false;

      const referer =
        uncontrolledGlobalData.device.referer ||
        window.document.referrer ||
        undefined;

      globalData = {
        ...uncontrolledGlobalData,
        device: {
          ...uncontrolledGlobalData.device,
          appSessionId: uuid(),
          browserHeight: `${window.innerHeight}px`,
          browserWidth: `${window.innerWidth}px`,
          callId: uuid(),
          dayOfWeek,
          hourOfDay: date.getHours(),
          id,
          language: window.navigator.language,
          referer,
          refererDomain: referer ? new URL(referer).hostname : undefined,
          screenOrientation: getScreenOrientation(),
          screenResolution: `${window.screen.availWidth}x${window.screen.availHeight}`,
          gpcEnabled,
          timezone,
          userAgent: window.navigator.userAgent,
        },
        event: {
          loggedTimestamp: now,
        },
        querystring: Object.fromEntries(
          new URLSearchParams(window.location.search),
        ),
        session: {
          sequenceNumber: 0,
        },
        view: {
          pageURL: window.location.href,
        },
      };

      return validate<GlobalData>('initialize', globalData, () =>
        globalDataSchema.safeParse(globalData),
      );
    },

    getGlobalData() {
      return globalData;
    },

    async setGlobalData(
      uncontrolledGlobalData: PartialDeep<UncontrolledGlobalData>,
    ) {
      globalData = mergeDeep(globalData, uncontrolledGlobalData) as GlobalData;

      return validate<GlobalData>('setGlobalData', globalData, () =>
        globalDataSchema.safeParse(globalData),
      );
    },

    async track<T extends Event>(event: T) {
      globalData.device.callId = uuid();
      globalData.device.hourOfDay = new Date().getHours();
      globalData.device.screenOrientation = getScreenOrientation();
      globalData.event.loggedTimestamp = Date.now();
      globalData.session.sequenceNumber += 1;
      globalData.view.pageURL = window.location.href;
      globalData.querystring = Object.fromEntries(
        new URLSearchParams(window.location.search),
      );

      const analyticsData = mergeDeep(globalData, event);

      return validate<AnalyticsData>(event.type, analyticsData, () =>
        analyticsDataSchema.safeParse(analyticsData),
      );
    },
  });

  const isBrowser = globalThis?.window !== undefined;

  const parameter =
    isBrowser ?
      new URL(window.location.href).searchParams.get('debug')
    : undefined;

  const debug =
    options?.debug ??
    (isBrowser &&
      (parameter?.includes('true') || parameter?.includes('analytics')));

  if (debug) {
    analytics.subscribe({
      all(method, data) {
        logger.log(`${method}${'type' in data ? `:${data.type}` : ''}`, data);
      },
    });
  }

  return {
    analytics,
    useAnalytics() {
      return analytics;
    },
  } as const;
}
