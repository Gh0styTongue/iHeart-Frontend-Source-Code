import {
  type CreateEmitter,
  createEmitter,
} from '@iheartradio/web.utilities/create-emitter';
import {
  type CreateStorage,
  createMemoryStorage,
} from '@iheartradio/web.utilities/create-storage';
import { isDeepEqual, isNonNullish, isNullish, omit, pick, prop } from 'remeda';

import {
  type Api,
  type Player,
  type PlayerState,
  type QueueItem,
  type Resolvers as PlaybackResolvers,
  type Station as PlaybackStation,
  QueueItemType,
} from './player:types.js';

type RoyaltyReportingState = {
  elapsed: number;
  endReason: 'DONE' | 'REPORT_15' | 'SKIP' | 'START' | 'STATIONCHANGE' | null;
  fetchedSkips: boolean;
  previousPosition: number;
  report15Reported: boolean;
  startReported: boolean;
};

export function createRoyaltyReportingSubscription<
  Resolvers extends PlaybackResolvers<any>,
  Station extends PlaybackStation,
>({
  api,
  resolvers,
  state,
}: {
  api: Api;
  resolvers: Resolvers;
  state: CreateStorage.Storage<PlayerState<Station>>;
}): [
  CreateEmitter.Emitter<CreateEmitter.Subscription<Player<Station>>>,
  CreateStorage.Storage<RoyaltyReportingState>,
] {
  const royaltyReportingState = createMemoryStorage<RoyaltyReportingState>({
    elapsed: 0,
    endReason: null,
    fetchedSkips: false,
    previousPosition: 0,
    report15Reported: false,
    startReported: false,
  });

  function isSameStation<T extends Station>({
    previousStation,
    currentStation,
  }: {
    previousStation: T;
    currentStation: T;
  }) {
    return isNonNullish(previousStation) && isNonNullish(currentStation) ?
        isDeepEqual(
          pick(previousStation, ['id', 'type']),
          pick(currentStation, ['id', 'type']),
        )
      : false;
  }

  function isSameItem({
    item,
    lastItem,
  }: {
    item: QueueItem;
    lastItem?: QueueItem;
  }) {
    return isNullish(lastItem) ? false : (
        isDeepEqual(
          omit(item, ['starttime', 'url']),
          omit(lastItem, ['starttime', 'url']),
        )
      );
  }

  const royaltyReporting = createEmitter<
    CreateEmitter.Subscription<Player<Station>>
  >({
    async load(_, station) {
      const { history } = state.deserialize();

      const previousStation = history.at(-1)?.station;

      if (
        !isSameStation({
          currentStation: station as Station,
          previousStation: previousStation as Station,
        })
      ) {
        royaltyReportingState.serialize(royaltyReportingState.seed);
      }
    },
    async next(_, internal) {
      const { index, shuffled, station, queue } = state.deserialize();

      // Get the *last* item played, because that's what we're reporting on
      const previousItem =
        index > 0 ? queue[index - 1]
        : queue.length > 1 ? queue.at(-1)
        : null;

      if (
        royaltyReportingState.get('startReported') &&
        isNonNullish(station) &&
        isNonNullish(previousItem) &&
        [QueueItemType.Track, QueueItemType.Episode].includes(previousItem.type)
      ) {
        royaltyReportingState.set('endReason', internal ? 'DONE' : 'SKIP');
        royaltyReportingState.set('startReported', false);

        const { daySkipsRemaining, hourSkipsRemaining } =
          await api.api.v3.playback
            .postReporting({
              body: {
                modes:
                  shuffled && isNonNullish(resolvers[station.type].setShuffle) ?
                    ['SHUFFLED']
                  : [],
                offline: false,
                playedDate: Date.now(),
                replay: false,
                reportPayload: previousItem.reporting,
                secondsPlayed: Math.round(royaltyReportingState.get('elapsed')),
                stationId: String(station.id),
                status: internal ? 'DONE' : 'SKIP',
              },
            })
            .then(prop('body'));

        state.set(
          'skips',
          Math.max(0, Math.min(hourSkipsRemaining, daySkipsRemaining)),
        );
      }
    },

    play() {
      const { history, index, queue, shuffled, station } = state.deserialize();

      // At this point in the lifecycle, the "current" station has already been pushed on to the
      // history stack, so we need to get the second-to-last item in the history to compare
      // against [DEM 2025/02/18]
      const lastHistory = history.at(-2);

      const previousStation = lastHistory?.station;

      const item = queue[index];
      const lastItem = lastHistory?.item;

      if (
        isNonNullish(item) &&
        isNonNullish(station) &&
        [
          QueueItemType.Track,
          QueueItemType.Episode,
          QueueItemType.Stream,
        ].includes(item.type)
      ) {
        if (
          item.type === QueueItemType.Stream &&
          !isSameItem({ item, lastItem })
        ) {
          api.api.v3.playback.postLiveStationReporting({
            body: {
              stationId: String(station.id),
              playedFrom: station.context.playedFrom,
              stationType: station.type,
            },
          });

          return;
        }

        if (
          isNonNullish(previousStation) &&
          !isSameStation({
            currentStation: station as Station,
            previousStation: previousStation as Station,
          }) &&
          !royaltyReportingState.get('startReported') &&
          isNonNullish(lastItem?.reporting) &&
          !isSameItem({ item, lastItem })
        ) {
          royaltyReportingState.set('endReason', 'STATIONCHANGE');
          api.api.v3.playback.postReporting({
            body: {
              modes:
                (
                  shuffled &&
                  isNonNullish(resolvers[previousStation?.type].setShuffle)
                ) ?
                  ['SHUFFLED']
                : [],
              offline: false,
              playedDate: Date.now(),
              replay: false,
              reportPayload: lastItem.reporting,
              secondsPlayed: Math.round(royaltyReportingState.get('elapsed')),
              stationId: String(previousStation.id),
              status: 'STATIONCHANGE',
            },
          });

          royaltyReportingState.set('elapsed', 0);
        } else {
          royaltyReportingState.set('endReason', null);
        }

        if (!royaltyReportingState.get('startReported')) {
          // Moved this 👇🏻 into the `.then` since that is more correct-er-ish [DEM 2025/07/21]
          // royaltyReportingState.set('startReported', true);
          royaltyReportingState.set('report15Reported', false);
          royaltyReportingState.set('elapsed', 0);

          api.api.v3.playback
            .postReporting({
              body: {
                modes:
                  (
                    shuffled &&
                    isNonNullish(station?.type) &&
                    isNonNullish(resolvers[station.type].setShuffle)
                  ) ?
                    ['SHUFFLED']
                  : [],
                offline: false,
                playedDate: Date.now(),
                replay: false,
                reportPayload: item.reporting,
                secondsPlayed: 0,
                stationId: String(station?.id),
                status: 'START',
              },
            })
            .then(data => {
              state.set(
                'skips',
                Math.max(
                  0,
                  Math.min(
                    data?.body?.hourSkipsRemaining,
                    data?.body?.daySkipsRemaining,
                  ),
                ),
              );
              return royaltyReportingState.set('startReported', true);
            })
            .catch(error =>
              console.error('Failed to update royalty reporting', error),
            );
        }
      }
    },

    seek(position) {
      royaltyReportingState.set('previousPosition', position);
    },

    async setTime({ time }) {
      const { index, shuffled, station, queue } = state.deserialize();

      const item = queue[index];

      const elapsed =
        royaltyReportingState.get('elapsed') +
        (time.position - royaltyReportingState.get('previousPosition'));

      royaltyReportingState.set('elapsed', elapsed);
      royaltyReportingState.set('previousPosition', time.position);

      if (
        royaltyReportingState.get('startReported') &&
        !royaltyReportingState.get('report15Reported') &&
        elapsed >= 15 &&
        isNonNullish(station) &&
        isNonNullish(item) &&
        [QueueItemType.Track, QueueItemType.Episode].includes(item.type)
      ) {
        royaltyReportingState.set('report15Reported', true);

        api.api.v3.playback.postReporting({
          body: {
            modes:
              shuffled && isNonNullish(resolvers[station.type].setShuffle) ?
                ['SHUFFLED']
              : [],
            offline: false,
            playedDate: Date.now(),
            replay: false,
            reportPayload: item.reporting,
            secondsPlayed: Math.round(elapsed),
            stationId: String(station.id),
            status: 'REPORT_15',
          },
        });
      }
    },
  });

  return [royaltyReporting, royaltyReportingState];
}
