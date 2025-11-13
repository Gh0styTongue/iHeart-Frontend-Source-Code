import type { Market } from '@iheartradio/web.remix-shared/schemas.js';
import cookie from 'js-cookie';
import { isNonNullish } from 'remeda';

import { MARKET_COOKIE_NAME, parseMarketCookie } from '~app/contexts/market';
import { defaultMXMarket, defaultUSMarket } from '~app/utilities/constants';

export type RadioDialFilterState = {
  selectedCountryCode: string;
  activeMarketId: number;
  geoMarketId: number;
  selectedGenreId: number;
  queryByZip?: string;
  invalidZip: boolean;
  isDefaultMarket: boolean;
  isChangingLocation: boolean;
};

type UpdateActiveMarketAction = {
  type: 'updateActiveMarket';
  payload: { marketId: number };
};
type UpdateSelectedGenreIdAction = {
  type: 'updateSelectedGenreId';
  payload: { genreId: number };
};
type UpdateSelectedCountryCodeAction = {
  type: 'updateSelectedCountryCode';
  payload: { countryCode: string };
};
type QueryMarketsByZipAction = {
  type: 'queryMarketsByZip';
  payload: { zipCode: string | undefined };
};
type InvalidZipAction = { type: 'invalidZip'; payload: { isInvalid: boolean } };
type UpdateGeoMarketAction = {
  type: 'updateGeoMarket';
  payload: { marketId: number };
};
type UpdateIsDefaultAction = {
  type: 'updateIsDefault';
  payload: { isDefault: boolean };
};
type UpdateIsChangingLocation = {
  type: 'updateIsChangingLocation';
  payload: {
    isChangingLocation: boolean;
  };
};

type Actions = Pick<
  | UpdateActiveMarketAction
  | UpdateSelectedCountryCodeAction
  | UpdateSelectedGenreIdAction
  | QueryMarketsByZipAction
  | InvalidZipAction
  | UpdateGeoMarketAction
  | UpdateIsChangingLocation
  | UpdateIsDefaultAction,
  'type'
>['type'];

type ActionPayload<T extends Actions> = Extract<
  | UpdateActiveMarketAction
  | UpdateSelectedCountryCodeAction
  | UpdateSelectedGenreIdAction
  | QueryMarketsByZipAction
  | InvalidZipAction
  | UpdateGeoMarketAction
  | UpdateIsChangingLocation
  | UpdateIsDefaultAction,
  { type: T }
>['payload'];
type BatchPayload = { [K in Actions]?: ActionPayload<K> };

export type RadioDialFilterAction =
  | UpdateActiveMarketAction
  | UpdateSelectedGenreIdAction
  | UpdateSelectedCountryCodeAction
  | QueryMarketsByZipAction
  | InvalidZipAction
  | UpdateGeoMarketAction
  | UpdateIsChangingLocation
  | UpdateIsDefaultAction
  | {
      type: 'batchUpdate';
      payload: BatchPayload;
    };

export const SessionStorageKeys = {
  RadioDialGenre: 'radioDialGenre',
  RadioDialCountry: 'radioDialCountry',
} as const;

export function radioDialFilterStateReducer(
  state: RadioDialFilterState,
  action: RadioDialFilterAction,
): RadioDialFilterState {
  const { type, payload } = action;
  switch (type) {
    case 'updateActiveMarket': {
      return {
        ...state,
        activeMarketId: payload.marketId,
      };
    }
    case 'updateGeoMarket': {
      return {
        ...state,
        geoMarketId: payload.marketId,
      };
    }
    case 'updateSelectedGenreId': {
      window.sessionStorage.setItem(
        SessionStorageKeys.RadioDialGenre,
        String(payload.genreId),
      );
      return {
        ...state,
        selectedGenreId: payload.genreId,
      };
    }
    case 'updateSelectedCountryCode': {
      window.sessionStorage.setItem(SessionStorageKeys.RadioDialGenre, '0');
      window.sessionStorage.setItem(
        SessionStorageKeys.RadioDialCountry,
        payload.countryCode,
      );
      return {
        ...state,
        selectedCountryCode: payload.countryCode,
        selectedGenreId: 0,
      };
    }
    case 'queryMarketsByZip': {
      return {
        ...state,
        queryByZip: payload.zipCode,
      };
    }
    case 'invalidZip': {
      return {
        ...state,
        invalidZip: payload.isInvalid,
      };
    }
    case 'updateIsDefault': {
      return {
        ...state,
        isDefaultMarket: payload.isDefault,
      };
    }
    case 'updateIsChangingLocation': {
      return {
        ...state,
        isChangingLocation: payload.isChangingLocation,
      };
    }
    case 'batchUpdate': {
      const newState = { ...state };

      for (const [key, value] of Object.entries(payload) as [
        Actions,
        ActionPayload<Actions>,
      ][]) {
        switch (key) {
          case 'updateActiveMarket': {
            newState['activeMarketId'] = (
              value as ActionPayload<'updateActiveMarket'>
            ).marketId;
            break;
          }
          case 'updateGeoMarket': {
            newState['geoMarketId'] = (
              value as ActionPayload<'updateGeoMarket'>
            ).marketId;
            break;
          }
          case 'invalidZip': {
            newState['invalidZip'] = (
              value as ActionPayload<'invalidZip'>
            ).isInvalid;
            break;
          }
          case 'queryMarketsByZip': {
            newState['queryByZip'] = (
              value as ActionPayload<'queryMarketsByZip'>
            ).zipCode;
            break;
          }
          case 'updateSelectedCountryCode': {
            window.sessionStorage.setItem(
              SessionStorageKeys.RadioDialGenre,
              '0',
            );
            window.sessionStorage.setItem(
              SessionStorageKeys.RadioDialCountry,
              (value as ActionPayload<'updateSelectedCountryCode'>).countryCode,
            );
            newState['selectedCountryCode'] = (
              value as ActionPayload<'updateSelectedCountryCode'>
            ).countryCode;
            break;
          }
          case 'updateSelectedGenreId': {
            window.sessionStorage.setItem(
              SessionStorageKeys.RadioDialGenre,
              String((value as ActionPayload<'updateSelectedGenreId'>).genreId),
            );
            newState['selectedGenreId'] = (
              value as ActionPayload<'updateSelectedGenreId'>
            ).genreId;
            break;
          }
          case 'updateIsDefault': {
            newState['isDefaultMarket'] = (
              value as ActionPayload<'updateIsDefault'>
            ).isDefault;
            break;
          }
          case 'updateIsChangingLocation': {
            newState['isChangingLocation'] = (
              value as ActionPayload<'updateIsChangingLocation'>
            ).isChangingLocation;
            break;
          }
        }
      }

      return newState;
    }
  }
}

export function createInitialFilterState({
  _countryCode,
  _marketId,
  _geoMarketId,
  _genreId,
  _isBrowser,
  _usePathParams,
}: {
  _countryCode?: string;
  _marketId?: number | string;
  _geoMarketId?: number | string;
  _genreId?: number | string;
  _isBrowser: boolean;
  _usePathParams: boolean;
}): RadioDialFilterState {
  const marketCookie = cookie.get(MARKET_COOKIE_NAME);
  const parsedMarket = marketCookie ? parseMarketCookie(marketCookie) : null;

  const _activeMarketId =
    _isBrowser && parsedMarket ?
      (parsedMarket.market?.marketId ?? _marketId)
    : _marketId;

  const geoMarketId =
    _isBrowser ?
      (parsedMarket?.geoMarket?.marketId ?? _geoMarketId)
    : (_geoMarketId ?? _activeMarketId);

  const selectedGenreId =
    _genreId ??
    (_isBrowser ? window.sessionStorage.getItem('radioDialGenre') : null);

  const radioDialCountry =
    _countryCode ??
    (_isBrowser ? window.sessionStorage.getItem('radioDialCountry') : null);

  const defaultMarket =
    radioDialCountry === 'MX' ? defaultMXMarket : defaultUSMarket;
  const defaultCountry = 'US';

  const selectedCountryCode =
    _usePathParams ?
      (_countryCode ?? radioDialCountry ?? defaultCountry)
    : (radioDialCountry ?? _countryCode ?? defaultCountry);

  const activeMarketId = resolveActiveMarketId({
    usePathParams: _usePathParams,
    marketId: _marketId,
    geoMarketId,
    activeMarketId: _activeMarketId,
    selectedCountryCode,
    market: parsedMarket?.market,
    defaultMarket,
  });

  return {
    activeMarketId,
    geoMarketId:
      isNonNullish(geoMarketId) ? Number(geoMarketId)
      : isNonNullish(_activeMarketId) ? Number(_activeMarketId)
      : defaultMarket.marketId,
    selectedGenreId:
      isNonNullish(selectedGenreId) ? Number(selectedGenreId) : 0,
    selectedCountryCode,
    invalidZip: false,
    isDefaultMarket: activeMarketId === defaultMarket.marketId,
    isChangingLocation: false,
  };
}

export function resolveActiveMarketId({
  usePathParams,
  marketId,
  geoMarketId,
  activeMarketId,
  selectedCountryCode,
  market,
  defaultMarket,
}: {
  usePathParams: boolean;
  marketId: string | number | undefined;
  geoMarketId: string | number | undefined;
  activeMarketId: string | number | undefined;
  selectedCountryCode: string;
  market: Market | undefined;
  defaultMarket: Market;
}): number {
  if (usePathParams && isNonNullish(marketId)) {
    return Number(marketId);
  }
  if (market) {
    return (
        market.countryAbbreviation.toLowerCase().trim() ===
          selectedCountryCode.toLowerCase().trim()
      ) ?
        market.marketId
      : 0;
  }
  if (isNonNullish(activeMarketId)) {
    return Number(activeMarketId);
  }
  if (isNonNullish(geoMarketId)) {
    return Number(geoMarketId);
  }
  return defaultMarket.marketId;
}
