import { invariant } from '@epic-web/invariant';
import { MARKET_COOKIE_NAME } from '@iheartradio/web.remix-shared/isomorphic/cookies';
import { marketCookieSchema } from '@iheartradio/web.remix-shared/schemas.js';
import cookie from 'js-cookie';
import type { ActionDispatch, ReactNode, RefObject } from 'react';
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
} from 'react';
import { clone, isNonNullish, isNullish, prop } from 'remeda';
import type { z } from 'zod';

import { type AmpClient, useAmpClient } from '~app/api/amp-client';
import type { Market } from '~app/api/types';
import { useRequestInfo } from '~app/hooks/use-request-info';
import { logger } from '~app/utilities/logger';

export { MARKET_COOKIE_NAME };

export interface MarketProviderProps {
  children?: ReactNode;
}

type MarketsCookie = z.infer<typeof marketCookieSchema>;

export type MarketContextValue = [MarketContextState, MarketContextDispatch];

export type MarketContextState = {
  market: Market | undefined;
  geoMarket: Market | undefined;
  ready: boolean;
};

type UpdateMarketAction = { type: 'updateMarket'; payload: Market };
type UpdateGeoMarketAction = { type: 'updateGeoMarket'; payload: Market };
type ReadyAction = { type: 'ready'; payload: boolean };
type FetchedMarketAction = { type: 'fetchedMarket'; payload: Market };

type Actions = Pick<
  | UpdateMarketAction
  | UpdateGeoMarketAction
  | ReadyAction
  | FetchedMarketAction,
  'type'
>['type'];

type ActionPayload<T extends Actions> = Extract<
  | UpdateMarketAction
  | UpdateGeoMarketAction
  | ReadyAction
  | FetchedMarketAction,
  { type: T }
>['payload'];

type BatchPayload = Partial<{ [K in Actions]: ActionPayload<K> }>;

export type MarketContextDispatch = ActionDispatch<[action: MarketHookAction]>;

export type MarketHookAction =
  | UpdateMarketAction
  | UpdateGeoMarketAction
  | ReadyAction
  | FetchedMarketAction
  | { type: 'batch'; payload: BatchPayload };

export function parseMarketCookie(sessionCookie: string): MarketsCookie {
  try {
    return marketCookieSchema.parse(
      JSON.parse(decodeURIComponent(atob(sessionCookie))),
    );
  } catch {
    return { market: undefined, geoMarket: undefined };
  }
}

export function writeMarketCookie(markets: MarketsCookie): string | undefined {
  try {
    return btoa(encodeURIComponent(JSON.stringify(markets)));
  } catch {
    return undefined;
  }
}

export function MarketHookReducer(
  state: MarketContextState,
  action: MarketHookAction,
): MarketContextState {
  const { type, payload } = action;
  switch (type) {
    case 'updateGeoMarket': {
      const newState = clone(state);
      newState.geoMarket = payload;

      const { geoMarket, market } = newState;
      const cookieString = writeMarketCookie({ geoMarket, market });
      if (cookieString) {
        cookie.set(MARKET_COOKIE_NAME, cookieString);
      }

      return newState;
    }
    case 'updateMarket': {
      const newState = clone(state);

      fetch('/api/v1/set-market', {
        method: 'POST',
        body: JSON.stringify({ marketId: payload.marketId }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      newState.market = payload;

      const { market, geoMarket } = newState;
      const cookieString = writeMarketCookie({ geoMarket, market });
      if (cookieString) {
        cookie.set(MARKET_COOKIE_NAME, cookieString);
      }

      return newState;
    }
    case 'ready': {
      const newState = clone(state);
      newState.ready = payload;

      const { market, geoMarket } = newState;
      const cookieString = writeMarketCookie({ geoMarket, market });
      if (cookieString) {
        cookie.set(MARKET_COOKIE_NAME, cookieString, {
          secure: true,
          sameSite: 'none',
        });
      }

      return newState;
    }
    case 'fetchedMarket': {
      const newState: MarketContextState = { ...clone(state), ready: true }; // setting `ready: true` here
      fetchedMarketAction(newState, payload);

      return newState;
    }
    case 'batch': {
      const newState = clone(state);

      for (const [key, value] of Object.entries(payload) as [
        Actions,
        ActionPayload<Actions>,
      ][]) {
        switch (key) {
          case 'updateMarket': {
            newState.market = value as ActionPayload<typeof key>;
            break;
          }
          case 'updateGeoMarket': {
            newState.geoMarket = value as ActionPayload<typeof key>;
            break;
          }
          case 'fetchedMarket': {
            fetchedMarketAction(newState, value as ActionPayload<typeof key>);
            newState.ready = true;
            break;
          }
        }
      }

      return newState;
    }
  }
}

function fetchedMarketAction(newState: MarketContextState, payload: Market) {
  if (isNullish(newState.market)) {
    newState.market = payload;
  }
  if (isNullish(newState.geoMarket)) {
    newState.geoMarket = payload;
  }

  const { market, geoMarket } = newState;
  const cookieString = writeMarketCookie({ geoMarket, market });
  if (cookieString) {
    cookie.set(MARKET_COOKIE_NAME, cookieString, {
      secure: true,
      sameSite: 'none',
    });
  }
}

function isNumber(coord: unknown): coord is number {
  return isNonNullish(coord) && !Number.isNaN(Number(coord));
}

function deriveQuery({ lat, lng }: { lat?: unknown; lng?: unknown }) {
  return isNumber(lat) && isNumber(lng) ? { lat, lng } : { useIP: true };
}

export type GetMarketsMethod = AmpClient['api']['v2']['content']['getMarkets'];

export async function fetchMarket({
  coords = { lat: undefined, lng: undefined },
  dispatch,
  fatalStop,
  getMarkets,
  onlyGeo,
}: {
  coords?: { lat?: unknown; lng?: unknown };
  dispatch: ActionDispatch<[action: MarketHookAction]>;
  fatalStop: RefObject<boolean>;
  getMarkets: GetMarketsMethod;
  onlyGeo: boolean;
}): Promise<void> {
  const { lat, lng } = coords;
  try {
    const market = await getMarkets({
      query: {
        ...deriveQuery({ lat, lng }),
        limit: 1,
      },
      fetchOptions: {
        cache: 'no-store',
      },
    })
      .then(prop('body'))
      .then(prop('hits'))
      .then(hits => hits?.at(0));

    if (market) {
      if (onlyGeo) {
        dispatch({ type: 'updateGeoMarket', payload: market });
      } else {
        dispatch({ type: 'fetchedMarket', payload: market });
      }
    } else {
      throw new Error('Failed to fetch geo market');
    }
  } catch (error: unknown) {
    fatalStop.current = true;
    logger.warn(error instanceof Error ? error.message : 'Unknown error');
    dispatch({ type: 'ready', payload: true });
  }
}

export function MarketHookInitialState(): MarketContextState {
  const initialState: MarketContextState = {
    market: undefined,
    geoMarket: undefined,
    ready: false,
  };

  const sessionCookie = cookie.get(MARKET_COOKIE_NAME);

  if (sessionCookie) {
    const marketSession = parseMarketCookie(sessionCookie);
    if (isNonNullish(marketSession.market)) {
      initialState.market = marketSession.market;
    }

    if (isNonNullish(marketSession.geoMarket)) {
      initialState.geoMarket = marketSession.geoMarket;
    }
  }

  if (
    isNonNullish(initialState.market) &&
    isNonNullish(initialState.geoMarket)
  ) {
    initialState.ready = true;
  }

  return initialState;
}

const MarketContext = createContext<MarketContextValue | null>(null);

export function MarketProvider({ children }: MarketProviderProps) {
  const { geo } = useRequestInfo();
  const amp = useAmpClient();
  const fatalStop = useRef<boolean>(false);

  const [state, dispatch] = useReducer(
    MarketHookReducer,
    null,
    MarketHookInitialState,
  );

  useEffect(() => {
    if (isNullish(state.geoMarket) || isNullish(state.market)) {
      const { lat, lng } = geo ?? {};

      if (!fatalStop.current) {
        fetchMarket({
          fatalStop,
          getMarkets: amp.api.v2.content.getMarkets,
          onlyGeo: isNonNullish(state.geoMarket) && isNonNullish(state.market),
          coords: { lat, lng },
          dispatch,
        });
      }
    }
  }, [
    state.geoMarket,
    state.market,
    dispatch,
    geo,
    amp.api.v2.content.getMarkets,
  ]);

  return (
    <MarketContext.Provider
      value={useMemo(() => [state, dispatch], [state, dispatch])}
    >
      {children}
    </MarketContext.Provider>
  );
}

export function useMarket() {
  const contextValue = useContext(MarketContext);
  invariant(
    contextValue,
    'Attempted to use MarketContext outside of MarketContext.Provider',
  );

  const [state, dispatch] = contextValue;

  return {
    ...state,
    setMarket(market: Market) {
      dispatch({ type: 'updateMarket', payload: market });
    },
  };
}
