import type {
  Country,
  LiveStation,
  Market,
  MarketGenre,
} from '~app/queries/radio-dial';

export type FilterDataState = {
  countries?: Country[];
  markets?: Market[];
  geoMarket?: Market | null;
  genres?: MarketGenre[];
  stations?: LiveStation[];
};

export type FilterDataAction =
  | {
      type: 'updateCountries';
      payload: {
        countries: Country[];
      };
    }
  | {
      type: 'updateMarkets';
      payload: {
        markets: Market[];
      };
    }
  | {
      type: 'updateGenres';
      payload: {
        genres: MarketGenre[];
      };
    }
  | {
      type: 'updateStations';
      payload: {
        stations: LiveStation[];
      };
    }
  | {
      type: 'updateGeoMarket';
      payload: {
        market: Market | undefined;
      };
    };

export function radioDialFilterDataReducer(
  state: FilterDataState,
  action: FilterDataAction,
): FilterDataState {
  const { type, payload } = action;

  switch (type) {
    case 'updateCountries': {
      return {
        ...state,
        countries: payload.countries,
      };
    }
    case 'updateMarkets': {
      return {
        ...state,
        markets: payload.markets,
      };
    }
    case 'updateGenres': {
      return {
        ...state,
        genres: payload.genres,
      };
    }
    case 'updateStations': {
      return {
        ...state,
        stations: payload.stations,
      };
    }
    case 'updateGeoMarket': {
      return {
        ...state,
        geoMarket: payload.market,
      };
    }
  }
}
