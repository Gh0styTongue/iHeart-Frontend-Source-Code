/* eslint-disable @typescript-eslint/no-duplicate-type-constituents */
import { invariant } from '@epic-web/invariant';
import { type Theme, ThemeEnum } from '@iheartradio/web.accomplice';
import { useRouteLoaderData } from 'react-router';
import { isNonNullish } from 'remeda';

export type RequestInfo = {
  hints: {
    theme: Theme;
    reducedMotion: 'reduce' | 'no-preference';
    timeZone: string;
  };
  userPrefs: {
    theme: Theme | null;
  };
  locale: string;
  isMobile: boolean;
  referer?: string | undefined | null;
  origin?: string | undefined | null;
  path?: string | undefined | null;
  url?: string | undefined | null;
  hostName?: string | undefined | null;
  geo?: {
    lat?: number | null;
    lng?: number | null;
  };
};

/**
 * @returns the request info from the root loader
 */
function useRequestInfo(rootError: true): RequestInfo;
function useRequestInfo(rootError: false): RequestInfo;
function useRequestInfo(rootError: undefined): RequestInfo;
function useRequestInfo(): RequestInfo;
function useRequestInfo(rootError?: boolean | undefined): RequestInfo;
function useRequestInfo(rootError?: boolean): RequestInfo {
  const data = useRouteLoaderData('root') as {
    requestInfo?: RequestInfo | undefined;
  };

  if (rootError) {
    // Root error pages return a default light theme RequestInfo
    return {
      hints: {
        reducedMotion: 'no-preference',
        theme: ThemeEnum.light,
        timeZone: 'UTC',
      },
      userPrefs: { theme: ThemeEnum.light },
      isMobile: false,
      locale: 'en-US' as const,
      referer: '/',
    } as RequestInfo;
  }

  invariant(
    isNonNullish(data?.requestInfo),
    'No requestInfo found in root loader',
  );

  return data.requestInfo as RequestInfo;
}

export { useRequestInfo };
