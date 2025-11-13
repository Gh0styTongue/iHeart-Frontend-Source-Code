import {
  type ApiFetcher,
  type ApiFetcherArgs,
  type AppRoute,
  type AppRouteMutation,
  getCompleteUrl,
  initClient,
  isAppRoute,
  tsRestFetchApi,
  UnknownStatusError,
  validateResponse,
} from '@ts-rest/core';
import ms from 'ms';
import { isDeepEqual, isNonNullish, isPlainObject, omit, pickBy } from 'remeda';
import { ZodObject } from 'zod';
import { fromZodError, isZodErrorLike } from 'zod-validation-error';

import { ContentType } from '../httpUtils/constants.js';
import { HTTPError } from '../index.js';
import { isServer } from '../utils.js';
import { ampContract } from './contract/index.js';
import { logger } from './logger.js';
import {
  DEFAULT_TOKEN_COOKIE_SERIALIZER,
  fetchNewApiToken,
  getTokenErrorStatusMessage,
  HardenedHostnameSchema,
  isOkStatus,
  RetriesExceededError,
  toFormData,
  toURL,
  toUrlEncoded,
} from './utils.js';

export const createAmpClient = (options?: AmpClientOptions) => {
  return new AmpClient(options);
};

function encodeBody(
  contentType: ApiFetcherArgs['contentType'],
  rawBody: unknown,
): string | FormData | undefined {
  if (contentType === ContentType.FormData) {
    return (
      rawBody instanceof FormData ? rawBody
      : isPlainObject(rawBody) ? toFormData(rawBody)
      : undefined
    );
  }

  if (contentType === ContentType.FormUrlEncoded) {
    return toUrlEncoded(rawBody);
  }

  if (contentType === ContentType.Json) {
    return JSON.stringify(rawBody);
  }
}

function sortKeys<T extends Record<string, unknown>>(o: T): T {
  return Object.keys(o)
    .sort()
    .reduce<T>((result, key: keyof T) => {
      result[key] = o[key];
      return result;
    }, {} as T);
}

const isAppRouteMutation = (x: AppRoute): x is AppRouteMutation =>
  x.method !== 'GET';

export interface AmpClientOptions {
  baseUrl?: string;
  profileId?: string | number;
  sessionId?: string;
  userPrivacyOptOut?: boolean;
  hostName?: string;
  locale?: string;
  token?: string;

  throwOnErrorStatus?: boolean;
  throwOnUnknownStatus?: boolean;

  debug?: boolean;
  logTimings?: boolean;

  tokenCookieSerializer?: (value: {
    token: string;
    expiration: number;
  }) => Promise<string>;
}

export const AmpHeaderNames = {
  ProfileId: 'X-IHR-Profile-ID',
  SessionId: 'X-IHR-Session-ID',
  UserId: 'X-User-Id',
  Session_Id: 'X-Session-Id',
  HostName: 'X-hostName',
  Locale: 'X-Locale',
  Token: 'X-Token',
} as const;

export const DEFAULT_AMP_BASE_URL = 'https://global.api.iheart.com';
const MAX_RETRIES = 2;
const PerformanceMarks = {
  Begin: 'api-executor-begin',
  End: 'api-executor-end',
  Measure: 'api-executor-measure',
} as const;

interface CustomApiFetcherArgs {
  /**
   * If enabled, the client will log information about requests and responses.
   */
  debug?: boolean;
  /**
   * If enabled, the client will log the duration of requests.
   */
  logTimings?: boolean;
  /**
   * If enabled, the client will throw an error if the response status is not in the "ok" range (200 - 299).
   */
  throwOnErrorStatus?: boolean;
}

export class AmpClient {
  #baseUrl: AmpClientOptions['baseUrl'];
  #profileId?: AmpClientOptions['profileId'];
  #sessionId?: AmpClientOptions['sessionId'];
  #userPrivacyOptOut: AmpClientOptions['userPrivacyOptOut'];
  #hostName?: AmpClientOptions['hostName'];
  #locale?: AmpClientOptions['locale'];
  #token?: AmpClientOptions['token'];

  // ts-rest options
  #throwOnUnknownStatus: AmpClientOptions['throwOnUnknownStatus'];

  // Custom options
  #debug: AmpClientOptions['debug'];
  #logTimings: AmpClientOptions['logTimings'];
  #throwOnErrorStatus: AmpClientOptions['throwOnErrorStatus'];

  // Serializer for the token cookie. Abstracted here so that `createCookie` can be used
  // as the serializer when set in `web.listen`/`web.account`. A default is provided
  // in case the prop is not provided in call to `createAmpClient`.
  #tokenCookieSerializer: Exclude<
    AmpClientOptions['tokenCookieSerializer'],
    undefined
  >;

  constructor(options: Partial<AmpClientOptions> = {}) {
    const {
      profileId,
      sessionId,
      userPrivacyOptOut,
      hostName,
      baseUrl,
      locale,
      debug,
      logTimings,
      throwOnErrorStatus,
      throwOnUnknownStatus,
      token,
      tokenCookieSerializer,
    } = options;

    this.#throwOnUnknownStatus = throwOnUnknownStatus ?? false;

    this.#tokenCookieSerializer =
      tokenCookieSerializer ?? DEFAULT_TOKEN_COOKIE_SERIALIZER;

    this.#debug = debug ?? false;
    this.#logTimings = logTimings ?? false;
    this.#throwOnErrorStatus = throwOnErrorStatus ?? false;

    // Header values
    this.#profileId = profileId;
    this.#sessionId = sessionId;
    this.#userPrivacyOptOut = userPrivacyOptOut ?? false;
    this.#hostName = hostName;
    this.#baseUrl = baseUrl ?? DEFAULT_AMP_BASE_URL;
    this.#locale = locale;
    this.#token = token;
  }

  get hasCredentials(): boolean {
    return isNonNullish(this.#profileId) && isNonNullish(this.#sessionId);
  }

  #_executor = async (
    args: ApiFetcherArgs & CustomApiFetcherArgs,
    tries = 0,
    opts?: { setCookie?: string },
  ): ReturnType<ApiFetcher> => {
    const logTimings = args.logTimings ?? this.#logTimings ?? false;

    if (logTimings && tries === 0) {
      try {
        performance.mark(PerformanceMarks.Begin);
      } catch {
        /* do nothing */
      }
    }

    const {
      headers,
      body,
      rawBody,
      path,
      method,
      route,
      rawQuery,
      rawParams,
      contentType,
    } = args;

    const { setCookie } = opts ?? { setCookie: undefined };

    const debug = args.debug ?? this.#debug ?? false;

    const throwOnErrorStatus =
      args.throwOnErrorStatus ?? this.#throwOnErrorStatus ?? false;

    const failOnValidationMismatch =
      (isPlainObject(route.metadata) ?
        route.metadata?.failOnValidationMismatch
      : true) ?? true;

    const allHeaders = {
      ...pickBy(
        {
          [AmpHeaderNames.ProfileId]: this.#profileId?.toString(),
          [AmpHeaderNames.SessionId]: this.#sessionId,
          [AmpHeaderNames.UserId]: this.#profileId?.toString(),
          [AmpHeaderNames.Session_Id]: this.#sessionId,
          [AmpHeaderNames.HostName]: this.#hostName,
          [AmpHeaderNames.Locale]: this.#locale,
          // Only set `X-Token` header for hostnames that are whitelisted
          [AmpHeaderNames.Token]:
            HardenedHostnameSchema.safeParse(this.#hostName).success ?
              `Bearer ${this.#token}`
            : undefined, // this will get set in `setConfig`
        },
        isNonNullish,
      ),

      ...headers,
    };

    let parsedPathParams = null;
    let parsedQuery = null;
    let parsedBody = null;

    const signals = [
      // On the server, combine any provided signal with a timeout signal (set to 3 seconds)
      isServer ? AbortSignal.timeout(3000) : undefined,
      args.fetchOptions?.signal,
    ].filter(isNonNullish);

    const fetchOptions = {
      ...args.fetchOptions,
      signal: AbortSignal.any(signals),
    };

    if (isAppRoute(route) && route?.pathParams instanceof ZodObject) {
      const result = route?.pathParams.safeParse(rawParams);

      if (!result.success) {
        const validationError = fromZodError(result.error);
        if (debug) {
          logger.warn('Error parsing path params:', { route, validationError });
        }

        throw validationError;
      }

      parsedPathParams = result.data;
    }

    if (isAppRoute(route) && route?.query instanceof ZodObject) {
      // Specify `optional()` here because query params should always be optional and doing it elsewhere borks the types for some reason
      const result = route?.query?.optional().safeParse(rawQuery);

      if (!result.success) {
        const validationError = fromZodError(result.error);
        if (debug) {
          logger.warn('Error parsing query:', { validationError, route });
        }

        throw validationError;
      }

      parsedQuery =
        isPlainObject(result.data) ? sortKeys(result.data) : result.data;
    }

    if (isAppRouteMutation(route) && route?.body instanceof ZodObject) {
      const result = route?.body.safeParse(rawBody);

      if (!result.success) {
        const validationError = fromZodError(result.error);
        if (debug) {
          logger.warn('Error parsing body:', { validationError, route });
        }

        throw validationError;
      }

      parsedBody = result.data;
    }

    const sortedRawQuery =
      isPlainObject(rawQuery) ? sortKeys(rawQuery) : rawQuery;

    const completeUrl = getCompleteUrl(
      parsedQuery ?? sortedRawQuery,
      this.baseUrl,
      parsedPathParams ?? rawParams,
      route,
      false,
    );

    // Properly encode the request body if the content type is set to `application/x-www-form-urlencoded`
    const finalBody =
      isAppRouteMutation(route) ?
        (encodeBody(contentType, parsedBody ?? rawBody) ?? body)
      : body;

    const finalArgsWithoutValidation = {
      ...args,
      headers: allHeaders,
      body: finalBody,
      path: getCompleteUrl(
        sortedRawQuery,
        this.baseUrl,
        rawParams,
        route,
        false,
      ),
      rawQuery: sortedRawQuery,
    };

    const finalArgsWithValidation = {
      ...args,
      body: finalBody,
      headers: allHeaders,
      path: completeUrl,
      rawQuery: sortedRawQuery,
    };

    if (
      failOnValidationMismatch &&
      !isDeepEqual(
        omit(finalArgsWithoutValidation, ['route']),
        omit(finalArgsWithValidation, ['route']),
      )
    ) {
      logger.error('Final args are not deeply equal:', {
        finalArgsWithValidation: omit(finalArgsWithValidation, ['route']),
        finalArgsWithoutValidation: omit(finalArgsWithoutValidation, ['route']),
      });

      throw new Error('Final args are not deeply equal');
    }

    try {
      // If we've gotten a new token twice, and the retry still hasn't succeeded, we gotta bail
      // throwing inside try to catch it below
      if (tries >= MAX_RETRIES) {
        throw new RetriesExceededError();
      }

      const rawResponse = await tsRestFetchApi({
        ...finalArgsWithValidation,
        fetchOptions,
      });

      if (debug) {
        try {
          validateResponse({ appRoute: route, response: rawResponse });
        } catch (error: unknown) {
          let e = error;
          if (isZodErrorLike(error)) {
            e = fromZodError(error);
          }

          logger.warn(`Response validation failed for "${route.path}"`, {
            error: e,
            route,
          });
        }
      }

      // Token has expired, get a new one and retry
      if (rawResponse.status === 480 || rawResponse.status === 484) {
        const { token, expiration } = await fetchNewApiToken({
          baseUrl: this.#baseUrl ?? DEFAULT_AMP_BASE_URL,
          hostName: this.#hostName,
          path: ampContract.v3.session.postGetApiToken.path,
          profileId: this.#profileId,
          sessionId: this.#sessionId,
        });

        this.#token = token;

        // Retry the request, incrementing the number of tries and serializing the new token/expiration into a 'Set-Cookie' header
        return this.#_executor(args, tries + 1, {
          setCookie: await this.#tokenCookieSerializer({ token, expiration }),
        });
      }

      if (debug) {
        logger.log('rawResponse', { rawResponse });
      }

      if (throwOnErrorStatus && !isOkStatus(rawResponse.status)) {
        // If it was a token-related error, get the error message so that we can include it as
        // a header on the HTTPError that is thrown
        const tokenErrorStatusMessage = getTokenErrorStatusMessage(
          rawResponse.status,
        );

        const url = toURL(path, {
          // @ts-expect-error This should never be invalid but `rawQuery` being `unknown` complicates the types here
          query: rawQuery,
          baseUrl: this.#baseUrl,
        });

        const responseBody =
          rawResponse.headers.get('Content-Type')?.includes('json') ?
            JSON.stringify(rawResponse.body, null, 2)
          : rawResponse.body;

        // Dupe the raw response headers in order to be able to append the token error
        // message as a header
        const responseHeaders = new Headers(
          Object.fromEntries(rawResponse.headers.entries()),
        );
        if (tokenErrorStatusMessage) {
          responseHeaders.append('X-Token-Error', tokenErrorStatusMessage);
        }

        throw new HTTPError(
          new Response(responseBody as BodyInit, {
            status: rawResponse.status,
            headers: responseHeaders,
          }),
          new Request(url, {
            headers,
            body: finalBody,
            method,
          }),
        );
      }

      // This sets the new token/expiration in a cookie
      if (setCookie) {
        rawResponse.headers.append('Set-Cookie', setCookie);
      }

      return rawResponse;
    } catch (error: unknown) {
      if (
        error instanceof Error &&
        (error.name === 'AbortError' || error.name === 'TimeoutError')
      ) {
        const errorType =
          error.name === 'AbortError' ? 'was aborted' : 'timed out';
        logger.error(`Request ${errorType}:`, finalArgsWithValidation);
        throw error;
      }
      if (error instanceof HTTPError) {
        throw error;
      }
      if (error instanceof UnknownStatusError) {
        throw error;
      }
      if (isZodErrorLike(error)) {
        const validationError = fromZodError(error);
        throw validationError;
      }
      if (error instanceof TypeError) {
        throw error;
      }
      if (error instanceof RetriesExceededError) {
        throw error;
      }

      logger.warn('Unhandled error type:', { error });
      throw error;
    } finally {
      if (logTimings) {
        try {
          performance.mark(PerformanceMarks.End);

          const { duration } = performance.measure(
            PerformanceMarks.Measure,
            PerformanceMarks.Begin,
            PerformanceMarks.End,
          );

          logger.log(`TIMING: ${method} ${path}`, {
            duration: `${ms(
              new Intl.NumberFormat('en-US', {
                maximumSignificantDigits: 6,
              }).format(duration),
            )})`,
          });
        } catch {
          /* do nothing */
        }

        performance.clearMarks();
        performance.clearMeasures();
      }
    }
  };

  get api() {
    return initClient(ampContract, {
      throwOnUnknownStatus: this.throwOnUnknownStatus,
      baseUrl: this.baseUrl,
      baseHeaders: {
        accept: 'application/json',
      },
      api: this.#_executor,
    });
  }

  getConfig() {
    return {
      baseUrl: this.#baseUrl,
      profileId: this.#profileId,
      sessionId: this.#sessionId,
      userPrivacyOptOut: this.#userPrivacyOptOut,
      hostName: this.#hostName,
      locale: this.#locale,
      logTimings: this.#logTimings,
      debug: this.#debug,
      throwOnErrorStatus: this.#throwOnErrorStatus,
      throwOnUnknownStatus: this.#throwOnUnknownStatus,
      token: this.#token,
    };
  }

  setConfig(options: AmpClientOptions = {}) {
    // To avoid overwriting properties that are not set in `options`, we use the "in" operator here.

    if ('baseUrl' in options) {
      this.#baseUrl = options.baseUrl ?? DEFAULT_AMP_BASE_URL;
    }

    if ('profileId' in options) {
      this.#profileId = options.profileId;
    }

    if ('sessionId' in options) {
      this.#sessionId = options.sessionId;
    }

    if ('userPrivacyOptOut' in options) {
      this.#userPrivacyOptOut = options.userPrivacyOptOut ?? false;
    }

    if ('hostName' in options) {
      this.#hostName = options.hostName;
    }

    if ('locale' in options) {
      this.#locale = options.locale;
    }

    if ('logTimings' in options) {
      this.#logTimings = options.logTimings ?? this.#logTimings;
    }

    if ('debug' in options) {
      this.#debug = options.debug ?? this.#debug;
    }

    if ('token' in options) {
      this.#token = options.token ?? this.#token;
    }

    if ('tokenCookieSerializer' in options) {
      this.#tokenCookieSerializer =
        options.tokenCookieSerializer ?? this.#tokenCookieSerializer;
    }
  }

  get baseUrl() {
    if (this.#baseUrl) return this.#baseUrl;
    throw new Error('baseUrl is not set');
  }

  get profileId() {
    if (this.#profileId) return this.#profileId;
    throw new Error('profileId is not set');
  }

  get sessionId() {
    if (this.#sessionId) return this.#sessionId;
    throw new Error('sessionId is not set');
  }

  get userPrivacyOptOut() {
    if (this.#userPrivacyOptOut) return this.#userPrivacyOptOut;
    throw new Error('userPrivacyOptOut is not set');
  }

  get hostName() {
    if (this.#hostName) return this.#hostName;
    throw new Error('hostName is not set');
  }

  get locale() {
    return this.#locale;
  }

  get throwOnErrorStatus() {
    return this.#throwOnErrorStatus ?? false;
  }

  get throwOnUnknownStatus() {
    return this.#throwOnUnknownStatus ?? false;
  }

  get token() {
    return this.#token;
  }

  set token(val: string | undefined) {
    this.#token = val;
  }

  get logTimings() {
    return this.#logTimings ?? false;
  }

  get debug() {
    return this.#debug ?? false;
  }
}
