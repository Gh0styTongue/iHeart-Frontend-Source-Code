/// <reference types="jwplayer" />

import { createEmitter } from '@iheartradio/web.utilities/create-emitter';
import type { Logger } from '@iheartradio/web.utilities/create-logger';
import type { SafeInterval } from '@iheartradio/web.utilities/safe-interval';
import type { SafeTimeout } from '@iheartradio/web.utilities/safe-timeout';
import { toJSON } from 'flatted';
import { isNonNullish, isPlainObject, isTruthy } from 'remeda';

import type { ErrorCounter } from './player:error.js';
import { PlayerError, PlayerErrorCode } from './player:error.js';
import type { QueueItemMeta } from './player:schemas.js';
import {
  JWPlayerMetadataCueSchema,
  JWPlayerSourceErrorSchema,
  MetadataType,
  QueueItemType,
} from './player:schemas.js';
import type {
  Api,
  Player,
  PlayerState,
  QueueItem,
  QueueItemFormat,
  Station as PlayerStation,
} from './player:types.js';
import { AdPlayerStatus, AdType, StationType, Status } from './player:types.js';
import { normalizeMetadata } from './utility:normalize-metadata.js';
import {
  getTrackMeta,
  processInStreamMetadata,
  setLiveStreamCompanion,
} from './utility:process-in-stream-metadata.js';

type JWPlayerEventsFactoryParams<Station extends PlayerStation> = {
  amp: Api;
  jwPlayer: jwplayer.JWPlayer;
  player: Player<Station>;
  logger: Logger;
  options: {
    adEnvironment?: string | null;
    methods: {
      load(state: PlayerState<Station> | null): void;
      setCurrentTrackMeta: ({
        streamId,
        stationMeta,
      }: {
        streamId: number;
        stationMeta: Readonly<QueueItem['meta']>;
      }) => Promise<void>;
      setStatus: (status: Status) => void;
      setAdsStatus: (status: AdPlayerStatus) => void;
      isAdBreak: () => boolean;
      getAdsStatus: () => AdPlayerStatus;
    };
  };
  SafeInterval: SafeInterval;
  SafeTimeout: SafeTimeout;
};

export const LIVE_META_INTERVAL_KEY = 'live-meta';
export const BUFFER_TIMEOUT_KEY = 'buffer-timeout';

const BUFFER_TIMEOUT_MESSAGES = {
  [QueueItemType.Stream]: 'This stream is taking too long to load',
  [QueueItemType.Track]: 'This track is taking too long to load',
  [QueueItemType.Episode]: 'This is episode is taking too long to load',
  [QueueItemType.Event]: 'The player is taking too long to load',
} as const;

const BUFFER_TIMEOUT_MESSAGE_MAP = {
  [StationType.Album]: `${BUFFER_TIMEOUT_MESSAGES[QueueItemType.Track]}, trying the next track`,
  [StationType.Artist]: `${BUFFER_TIMEOUT_MESSAGES[QueueItemType.Track]}, trying the next track`,
  [StationType.Favorites]: `${BUFFER_TIMEOUT_MESSAGES[QueueItemType.Track]}, trying the next track`,
  [StationType.Live]: `${BUFFER_TIMEOUT_MESSAGES[QueueItemType.Stream]}, please try again in a few moments`,
  [StationType.Playlist]: `${BUFFER_TIMEOUT_MESSAGES[QueueItemType.Track]}, trying the next track`,
  [StationType.PlaylistRadio]: `${BUFFER_TIMEOUT_MESSAGES[QueueItemType.Track]}, trying the next track`,
  [StationType.Podcast]: `${BUFFER_TIMEOUT_MESSAGES[QueueItemType.Episode]}, trying the next episode`,
  [StationType.Scan]: `${BUFFER_TIMEOUT_MESSAGES[QueueItemType.Stream]}, trying the next station`,
  [StationType.TopSongs]: `${BUFFER_TIMEOUT_MESSAGES[QueueItemType.Track]}, trying the next track`,
} as const;

const FATAL_ERROR_MESSAGES = {
  Track:
    'Tracks are taking too long to load, stopping playback for now. Please try again in a few minutes',
  Stream:
    'Streams are taking too long to load, stopping playback for now. Please try again in a few minutes',
  Episode:
    'Episodes are taking too long to load, stopping playback for now. Please try again in a few minutes',
} as const;

const BUFFER_TIMOUT_FATAL_ERROR_MESSAGE_MAP = {
  [StationType.Album]: FATAL_ERROR_MESSAGES.Track,
  [StationType.Artist]: FATAL_ERROR_MESSAGES.Track,
  [StationType.Favorites]: FATAL_ERROR_MESSAGES.Track,
  [StationType.Live]: FATAL_ERROR_MESSAGES.Stream,
  [StationType.Playlist]: FATAL_ERROR_MESSAGES.Track,
  [StationType.PlaylistRadio]: FATAL_ERROR_MESSAGES.Track,
  [StationType.Podcast]: FATAL_ERROR_MESSAGES.Episode,
  [StationType.Scan]: FATAL_ERROR_MESSAGES.Stream,
  [StationType.TopSongs]: FATAL_ERROR_MESSAGES.Track,
} as const;

const DEFAULT_SET_BUFFER_TIMEOUT_PROPS = { fatal: false };

export const createPlayerEventsHandlers = <Station extends PlayerStation>({
  amp,
  player,
  jwPlayer,
  logger,
  options,
  SafeInterval,
  SafeTimeout,
}: JWPlayerEventsFactoryParams<Station>) => {
  const { methods } = options;
  const playbackBufferTimeout = Number(
    player.getFeatures().get('playbackBufferTimeout') ?? 7000,
  );
  const { load, setStatus, setAdsStatus, setCurrentTrackMeta, getAdsStatus } =
    methods;

  function setBufferTimeout(
    props: { fatal: boolean } = DEFAULT_SET_BUFFER_TIMEOUT_PROPS,
  ) {
    const { fatal } = props;
    SafeTimeout.set(
      BUFFER_TIMEOUT_KEY,
      () => {
        const state = player.getState().deserialize();
        const { station, queue, index } = state;
        const { type: stationType } = station;
        const queueItemType = queue[index].type;
        const next = stationType !== StationType.Live;

        const message =
          next ?
            BUFFER_TIMEOUT_MESSAGE_MAP[stationType]
          : BUFFER_TIMEOUT_MESSAGES[queueItemType];

        player.setMessage(message);

        if (stationType === StationType.Live || fatal) {
          player.stop();
          // This was just a message previously. Setting an error so that we will have a record of
          // it in localStorage
          if (fatal) {
            player.setError(
              PlayerError.new({
                code: PlayerErrorCode.NetworkError,
                message: BUFFER_TIMOUT_FATAL_ERROR_MESSAGE_MAP[stationType],
              }),
            );
            logger.error('Buffer timeout fatal, stopping playback', {
              message,
            });
          }
        } else {
          logger.info(
            'Buffer timeout reached, skipping to next item in queue',
            { message },
          );
          player.next(true, message); // true to indicate that this is an "internal" skip
        }
      },
      playbackBufferTimeout,
    );
  }

  function clearBufferTimeout() {
    SafeTimeout.clear(BUFFER_TIMEOUT_KEY);
  }

  const jwPlayerEventHandlers = createEmitter({
    adBreakEnd(ad: jwplayer.AdBreak<'adBreakEnd'>) {
      try {
        const tag = new URL(ad.tag);
        const type = tag.searchParams.get('type');
        const isPreroll =
          type ?
            type.includes(AdType.Preroll)
          : player.getAds().get('current')?.type;

        const adType = isPreroll ? AdType.Preroll : AdType.Midroll;

        player.adComplete(adType);
      } catch {
        player.adComplete(player.getAds().get('current')?.type);
      }
    },
    adClick() {
      setStatus(Status.Paused);
      setAdsStatus(AdPlayerStatus.Paused);
    },
    adError(data: jwplayer.AdErrorParam) {
      let tag: URL | undefined = undefined;
      try {
        tag = new URL(data.tag);
      } catch {
        const currentTag = player.getAds().get('current')?.tag;
        if (currentTag) {
          tag = new URL(currentTag);
        }
      }

      if (tag) {
        const type = tag.searchParams.get('type');
        const isPreroll =
          type ?
            type.includes(AdType.Preroll)
          : player.getAds().get('current')?.type;

        const { code, message } =
          isPreroll ? PlayerError.Preroll : PlayerError.Midroll;

        const error = PlayerError.new({
          code,
          message,
          data,
        });
        player.setError(error);
        player.adEnd();
      } else {
        const error = PlayerError.new({
          code: PlayerErrorCode.Generic,
        });
        player.setError(error);
        player.adEnd();
      }
    },
    adPlay() {
      setStatus(Status.Playing);
      setAdsStatus(AdPlayerStatus.Playing);
      clearBufferTimeout();
    },
    adRequest() {
      player.adRequest();
    },
    adSkipped(ad: jwplayer.AdProgressParam) {
      const tag = new URL(ad.tag);
      const type = tag.searchParams.get('type');
      const isPreroll =
        type ?
          type.includes(AdType.Preroll)
        : player.getAds().get('current')?.type;

      const adType = isPreroll ? AdType.Preroll : AdType.Midroll;

      player.adComplete(adType);
    },
    adStarted(ad: jwplayer.AdStartedParam) {
      player.adStart(ad);
    },
    adTime(time: jwplayer.AdTimeParam) {
      const { duration, position } = time;
      player.setTime({
        duration: Math.max(0, duration),
        position: Math.max(0, position),
      });
    },
    autostartNotAllowed(data: {
      code: 303_220;
      error: unknown;
      reason: 'autoplayDisabled';
      type: 'autostartNotAllowed';
    }) {
      const error = PlayerError.new({
        code: PlayerError.AutoplayBlocked.code,
        data,
      });

      player.setError(error);
    },
    beforeComplete() {
      player.midroll();
    },
    beforePlay() {
      player.preroll();
    },
    buffer({ newstate, reason }: jwplayer.EventParams['buffer']) {
      const errorReasons = new Set(['stalled', 'error']);
      const timeoutResetStates = new Set(['idle', 'playing', 'paused']);

      if (timeoutResetStates.has(newstate)) {
        clearBufferTimeout();
      } else if (newstate === 'buffering') {
        if (!errorReasons.has(reason)) {
          setStatus(Status.Buffering);

          setBufferTimeout({ fatal: false });
        } else if (errorReasons.has(reason)) {
          setBufferTimeout({ fatal: true });
        }
      } else if (errorReasons.has(reason)) {
        setBufferTimeout({ fatal: true });
      }
    },
    error(PlayerErrorCounter: ErrorCounter) {
      return async (data: jwplayer.ErrorParam) => {
        // These changes are to allow us to display a warning to the user that we were unable
        // to play a particular station during scan playback, but it does not end playback.
        const { isScanning, queue, index } = player.getState().deserialize();
        const meta = isScanning ? queue[index].meta.subtitle : undefined;

        const error = PlayerError.new({
          code:
            isScanning ?
              PlayerError.InternalPlayerErrorDuringScan.code
            : PlayerError.InternalPlayerError.code,
          data: toJSON(data),
          meta,
        });

        const sourceError = JWPlayerSourceErrorSchema.safeParse(
          data.sourceError,
        );

        if (PlayerErrorCounter.shouldRetry(data.code)) {
          if (PlayerErrorCounter.retry(data.code, data)) {
            await player.stop(error.message);
            player.setMessage(
              "We've encountered an issue playing this station, trying again...",
            );
            player.getAds().set('skipNext', true);

            let exclude: QueueItemFormat | undefined;
            try {
              exclude = jwPlayer.getPlaylistItem()?.sources?.at(0)?.type as
                | QueueItemFormat
                | undefined;
            } catch (error: unknown) {
              logger.error(
                error instanceof Error ?
                  error.message
                : 'Could not get current playlist item format',
                error,
              );
            }
            await player.reload({
              exclude,
              ...(sourceError.success ? { sourceError: sourceError.data } : {}),
            });
            await player.play();
          } else {
            player.stop(error.message);
            player.setError(error);
          }
        } else {
          player.setError(error);
        }

        // If we're currently scanning, just go to the next item in the queue
        if (isScanning) {
          logger.info('Skipping to next station in scan playback', { error });
          player.next(true, error.message);
        }
      };
    },
    idle() {
      setStatus(Status.Idle);
      setAdsStatus(AdPlayerStatus.Idle);
    },
    async metadataCueParsed(data: jwplayer.MetadataParam) {
      const { station } = player.getState().deserialize();

      if (station.type === StationType.Live) {
        logger.info('Parsing metadata cue', { data }, ['META']);

        const metadata = JWPlayerMetadataCueSchema.safeParse(data);

        async function updateTrackMeta(
          TPID: number,
          stationMeta: QueueItemMeta,
        ) {
          const trackMeta = await getTrackMeta(TPID, amp);

          if (trackMeta) {
            const normalizedMeta = normalizeMetadata(trackMeta);

            player.setMetadata({
              type: MetadataType.InStream,
              data: {
                ...normalizedMeta,
                subtitle: stationMeta.subtitle,
                id: stationMeta.id,
                name: stationMeta.description,
              },
            });
          } else {
            const noticedError = new Error(
              `Received track ID: ${TPID} from metadata, but unable to locate track in catalog`,
            );
            logger.warn(noticedError.message, {}, ['META']);
            try {
              // Send this error to NewRelic so we can track it
              globalThis.window?.newrelic?.noticeError?.(noticedError, {
                streamId: String(player.getState().get('station').id),
                TPID: String(TPID),
                ts: String(Date.now()),
                cue: JSON.stringify(data),
              });
            } catch {
              // do nothing
            }

            player.setMetadata({
              type: MetadataType.Station,
              data: {
                ...stationMeta,
              },
            });
          }
        }

        if (metadata.success) {
          logger.info('Metadata cue parsed', { data: metadata.data }, ['META']);

          const { queue, index } = player.getState().deserialize();
          const stationMeta = queue[index].meta;

          if ('TXXX' in metadata.data.metadata) {
            if (metadata.data.metadata.TXXX.URL.song_spot !== 'T') {
              await updateTrackMeta(
                metadata.data.metadata.TXXX.URL.TPID,
                stationMeta,
              );
            } else {
              player.setMetadata({
                type: MetadataType.Station,
                data: {
                  ...stationMeta,
                },
              });
            }
          } else if ('WXXX' in metadata.data.metadata) {
            if (metadata.data.metadata.WXXX.URL.song_spot !== 'T') {
              await updateTrackMeta(
                metadata.data.metadata.WXXX.URL.TPID,
                stationMeta,
              );
            } else {
              player.setMetadata({
                type: MetadataType.Station,
                data: {
                  ...stationMeta,
                },
              });
            }
          } else if ('COMM' in metadata.data.metadata) {
            const { COMM: comm } = metadata.data.metadata;
            const COMM = isPlainObject(comm) ? comm.ENG : comm;

            const companion = await processInStreamMetadata({ COMM }, logger);

            if (companion && companion.type === 'companion') {
              /*
               * Set the companions
               */
              for (const companionAd of companion.data) {
                const {
                  companion,
                  delay,
                  identifier = String(Date.now()),
                  previousAdMarkers,
                  offsetTimeEvents,
                } = companionAd;

                logger.info(`Setting Live Stream companion, ${identifier}`, {
                  companion,
                  delay,
                  COMM,
                  previousAdMarkers,
                });

                setLiveStreamCompanion<Station>({
                  liveInStreamAdPayload: companion,
                  player,
                  logger,
                  delay,
                  identifier,
                  offsetTimeEvents,
                });
              }
            }
          } else {
            player.setMetadata({
              type: MetadataType.Station,
              data: {
                ...stationMeta,
              },
            });
          }
        } else {
          logger.warn(
            'Parsing metadata cue failed',
            { error: metadata.error.flatten(), data },
            ['META'],
          );
        }
      }
    },
    pause() {
      setStatus(Status.Paused);
    },
    play() {
      setStatus(Status.Playing);
      setAdsStatus(AdPlayerStatus.Done);
      clearBufferTimeout();
      player.beforeStart();
    },
    playAttemptFailed(data: {
      error: unknown;
      item: unknown;
      playReason: string;
    }) {
      const error = PlayerError.new({
        code: PlayerError.PlayAttemptFailed.code,
        data,
      });

      player.setError(error);
    },
    ready() {
      const state = player.getState().deserialize();
      const { index, muted, queue, volume, time } = state;

      const item = queue[index];

      if (isNonNullish(item)) {
        queue[index] = { ...item, starttime: time.position };
        load(state);
      }

      // IHRWEB-20350 - if the stored state indicates that the player should be muted, we should
      // only call `jwplayer.setMute` and not `jwplayer.setVolume`. Calling `jwplayer.setVolume`
      // with a value other than 0 triggers another internal `setMute` with the state set to false.
      if (muted) {
        jwPlayer.setMute(muted);
      } else {
        jwPlayer.setVolume(volume);
      }
    },
    setupError(data: jwplayer.ErrorParam) {
      const error = PlayerError.new({
        code: PlayerError.InternalPlayerError.code,
        data,
      });

      player.setError(error);
    },
    time({ duration, position }: jwplayer.TimeParam) {
      player.setTime({ duration, position });
    },
    async adsManager(event: jwplayer.AdEvent) {
      const { adsManager, videoElement } = event;

      const anID = player.getAds().get('anID');

      if (isTruthy(anID)) {
        try {
          const adURL = new URLSearchParams(
            new URL(adsManager.adTagUrl).search,
          );

          const iasConfig = {
            anId: anID,
            campId: adURL?.get('sz'),
            chanId: adURL?.get('iu'),
            env: player.getAds().get('env'),
            placementId: 'Open Auction',
            pubOrder: 'Video',
            pubId: 'Direct',
            pubCreative: 'Default Creative',
          };

          if (window.googleImaVansAdapter) {
            window.googleImaVansAdapter.init(
              window.google,
              adsManager,
              videoElement,
              iasConfig,
            );
          }

          logger.info('adsManager', iasConfig);
        } catch (error: unknown) {
          logger.warn(
            error instanceof Error ? error.message : JSON.stringify(error),
          );
        }
      }
    },
  });

  const visibilitychangeHandler = () => {
    const state = player.getState().deserialize();
    const { station, queue, index, status } = state;
    const stationMeta = queue[index]?.meta;

    const isAdvertPaused = getAdsStatus() === AdPlayerStatus.Paused;

    if (document.visibilityState === 'visible' && isAdvertPaused) {
      // If the player is currently in an ad break, skip the ad break
      // This is to ensure that the ad break does not continue playing when the user returns to the page
      // and we want to skip it to provide a better user experience when advert is paused
      logger.info('Visibility change to visible, skipping ad break');
      jwPlayer.skipAdBreak();
    }

    if (
      document.visibilityState === 'visible' &&
      station &&
      station.type === StationType.Live &&
      station.id &&
      stationMeta
    ) {
      // If not currently playing, set track meta immediately, then start interval
      if (status !== Status.Playing) {
        setCurrentTrackMeta({
          streamId: Number(station.id),
          stationMeta,
        });
      }
      SafeInterval.set(
        LIVE_META_INTERVAL_KEY,
        () =>
          setCurrentTrackMeta({
            streamId: Number(station.id),
            stationMeta,
          }),
        5000,
      );
    } else if (
      station.type === StationType.Live &&
      SafeInterval.has(LIVE_META_INTERVAL_KEY)
    ) {
      SafeInterval.clear(LIVE_META_INTERVAL_KEY);
    }
  };

  return { jwPlayerEventHandlers, visibilitychangeHandler };
};

export type JWPlayerEventHandlers = ReturnType<
  typeof createPlayerEventsHandlers
>['jwPlayerEventHandlers'];
