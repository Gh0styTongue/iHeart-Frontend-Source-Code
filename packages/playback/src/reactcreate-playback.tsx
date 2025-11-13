import { invariant } from '@epic-web/invariant';
import type * as Analytics from '@iheartradio/web.analytics';
import type { AmpClientOptions } from '@iheartradio/web.api/amp';
import type { Logger } from '@iheartradio/web.utilities/create-logger';
import {
  type ReactNode,
  createContext,
  use,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { isArray, isEmpty, isNullish, isPlainObject } from 'remeda';

import { createPlayer } from './player:create.js';
import type { Messages, Station } from './player:schemas.js';
import { createAnalyticsSubscription } from './player:subscription:analytics.js';
import { createJWPlayerSubscription } from './player:subscription:jw-player.js';
import { createKeyboardControlsSubscription } from './player:subscription:keyboard-controls.js';
import { createLoggingSubscription } from './player:subscription:logging.js';
import { createMediaSessionSubscription } from './player:subscription:media-session.js';
import { createRoyaltyReportingSubscription } from './player:subscription:royalty-reporting.js';
import * as Playback from './player:types.js';
import type { MARK_AS_UNPLAYED_ACTION } from './utility:constants.js';
import { MARK_AS_PLAYED_ACTION } from './utility:constants.js';
import { logger as defaultLogger } from './utility:default-logger.js';
import type { ExtendedError } from './utility:extended-error.js';
import { getDebug } from './utility:get-debug.js';

export const MetadataContext = createContext<Playback.Metadata>(null);
export function useMetadataContext() {
  return use(MetadataContext);
}

export const AdsContext = createContext<Playback.Ads | null>(null);
export function useAdsContext() {
  const ctx = use(AdsContext);
  invariant(ctx, 'useAdsContext() must be used within AdsContext');
  return ctx;
}

export const ErrorContext = createContext<
  Error[] | ExtendedError<string>[] | null
>(null);
export function usePlaybackErrorContext() {
  return use(ErrorContext);
}

export const MessagesContext = createContext<Messages | null>(null);
export function usePlaybackMessagesContext() {
  const ctx = use(MessagesContext);
  invariant(
    ctx,
    'usePlaybackMessagesContext() must be used within MessagesContext',
  );
  return ctx;
}

export const StateContext = createContext<Omit<
  Playback.PlayerState<Station>,
  'errors' | 'metadata' | 'time'
> | null>(null);
export function usePlaybackStateContext() {
  const ctx = use(StateContext);
  invariant(ctx, 'usePlaybackState() must be used within StateContext');
  return ctx;
}

export const TimeContext = createContext<Playback.Time | null>(null);
export function usePlaybackTime() {
  const ctx = use(TimeContext);
  invariant(ctx, 'usePlaybackTime() must be used within TimeContext');
  return ctx;
}

export type PlaybackProviderProps = {
  adsEnabled?: boolean;
  anID?: number;
  apiConfig: AmpClientOptions;
  children: ReactNode;
  dfpInstanceId?: number | null;
  environment?: string;
  featureFlags?: Record<string, boolean | number>;
  lsid?: string;
  pageName?: string;
  subscriptionType?: string;
};

export function createReactPlayback<Resolvers extends Playback.Resolvers<any>>({
  analytics = {} as Analytics.Analytics.Analytics,
  api,
  debug = getDebug(),
  logger = defaultLogger,
  resolvers,
}: {
  analytics: Analytics.Analytics.Analytics;
  api: Playback.Api;
  debug?: boolean;
  logger?: Logger;
  resolvers: Resolvers;
}) {
  type Station = Parameters<Resolvers[keyof Resolvers]['load']>[1];

  const { player, errorCounter } = createPlayer<Resolvers, Station>({
    api,
    logger,
    resolvers,
  });

  const adsStorage = player.getAds();
  const stateStorage = player.getState();
  const timeStorage = player.getTime();
  const messagesStorage = player.getMessages();
  const featuresStorage = player.getFeatures();

  const jwPlayer = createJWPlayerSubscription<Station>(
    player,
    api,
    logger,
    errorCounter,
  );

  const keyboardControls = createKeyboardControlsSubscription<Station>(player);

  const mediaSession = createMediaSessionSubscription<Resolvers, Station>({
    player,
    resolvers,
  });

  const [royaltyReporting] = createRoyaltyReportingSubscription<
    Resolvers,
    Station
  >({
    api,
    resolvers,
    state: stateStorage,
  });

  const [analyticsReporting] = createAnalyticsSubscription<Station>({
    api,
    state: stateStorage,
    timeState: timeStorage,
    analytics,
    ads: adsStorage,
  });

  player.subscribe(jwPlayer);
  player.subscribe(keyboardControls);
  player.subscribe(mediaSession);
  player.subscribe(royaltyReporting);
  player.subscribe(analyticsReporting);

  if (debug) {
    logger.enable();

    player.subscribe(createLoggingSubscription('player', logger));

    jwPlayer.subscribe(
      createLoggingSubscription('player:subscription:jw-player', logger),
    );

    keyboardControls.subscribe(
      createLoggingSubscription(
        'player:subscription:keyboard-controls',
        logger,
      ),
    );

    mediaSession.subscribe(
      createLoggingSubscription('player:subscription:media-session', logger),
    );

    royaltyReporting.subscribe(
      createLoggingSubscription(
        'player:subscription:royalty-reporting',
        logger,
      ),
    );

    analyticsReporting.subscribe(
      createLoggingSubscription('player:subscription:analytics', logger),
    );

    adsStorage.subscribe({
      set(_payload, key, value) {
        const prefix = `ads:subscription.set(${key}) => `;

        const args = JSON.stringify(value);

        const message = [prefix, args].join('');

        const logType =
          message.toLowerCase().includes('error') ? 'error' : 'log';

        logger[logType](message, { arguments: args });
      },
    });

    for (const [key, resolver] of Object.entries(resolvers)) {
      resolver.subscribe(
        createLoggingSubscription(`player:resolver:${key}`, logger),
      );
    }
  } else {
    logger.disable();
  }

  const {
    errors: _errors,
    metadata,
    time: _time,
    ...rest
  } = stateStorage.deserialize();

  const DEFAULT_FEATURE_FLAGS: Record<string, boolean | number> = {
    playbackBufferTimeout: 7000,
  };

  function PlaybackProvider({
    children,
    adsEnabled = true,
    apiConfig,
    dfpInstanceId,
    environment = 'prod',
    featureFlags = DEFAULT_FEATURE_FLAGS,
    pageName = 'home',
    subscriptionType = 'free',
    lsid = '',
    anID = 0,
  }: PlaybackProviderProps) {
    const [metadataValue, setMetadata] = useState<Playback.Metadata>(metadata);

    const [ads, setAds] = useState(() => adsStorage.deserialize());
    const [playerState, setPlayerState] = useState(() => rest);
    const [errorState, setErrorState] = useState<Error[] | null>(null);
    const [time, setTime] = useState<Playback.Time>(
      () => timeStorage.deserialize().time,
    );
    const [messages, setMessages] = useState<Messages>(() =>
      messagesStorage.deserialize(),
    );

    useEffect(() => {
      api.setConfig(apiConfig);
    }, [apiConfig]);

    useEffect(() => {
      featuresStorage.serialize({
        ...featuresStorage.deserialize(),
        ...featureFlags,
      });
    }, [featureFlags]);

    useEffect(() => {
      adsStorage.serialize({
        ...adsStorage.deserialize(),
        dfpInstanceId,
        env: environment,
        enabled: adsEnabled,
        subscriptionType,
        anID,
      });
    }, [dfpInstanceId, environment, adsEnabled, subscriptionType, anID]);

    useEffect(() => {
      const unsubscribe = stateStorage.subscribe({
        serialize(_, { errors, metadata, ...state }) {
          if (isArray(errors)) {
            const [error] = errors.slice(-1);

            if (error instanceof Error) {
              setErrorState([error]);
            }
          }

          if (isPlainObject(metadata)) {
            setMetadata(metadata);
          }

          setPlayerState(current => ({ ...current, ...state }));
        },

        set(_, key, value) {
          switch (key) {
            case 'errors': {
              if (Array.isArray(value)) {
                setErrorState(value.slice(-1) as Error[]);
              }
              break;
            }
            case 'metadata': {
              setMetadata(value as Playback.Metadata);
              break;
            }
            case 'time': {
              setTime(value as Playback.Time);
              break;
            }
            default: {
              setPlayerState(current => ({ ...current, [key]: value }));
              break;
            }
          }
        },
      });

      return unsubscribe;
    }, [setErrorState, setMetadata, setPlayerState, setTime, playerState]);

    useEffect(() => {
      stateStorage.serialize({
        ...stateStorage.deserialize(),
        pageName,
        lsid,
        featureFlags,
      });
    }, [pageName, lsid, featureFlags]);

    useEffect(() => {
      const unsubscribe = adsStorage.subscribe({
        serialize(_, data) {
          setAds(current => ({ ...current, ...data }));
        },

        set(_, key, value) {
          setAds(current => ({ ...current, [key]: value }));
        },
      });

      return unsubscribe;
    }, [setAds]);

    useEffect(() => {
      const unsubscribe = timeStorage.subscribe({
        serialize(_, { time }) {
          if (isPlainObject(time)) {
            setTime(time);
          }
        },
        set(_, _key, value) {
          setTime(value);
        },
      });

      return unsubscribe;
    }, [time, setTime]);

    useEffect(() => {
      return messagesStorage.subscribe({
        serialize(_, { messages }) {
          if (messages) {
            setMessages({ messages });
          }
        },
        set(_, key, value) {
          if (key === 'messages' && Array.isArray(value)) {
            setMessages({ [key]: value });
          }
        },
      });
    }, [setMessages]);

    useEffect(() => {
      if (isNullish(errorState)) {
        return;
      }

      setErrorState(null);
    }, [errorState]);

    return (
      <ErrorContext value={errorState}>
        <StateContext value={playerState}>
          <AdsContext value={ads}>
            <TimeContext value={time}>
              <MetadataContext value={metadataValue}>
                <MessagesContext value={messages}>{children}</MessagesContext>
              </MetadataContext>
            </TimeContext>
          </AdsContext>
        </StateContext>
      </ErrorContext>
    );
  }

  return {
    PlaybackProvider,

    AdsContext,
    ErrorContext,
    MessagesContext,
    MetadataContext,
    player,
    StateContext,
    TimeContext,

    useAds() {
      const ads = useAdsContext();
      return useMemo(() => {
        return {
          ...ads,
          adBreak: {
            [Playback.AdPlayerStatus.Buffering]: true,
            [Playback.AdPlayerStatus.Paused]: true,
            [Playback.AdPlayerStatus.Playing]: true,
            [Playback.AdPlayerStatus.Streaming]: true,
            [Playback.AdPlayerStatus.Done]: false,
            [Playback.AdPlayerStatus.Idle]: false,
          }[ads.status],
        };
      }, [ads]);
    },

    useError() {
      return usePlaybackErrorContext();
    },

    useMessage() {
      return usePlaybackMessagesContext();
    },

    useMetadata() {
      return useMetadataContext();
    },

    usePlayer<T extends Playback.Station>() {
      return player as Playback.Player<T>;
    },

    useState() {
      return usePlaybackStateContext();
    },

    useTime() {
      return usePlaybackTime();
    },

    // This method exists in order to update playback queue + metadata state when marking a podcast episode as played/unplayed
    useMarkEpisodeAsPlayed() {
      return ({
        action,
        episodeId,
      }: {
        action: typeof MARK_AS_PLAYED_ACTION | typeof MARK_AS_UNPLAYED_ACTION;
        episodeId: number;
      }) => {
        const state = player.getState();

        const { queue, metadata } = state.deserialize();

        // If queue exists...
        if (queue && !isEmpty(queue)) {
          // Grab currently playing episode
          const queueItem = queue.find(
            (item: Playback.QueueItem) => item.id === episodeId,
          );

          // If `queueItem` and `metadata` exist...
          if (queueItem && metadata) {
            // If marking as played, set all player state values to reflect a "played" episode
            if (action === MARK_AS_PLAYED_ACTION) {
              queueItem.meta.completed = true;
              metadata.data.completed = true;
            } else {
              // Else, the episode is being marked as unplayed, so set all player state values to reflect an "unplayed" episode
              queueItem.meta.completed = false;
              metadata.data.completed = false;
            }

            // Take all values we set above and push them into playback state
            state.set('queue', queue);
            state.set('metadata', metadata);
          }
        }
      };
    },
  } as const;
}
