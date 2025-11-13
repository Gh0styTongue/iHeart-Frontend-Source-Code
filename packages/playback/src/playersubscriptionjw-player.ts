/// <reference types="jwplayer" />

import type { HTTPError } from '@iheartradio/web.api';
import type { ResponseShapes } from '@iheartradio/web.api/amp';
import { waitUntil } from '@iheartradio/web.utilities';
import {
  type CreateEmitter,
  createEmitter,
} from '@iheartradio/web.utilities/create-emitter';
import type { Logger } from '@iheartradio/web.utilities/create-logger';
import { createSafeInterval } from '@iheartradio/web.utilities/safe-interval';
import { createSafeTimeout } from '@iheartradio/web.utilities/safe-timeout';
import { debounce } from '@iheartradio/web.utilities/timing';
import { isDefined, isEmpty, isNullish } from 'remeda';

import type { ErrorCounter } from './player:error.js';
import { PlayerError, PlayerErrorCode } from './player:error.js';
import {
  AdPlayerStatus,
  JWPlayerFilePlaylistItem,
  JWPlayerSourcesPlaylistItem,
  MetadataType,
  QueueItemType,
  Speed,
  StationType,
  Status,
} from './player:schemas.js';
import type { JWPlayerEventHandlers } from './player:subscription:jw-player-events.js';
import {
  createPlayerEventsHandlers,
  LIVE_META_INTERVAL_KEY,
} from './player:subscription:jw-player-events.js';
import type {
  Api,
  Player,
  PlayerState,
  QueueItem,
  QueueItemFormat,
  Station as PlaybackStation,
} from './player:types.js';
import { normalizeMetadata } from './utility:normalize-metadata.js';

export function createJWPlayerSubscription<Station extends PlaybackStation>(
  player: Player<Station>,
  amp: Api,
  logger: Logger,
  errorCounter: ErrorCounter,
): CreateEmitter.Emitter<CreateEmitter.Subscription<Player<Station>>> {
  const SafeInterval = createSafeInterval(logger);
  const SafeTimeout = createSafeTimeout(logger);

  let firstPlay = true;
  let jwplayer: jwplayer.JWPlayer;
  const { api } = amp;

  let doNotQueryAmp = false;

  function isAdBreak() {
    const { status: adsStatus } = player.getAds().deserialize();

    if (
      [
        AdPlayerStatus.Buffering,
        AdPlayerStatus.Playing,
        AdPlayerStatus.Paused,
        AdPlayerStatus.Streaming,
      ].includes(adsStatus)
    ) {
      return true;
    }
    return false;
  }

  async function setCurrentTrackMeta({
    streamId,
    stationMeta,
  }: {
    streamId: number;
    stationMeta: Readonly<QueueItem['meta']>;
  }) {
    if (!isAdBreak()) {
      const metadata = await getCurrentTrackMeta({ streamId });
      const type = metadata?.type ?? MetadataType.Station;
      const data: QueueItem['meta'] = {
        ...stationMeta,
        ...metadata?.data,
      };
      player.setMetadata({
        type,
        data,
      });
    }
  }

  async function getCurrentTrackMeta({ streamId }: { streamId: number }) {
    if (!doNotQueryAmp) {
      const metadata: ResponseShapes['v3']['livemeta']['getCurrentTrackMeta']['body'] =
        await api.v3.livemeta
          .getCurrentTrackMeta({ params: { streamId } })
          .then(({ body }) => body)
          .catch(async (error: HTTPError) => {
            const { response } = error;

            if (response) {
              switch (response.status) {
                case 404:
                case 410:
                case 424: {
                  if (SafeInterval.has(LIVE_META_INTERVAL_KEY)) {
                    SafeInterval.clear(LIVE_META_INTERVAL_KEY);
                  }
                  doNotQueryAmp = true;
                  break;
                }
                case 422: {
                  const blob = await response.clone().blob();
                  const text = await blob.text();
                  try {
                    return JSON.parse(text);
                  } catch {
                    if (SafeInterval.has(LIVE_META_INTERVAL_KEY)) {
                      SafeInterval.clear(LIVE_META_INTERVAL_KEY);
                    }
                    doNotQueryAmp = true;
                    break;
                  }
                }
              }
            }
          });

      if (isEmpty(metadata)) {
        return;
      }

      const {
        artistId,
        artist: artistName,
        trackId,
        title: trackName,
      } = metadata;

      if (
        artistId &&
        artistName &&
        trackId &&
        trackName &&
        Number(artistId) > -1 &&
        Number(trackId) > -1
      ) {
        // Remove undefined values from `normalizeMetadata` so that they don't override "defaults" from
        // the station meta (i.e., "subtitle" (which is the station name))
        const trackMeta = Object.fromEntries(
          Object.entries(
            normalizeMetadata({ artistId, artistName, trackId, trackName }),
          ).reduce(
            (accumulator, [key, value]) => {
              if (isDefined(value)) {
                accumulator.push([key, value]);
              }
              return accumulator;
            },
            [] as [string, unknown][],
          ),
        );

        return {
          type: MetadataType.InStream,
          data: trackMeta,
        };
      }
    }
  }

  function _load(state: PlayerState<Station> | null) {
    if (isNullish(state?.station)) {
      return;
    }

    const item = state.queue[state.index];
    const itemUrl = new URL(item.url);
    itemUrl.searchParams.set('modTime', `${Date.now() / 1000}`);

    const isEpisode = item.type === QueueItemType.Episode;

    const playerPlaylist =
      state.station.type === StationType.Live ?
        [
          JWPlayerSourcesPlaylistItem.parse({
            sources: state.queue.reduce(
              (accumulator, queueItem) => {
                const itemUrl = new URL(queueItem.url);
                itemUrl.searchParams.set('modTime', `${Date.now() / 1000}`);
                if (queueItem.format) {
                  accumulator.push({
                    file: itemUrl.toString(),
                    type: queueItem.format,
                  });
                }
                return accumulator;
              },
              [] as Array<{ file: string; type: QueueItemFormat }>,
            ),
          }),
        ]
      : state.station.type === StationType.Scan ?
        [
          JWPlayerSourcesPlaylistItem.parse({
            sources: item.sources,
          }),
        ]
      : [
          JWPlayerFilePlaylistItem.parse({
            file: itemUrl.toString(),
            preload: 'auto',
            starttime:
              firstPlay || item.type === QueueItemType.Episode ?
                item.starttime
              : undefined,
            type: item.format,
          }),
        ];

    jwplayer.setPlaybackRate(isEpisode ? state.speed : Speed.Normal);

    jwplayer.load(playerPlaylist);

    if (SafeInterval.has(LIVE_META_INTERVAL_KEY)) {
      SafeInterval.clear(LIVE_META_INTERVAL_KEY);
    }

    if (state.station.type === StationType.Live) {
      SafeInterval.set(
        LIVE_META_INTERVAL_KEY,
        () =>
          setCurrentTrackMeta({
            streamId: Number(item.id),
            stationMeta: item.meta,
          }),
        5000,
      );
      doNotQueryAmp = false;
    } else if (SafeInterval.has(LIVE_META_INTERVAL_KEY)) {
      SafeInterval.clear(LIVE_META_INTERVAL_KEY);
      doNotQueryAmp = true;
    }

    firstPlay = false;
  }

  function onSeeked() {
    jwplayer.pause();
    jwplayer.setMute(false);
    jwplayer.off('seeked', onSeeked);
  }

  async function seek(position: number) {
    const status = jwplayer.getState();

    if (status === Status.Idle || status === Status.Paused) {
      jwplayer.on('seeked', onSeeked);
      jwplayer.setMute(true);
    }

    jwplayer.seek(position);
  }

  let jwPlayerEventHandlers: JWPlayerEventHandlers;

  const subscription = createEmitter<
    CreateEmitter.Subscription<Player<Station>>
  >({
    fastForward: seek,

    async initialize() {
      if (isNullish(globalThis?.window)) {
        return;
      }

      try {
        await waitUntil(() => isDefined(globalThis.window.jwplayer));
      } catch {
        player.setError(
          PlayerError.new({
            code: PlayerErrorCode.CriticalError,
          }),
        );
        return;
      }

      const playerElement =
        globalThis.window?.document.querySelector<HTMLDivElement>('#jw-player');

      const element =
        playerElement ?? globalThis.window?.document.createElement('div');

      const wrapperElement =
        globalThis.window?.document.querySelector<HTMLDivElement>(
          '#iheart-player-container',
        );

      const wrapper =
        wrapperElement ?? globalThis.window?.document.createElement('div');

      const adEnvironment = player.getAds()?.get('env');

      if (!playerElement) {
        element.id = 'jw-player';
      }
      if (!wrapperElement) {
        wrapper.id = 'iheart-player-container';
        wrapper.append(element);
        document.body.append(wrapper);
      }

      jwplayer = window.jwplayer(element).setup({
        advertising: {
          client: 'googima',
        },
        autostart: false,
        controls: false,
        file: 'https://www.iheart.com/static/assets/blank.mp4',
        preload: 'auto',
        responsive: true,
        width: '100%',
        aspectratio: '16:9',
      });

      const { call: setStatus } = debounce(
        (status: Status) => player.setStatus(status),
        { timing: 'trailing', waitMs: 100 },
      );
      const setAdsStatus = (status: AdPlayerStatus) =>
        player.getAds().set('status', status);

      const getAdsStatus = () =>
        player.getAds().get('status') ?? AdPlayerStatus.Idle;

      const handlers = createPlayerEventsHandlers({
        amp,
        player,
        jwPlayer: jwplayer,
        logger,
        options: {
          adEnvironment,
          methods: {
            load: _load,
            setCurrentTrackMeta,
            setStatus,
            setAdsStatus,
            getAdsStatus,
            isAdBreak,
          },
        },
        SafeInterval,
        SafeTimeout,
      });
      jwPlayerEventHandlers = handlers.jwPlayerEventHandlers;

      jwplayer.on('adBreakEnd', jwPlayerEventHandlers.adBreakEnd);
      jwplayer.on('adClick', jwPlayerEventHandlers.adClick);
      jwplayer.on('adError', jwPlayerEventHandlers.adError);
      jwplayer.on('adPlay', jwPlayerEventHandlers.adPlay);
      jwplayer.on('adRequest', jwPlayerEventHandlers.adRequest);
      jwplayer.on('adSkipped', jwPlayerEventHandlers.adSkipped);
      jwplayer.on('adStarted', jwPlayerEventHandlers.adStarted);
      jwplayer.on('adTime', jwPlayerEventHandlers.adTime);
      jwplayer.on(
        'autostartNotAllowed',
        jwPlayerEventHandlers.autostartNotAllowed,
      );
      jwplayer.on('beforeComplete', jwPlayerEventHandlers.beforeComplete);
      // 👇🏻 This now happens in `load` [DEM 2025/07/14]
      // jwplayer.on('beforePlay', jwPlayerEventHandlers.beforePlay);
      jwplayer.on('buffer', jwPlayerEventHandlers.buffer);
      jwplayer.on('error', jwPlayerEventHandlers.error(errorCounter));
      jwplayer.on('idle', jwPlayerEventHandlers.idle);
      jwplayer.on('metadataCueParsed', jwPlayerEventHandlers.metadataCueParsed);
      jwplayer.on('pause', jwPlayerEventHandlers.pause);
      jwplayer.on('play', jwPlayerEventHandlers.play);
      jwplayer.on('playAttemptFailed', jwPlayerEventHandlers.playAttemptFailed);
      jwplayer.on('time', jwPlayerEventHandlers.time);
      jwplayer.on('adsManager', jwPlayerEventHandlers.adsManager);

      // These methods should really only ever fire once [DEM 2025/07/14]
      jwplayer.once('ready', jwPlayerEventHandlers.ready);
      jwplayer.once('setupError', jwPlayerEventHandlers.setupError);

      globalThis.window.document.addEventListener(
        'visibilitychange',
        handlers.visibilitychangeHandler,
      );
    },

    load: payload => {
      // 1️⃣ Unregister any previously registered handlers for `beforePlay` so that...
      jwplayer.off('beforePlay', jwPlayerEventHandlers.beforePlay);
      // 2️⃣ ...we just execute `beforePlay` once per load
      jwplayer.once('beforePlay', jwPlayerEventHandlers.beforePlay);

      // 3️⃣ `jwplayer.off` is necessary because we load the previous station into the player on
      // page load - but if the user loads a different station before clicking play the preroll
      // method would execute twice. `.off` prevents that from happening. [DEM 2025/07/14]

      _load(payload);
    },

    loadAdXml(_, { xmlDoc }) {
      // Take the XML Document and serialize back into a string, but just from `<VAST>` tag down
      jwplayer.loadAdXml(
        new XMLSerializer().serializeToString(xmlDoc.documentElement),
      );
    },

    next(state) {
      if (isNullish(state)) {
        return;
      }

      _load(state);

      jwplayer.play();
    },

    pause() {
      jwplayer.pause();
    },

    pauseAd(status) {
      jwplayer.pauseAd(status);
    },

    play(status) {
      switch (status) {
        case Status.Idle: {
          jwplayer.stop();
          break;
        }
        case Status.Paused: {
          jwplayer.pause();
          break;
        }
        case Status.Restart: {
          jwplayer.seek(0);
          player.play();
          break;
        }
        default: {
          jwplayer.play();
          break;
        }
      }
    },

    playAd(tag) {
      jwplayer.playAd(tag);
    },

    previous(state) {
      if (isNullish(state)) {
        return;
      }

      _load(state);

      jwplayer.play();
    },

    rewind: seek,

    seek,

    setMute(muted) {
      jwplayer.setMute(muted);
    },

    setSpeed(speed) {
      jwplayer.setPlaybackRate(speed);
    },

    setVolume(volume) {
      jwplayer.setMute(volume === 0);
      jwplayer.setVolume(volume);
    },

    stop() {
      const { queue, index, station } = player.getState().deserialize();
      const stationMeta = queue[index].meta;
      if (station?.type === StationType.Live) {
        SafeInterval.set(
          LIVE_META_INTERVAL_KEY,
          () =>
            setCurrentTrackMeta({
              streamId: Number(station?.id),
              stationMeta,
            }),
          5000,
        );
        doNotQueryAmp = false;
      }
      jwplayer.stop();
    },
  });

  return subscription;
}
