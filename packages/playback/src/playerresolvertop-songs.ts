import { HTTPError } from '@iheartradio/web.api';
import { StationEnum } from '@iheartradio/web.api/amp';
import {
  type CreateEmitter,
  createEmitter,
} from '@iheartradio/web.utilities/create-emitter';
import { createMemoryStorage } from '@iheartradio/web.utilities/create-storage';
import { prop, shuffle } from 'remeda';
import type { Merge } from 'type-fest';

import { PlayerError, PlayerErrorCode } from './player:error.js';
import * as Playback from './player:types.js';
import { ExtendedError } from './utility:extended-error.js';

export type TopSongsStation = Merge<
  Playback.Station,
  {
    id: number;
    seed?: number;
    type: Playback.StationType.TopSongs;
  }
>;

export function createTopSongsResolver(): CreateEmitter.Emitter<
  Playback.Resolver<TopSongsStation>
> {
  const topSongsState = createMemoryStorage<{
    shuffled: Playback.Queue;
    unshuffled: Playback.Queue;
  }>({
    shuffled: [],
    unshuffled: [],
  });

  const topSongsResolver = createEmitter<Playback.Resolver<TopSongsStation>>({
    async load({ api, state }, stationToLoad) {
      const station = { ...stationToLoad };
      try {
        const [{ artist }, { tracks }] = await Promise.all([
          api.api.v3.artists
            .getArtistProfile({ params: { id: station.id } })
            .then(prop('body')),
          api.api.v3.catalog
            .getArtistTracks({
              params: { id: station.id },
              query: { limit: 50, offset: 0 },
            })
            .then(prop('body')),
        ]);
        station.name = `${artist.name} Top Songs`;

        station.meta = {
          title: `${artist.name} Top Songs`,
          image: `https://i.iheart.com/v3/catalog/artist/${artist.artistId}?ops=cover(400,400)`,
        };

        const { items } = await api.api.v2.playback
          .postStreams({
            body: {
              hostName: api.hostName,
              contentIds: tracks.map(track => track.id),
              playedFrom: station.context.playedFrom,
              stationId: String(station.id),
              stationType: StationEnum.RADIO,
            },
          })
          .then(prop('body'));

        if (items === undefined || items.length === 0) {
          throw PlayerError.new({ code: PlayerErrorCode.MissingStreams });
        }

        topSongsState.set(
          'unshuffled',
          items.reduce((accumulator, item) => {
            if (item.streamUrl) {
              accumulator.push({
                id: item.content?.id as number,
                meta: {
                  ...item.content,
                  artistId: artist.artistId,
                  artistName: artist.name,
                  description: item.content?.albumName,
                  image: item.content?.imagePath,
                  subtitle: `${artist.name} Top Songs`,
                  title:
                    item.content?.title ?
                      `${item.content?.title}${
                        item.content?.version ?
                          ` • ${item.content.version}`
                        : ''
                      }`
                    : undefined,
                },
                reporting: item.reportPayload,
                type: Playback.QueueItemType.Track,
                url: item.streamUrl,
              });
            }
            return accumulator;
          }, [] as Playback.Queue),
        );

        const shuffledQueue = topSongsState.get('shuffled');
        const unshuffledQueue = topSongsState.get('unshuffled');

        topSongsState.set(
          'unshuffled',
          state.shuffled ? shuffle(unshuffledQueue) : unshuffledQueue,
        );

        const queue =
          state.shuffled ? shuffledQueue : topSongsState.get('unshuffled');

        let index =
          station.seed ? queue.findIndex(item => item.id === station.seed) : 0;

        index = index === -1 ? 0 : index;

        return {
          ...state,
          index,
          queue,
          station,
        };
      } catch (error: unknown) {
        if (error instanceof ExtendedError) {
          throw error;
        } else if (error instanceof HTTPError) {
          const data = {
            requestPayload: await error.getRequestPayload(),
            requestUrl: await error.getRequestUrl(),
            responseErrors: await error.getResponseErrors(),
          };

          throw PlayerError.new({
            code: PlayerErrorCode.ApiError,
            data,
          });
        } else if (error instanceof Error) {
          throw PlayerError.new({
            code: PlayerErrorCode.Generic,
            data: {
              stack: error.stack,
              cause: error.cause,
              message: error.message,
            },
          });
        }

        throw PlayerError.new({
          code: PlayerErrorCode.Generic,
        });
      }
    },

    async next({ state }) {
      const { index, queue, station } = state;

      const nextIndex = index === queue.length - 1 ? 0 : index + 1;

      return {
        ...state,
        index: nextIndex,
        station: {
          ...station,
          seed: Number(queue[nextIndex].id),
        },
      };
    },

    async previous({ state }) {
      const { index, queue } = state;

      const previousIndex = index === 0 ? queue.length - 1 : index - 1;

      return {
        ...state,
        index: previousIndex,
        seed: Number(queue[previousIndex].id),
      };
    },

    async setMetadata({ state }) {
      const { index, queue } = state;

      return {
        type: Playback.MetadataType.Track,
        data: queue[index].meta,
      };
    },

    async setShuffle({ state }, shuffled) {
      const { index, queue } = state;
      const shuffledQueue = topSongsState.get('shuffled');
      const unshuffledQueue = topSongsState.get('unshuffled');

      if (shuffled) {
        topSongsState.set('shuffled', shuffle(shuffledQueue));
      }

      const newQueue = shuffled ? shuffledQueue : unshuffledQueue;
      const newIndex = newQueue.findIndex(item => item.id === queue[index].id);

      return {
        ...state,
        index: newIndex,
        queue: newQueue,
      };
    },
  });

  return topSongsResolver;
}
