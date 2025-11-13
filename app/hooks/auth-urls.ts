import { useCallback, useMemo } from 'react';

import type { RegGateContext } from '~app/analytics/data';
import {
  makeLoginUrl,
  makeSignUpUrl,
  makeSubscribeUrl,
} from '~app/analytics/reg-gate-toast';
import { useConfig } from '~app/contexts/config';

import { useCurrentLocation } from './use-current-location';

export interface AuthQueryParams {
  redirectUrl?: string;
  context: RegGateContext;
}

export function useLoginUrl(params?: AuthQueryParams) {
  const currentLocationUrl = useCurrentLocation();
  const { urls } = useConfig();

  const loginUrl = useMemo(() => {
    return makeLoginUrl(urls.account, {
      redirectUrl: currentLocationUrl.toString(),
      ...params,
    });
  }, [currentLocationUrl, params, urls.account]);

  return loginUrl;
}

export function useGetLoginUrl(defaultParams?: AuthQueryParams) {
  const currentLocationUrl = useCurrentLocation();
  const { urls } = useConfig();

  return useCallback(
    (params?: AuthQueryParams) => {
      return makeLoginUrl(urls.account, {
        redirectUrl: currentLocationUrl.toString(),
        ...defaultParams,
        ...params,
      });
    },
    [currentLocationUrl, defaultParams, urls.account],
  );
}

export function useSignUpUrl(params?: AuthQueryParams) {
  const currentLocationUrl = useCurrentLocation();
  const { urls } = useConfig();

  const signUpUrl = useMemo(() => {
    return makeSignUpUrl(urls.account, {
      redirectUrl: currentLocationUrl.toString(),
      ...params,
    });
  }, [currentLocationUrl, params, urls.account]);

  return signUpUrl;
}

export function useGetSignUpUrl(defaultParams?: AuthQueryParams) {
  const currentLocationUrl = useCurrentLocation();
  const { urls } = useConfig();

  return useCallback(
    (params: AuthQueryParams) => {
      return makeSignUpUrl(urls.account, {
        redirectUrl: currentLocationUrl.toString(),
        ...defaultParams,
        ...params,
      });
    },
    [currentLocationUrl, defaultParams, urls.account],
  );
}

export function useSubscribeUrl(params?: AuthQueryParams) {
  const currentLocationUrl = useCurrentLocation();
  const { urls } = useConfig();

  const signUpUrl = useMemo(() => {
    return makeSubscribeUrl(urls.account, {
      redirectUrl: currentLocationUrl.toString(),
      ...params,
    });
  }, [currentLocationUrl, params, urls.account]);

  return signUpUrl;
}

export function useGetSubscribeUrl(defaultParams?: AuthQueryParams) {
  const currentLocationUrl = useCurrentLocation();
  const { urls } = useConfig();

  return useCallback(
    (params: AuthQueryParams) => {
      return makeSubscribeUrl(urls.account, {
        redirectUrl: currentLocationUrl.toString(),
        ...defaultParams,
        ...params,
      });
    },
    [currentLocationUrl, defaultParams, urls.account],
  );
}
