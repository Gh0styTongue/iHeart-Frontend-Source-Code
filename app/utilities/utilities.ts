import { MediaServerURL } from '@iheartradio/web.assets';
import { isNonNullish, isString } from 'remeda';

import type { RecentlyPlayedResults } from '~app/api/types';

/**
 * Gets the current time as a floating point number
 *
 * @example
 * ```ts
 * const certainDate = new Date(1684945194000);
 * const time = getTimeFromDate(certainDate); // 11.19 in DST
 * ```
 *
 * @param date Date object
 * @returns returns the time part in 24h format
 */
export const getTimeFromDate = (date: Date): number => {
  return Number.parseFloat(`${date?.getHours()}.${date?.getMinutes()}`);
};

/**
 * Checks if url is relative
 *
 * @example
 * ```ts
 * isRelativeUrl('/browse/live/1469'); // true
 * isRelativeUrl('https://z100.iheart.com'); // false
 * isRelativeUrl(someNullOrUndefinedVar); // false
 * ```
 * @param url URL to check
 * @returns `true` if url is relative, `false` if url is absolute
 */
export const isRelativeUrl = (url: string): boolean => {
  if (!isString(url)) return false;

  const isAbsolute =
    url.indexOf('http://') === 0 || url.indexOf('https://') === 0;

  return !isAbsolute;
};

/**
 * Generates lead urls for Live Profile pages
 * @param liveProfileData Data from liveProfileResponse from WebAPI
 */
export const leadUrlForLiveProfile = (liveProfileData: {
  url: string;
  stationHost?: string;
  showInApp?: boolean;
  embeddedNewsUrl?: string;
}): string => {
  const { url, stationHost, showInApp, embeddedNewsUrl } = liveProfileData;

  if (showInApp && isRelativeUrl(url)) {
    return `${embeddedNewsUrl}${url}`;
  }

  if (stationHost && isRelativeUrl(url)) {
    return `https://${stationHost}${url}`;
  }

  return url;
};

/**
 * Generates a canonical url
 * @param route The app route ("/browse/live")
 * @param base the base url ("https://wwww.iheart.com")
 * @returns {URL} The url
 */
export function getCanonicalURLForRoute(route: string, base?: string): URL {
  return new URL(route, base ?? 'https://www.iheart.com');
}

/**
 * @deprecated
 * @remarks Gets the language (or the full locale string) of the current browser
 * @example
 * ```ts
 * const locale = getBrowserLanguage({ fullLocale: true }); // 'en-US'
 * const lang = getBrowserLanguage(); // 'en'
 * ```
 * @param options If fullLocale = true, returns the full locale, not just the language
 * @returns {string | undefined}
 */
export function getBrowserLanguage(options?: {
  fullLocale?: boolean;
}): string | undefined {
  const fullLocale = options?.fullLocale ?? false;
  const locale: string | undefined = globalThis.window?.navigator?.language;
  if (isNonNullish(locale) && locale.trim() !== '') {
    return fullLocale ? locale : locale.split('-').at(0);
  }
}

export function getLanguageFromLocale(locale?: string) {
  return locale?.split('-').at(0);
}

export function isBrowser() {
  return typeof window !== 'undefined';
}

export function getRecentlyPlayedArtwork(
  hit: RecentlyPlayedResults[number],
): MediaServerURL | undefined {
  let source: string | undefined = undefined;
  if ('imagePath' in hit && hit.imagePath) {
    source = hit.imagePath;
  } else if (
    'content' in hit &&
    hit.content &&
    hit.content[0] &&
    'logo' in hit.content[0] &&
    hit.content[0].logo
  ) {
    source = hit.content[0].logo;
  } else if (
    'content' in hit &&
    hit.content &&
    hit.content[0] &&
    'imagePath' in hit.content[0] &&
    hit.content[0].imagePath
  ) {
    source = hit.content[0].imagePath;
  } else if (
    'urls' in hit &&
    hit.urls &&
    'image' in hit.urls &&
    hit.urls.image
  ) {
    source = hit.urls.image;
  } else if (globalThis.window) {
    source = `${globalThis.window.location.origin}/public/listen/hero-default-square.jpg`;
  }
  return source ? MediaServerURL.fromURL(source) : undefined;
}
