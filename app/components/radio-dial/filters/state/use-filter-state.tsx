import { invariant } from '@epic-web/invariant';
import type { Dispatch, ReactNode } from 'react';
import { createContext, use, useMemo, useReducer } from 'react';

import { useMarket } from '~app/contexts/market';

import type {
  RadioDialFilterAction,
  RadioDialFilterState,
} from './radio-dial-filter-state';
import {
  createInitialFilterState,
  radioDialFilterStateReducer,
} from './radio-dial-filter-state';

type RadioDialFilterStateProviderProps = {
  country?: string;
  marketId?: number | string;
  geoMarketId?: number | string;
  genreId?: number | string;
  usePathParams?: boolean;
  isChangingLocation?: boolean;
};

const RadioDialFilterStateContext = createContext<
  [RadioDialFilterState, Dispatch<RadioDialFilterAction>]
>([{} as RadioDialFilterState, () => void 0]);

export function RadioDialFilterStateProvider({
  children,
  ...props
}: { children: ReactNode } & RadioDialFilterStateProviderProps) {
  const {
    country,
    marketId,
    geoMarketId,
    genreId,
    usePathParams = false,
  } = props ?? {};
  const isBrowser = globalThis.window !== undefined;

  const { market, geoMarket } = useMarket();

  const filterStateArg = useMemo(
    () => ({
      _countryCode: country,
      _marketId: marketId ?? market?.marketId,
      _geoMarketId: geoMarketId ?? geoMarket?.marketId,
      _genreId: genreId,
      _isBrowser: isBrowser,
      _usePathParams: usePathParams,
      _isChangingLocation: false,
    }),
    [
      country,
      genreId,
      geoMarket?.marketId,
      geoMarketId,
      isBrowser,
      market?.marketId,
      marketId,
      usePathParams,
    ],
  );

  const [state, dispatch] = useReducer(
    radioDialFilterStateReducer,
    filterStateArg,
    createInitialFilterState,
  );

  return (
    <RadioDialFilterStateContext.Provider
      value={useMemo(() => [state, dispatch], [state, dispatch])}
    >
      {children}
    </RadioDialFilterStateContext.Provider>
  );
}

export const useRadioDialFilterState = (): [
  RadioDialFilterState,
  Dispatch<RadioDialFilterAction>,
] => {
  const ctx = use(RadioDialFilterStateContext);
  invariant(ctx, 'RadioDialFilterStateContext is null');
  return ctx;
};
