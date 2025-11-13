import { invariant } from '@epic-web/invariant';
import type { Dispatch, ReactNode } from 'react';
import { createContext, use, useMemo, useReducer } from 'react';

import type { Market } from '~app/api/types';
import type { LiveStation } from '~app/queries/radio-dial';

export type RadioDialState = {
  country: string;
  currentIndex: number | undefined;
  currentStation: number | undefined;
  genre: string;
  genreId: number;
  isFetching: boolean;
  isScanning: boolean;
  location: string;
  market: Market | undefined;
  stations: LiveStation[];
};

type UpdateStationsAction = {
  type: 'updateStations';
  payload: { stations: LiveStation[] };
};
type UpdateFetchStatusAction = {
  type: 'updateFetchStatus';
  payload: { isFetching: boolean };
};
type UpdateLocationAction = {
  type: 'updateLocation';
  payload: { location: string };
};
type UpdateCountryAction = {
  type: 'updateCountry';
  payload: { country: string };
};
type UpdateMarketAction = {
  type: 'updateMarket';
  payload: { market: Market | undefined };
};
type UpdateGenreIdAction = {
  type: 'updateGenreId';
  payload: { genreId: number };
};
type UpdateGenreAction = { type: 'updateGenre'; payload: { genre: string } };
type UpdateCurrentStation = {
  type: 'updateCurrentStation';
  payload: { id: number | undefined };
};
type UpdateCurrentIndex = {
  type: 'updateCurrentIndex';
  payload: { index: number | undefined };
};
type UpdateIsScanning = {
  type: 'updateIsScanning';
  payload: { isScanning: boolean };
};

type Actions = Pick<
  | UpdateCountryAction
  | UpdateCurrentIndex
  | UpdateCurrentStation
  | UpdateFetchStatusAction
  | UpdateGenreAction
  | UpdateGenreIdAction
  | UpdateIsScanning
  | UpdateLocationAction
  | UpdateMarketAction
  | UpdateStationsAction,
  'type'
>['type'];

type ActionPayload<T extends Actions> = Extract<
  | UpdateCountryAction
  | UpdateCurrentIndex
  | UpdateCurrentStation
  | UpdateFetchStatusAction
  | UpdateGenreAction
  | UpdateGenreIdAction
  | UpdateIsScanning
  | UpdateLocationAction
  | UpdateMarketAction
  | UpdateStationsAction,
  { type: T }
>['payload'];
type BatchPayload = Partial<{ [K in Actions]: ActionPayload<K> }>;

export type RadioDialAction =
  | UpdateCountryAction
  | UpdateCurrentIndex
  | UpdateCurrentStation
  | UpdateFetchStatusAction
  | UpdateGenreAction
  | UpdateGenreIdAction
  | UpdateIsScanning
  | UpdateLocationAction
  | UpdateMarketAction
  | UpdateStationsAction
  | { type: 'batch'; payload: BatchPayload };

export function createRadioDialInitialState(): RadioDialState {
  return {
    country: '',
    currentIndex: undefined,
    currentStation: undefined,
    genre: 'All Genres',
    genreId: 0,
    isFetching: true,
    isScanning: false,
    location: '',
    market: undefined,
    stations: [],
  };
}

function radioDialReducer(
  state: RadioDialState,
  action: RadioDialAction,
): RadioDialState {
  const { type, payload } = action;
  switch (type) {
    case 'updateFetchStatus': {
      return {
        ...state,
        isFetching: payload.isFetching,
      };
    }
    case 'updateStations': {
      return {
        ...state,
        stations: payload.stations,
      };
    }
    case 'updateGenre': {
      return {
        ...state,
        genre: payload.genre,
      };
    }
    case 'updateLocation': {
      return {
        ...state,
        location: payload.location,
      };
    }
    case 'updateCountry': {
      return {
        ...state,
        country: payload.country,
      };
    }
    case 'updateMarket': {
      return {
        ...state,
        market: payload.market,
      };
    }
    case 'updateGenreId': {
      return {
        ...state,
        genreId: payload.genreId,
      };
    }
    case 'updateCurrentStation': {
      return {
        ...state,
        currentStation: payload.id,
      };
    }
    case 'updateCurrentIndex': {
      return {
        ...state,
        currentIndex: payload.index,
      };
    }
    case 'updateIsScanning': {
      return {
        ...state,
        isScanning: payload.isScanning,
      };
    }
    case 'batch': {
      const newState = { ...state };

      for (const [key, value] of Object.entries(payload) as [
        Actions,
        ActionPayload<Actions>,
      ][]) {
        switch (key) {
          case 'updateFetchStatus': {
            newState['isFetching'] = (
              value as ActionPayload<typeof key>
            ).isFetching;
            break;
          }
          case 'updateGenre': {
            newState['genre'] = (value as ActionPayload<typeof key>).genre;
            break;
          }
          case 'updateLocation': {
            newState['location'] = (
              value as ActionPayload<typeof key>
            ).location;
            break;
          }
          case 'updateStations': {
            newState['stations'] = (
              value as ActionPayload<typeof key>
            ).stations;
            break;
          }
          case 'updateCountry': {
            newState['country'] = (value as ActionPayload<typeof key>).country;
            break;
          }
          case 'updateMarket': {
            newState['market'] = (value as ActionPayload<typeof key>).market;
            break;
          }
          case 'updateGenreId': {
            newState['genreId'] = (value as ActionPayload<typeof key>).genreId;
            break;
          }
          case 'updateCurrentStation': {
            newState['currentStation'] = (
              value as ActionPayload<typeof key>
            ).id;
            break;
          }
          case 'updateCurrentIndex': {
            newState['currentIndex'] = (
              value as ActionPayload<typeof key>
            ).index;
            break;
          }
          case 'updateIsScanning': {
            newState['isScanning'] = (
              value as ActionPayload<typeof key>
            ).isScanning;
            break;
          }
        }
      }

      return newState;
    }
  }
}

const RadioDialDataContext = createContext<
  [RadioDialState, Dispatch<RadioDialAction>]
>([{} as RadioDialState, () => void 0]);

export function RadioDialDataProvider({ children }: { children: ReactNode }) {
  const [liveRadioDialData, dispatch] = useReducer(
    radioDialReducer,
    undefined,
    createRadioDialInitialState,
  );

  return (
    <RadioDialDataContext.Provider
      value={useMemo(
        () => [liveRadioDialData, dispatch],
        [liveRadioDialData, dispatch],
      )}
    >
      {children}
    </RadioDialDataContext.Provider>
  );
}

export const useRadioDialData = (): [
  RadioDialState,
  Dispatch<RadioDialAction>,
] => {
  const ctx = use(RadioDialDataContext);
  invariant(ctx, 'RadioDialDataContext is null');
  return ctx;
};
