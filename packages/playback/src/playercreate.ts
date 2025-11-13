import { createEmitter } from '@iheartradio/web.utilities/create-emitter';
import type { Logger } from '@iheartradio/web.utilities/create-logger';
import {
  createMemoryStorage,
  createWebStorage,
} from '@iheartradio/web.utilities/create-storage';
import { throttle } from '@iheartradio/web.utilities/timing';
import { toJSON } from 'flatted';
import { lookup as mimeLookup } from 'mrmime';
import {
  clone,
  isDeepEqual,
  isNonNullish,
  isNullish,
  isObjectType,
  omit,
} from 'remeda';
import { v4 as uuid } from 'uuid';
import type { z } from 'zod';

import {
  ErrorCounter,
  PlayerError,
  PlayerErrorCode,
  PlayerErrorMessages,
} from './player:error.js';
import {
  type Messages,
  AdPlayerStatus,
  AdStatus,
  AdType,
  CompanionsSchema,
  MessageItemSchema,
  MetadataType,
  PlayerErrorSchema,
  PreRollStationSchema,
  QueueItemType,
  Repeat,
  Speed,
  StationType,
  Status,
} from './player:schemas.js';
import type {
  Ad,
  AdPayload,
  Ads,
  Api,
  LiveStation,
  Player,
  PlayerProperties,
  PlayerState,
  Queue,
  QueueItemFormat,
  Resolvers as PlaybackResolvers,
  Station as PlaybackStation,
  Targeting,
  Time,
} from './player:types.js';
import { COMPANION_CLICK_THROUGH_URL_CLASS } from './utility:constants.js';
import { ExtendedError } from './utility:extended-error.js';
import { fetchAndParseVAST } from './utility:vast.js';

export type Options<Resolvers extends PlaybackResolvers<any>> = {
  api: Api;
  logger: Logger;
  resolvers: Resolvers;
};

export function createPlayer<
  Resolvers extends PlaybackResolvers<any>,
  Station extends PlaybackStation,
>({
  api,
  logger,
  resolvers,
}: Options<Resolvers>): {
  player: Player<Station>;
  errorCounter: ErrorCounter;
} {
  const ads = createWebStorage<Ads>({
    seed: {
      current: undefined,
      companionClickThroughs: [],
      enabled: true,
      env: null,
      errors: [],
      history: [],
      sessionid: uuid(),
      sessionstart: true,
      skipNext: false,
      status: AdPlayerStatus.Idle,
      subscriptionType: 'free',
      targeting: {} as Targeting,
      type: 'unknown',
    },
    prefix: 'player:ads.',
    type: 'session',
  });

  const seed: PlayerState<Station> = {
    errors: [],
    featureFlags: {},
    history: [],
    index: 0,
    isScanning: false,
    metadata: null,
    muted: false,
    queue: [],
    repeat: Repeat.Yes,
    retry: false,
    shuffled: false,
    skips: Number.MAX_SAFE_INTEGER,
    speed: Speed.Normal,
    station: {
      context: {
        pageName: '',
        playedFrom: 0,
      },
      type: StationType.Live,
      id: -1,
    } as Station,
    status: Status.Idle,
    time: { duration: 0, position: 0 },
    volume: 50,
    pageName: 'home',
    lsid: '',
  };

  const state = createWebStorage<PlayerState<Station>>({
    seed,
    prefix: 'player:state.',
    type: 'local',
  });

  const messageState = createMemoryStorage<Messages>({
    messages: [],
  });

  const featuresState = createMemoryStorage<
    Record<string, boolean | number | undefined>
  >({});

  /**
   * There is the potential that the seed shape of whatever is in localStorage is invalid. As a
   * result, this validates the initial state. If it fails validation, it is re-seeded with a valid
   * seed.
   */
  try {
    PlayerError.InvalidPlayerState.validate(state.deserialize());
  } catch {
    state.serialize(seed);
  }

  const throttleSetStateTime = throttle((value: Time) => {
    state.set('time', value);
  }, 5000);

  const timeState = createMemoryStorage<{ time: Time }>({
    time: {
      duration: 0,
      position: 0,
    },
  });

  timeState.set('time', state.get('time'));

  timeState.subscribe({
    set: (_, _key, value) => {
      throttleSetStateTime(value);
    },
  });

  state.serialize({
    ...state.deserialize(),
    errors: [],
    status: Status.Idle,
  });

  async function load(
    payload: Parameters<PlayerProperties<Station>['load']>[0],
    exclude?: QueueItemFormat,
  ) {
    if (errorCounter.timeRemaining > 0) {
      player.setMessage(
        `We're having trouble playing right now, please try again in ${errorCounter.timeRemainingFormatted()}`,
        'warning',
      );
      return state.deserialize();
    }

    const station = PlayerError.InvalidStation.validate(payload);

    const resolver = resolvers[station.type];

    const { station: currentStation } = state.deserialize();

    if (station.type === StationType.Scan) {
      if (exclude === undefined) {
        resolver.internalState?.clear();
      } else {
        state.set('isScanning', true);
      }
    } else {
      state.set('isScanning', false);
    }

    // Reset the ads state, generating a new `sessionid` and resetting `sessionstart` to true, as
    // well as setting `current` to `undefined`. `sessionstart` and `sessionid` aren't used for Live/Scan
    if (
      station.type !== StationType.Live &&
      station.type !== StationType.Scan
    ) {
      ads.serialize({
        ...ads.deserialize(),
        status: AdPlayerStatus.Idle,
        sessionstart: true,
        sessionid: uuid(),
        current: undefined,
        targeting: station.targeting,
      });
    } else {
      ads.serialize({
        ...ads.deserialize(),
        status: AdPlayerStatus.Idle,
        sessionstart: null,
        sessionid: null,
        current: undefined,
        targeting: station.targeting,
      });
    }

    const adsState = { ...ads.deserialize() };
    const current = { ...state.deserialize() };
    const { time } = { ...timeState.deserialize() };

    const result = await resolver.load(
      { api, state: current, ads: adsState, logger, time },
      payload,
    );

    if (result) {
      // If this is a reload, and we have a type that should be excluded
      if (exclude) {
        logger.info(`Excluding stream format: ${exclude}`);
        // Then reduce the queue to remove any queue items that match the format
        // that should be excluded
        result.queue = result.queue.reduce((queue, item) => {
          if (item.type === QueueItemType.Stream) {
            if (item.format !== exclude) {
              queue.push(item);
            }
          } else {
            queue.push(item);
          }
          return queue;
        }, [] as Queue);
      }

      if (!result.time) {
        result.time = { duration: 0, position: 0 };
      }
      timeState.serialize({ time: result.time });
      let index = result.index;

      if (station.type === StationType.Scan) {
        // look for the "current" stationId in the result
        const stationIndex = result.queue.findIndex(
          item => item.id === currentStation?.id,
        );
        if (stationIndex > -1) {
          // If we found it, set the index to the next station, or zero if it would go past the
          // end of the queue
          index = stationIndex + 1;
          if (index > result.queue.length - 1) {
            index = 0;
          }
        }
      }

      state.serialize({
        ...current,
        ...result,
        index,
      });
    }

    player.setMetadata();

    return state.deserialize();
  }

  async function setScanning({ isScanning }: { isScanning: boolean }) {
    state.set('isScanning', isScanning);
    // If we're no longer scanning...
    if (!isScanning) {
      // Get the current queue item
      const { queue, index, station } = state.deserialize();
      const queueItem = queue.at(index);
      if (!queueItem) return;

      const { id, meta } = queueItem;
      const { stationType } = meta;

      // If it is a live station...
      if (stationType && stationType === StationType.Live && station) {
        ads.set('skipNext', true);
        const adsState = { ...ads.deserialize() };
        const current = { ...state.deserialize() };
        const { time } = { ...timeState.deserialize() };
        const stationToLoad: LiveStation = {
          context: station.context,
          targeting: station.targeting,
          id: Number(id),
          type: StationType.Live,
        };
        // Execute the live resolver `load` method
        const result = await resolvers[StationType.Live].load(
          {
            api,
            state: current,
            ads: adsState,
            time,
            logger,
          },
          stationToLoad,
        );

        // and if we get a result
        if (result) {
          if (!result.time) {
            result.time = { duration: 0, position: 0 };
          }
          // Replace the current time state
          timeState.serialize({ time: result.time });
          // and player state
          state.serialize(result);
          // and then set the metadata
          player.setMetadata();
        }
      }
    }
  }

  const errorCounter = new ErrorCounter({
    specialHandlers: {
      224_003: (_, data) => {
        player.setError(
          PlayerError.new({
            code: PlayerError.InternalPlayerErrorFatal.code,
            message:
              'This media type cannot be played by this browser (JW Error 224003)',
            data: toJSON(data),
          }),
        );
      },
      232_011: (_, data) => {
        player.setError(
          PlayerError.new({
            code: PlayerError.InternalPlayerErrorFatal.code,
            message:
              'This media could not be played because of a technical error (JW Error 232011)',
            data: toJSON(data),
          }),
        );
      },
    },
    defaultHandler: (instance, data) => {
      player.setError(
        PlayerError.new({
          code: PlayerError.InternalPlayerErrorFatal.code,
          message: `${PlayerError.InternalPlayerErrorFatal.message}. Please try again in ${instance.timeRemainingFormatted()}`,
          data: toJSON(data),
        }),
      );
    },
  });

  const player = createEmitter<PlayerProperties<Station>>({
    async initialize() {
      state.set('status', Status.Idle);
      ads.set('status', AdPlayerStatus.Idle);
      ads.set('type', 'unknown');

      const time: Time = (function getStoredTime() {
        const { queue = [], index = 0 } = state.deserialize();

        return (
          queue[index]?.type === QueueItemType.Episode ?
            // if the current item is a podcast episode,
            {
              // set position to the starttime of the current item (stored in state)
              position: queue[index]?.starttime ?? 0,
              duration: queue[index]?.duration ?? 0,
            }
            // if the current item is a track
          : queue[index]?.type === QueueItemType.Track ?
            // set the position to 0, and the duration to the value stored in the item meta
            {
              position: 0,
              duration: queue[index]?.meta?.duration ?? 0,
            }
            // We used to set "streams" to `Number.POSITIVE_INFINITY`, but when JSON.stringify-ed it transforms to `null`
            // and `null` causes station validation to fail, so we fall back to 0/0.
          : { position: 0, duration: 0 }
        );
      })();

      state.serialize({
        ...state.deserialize(),
        errors: [],
        time,
        status: Status.Idle,
      });

      timeState.set('time', time);

      return state.deserialize();
    },

    async adComplete(type) {
      const station = PlayerError.InvalidStation.validate(state.get('station'));

      ads.set('companionClickThroughs', []);
      const clickThroughPixels = Array.from(
        document.querySelectorAll('.' + COMPANION_CLICK_THROUGH_URL_CLASS),
      );

      // Remove companionClickThroughs when the ad is complete
      for (const pixel of clickThroughPixels) {
        pixel.remove();
      }

      const payload = ads.get('current');

      if (isNonNullish(payload)) {
        const history = ads.get('history');

        const ad: Ad = {
          format: payload.format,
          station,
          status: AdStatus.Complete,
          type: payload.type,
          tag: payload.tag,
          timestamp: Date.now(),
        };

        ads.set('history', [...history, ad]);

        ads.set('current', undefined);
      }

      if (payload?.type === AdType.Midroll || type === AdType.Midroll) {
        player.next(true);
      }

      player.setMetadata();
      return payload?.type ?? type ?? null;
    },

    async adEnd() {
      const { station } = state.deserialize();
      if (station) {
        const resolver = resolvers[station.type];
        await resolver.adEnd?.();
      }
      ads.set('status', AdPlayerStatus.Done);
    },

    async adStart(ad) {
      if (ad) {
        const isAudio =
          ad.creativetype.includes('audio') ||
          mimeLookup(ad.mediaFile?.file)?.includes('audio');
        const isVideo =
          !isAudio &&
          (ad.creativetype.includes('video') ||
            mimeLookup(ad.mediaFile?.file)?.includes('video') ||
            ad.mediaFile?.file.includes('video'));
        const isScript =
          !isAudio && !isVideo && ad.creativetype.includes('javascript');

        ads.set(
          'type',
          isAudio ? 'audio'
          : isVideo ? 'video'
          : isScript ? 'script'
          : 'unknown',
        );
        ads.set('status', AdPlayerStatus.Playing);

        const currentAd = ads.get('current');

        if (isNonNullish(currentAd)) {
          currentAd.totalAds = ad.ima?.ad.data.adPodInfo.totalAds ?? 1;
          currentAd.adIndex = ad.ima?.ad.data.adPodInfo.adPosition ?? 1;

          const clickThroughUrl = ads.get('companionClickThroughs')[
            currentAd.adIndex - 1
          ];

          const companions = CompanionsSchema.safeParse(
            ad.ima?.ad.data.companions,
          );
          if (companions.success && isAudio) {
            if (Array.isArray(companions.data) && companions.data.length > 0) {
              currentAd.companions = companions.data.map(companion => ({
                ...companion,
                clickThroughUrl,
              }));
            } else {
              currentAd.companions = null;
            }
          } else if (!companions.success) {
            player.setError(
              PlayerError.new({
                code: PlayerErrorCode.AdsMetadata,
                message: 'Failed to parse companion ads!',
                data: {
                  ...companions.error,
                },
              }),
            );
            currentAd.companions = null;
          }
          ads.set('current', { ...currentAd });
        }

        const { name, meta } = state.get('station');
        state.set('metadata', {
          type: MetadataType.Ad,
          data: {
            ...meta,
            subtitle: `${name ?? 'Your content'} will play after the break`,
          },
        });
      } else {
        ads.set('status', AdPlayerStatus.Buffering);
      }
    },

    async adRequest() {
      ads.set('status', AdPlayerStatus.Buffering);
    },

    /**
     * This is an integration point for analytics events to avoid importing the analytics emitter
     * into another subscription, namely the jwPlayerEventHandlers emitter. It is called at the end
     * of jwplayer.on('play') and will fire before playback starts/resumes for non-ad content.
     * https://docs.jwplayer.com/players/reference/playback-events#onplay
     */
    async beforeStart() {
      state.set('retry', false);
      errorCounter.clearAll();
    },

    async fastForward(seconds) {
      const currentState = clone(state.deserialize());
      const { time: currentTime } = clone(timeState.deserialize());
      const currentAds = clone(ads.deserialize());

      const { queue, index } = currentState;
      const { duration, position: currentPosition } = currentTime;

      PlayerError.InvalidSeekType.validate(queue[index].type);
      PlayerError.InvalidSeekValue.validate(seconds);
      PlayerError.RestrictedDuringAdBreak.validate(
        currentAds.status !== AdPlayerStatus.Idle &&
          currentAds.status !== AdPlayerStatus.Done,
        'fastForward',
      );

      const position =
        currentPosition + seconds >= duration ?
          duration
        : currentPosition + seconds;

      player.seek(position);

      return position;
    },

    _get() {
      const station = PlayerError.InvalidStation.validate(state.get('station'));

      const resolver = resolvers[station.type];
      return resolver.internalState;
    },

    getAds() {
      return ads;
    },

    getFeatures() {
      return featuresState;
    },

    getMessages() {
      return messageState;
    },

    getState() {
      return state;
    },

    getTime() {
      return timeState;
    },

    load,

    loadAdXml: async props => props,

    async midroll(): Promise<AdPayload | null> {
      const station = PlayerError.InvalidStation.validate(state.get('station'));

      const currentPlayerState = { ...state.deserialize() };
      const currentTimeState = { ...timeState.deserialize() };
      const currentAdsState = { ...ads.deserialize() };

      if (!currentAdsState.enabled) {
        player.next(true);
        return null;
      }

      const resolver = resolvers[station.type];

      try {
        const payload = await resolver.midroll?.({
          ads: currentAdsState,
          api,
          logger,
          state: currentPlayerState,
          time: currentTimeState.time,
        });

        if (isNullish(payload)) {
          ads.set('status', AdPlayerStatus.Done);

          if (station.type !== StationType.Live) {
            player.next(true);
          }

          return null;
        } else {
          return fetchAndParseVAST({ ads, payload, player, station });
        }
      } catch {
        return null;
      }
    },

    async next(internal = false) {
      const station = PlayerError.InvalidStation.validate(state.get('station'));
      const { time } = timeState.deserialize();

      if (!internal) {
        PlayerError.SkipLimit.validate(state.get('skips'));
      }

      const resolver = resolvers[station.type];

      const next = PlayerError.UnsupportedMethod.validate(resolver.next);

      const payload = await next(
        {
          api,
          state: state.deserialize(),
          ads: ads.deserialize(),
          logger,
          time,
        },
        internal,
      );

      if (isNullish(payload)) {
        state.set('index', 0);

        if (state.get('repeat') === Repeat.No) {
          player.stop();
        }

        return payload;
      }

      if (payload.time) {
        timeState.set('time', payload.time);
      }
      return Promise.resolve(
        !payload.isScanning && station.type === StationType.Scan,
      )
        .then(setScanningFalse => {
          if (setScanningFalse) {
            player.setScanning({ isScanning: false });
          }
          return setScanningFalse;
        })
        .then(scanningWasSet => {
          if (!scanningWasSet) {
            state.serialize(payload);
            player.setMetadata();
          }

          // The `player.play()` has been added back, because _not_ calling it made the royalty
          // reporting subscription short-circuit and skips were being incorrectly updated...
          // Isn't engineering fun? 🫠 [DEM 2025/07/21]
          player.play();

          return payload;
        });
    },

    async pause() {
      const station = PlayerError.InvalidStation.validate(state.get('station'));
      const { time } = timeState.deserialize();

      const resolver = resolvers[station.type];

      await resolver.pause?.({
        api,
        ads: ads.deserialize(),
        logger,
        state: state.deserialize(),
        time,
      });

      if (
        ads.get('status') !== AdPlayerStatus.Done &&
        ads.get('status') !== AdPlayerStatus.Idle
      ) {
        player.pauseAd(ads.get('status') === AdPlayerStatus.Playing);
        return ads.get('status') === AdPlayerStatus.Playing ?
            Status.Paused
          : Status.Playing;
      }

      state.set('status', Status.Paused);

      return Status.Paused;
    },

    async pauseAd(pause) {
      state.set('status', pause ? Status.Paused : Status.Playing);
      ads.set('status', pause ? AdPlayerStatus.Paused : AdPlayerStatus.Playing);

      return pause;
    },

    async play(context) {
      if (errorCounter.timeRemaining > 0) {
        player.setMessage(
          `We're having trouble playing right now, please try again in ${errorCounter.timeRemainingFormatted()}`,
        );
        return state.get('status');
      }

      const station = state.get('station');

      PlayerError.InvalidStation.validate(station);

      const updateContext =
        context && context.playedFrom !== station.context.playedFrom;

      if (updateContext) {
        state.set('station', {
          ...station,
          context,
        });
      }

      const updatedStation = state.get('station');

      if (
        ads.get('status') !== AdPlayerStatus.Done &&
        ads.get('status') !== AdPlayerStatus.Idle
      ) {
        player.pauseAd(ads.get('status') === AdPlayerStatus.Playing);
        return ads.get('status') === AdPlayerStatus.Playing ?
            Status.Paused
          : Status.Playing;
      }

      const queue = state.get('queue');
      const index = state.get('index');
      const item = queue[index];

      const history = state
        .get('history')
        .filter(history => history.item?.type !== QueueItemType.Event);
      const lastItem = history.at(-1)?.item;

      const sameItem =
        lastItem === undefined ? false : (
          isDeepEqual(
            omit(item, ['starttime', 'url']),
            omit(lastItem, ['starttime', 'url']),
          )
        );

      if (updateContext || !sameItem) {
        state.set(
          'history',
          [
            ...history,
            { item, station: updatedStation, timestamp: Date.now() },
          ].slice(-50),
        );
        timeState.set('time', { duration: 1, position: 0 });
      }

      const pauseOrStop =
        item.type === QueueItemType.Stream ? Status.Idle : Status.Paused;

      // If `item.meta` includes a `restart` key, that takes precedence over anything else
      // When `restart` is true, this makes sure the jwplayer seeks back to the beginning for playing the episode
      const status =
        sameItem ?
          {
            [Status.Buffering]: pauseOrStop,
            [Status.Idle]: item.meta.restart ? Status.Restart : Status.Playing,
            [Status.Paused]:
              item.meta.restart ? Status.Restart : Status.Playing,
            [Status.Playing]: pauseOrStop,
            [Status.Restart]: Status.Playing,
          }[state.get('status')]
        : Status.Playing;

      state.set('status', status);

      // If we need to restart, `status` is now set correctly and then we delete `restart` from the `item`
      delete item.meta.restart;
      queue[index] = item;
      state.set('queue', queue);

      const resolver = resolvers[updatedStation.type];

      if (resolver && resolver.play && status === Status.Playing) {
        return await resolver.play({
          api,
          state: state.deserialize(),
          ads: ads.deserialize(),
          logger,
          time: timeState.deserialize().time,
        });
      }

      return status;
    },

    async playAd(tag) {
      PlayerError.RestrictedDuringAdBreak.validate(
        ads.get('status') !== AdPlayerStatus.Idle &&
          ads.get('status') !== AdPlayerStatus.Done,
        'playAd',
      );

      state.set('status', Status.Playing);
      ads.set('status', AdPlayerStatus.Buffering);

      return tag;
    },

    async preroll() {
      const station = PlayerError.InvalidStation.validate(state.get('station'));

      const currentPlayerState = { ...state.deserialize() };
      const currentTimeState = { ...timeState.deserialize() };
      const currentAdsState = { ...ads.deserialize() };

      if (
        !currentAdsState.enabled ||
        !PreRollStationSchema.safeParse(station.type).success ||
        currentAdsState.skipNext
      ) {
        ads.set('status', AdPlayerStatus.Done);
        if (currentAdsState.skipNext) {
          ads.set('skipNext', false);
        }
        return null;
      }

      const resolver = resolvers[station.type];

      try {
        const payload = await resolver.preroll?.({
          api,
          state: currentPlayerState,
          ads: currentAdsState,
          logger,
          time: currentTimeState.time,
        });

        if (isNullish(payload)) {
          ads.set('status', AdPlayerStatus.Done);
          ads.set('current', undefined);
          return null;
        }

        ads.set('current', payload);

        const ad = new URL(payload.tag);

        ad.searchParams.set('correlator', String(Date.now()));
        ad.searchParams.set('type', AdType.Preroll);

        player.playAd(ad.toString());

        return payload;
      } catch {
        return null;
      }
    },

    async previous(internal = true) {
      const currentState = clone(state.deserialize());
      const { station: currentStation } = currentState;
      const station = PlayerError.InvalidStation.validate(currentStation);

      if (!internal) {
        PlayerError.SkipLimit.validate(state.get('skips'));
      }

      const resolver = resolvers[station.type];

      const previous = PlayerError.UnsupportedMethod.validate(
        resolver.previous,
      );

      const newState = await previous({
        api,
        state: state.deserialize(),
        ads: ads.deserialize(),
        logger,
        time: timeState.deserialize().time,
      });

      if (isNullish(newState)) {
        state.set('index', 0);

        if (state.get('repeat') === Repeat.No) {
          player.stop();
        }

        return newState;
      }

      if (newState.time) {
        timeState.set('time', newState.time);
      }

      state.serialize({
        ...currentState,
        ...newState,
      });

      player.setMetadata();
      player.play();

      return {
        ...currentState,
        ...newState,
      };
    },

    async reload({ exclude }) {
      logger.info('Reloading Station');
      const station = state.get('station');
      state.set('retry', true);
      return load(station, exclude);
    },

    async rewind(seconds) {
      const currentState = clone(state.deserialize());
      const { time: currentTime } = clone(timeState.deserialize());
      const currentAds = clone(ads.deserialize());

      const { queue, index } = currentState;
      const { position: currentPosition } = currentTime;

      PlayerError.InvalidSeekType.validate(queue[index].type);
      PlayerError.InvalidSeekValue.validate(seconds);
      PlayerError.RestrictedDuringAdBreak.validate(
        currentAds.status !== AdPlayerStatus.Idle &&
          currentAds.status !== AdPlayerStatus.Done,
        'rewind',
      );

      const position =
        currentPosition - seconds <= 0 ? 0 : currentPosition - seconds;

      player.seek(position);

      return position;
    },

    async seek(newPosition) {
      const currentState = clone(state.deserialize());
      const { time: currentTime } = clone(timeState.deserialize());
      const currentAds = clone(ads.deserialize());

      const { queue, index, station: currentStation } = currentState;
      const station = PlayerError.InvalidStation.validate(currentStation);
      const { duration } = currentTime;

      PlayerError.InvalidSeekType.validate(queue[index].type);
      PlayerError.InvalidSeekValue.validate(newPosition);
      PlayerError.RestrictedDuringAdBreak.validate(
        currentAds.status !== AdPlayerStatus.Idle &&
          currentAds.status !== AdPlayerStatus.Done,
        'seek',
      );

      const seek = resolvers[station.type].seek;

      const position =
        newPosition >= duration ? duration
        : newPosition <= 0 ? 0
        : newPosition;

      const newTime = {
        duration,
        position,
      };

      seek?.(
        {
          api,
          ads: currentAds,
          logger,
          state: currentState,
          time: currentTime,
        },
        position,
      );
      timeState.set('time', newTime);
      state.serialize({
        ...currentState,
        time: newTime,
      });

      return newTime.position;
    },

    async setError(error) {
      const station = state.get('station');
      const resolver = resolvers[station.type];

      const parsedError = PlayerErrorSchema.safeParse(error);
      let data =
        parsedError.success ?
          parsedError.data
        : ({} as z.infer<typeof PlayerErrorSchema>);

      if (isNullish(station)) {
        data = PlayerError.new({
          code: PlayerError.InvalidStation.code,
          data: station,
          message: PlayerErrorMessages[PlayerErrorCode.InvalidStation],
        });
      } else if (parsedError.success) {
        switch (parsedError.data.code) {
          case PlayerError.Preroll.code: {
            ads.set('errors', [
              ...ads.get('errors'),
              PlayerErrorSchema.parse(error),
            ]);

            const payload = ads.get('current');

            if (isNullish(payload)) {
              return error;
            }

            ads.set('history', [
              ...ads.get('history'),
              {
                format: payload.format,
                station,
                status: AdStatus.Error,
                type: AdType.Preroll,
                tag: payload.tag,
                timestamp: Date.now(),
              },
            ]);

            ads.set('current', undefined);

            return error;
          }
          case PlayerError.Midroll.code: {
            ads.set('errors', [
              ...ads.get('errors'),
              PlayerErrorSchema.parse(error),
            ]);

            const payload = ads.get('current');

            if (isNullish(payload)) {
              return error;
            }

            ads.set('history', [
              ...ads.get('history'),
              {
                format: payload.format,
                station,
                status: AdStatus.Error,
                type: AdType.Preroll,
                tag: payload.tag,
                timestamp: Date.now(),
              },
            ]);

            ads.set('current', undefined);

            player.next(true);

            return error;
          }
          default: {
            parsedError.data = PlayerErrorSchema.parse(error);

            break;
          }
        }
      } else {
        data = PlayerError.new({
          code: PlayerError.Generic.code,
          data: error,
          message: PlayerError.Generic.code,
        });
      }

      await resolver.setError?.(error);

      // data.data can be any[] | Record<string, any> | undefined
      const dataToCheck =
        Array.isArray(data.data) ?
          data.data.filter((item): item is string => typeof item === 'string')
        : isObjectType(data.data) ?
          Object.values(data.data).filter(
            (item): item is string => typeof item === 'string',
          )
        : null;
      // Ignore this error
      if (
        dataToCheck &&
        dataToCheck.some(
          (el: string) => el.trim() === 'This video file cannot be played.',
        )
      ) {
        return error;
      }

      state.set('errors', [...state.get('errors'), data]);

      return error;
    },

    async setMessage(message, kind) {
      const id = uuid();

      const instance = MessageItemSchema.parse({ id, message, kind });

      messageState.set('messages', [
        ...messageState.get('messages'),
        { ...instance },
      ]);

      return instance;
    },

    async setMetadata(metadata) {
      const station = PlayerError.InvalidStation.validate(state.get('station'));

      if (isNonNullish(metadata)) {
        state.set('metadata', metadata);
        return metadata;
      }

      const resolver = resolvers[station.type];

      const setMetadata = PlayerError.UnsupportedMethod.validate(
        resolver.setMetadata,
      );

      const nextMetadata = PlayerError.InvalidMetadata.validate(
        await setMetadata(
          {
            ads: ads.deserialize(),
            api,
            logger,
            state: state.deserialize(),
            time: timeState.deserialize().time,
          },
          null,
        ),
      );

      state.set('metadata', nextMetadata);

      return nextMetadata;
    },

    async setMute(newMuted) {
      const muted = newMuted ?? !state.get('muted');

      state.set('muted', muted);

      return muted;
    },

    async setRepeat(repeat) {
      state.set('repeat', repeat);

      return repeat;
    },

    setScanning,

    async setShuffle(newShuffled) {
      const currentState = clone(state.deserialize());
      const { station: currentStation } = currentState;
      const station = PlayerError.InvalidStation.validate(currentStation);

      const resolver = resolvers[station.type];

      const shuffle = PlayerError.UnsupportedMethod.validate(
        resolver.setShuffle,
      );

      const shuffled = newShuffled ?? !state.get('shuffled');

      const newState = await shuffle(
        {
          ads: ads.deserialize(),
          api,
          logger,
          state: state.deserialize(),
          time: timeState.deserialize().time,
        },
        shuffled,
      );

      state.serialize({
        ...currentState,
        ...newState,
        shuffled,
      });

      return {
        ...currentState,
        ...newState,
        shuffled,
      };
    },

    async setSpeed(speed) {
      const item = state.get('queue')[state.get('index')];

      PlayerError.InvalidSpeed.validate(speed);
      PlayerError.InvalidSpeedType.validate(item.type);
      PlayerError.InvalidStation.validate(state.get('station'));
      PlayerError.RestrictedDuringAdBreak.validate(
        ads.get('status') !== AdPlayerStatus.Idle &&
          ads.get('status') !== AdPlayerStatus.Done,
        'setSpeed',
      );

      state.set('speed', speed);

      return speed;
    },

    async setStatus(status) {
      PlayerError.InvalidStation.validate(state.get('station'));

      state.set('status', status);

      return status;
    },

    async setTime({ duration, position }) {
      const currentState = { ...state.deserialize() };
      const { station: currentStation, queue, index } = currentState;

      const station = PlayerError.InvalidStation.validate(currentStation);

      // If we're playing a stream, bail early. There is an issue with (I think) HLS.js where it
      // will randomly supply a duration/position that are wildly wrong, example -
      // `{ duration: -120.3894, position: -2.1449 }`, which in turn causes the validate method
      // below to throw an error. Since this is a stream, and we don't show time values or even
      // the scrubber bar, we can just return the state as-is. [DEM 2024/04/24]
      //
      // If the station type is Scan, we need to check to see if the scan duration has elapsed
      if (
        queue?.[index]?.type === QueueItemType.Stream &&
        station.type !== StationType.Scan
      ) {
        return {
          ...currentState,
        };
      }

      const resolver = resolvers[station.type];

      if (station.type !== StationType.Scan) {
        const time = PlayerError.InvalidTime.validate({
          duration,
          position,
        });

        const newState = await resolver.setTime?.(
          {
            ads: ads.deserialize(),
            api,
            logger,
            state: currentState,
            time,
          },
          time,
        );

        state.serialize({
          ...currentState,
          ...newState,
        });
        timeState.set('time', time);

        return {
          ...currentState,
          ...newState,
          time,
        };
      } else {
        try {
          const time = { duration: 0, position: 0 };

          const newState = await resolver.setTime?.(
            {
              ads: ads.deserialize(),
              api,
              logger,
              state: currentState,
              time,
            },
            time,
          );

          state.serialize({
            ...currentState,
            ...newState,
          });
          if (newState?.time) {
            timeState.set('time', newState?.time);
          }

          return {
            ...currentState,
            ...newState,
          };
        } catch (error: unknown) {
          // If Scan station throws an object with `scanNext`, then we should go to the next
          // item in the queue by calling `player.next`
          if (error && typeof error === 'object' && 'scanNext' in error) {
            player.next(true);
          }
          return {
            ...currentState,
          };
        }
      }
    },

    async setVolume(volume) {
      PlayerError.InvalidVolume.validate(volume);

      state.set('muted', false);
      state.set('volume', volume);

      return volume;
    },

    async stop() {
      if (ads.get('status') === AdPlayerStatus.Playing) {
        player.pauseAd(true);

        return Status.Paused;
      }

      state.set('status', Status.Idle);
      state.set('isScanning', false);
      ads.set('status', AdPlayerStatus.Idle);
      timeState.set('time', { ...timeState.get('time'), position: 0 });

      const { station: currentStation } = state.deserialize();

      const station = PlayerError.InvalidStation.validate(currentStation);

      const resolver = resolvers[station.type];

      await resolver.stop?.();

      return Status.Idle;
    },
  });

  player.subscribe({
    catch(_, error, ...args) {
      player.setError(
        error instanceof ExtendedError ? error : (
          PlayerError.new({
            code: PlayerError.Code.Generic,
            message: error.message,
            data: { error, args, _ },
          })
        ),
      );
    },
  });

  return {
    player,
    errorCounter,
  };
}
