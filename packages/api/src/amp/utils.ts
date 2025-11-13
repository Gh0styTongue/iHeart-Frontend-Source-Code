import ms from 'ms';
import {
  capitalize,
  isBoolean,
  isNonNullish,
  isNullish,
  isNumber,
  isPlainObject,
  isString,
  pickBy,
} from 'remeda';
import { z } from 'zod';

import { HTTPError } from '../errors/http-error.js';
import type {
  ResponseObject,
  ResponseObjectV2,
} from '../types/amp-generated.js';

export function toPlainObject(data: {
  entries: () => IterableIterator<[string, any]>;
}) {
  return Object.fromEntries(data.entries());
}

export function toFormData(
  data: Record<string, unknown> | Array<[string, unknown]>,
): FormData {
  const fd = new FormData();
  for (const [k, v] of Array.isArray(data) ? data : Object.entries(data)) {
    if (isNullish(v)) {
      break;
    }

    switch (true) {
      case typeof v === 'string': {
        fd.append(k, v);
        break;
      }
      default: {
        fd.append(k, JSON.stringify(v));
        break;
      }
    }
  }
  return fd;
}

export function toUrlEncoded(data: Record<string, unknown> | unknown) {
  return Object.entries(isPlainObject(data) ? pickBy(data, isNonNullish) : {})
    .map(([k, v]) =>
      isString(v) || isNumber(v) || isBoolean(v) ?
        `${encodeURIComponent(k)}=${encodeURIComponent(v)}`
      : null,
    )
    .filter(isNonNullish)
    .join('&');
}

export function toURL(
  path: string | URL,
  options: {
    baseUrl?: string | URL;
    query?:
      | ConstructorParameters<typeof URLSearchParams>[0]
      | Record<string, { toString(): string }>;
  } = {},
) {
  const { baseUrl, query } = options;

  const searchParams =
    query ?
      new URLSearchParams(
        isPlainObject(query) ?
          (Object.entries(query).map(([k, v]) => [k, v.toString()]) as [
            string,
            string,
          ][])
        : query,
      )
        .toString()
        .trim()
    : '';

  const url =
    path +
    (searchParams && searchParams.length > 0 ?
      '?' + searchParams
    : searchParams);
  if (!URL.canParse(url, baseUrl?.toString())) {
    throw new Error(`Cannot create URL from ${baseUrl} + ${path} + ${query}`);
  }
  return new URL(url, baseUrl);
}

type Enumerate<N extends number, Accumulator extends number[] = []> =
  Accumulator['length'] extends N ? Accumulator[number]
  : Enumerate<N, [...Accumulator, Accumulator['length']]>;

type IntRange<F extends number, T extends number> = Exclude<
  Enumerate<T>,
  Enumerate<F>
>;

/**
 * Checks if a HTTP status is in the "OK" range (`200-299`)
 *
 * @param status The HTTP status
 * @returns `true` if the status is in the `200-299` range, `false` otherwise
 */
export function isOkStatus(status: number): status is IntRange<200, 300> {
  return status >= 200 && status <= 299;
}

/**
 * Gets the error message based on the API Token Error HTTP status
 *
 * @param status the HTTP status in "API Token Error" range (`481-489`)
 * @returns string
 */
export function getTokenErrorStatusMessage(status: number): string | undefined {
  switch (status) {
    case 481: {
      return 'Invalid Signature';
    }
    case 482: {
      return 'Key Not Found';
    }
    case 483: {
      return 'Unsupported Algorithm';
    }
    case 484: {
      return 'Token Not Found';
    }
    case 489: {
      return 'Other Token Error';
    }
  }
}

/**
 * Fetches a new API Token when a `480` status code is encountered when making a request from the AmpClient
 *
 * @param opts `{ baseUrl, hostName, path, profileId, sessionId }: { baseUrl: string; hostName?: string; path: string; profileId?: string | number; sessionId?: string }
 * @returns { token, expiration } An object containing the new token and expiration timestamp
 */
export async function fetchNewApiToken({
  baseUrl,
  hostName,
  path,
  profileId,
  sessionId,
}: {
  baseUrl: string;
  hostName?: string;
  path: string;
  profileId?: string | number;
  sessionId?: string;
}): Promise<{ token: string; expiration: number }> {
  // Construct a URL instance using `this.#baseUrl` or `DEFAULT_AMP_BASE_URL` if the
  // class instance variable is undefined
  const tokenRefreshUrl = new URL(baseUrl);

  tokenRefreshUrl.pathname = path;
  // `hostname` is a required query parameter for this request
  tokenRefreshUrl.searchParams.append('hostname', hostName ?? '');
  // `version` is another (optional) query param - defaults to '0' if not provided...
  // ...since I'm not sure of its function - we are not providing it 🤷🏽‍♂️

  // Must set `X-IHR-Profile-ID` and `X-IHR-Session-ID` in order to get a token
  // It seems like these are the "correct" headers to send, and are the only ones accepted...
  // ...vs 'X-User-Id' and 'X-Session-Id'
  const tokenRefreshHeaders = new Headers();
  if (profileId) {
    tokenRefreshHeaders.append('X-IHR-Profile-ID', String(profileId));
  }
  if (sessionId) {
    tokenRefreshHeaders.append('X-IHR-Session-ID', sessionId);
  }

  return await fetch(tokenRefreshUrl, {
    method: 'POST',
    headers: tokenRefreshHeaders,
    mode: 'no-cors',
  }).then(async response => {
    // If the response is not OK, throw an HTTPError
    if (!response.ok) {
      throw new HTTPError(
        new Response(
          response.headers.get('Content-Type')?.includes('json') ?
            JSON.stringify(response.body)
          : response.body,
          {
            status: response.status,
            headers: response.headers,
          },
        ),
        new Request(tokenRefreshUrl, {
          headers: tokenRefreshHeaders,
          body: null,
          method: 'POST',
        }),
      );
    }
    const {
      token,
      // Eventually this will be a part of the response from `/api/v3/session/api-token`, but
      // for now, we are just defaulting it to 24 hours (per Jacob Bolton). Also, the token expiration
      // is in epoch-seconds, hence the division by 1000
      expiration = Math.floor((Date.now() + ms('24h')) / 1000),
    } = (await response.json()) as { token: string; expiration: number };

    return {
      token,
      expiration,
    };
  });
}

// The cookie name is exported so it can be used in `createCookie` in `web.listen` and `web.account`
export const TOKEN_COOKIE_NAME = '__api-token';
// Exporting the cookie options to be used `createCookie`
export const TOKEN_COOKIE_OPTIONS = Object.freeze({
  path: '/',
  httpOnly: true,
  secure: true,
  maxAge: Math.floor(ms('24h') / 1000),
});

// Serialize the options for the default serializer
export function serializeTokenCookieOptions(
  options: typeof TOKEN_COOKIE_OPTIONS,
): string {
  return Object.entries(options)
    .reduce((accumulator, [key, value]) => {
      if (isString(value) || isNumber(value)) {
        const keyVal = key === 'maxAge' ? 'Max-Age' : key;
        accumulator.push(`${capitalize(keyVal)}=${value}`);
      } else if (value === true) {
        accumulator.push(capitalize(key));
      }
      return accumulator;
    }, [] as string[])
    .join('; ');
}

export async function DEFAULT_TOKEN_COOKIE_SERIALIZER(value: {
  token: string;
  expiration: number;
}): Promise<string> {
  return `${TOKEN_COOKIE_NAME}=${btoa(
    JSON.stringify(value),
  )}; ${serializeTokenCookieOptions(TOKEN_COOKIE_OPTIONS)}`;
}

// The only hostnames that are eligible for API Hardening, per [this comment](https://ihm-it.atlassian.net/browse/IHRAMP-12179?focusedCommentId=874488)
const HARDENED_HOSTNAMES = [
  'listen.web.au',
  'listen.web.ca',
  'listen.web.mx',
  'listen.web.nz',
  'listen.web.us',
  'listen.web.ww',
] as const;

type HardenedHostname = (typeof HARDENED_HOSTNAMES)[number];

export const HardenedHostnameSchema = z
  .string()
  .refine(val => {
    const isValidHostName = HARDENED_HOSTNAMES.includes(
      val as HardenedHostname,
    );

    return isValidHostName ? val : undefined;
  })
  .optional();

/**
 * Error thrown when the number of retries for a request has been exceeded
 * Retries occur when fetching a new token when the previous token has expired
 */
export class RetriesExceededError extends Error {
  constructor() {
    super('Number of request retries exceeded');
  }
}

export function getAmpErrors(response: ResponseObject | ResponseObjectV2) {
  return (
    'error' in response ? [response.error]
    : 'errors' in response ? (response.errors ?? [])
    : []).filter(isNonNullish);
}
