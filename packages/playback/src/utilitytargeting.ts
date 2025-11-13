import type {
  ampContract,
  ClientInferResponseBody,
  GetTargetingResponse,
} from '@iheartradio/web.api/amp';
import { CCPAUserPrivacy } from '@iheartradio/web.utilities';
import type { Logger } from '@iheartradio/web.utilities/create-logger';
import memoize from 'memoize';
import { isEmpty, isNullish, isPlainObject } from 'remeda';
import { v4 as uuid } from 'uuid';

import { PlayerError } from './player:error.js';
import type {
  AdPayload,
  CustomInStreamAdTargeting,
  CustomPrerollAdTargeting,
  CustomTargeting,
  LiveTargeting,
  PrerollAdTargeting,
  Queue,
  Targeting,
} from './player:schemas.js';
import { AdFormat, AdType, AudioAdProvider } from './player:schemas.js';
import {
  DEFAULT_PREROLL_PARAMS,
  GAM_VAST_BASE_URL,
  TRITON_VAST_BASE_URL,
} from './utility:constants.js';
import { logger } from './utility:default-logger.js';

const buildTargetingQueryParams = (entries: [string, unknown][]) => {
  const queryParams = new URLSearchParams();
  for (const [key, value] of entries) {
    if (isPlainObject(value)) {
      queryParams.set(
        key,
        buildTargetingQueryParams(Object.entries(value)).toString(),
      );
    } else {
      queryParams.set(key, String(value));
    }
  }

  return queryParams;
};

const refreshPrerollUniqueTargetingParameters = (
  searchParams: URLSearchParams,
) => {
  const now = Date.now().toString();

  searchParams.set('ts', now);
  searchParams.set('ord', cachebuster());

  return searchParams;
};

export type LiveInStreamAdTargetingOptions = Pick<
  ClientInferResponseBody<typeof ampContract.v3.livemeta.getStationMeta>,
  'ads' | 'callLetters' | 'feeds' | 'id'
> & { subscriptionType: string };

export const buildLiveInstreamTargeting = (
  targeting: LiveTargeting,
  options: LiveInStreamAdTargetingOptions,
) => {
  const { ads, callLetters, feeds, id, subscriptionType } = options;
  const { audio_ad_provider, enable_triton_token } = ads ?? {};
  const { childOriented = false } = feeds ?? {};

  const partnertok =
    childOriented ?
      targeting?.Extra?.partnerTokens?.coppa
    : targeting?.Extra?.partnerTokens?.nonCoppa;

  let InStream = {
    ...targeting?.InStream,
  };

  if (
    audio_ad_provider === AudioAdProvider.Triton &&
    enable_triton_token &&
    partnertok
  ) {
    InStream.partnertok = partnertok;
  }

  InStream = {
    ...InStream,
    callLetters,
    dist: 'iheart',
    streamid: id.toString(),
    ...(enable_triton_token && partnertok ? { partnertok } : {}),
    subscription_type:
      subscriptionType === 'PREMIUM' ? 'all_access' : (
        subscriptionType.toLowerCase()
      ),
  };

  return InStream;
};

export async function fetchAmazonBids() {
  if (!globalThis.window.apstag) {
    logger.info('Amazon apstag not loaded');
    return {};
  }
  return new Promise<object>(resolve => {
    try {
      logger.info('Fetching Amazon bids');
      globalThis.window.apstag?.fetchBids(
        {
          slots: [
            {
              slotID: 'preroll',
              slotName: 'preroll',
              sizes: [[640, 480]],
              mediaType: 'video',
            },
          ],
          timeout: 5000,
        },
        bids => {
          logger.info(`Amazon bids Length ${bids?.length}`);

          if (isNullish(bids) || bids.length === 0) {
            logger.info('No Amazon bids returned');
            resolve({});
            return;
          }

          const encodedQsParams = bids
            .filter(bid => bid.mediaType === 'video')
            .map(bid => bid.encodedQsParams || bid.helpers?.encodedQsParams())
            .join('');

          logger.info('Amazon bids encoded params', encodedQsParams);

          const decodedQsParams = decodeURIComponent(encodedQsParams);

          const params = new URLSearchParams(decodedQsParams);

          resolve(Object.fromEntries(params.entries()));
        },
      );
    } catch (error) {
      logger.error('Error fetching Amazon bids', error);
      resolve({});
    }
  });
}

export const buildLivePreRollUrl = async (
  targeting: PrerollAdTargeting,
  userOptedOut: boolean,
  logger: Logger,
) => {
  try {
    const apsTargeting = await fetchAmazonBids();

    if (Object.keys(apsTargeting).length > 0) {
      targeting.cust_params = {
        ...(targeting.cust_params as object),
        ...(apsTargeting as object),
      };
    }

    if (userOptedOut) {
      targeting.rdp = '1';
      targeting.cust_params = {
        ...(targeting.cust_params as object),
        age: null,
        gender: null,
        zip: null,
      };
    }

    if (!isEmpty(targeting)) {
      targeting.description_url = encodeURIComponent(window.location.href);
    }

    const targetingQueryParams = buildTargetingQueryParams(
      Object.entries(targeting),
    );

    return targetingQueryParams.toString().length > 0 ?
        new URL(
          `${GAM_VAST_BASE_URL}?${targetingQueryParams.toString()}`,
        ).toString()
      : undefined;
  } catch {
    logger.error(PlayerError.Targeting.message);
  }
};

export type CustomInStreamAdTargetingOptions = {
  childOriented: boolean;
  stationId?: string;
};
const buildCustomInStreamTargeting = ({
  stationTargeting,
  ampTargeting,
  options,
}: {
  stationTargeting: CustomTargeting;
  ampTargeting?: GetTargetingResponse;
  options: CustomInStreamAdTargetingOptions;
}) => {
  const InStream = {
    ...stationTargeting.InStream,
  };

  const partnertok =
    options.childOriented ?
      stationTargeting?.Extra?.partnerTokens?.coppa
    : stationTargeting?.Extra?.partnerTokens?.nonCoppa;

  if (partnertok) {
    InStream.partnertok = partnertok;
  }

  const ihmgenre = ampTargeting?.['aw_0_1st.ihmgenre'];
  const playlistid = ampTargeting?.['aw_0_1st.playlistid'];
  const playlisttype = ampTargeting?.['aw_0_1st.playlisttype'];

  return {
    ...InStream,
    ihmgenre,
    playlistid,
    playlisttype,
    dist: 'iheart',
    ...(options.stationId ? { streamid: options.stationId } : {}),
    tags: ihmgenre,
    'break-id': uuid(),
  };
};

export const cachebuster = () => {
  const randomArray = new Uint32Array(2);
  globalThis.window.crypto.getRandomValues<Uint32Array>(randomArray);

  return randomArray.join('');
};

export const getCustomInStreamAdUrl = ({
  ampTargeting,
  paramsKey,
  queue,
  stationId,
  targeting,
}: {
  ampTargeting?: GetTargetingResponse;
  paramsKey?: string;
  queue: Queue;
  stationId?: string | number;
  targeting: Targeting;
}): AdPayload | null => {
  const streamTargeting = buildCustomInStreamTargeting({
    stationTargeting: {
      ...targeting,
      InStream: {
        ...targeting?.InStream,
        sessionstart: false,
      },
    },
    ampTargeting,
    options: {
      childOriented: queue.some(({ meta }) => !!meta.childOriented),
      ...(stationId ? { stationId: String(stationId) } : {}),
    },
  });

  const midroll = buildCustomInStreamAdUrl(streamTargeting);

  if (midroll) {
    const instreamVastUrl = new URL(midroll);

    const searchParams = new URLSearchParams(
      (() => {
        if (paramsKey && instreamVastUrl.searchParams.has(paramsKey)) {
          return instreamVastUrl.searchParams.get(paramsKey)!.toString();
        }
      })(),
    );

    refreshPrerollUniqueTargetingParameters(
      paramsKey ? searchParams : instreamVastUrl.searchParams,
    );

    if (paramsKey) {
      instreamVastUrl.searchParams.set(paramsKey, searchParams.toString());
    }

    return {
      format: AdFormat.Custom,
      tag: instreamVastUrl.toString(),
      type: AdType.Midroll,
      companions: null,
    };
  }

  return null;
};

export const refreshPrerollUrl = (
  preroll: string,
  format: AdFormat,
): AdPayload | null => {
  try {
    const prerollUrl = new URL(preroll);

    const cust_params = new URLSearchParams(
      (() => {
        const cust_params = prerollUrl.searchParams.get('cust_params');
        if (cust_params) return cust_params;
      })(),
    );

    refreshPrerollUniqueTargetingParameters(cust_params);

    prerollUrl.searchParams.set('cust_params', cust_params.toString());

    return {
      format,
      tag: prerollUrl.toString(),
      type: AdType.Preroll,
      companions: null,
    };
  } catch {
    return null;
  }
};

export const buildCustomInStreamAdUrl = (
  targeting: CustomInStreamAdTargeting,
) => {
  const { ua, us_privacy, ...rest } = targeting;

  try {
    const targetingQueryParams = buildTargetingQueryParams(
      Object.entries({
        ...rest,
        us_privacy: CCPAUserPrivacy(us_privacy ?? ''),
        'X-Device-User-Agent': ua,
        'X-Device-Referer': window.location.href,
      }),
    );

    return targetingQueryParams.toString().length > 0 ?
        new URL(
          `${TRITON_VAST_BASE_URL}?${targetingQueryParams.toString()}`,
        ).toString()
      : null;
  } catch {
    console.error(PlayerError.Targeting.message);
  }
  return null;
};

export const buildCustomPreRollUrl = async ({
  ampPrerollUrl,
  iu,
  seed,
  prerollTargeting,
}: {
  ampPrerollUrl: string;
  iu: string;
  seed?: string;
  prerollTargeting?: CustomPrerollAdTargeting | null;
}) => {
  try {
    const [, query] = ampPrerollUrl.split('?');
    const vastParams = new URLSearchParams(query);

    vastParams.set('iu', iu);
    vastParams.set('description_url', encodeURIComponent(window.location.href));

    for (const [key, value] of Object.entries(DEFAULT_PREROLL_PARAMS)) {
      vastParams.set(key, value);
    }

    const cust_params = new URLSearchParams(
      vastParams.get('cust_params') ?? '',
    );

    const apsTargeting = await fetchAmazonBids();

    logger.info(
      'Amazon bids set in custom preroll apsTargeting values',
      JSON.stringify(apsTargeting),
    );

    if (apsTargeting && Object.keys(apsTargeting)?.length > 0) {
      for (const [key, value] of Object.entries(apsTargeting)) {
        logger.info(
          `Amazon bids set in custom preroll apsTargeting keys ${key}=${value}`,
        );
        cust_params.set(key, value as string);
      }
    }

    logger.info(`Amazon bids set in custom preroll ${cust_params.toString()}`);

    cust_params.set('ccrcontent1', 'null');
    cust_params.set('ccrcontent2', 'null');
    cust_params.set('ccrcontent3', 'null');
    cust_params.set('ccrpos', '7005');
    cust_params.set('source', 'null');
    if (seed) {
      cust_params.set('seed', seed);
    }
    if (prerollTargeting) {
      for (const [key, value] of Object.entries(prerollTargeting)) {
        if (value) {
          cust_params.set(key, String(value));
        }
      }
    }

    vastParams.set('cust_params', cust_params.toString());

    return new URL(`${GAM_VAST_BASE_URL}?${vastParams.toString()}`).toString();
  } catch (error: unknown) {
    console.log('Could not build custom preroll url', error);
  }
};

export const getLiveAdUnit = memoize(
  ({
    provider,
    market,
    callLetters,
    dfpInstanceId,
    postfix,
  }: {
    provider?: string;
    market?: string;
    callLetters: string;
    dfpInstanceId?: number | null;
    postfix: 'n' | undefined;
  }) => {
    if (!dfpInstanceId) return;

    const providerAlias =
      !provider || /clear\schannel/i.test(provider) ?
        'ccr'
      : provider?.toLowerCase().slice(0, 3);

    const marketAlias =
      market ? market.toLowerCase().replaceAll('-', '.') : undefined;

    return `/${[
      String(dfpInstanceId),
      [providerAlias, marketAlias, postfix].filter(Boolean).join('.'),
      callLetters?.toLowerCase(),
    ]
      .filter(Boolean)
      .join('/')}`;
  },
);
