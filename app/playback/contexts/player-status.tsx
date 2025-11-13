import { invariant } from '@epic-web/invariant';
import type { ActionDispatch, ReactNode } from 'react';
import { createContext, useContext, useMemo, useReducer } from 'react';
import { clone } from 'remeda';
import type { Entries } from 'type-fest';

type PlayerStatusState = {
  loaded: boolean;
  loading: boolean;
  loadAttempts: number;
};

type UpdateLoadedAction = { type: 'updateLoaded'; payload: boolean };
type UpdateLoadingAction = { type: 'updateLoading'; payload: boolean };
type IncrementLoadAttemptsAction = {
  type: 'incrementLoadAttempts';
  payload: never;
};

type BatchPayload = Omit<
  Partial<{ [K in Actions]: ActionPayload<K> }>,
  'batch'
>;

export type PlayerStatusAction =
  | UpdateLoadedAction
  | UpdateLoadingAction
  | IncrementLoadAttemptsAction
  | { type: 'batch'; payload: BatchPayload };

export type PlayerStatusContextDispatch = ActionDispatch<
  [action: PlayerStatusAction]
>;

export type PlayerStatusContextValue = [
  PlayerStatusState,
  PlayerStatusContextDispatch,
];

type Actions = Pick<PlayerStatusAction, 'type'>['type'];

type ActionPayload<T> =
  T extends Actions ?
    Extract<
      UpdateLoadedAction | UpdateLoadingAction | IncrementLoadAttemptsAction,
      { type: T }
    >['payload']
  : never;

export function PlayerStatusReducer(
  state: PlayerStatusState,
  action: PlayerStatusAction,
): PlayerStatusState {
  const { type, payload } = action;

  switch (type) {
    case 'incrementLoadAttempts': {
      return {
        ...state,
        loadAttempts: state.loadAttempts + 1,
      };
    }
    case 'updateLoaded': {
      return {
        ...state,
        loaded: payload,
      };
    }
    case 'updateLoading': {
      return {
        ...state,
        loading: payload,
      };
    }
    case 'batch': {
      const newState = clone(state);

      for (const [key, value] of Object.entries(
        payload,
      ) as Entries<BatchPayload>) {
        switch (key) {
          case 'incrementLoadAttempts': {
            newState.loadAttempts = newState.loadAttempts + 1;
            break;
          }
          case 'updateLoaded': {
            newState.loaded = value as ActionPayload<typeof key>;
            break;
          }
          case 'updateLoading': {
            newState.loading = value as ActionPayload<typeof key>;
            break;
          }
        }
      }

      return newState;
    }
  }
}

const PlayerStatusContext = createContext<PlayerStatusContextValue | null>(
  null,
);

export function PlayerStatusProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(PlayerStatusReducer, null, () => ({
    loadAttempts: 0,
    loaded: false,
    loading: false,
  }));

  return (
    <PlayerStatusContext.Provider
      value={useMemo(() => [state, dispatch], [state, dispatch])}
    >
      {children}
    </PlayerStatusContext.Provider>
  );
}

export function usePlayerStatus() {
  const contextValue = useContext(PlayerStatusContext);
  invariant(
    contextValue,
    'Attempted to use PlayerStatusContext outside of PlayerStatusContext.Provider',
  );

  return contextValue;
}
