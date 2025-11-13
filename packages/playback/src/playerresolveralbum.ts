import {
  type CreateEmitter,
  createEmitter,
} from '@iheartradio/web.utilities/create-emitter';
import { createWebStorage } from '@iheartradio/web.utilities/create-storage';
import { isDeepEqual, prop, shuffle } from 'remeda';
import type { Merge } from 'type-fest';

import { PlayerError, PlayerErrorCode } from './player:error.js';
import * as Playback from './player:types.js';

export type AlbumStation = Merge<
  Playback.Station,
  {
    artistId: number;
    type: Playback.StationType.Album;
    seed?: number;
  }
>;

export function createAlbumResolver(): CreateEmitter.Emitter<
  Playback.Resolver<AlbumStation>
> {
  const albumState = createWebStorage<{
    shuffled: Playback.Queue;
    unshuffled: Playback.Queue;
  }>({
    seed: {
      shuffled: [],
      unshuffled: [],
    },
    type: 'session',
    prefix: 'player:resolver:album:state.',
  });

  const albumResolver = createEmitter<Playback.Resolver<AlbumStation>>({
    async load({ api, state }, stationToLoad) {
      const station = { ...stationToLoad };

      const stationId = Array.isArray(station.id) ? station.id[0] : station.id;

      const { body: albumResponse } = await api.api.v3.catalog.getAlbum({
        params: { id: stationId },
      });

      if ('error' in albumResponse) {
        const errorMessage =
          Array.isArray(albumResponse.error) ?
            albumResponse.error.join(',')
          : albumResponse.error;

        throw PlayerError.new({
          code: PlayerErrorCode.ApiError,
          message: errorMessage,
        });
      }

      const { tracks, title } = albumResponse;
      station.name = title;

      const { items, ageLimit } = await api.api.v2.playback
        .postStreams({
          body: {
            hostName: api.hostName,
            contentIds: tracks.map(track => track.id),
            playedFrom: station.context.playedFrom,
            stationId: String(station.id),
            stationType: 'ALBUM',
          },
        })
        .then(prop('body'));

      if (items === undefined || items.length === 0) {
        throw PlayerError.new({ code: PlayerErrorCode.MissingStreams });
      }

      const unshuffledQueue = items.reduce((accumulator, item) => {
        const id = item.content?.id;

        if (item.streamUrl !== undefined && id !== undefined) {
          accumulator.push({
            type: Playback.QueueItemType.Track,
            id,
            meta: {
              ...item.content,
              description: item.content?.artistName,
              image: item.content?.imagePath,
              subtitle: item.content?.albumName,
              title:
                item.content?.title ?
                  `${item.content?.title}${
                    item.content?.version ? ` • ${item.content.version}` : ''
                  }`
                : undefined,
              childOriented: !!ageLimit,
            },
            reporting: item.reportPayload,
            url: item.streamUrl,
          });
        }
        return accumulator;
      }, [] as Playback.Queue);

      function getQueueIds(shuffledQueue: Playback.Queue) {
        return shuffledQueue.reduce(
          (accumulator, current) => [...accumulator, current.id],
          [] as Array<string | number>,
        );
      }

      albumState.set('unshuffled', unshuffledQueue);
      let shuffled = shuffle(unshuffledQueue);

      // If we have only one song in album then we don't need shuffle queue
      if (getQueueIds(albumState.get('unshuffled')).length > 1) {
        // Ensure that the shuffled queue ACTUALLY is shuffled
        while (
          isDeepEqual(
            getQueueIds(albumState.get('unshuffled')),
            getQueueIds(shuffled),
          )
        ) {
          shuffled = shuffle(albumState.get('unshuffled'));
        }
      } else {
        shuffled = shuffle(albumState.get('unshuffled'));
      }

      albumState.set('shuffled', shuffled);

      const queue = (
        state.shuffled ?
          albumState.get('shuffled')
        : albumState.get('unshuffled')) as Playback.Queue;

      let index =
        station.seed ? queue.findIndex(item => item.id === station.seed) : 0;

      index = index === -1 ? 0 : index;

      return {
        ...state,
        index,
        queue,
        station,
      };
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

    async setShuffle({ state }) {
      const { index, queue, shuffled } = state;
      const { shuffled: shuffledQueue, unshuffled: unshuffledQueue } =
        albumState.deserialize();

      const newQueue = shuffled ? unshuffledQueue : shuffledQueue;
      const newIndex = newQueue.findIndex(item => item.id === queue[index].id);

      return {
        ...state,
        shuffled: !shuffled,
        index: newIndex,
        queue: newQueue,
      };
    },
  });

  return albumResolver;
}
