import { invariant } from '@epic-web/invariant';
import type { Dispatch, ReactNode } from 'react';
import { createContext, use, useEffect, useMemo, useReducer } from 'react';
import { isNonNullish } from 'remeda';

import {
  useQueryRadioDialCountries,
  useQueryRadioDialGenres,
  useQueryRadioDialGeoMarket,
  useQueryRadioDialMarkets,
  useQueryRadioDialStations,
} from '~app/queries/radio-dial';

import { useRadioDialData } from '../../state/radio-dial-data';
import type {
  FilterDataAction,
  FilterDataState,
} from './radio-dial-filter-data';
import { radioDialFilterDataReducer } from './radio-dial-filter-data';
import { useRadioDialFilterState } from './use-filter-state';

const RadioDialFilterDataContext = createContext<
  [FilterDataState, Dispatch<FilterDataAction>]
>([{} as FilterDataState, () => void 0]);

export function RadioDialFilterDataProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [filterState, updateFilterState] = useRadioDialFilterState();
  const [, rootDispatch] = useRadioDialData();

  const { data: _countries, status: _countriesStatus } =
    useQueryRadioDialCountries();

  const { data: _markets, status: _marketsStatus } = useQueryRadioDialMarkets({
    countryCode: filterState.selectedCountryCode,
  });

  const { data: _genres, status: _genresStatus } = useQueryRadioDialGenres();

  const {
    data: _stations,
    status: _stationsStatus,
    fetchStatus: _stationsFetchStatus,
  } = useQueryRadioDialStations({
    marketId: filterState.activeMarketId,
    genreId: filterState.selectedGenreId,
    countryCode: filterState.selectedCountryCode,
  });

  const { data: _geoMarket, status: _geoMarketStatus } =
    useQueryRadioDialGeoMarket({
      id: filterState.geoMarketId,
    });

  const [state, dispatch] = useReducer(radioDialFilterDataReducer, {
    countries: _countries,
    markets: _markets,
    genres: _genres,
    stations: _stations,
    geoMarket: _geoMarket,
  });

  useEffect(() => {
    if (_countriesStatus === 'success') {
      dispatch({
        type: 'updateCountries',
        payload: {
          countries: _countries,
        },
      });
    }
  }, [_countries, _countriesStatus, dispatch]);

  useEffect(() => {
    if (_marketsStatus === 'success') {
      dispatch({
        type: 'updateMarkets',
        payload: {
          markets: _markets,
        },
      });
    }
  }, [_markets, _marketsStatus, dispatch]);

  useEffect(() => {
    if (_genresStatus === 'success') {
      dispatch({
        type: 'updateGenres',
        payload: {
          genres: _genres,
        },
      });
    }
  }, [
    _genres,
    _genresStatus,
    dispatch,
    filterState.selectedGenreId,
    updateFilterState,
  ]);

  useEffect(() => {
    if (_stationsStatus === 'pending') {
      rootDispatch({
        type: 'updateFetchStatus',
        payload: {
          isFetching: true,
        },
      });
    } else if (_stationsStatus === 'success') {
      rootDispatch({
        type: 'updateFetchStatus',
        payload: {
          isFetching: false,
        },
      });
      dispatch({
        type: 'updateStations',
        payload: {
          stations: _stations,
        },
      });
    }
  }, [_stations, _stationsStatus, dispatch, rootDispatch]);

  useEffect(() => {
    if (_geoMarketStatus === 'success' && isNonNullish(_geoMarket)) {
      dispatch({
        type: 'updateGeoMarket',
        payload: {
          market: _geoMarket,
        },
      });
    }
  }, [_geoMarket, _geoMarketStatus, dispatch]);

  return (
    <RadioDialFilterDataContext.Provider
      value={useMemo(() => [state, dispatch], [state, dispatch])}
    >
      {children}
    </RadioDialFilterDataContext.Provider>
  );
}

export const useRadioDialFilterData = (): [
  FilterDataState,
  Dispatch<FilterDataAction>,
] => {
  const ctx = use(RadioDialFilterDataContext);
  invariant(ctx, 'RadioDialFilterContext is null');
  return ctx;
};
