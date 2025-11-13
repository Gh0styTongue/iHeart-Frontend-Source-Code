import type { GetStationMetaResponseBody } from '@iheartradio/web.api/amp';
import { MediaServerURL } from '@iheartradio/web.assets';
import {
  type CreateEmitter,
  createEmitter,
} from '@iheartradio/web.utilities/create-emitter';
import { createWebStorage } from '@iheartradio/web.utilities/create-storage';
import ms from 'ms';
import { difference, isEmpty, isNonNullish, isNullish, prop } from 'remeda';
import type { Merge } from 'type-fest';

import {
  PlayerError,
  PlayerErrorCode,
  PlayerErrorMessages,
} from './player:error.js';
import * as Playback from './player:types.js';
import { ExtendedError } from './utility:extended-error.js';
import {
  buildLiveInstreamTargeting,
  cachebuster,
} from './utility:targeting.js';

enum StreamType {
  HLS = 'secure_hls_stream',
  MP3 = 'secure_mp3_pls_stream',
  PLS = 'secure_pls_stream',
  Shoutcast = 'secure_shoutcast_stream',
}

export type ScanStation = Merge<
  Playback.Station,
  {
    genre: string;
    id: number[];
    location: string;
    scanDuration?: number;
    type: Playback.StationType.Scan;
  }
>;

export type ScanState = {
  ids: number[] | undefined;
  iterations: number;
  scanDuration: number;
  stationStart: number | undefined;
  stations: GetStationMetaResponseBody[];
  currentIndex: number;
};

export type ValidStream = {
  url: string;
  format: Playback.QueueItemFormat;
  type: StreamType;
};

const format = {
  [StreamType.HLS]: Playback.QueueItemFormat.HLS,
  [StreamType.MP3]: Playback.QueueItemFormat.MP3,
  [StreamType.PLS]: Playback.QueueItemFormat.AAC,
  [StreamType.Shoutcast]: Playback.QueueItemFormat.AAC,
} as const;

const order = [
  StreamType.HLS,
  StreamType.Shoutcast,
  StreamType.PLS,
  StreamType.MP3,
] as const;

const PLS_STREAM_REGEX = /File\d=(?<stream>.*)/g;

export function createScanResolver(): CreateEmitter.Emitter<
  Playback.Resolver<ScanStation>
> {
  const scanState = createWebStorage<ScanState>({
    seed: {
      currentIndex: 0,
      ids: undefined,
      iterations: 0,
      scanDuration: ms('7s'),
      stationStart: undefined,
      stations: [],
    },
    prefix: `player:resolver:scan:state.`,
    type: 'session',
  });

  const scanResolver = createEmitter<Playback.Resolver<ScanStation>>({
    internalState: scanState,

    async load({ api, logger, state, ads, time }, stationToLoad) {
      const station = { ...stationToLoad };
      const { targeting, subscriptionType } = ads;

      if (!Array.isArray(stationToLoad.id) || stationToLoad.id.length < 3) {
        throw PlayerError.new({
          code: PlayerErrorCode.InvalidStation,
          message: 'Cannot scan fewer than three stations',
        });
      }

      const previousScanStations = scanState.get('ids');

      // If attempting to load the same ids (in the same order) as what is currently loaded into
      // the Scan resolver, just return the state
      if (
        previousScanStations &&
        difference(previousScanStations, stationToLoad.id).length === 0 &&
        difference(stationToLoad.id, previousScanStations).length === 0
      ) {
        return state;
      }

      scanState.clear();

      const liveStations = await Promise.allSettled(
        stationToLoad.id.map(stationId =>
          api.api.v3.livemeta
            .getStationMeta({
              params: { stationId },
            })
            .then(prop('body')),
        ),
      )
        .then(promises =>
          promises.map(result =>
            result.status === 'rejected' ? null : result.value,
          ),
        )
        .then(values => values.filter(isNonNullish));

      scanState.set('stations', liveStations);
      // Map over the resolved/filtered station responses to populate ids in state
      // Just in case any of the requests to `getStationMeta` failed and got filtered out
      scanState.set(
        'ids',
        liveStations.map(({ id }) => id),
      );
      scanState.set('scanDuration', stationToLoad.scanDuration ?? ms('7s'));
      scanState.set('iterations', 0);
      scanState.set('stationStart', undefined);

      // Set pre-roll targeting according to the first resolved station
      if (isNonNullish(targeting) && isNonNullish(liveStations[0]?.ads)) {
        targeting.InStream = {
          ...targeting.InStream,
          ...buildLiveInstreamTargeting(targeting, {
            ads: liveStations[0].ads,
            callLetters: liveStations[0].callLetters,
            feeds: liveStations[0].feeds,
            id: liveStations[0].id,
            subscriptionType,
          }),
        };
      }

      function removeStation(id: number) {
        const ids = scanState.get('ids')?.filter(stateId => stateId !== id);
        const stations = scanState
          .get('stations')
          ?.filter(station => station.id !== id);

        scanState.set('ids', ids);
        scanState.set('stations', stations);
      }

      const queue: Playback.Queue = [];

      for (const liveStation of liveStations) {
        const { description, feeds, id, name, streams } = liveStation;

        if (isNullish(streams) || isEmpty(streams)) {
          // if no streams available, remove the station from the state and continue
          logger.warn(
            `${PlayerErrorMessages.MissingStreams} Station id: ${id}`,
          );

          removeStation(id);
          continue;
        }

        const validStreams = order
          .filter(type => streams[type])
          .map(type => ({
            url: streams[type],
            format: format[type],
            type,
          }))
          .filter((stream): stream is ValidStream => !!stream);

        if (validStreams.length === 0) {
          // if no VALID streams available, remove the station from the state and continue
          logger.warn(`${PlayerErrorMessages.ValidStreams} Station id: ${id}`);
          removeStation(id);
          continue;
        }

        const ord = cachebuster();

        const parsedStreams = await validStreams.reduce<Promise<ValidStream[]>>(
          async (accumulator, stream) => {
            if (stream.type !== StreamType.PLS) {
              try {
                const streamUrl = new URL(stream.url);
                for (const [key, value] of Object.entries(
                  targeting?.InStream ?? {},
                )) {
                  if (value) streamUrl.searchParams.set(key, String(value));
                }
                streamUrl.searchParams.set('ord', ord);
                return [
                  ...(await accumulator),
                  {
                    ...stream,
                    url: streamUrl.toString(),
                  },
                ];
              } catch {
                return accumulator;
              }
            }

            try {
              const response = await window.fetch(stream.url);
              const plsTextContent = await response.text();

              const matches = [...plsTextContent.matchAll(PLS_STREAM_REGEX)]
                .filter(match => !!match.groups && 'stream' in match.groups)
                .reduce<ValidStream[]>((accumulator, match) => {
                  try {
                    const streamUrl = new URL(match.groups!.stream);
                    for (const [key, value] of Object.entries(
                      targeting?.InStream ?? {},
                    )) {
                      if (value) streamUrl.searchParams.set(key, String(value));
                    }
                    streamUrl.searchParams.set('ord', ord);
                    accumulator.push({
                      url: streamUrl.toString(),
                      format: format[stream.type],
                      type: stream.type,
                    });
                  } catch {
                    /* empty */
                  }
                  return accumulator;
                }, []);

              return [...(await accumulator), ...matches];
            } catch {
              return accumulator;
            }
          },
          Promise.resolve([]),
        );

        if (parsedStreams.length === 0) {
          // if no parsed streams available, remove the station from the state and continue
          logger.warn(
            `${PlayerErrorMessages.ResolvedStreams} Station id: ${id}`,
          );

          removeStation(id);
          continue;
        }

        // If all guards passed, push the QueueItem onto the Queue
        queue.push({
          id,
          type: Playback.QueueItemType.Stream,
          meta: {
            ...liveStation,
            ...station.meta,
            image: MediaServerURL.fromCatalog({ type: 'live', id })
              .fit(150)
              .quality(50)
              .toString(),
            childOriented: feeds?.childOriented ?? false,
            description,
            subtitle: name,
            stationType: Playback.StationType.Live,
          },
          url: parsedStreams[0].url,
          sources: Playback.SourcesSchema.parse(
            parsedStreams.map(stream => ({
              type: stream.format,
              file: stream.url,
            })),
          ),
        });
      }

      // If we ended up with 0 items in the queue, throw a PlayerError
      if (queue.length === 0) {
        throw PlayerError.new({ code: PlayerErrorCode.MissingStreams });
      }

      station.meta = {
        title: queue[0].meta.title,
        image: MediaServerURL.fromCatalog({ type: 'live', id: queue[0].id })
          .cover(200, 200)
          .quality(70)
          .toString(),
      };

      return {
        ...state,
        time: {
          ...time,
          position: 0,
        },
        index: 0,
        queue,
        station,
        repeat: Playback.Repeat.No,
      };
    },

    async next({ state }) {
      const { index, queue, station } = state;
      const iterations = scanState.get('iterations');
      let nextIteration = iterations;

      let nextIndex = index + 1 < queue.length ? index + 1 : 0;

      if (nextIndex === 0 && nextIteration < 3) {
        nextIteration += 1;
      }

      if (nextIteration === 3 && nextIndex === 0) {
        state.isScanning = false;
        nextIndex = queue.length - 1;
      }

      scanState.set('iterations', nextIteration);

      return {
        ...state,
        station,
        index: nextIndex,
      };
    },

    async setError(error) {
      if (
        error instanceof ExtendedError &&
        (error.code === PlayerErrorCode.AutoplayBlocked ||
          error.code === PlayerErrorCode.InternalPlayerError ||
          error.code === PlayerErrorCode.NetworkError ||
          error.code === PlayerErrorCode.CriticalError)
      ) {
        scanState.set('stationStart', undefined);
      }

      return error;
    },

    async setMetadata({ state }) {
      const { index, queue } = state;

      return {
        type: Playback.MetadataType.Station,
        data: queue[index].meta,
      };
    },

    async setTime({ ads, state }) {
      const { stationStart, scanDuration } = scanState.deserialize();

      // Don't set `stationStart` until we're for sure not in ad break
      if (!ads.current) {
        if (!stationStart) {
          scanState.set('stationStart', Date.now());
          return {
            ...state,
            ...(state.isScanning ?
              { time: { duration: scanDuration / 1000, position: 0 } }
            : {}),
          };
        } else if (stationStart) {
          const time = {
            duration: Math.floor(scanDuration / 1000),
            position:
              stationStart ? Math.floor((Date.now() - stationStart) / 1000) : 0,
          };

          const elapsed = Date.now() - stationStart;

          // If the current station has been playing for the scan duration, and we are currently scanning
          // Must check for isScanning b/c the user can stop the scan by clicking "Stop Scanning" button,
          // but the currently playing stream is supposed to keep playing
          if (
            stationStart &&
            elapsed > scanState.get('scanDuration') &&
            state.isScanning
          ) {
            // Unset `stationStart` so that we can start the countdown over again
            scanState.set('stationStart', undefined);
            // Throw an object that will be caught in `player.setTime`
            throw { scanNext: true };
          }

          return {
            ...state,
            ...(state.isScanning ? { time } : {}),
          };
        } else {
          return { ...state, time: { duration: 0, position: 0 } };
        }
      }
      return { ...state, time: { duration: 0, position: 0 } };
    },

    async stop() {
      scanState.set('stationStart', undefined);

      return Playback.Status.Idle;
    },
  });

  return scanResolver;
}
