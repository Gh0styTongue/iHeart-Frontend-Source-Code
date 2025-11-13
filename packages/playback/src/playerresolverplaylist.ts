import { type Poweramp, StationEnum } from '@iheartradio/web.api/amp';
import {
  type CreateEmitter,
  createEmitter,
} from '@iheartradio/web.utilities/create-emitter';
import { createMemoryStorage } from '@iheartradio/web.utilities/create-storage';
import { isNullish, prop, shuffle } from 'remeda';
import type { Merge } from 'type-fest';

import { PlayerError, PlayerErrorCode } from './player:error.js';
import * as Playback from './player:types.js';

type UserId = number;
type PlaylistId = string;

export type PlaylistStation = Merge<
  Playback.Station,
  {
    id: `${UserId}::${PlaylistId}`;
    seed?: string;
    type: Playback.StationType.Playlist;
  }
>;

export function createPlaylistResolver(): CreateEmitter.Emitter<
  Playback.Resolver<PlaylistStation>
> {
  const playlistState = createMemoryStorage<{
    playlist: Poweramp.ComIheartPowerampCollectionDomainCollection | undefined;
    shuffled: Playback.Queue;
    unshuffled: Playback.Queue;
  }>({
    playlist: undefined,
    shuffled: [],
    unshuffled: [],
  });

  async function getPlaylist({
    api,
    station,
  }: {
    api: Playback.Api;
    station: PlaylistStation;
  }) {
    if (playlistState.get('playlist') !== undefined) {
      return;
    }

    const [userId, id] = station.id.split('::');

    const { body: playlist } = await api.api.v3.collection.getCollection({
      params: { id, userId },
    });

    playlistState.set('playlist', playlist);

    playlistState.set(
      'unshuffled',
      playlist.tracks.map(item => ({
        id: item.id,
        meta: {
          description: '',
          image: '',
          subtitle: '',
          title: '',
          trackId: item.trackId,
          childOriented: playlist?.childOriented ?? false,
        },
        type: Playback.QueueItemType.Track,
        url: '',
      })),
    );

    const unshuffledQueue = playlistState.get('unshuffled');

    playlistState.set('shuffled', shuffle(unshuffledQueue));
  }

  async function updatePlaylistQueue({
    api,
    index,
    queue,
    station,
  }: {
    api: Playback.Api;
    index: number;
    queue: Playback.Queue;
    station: PlaylistStation;
  }) {
    try {
      if (queue[index].url) {
        return queue;
      }

      const { items, ageLimit } = await api.api.v2.playback
        .postStreams({
          body: {
            hostName: api.hostName,
            contentIds: [queue[index].meta.trackId as number],
            playedFrom: station.context.playedFrom,
            stationId: String(station.id),
            stationType: StationEnum.COLLECTION,
          },
        })
        .then(prop('body'));

      if (items === undefined || items.length === 0) {
        throw new Error(':(');
      }

      const [item] = items;

      queue[index] = {
        ...queue[index],
        url: item.streamUrl as string,
        meta: {
          ...item.content,
          childOriented:
            (playlistState.get('playlist')?.childOriented || !!ageLimit) ??
            false,
          isCurated: playlistState.get('playlist')?.curated ?? false,
          description: item.content?.artistName,
          image: item.content?.imagePath,
          subtitle: playlistState.get('playlist')?.name as string,
          followed: playlistState.get('playlist')?.followed,
          followable: playlistState.get('playlist')?.followable,
          title:
            item.content?.title ?
              `${item.content?.title}${
                item.content?.version ? ` • ${item.content.version}` : ''
              }`
            : undefined,
        },
        reporting: item.reportPayload,
      };

      return queue;
    } catch {
      throw PlayerError.new({
        code: PlayerErrorCode.NoAvailableSongs,
      });
    }
  }

  const playlistResolver = createEmitter<Playback.Resolver<PlaylistStation>>({
    async load({ api, state }, stationToLoad) {
      const station = { ...stationToLoad };
      playlistState.set('playlist', undefined);

      await getPlaylist({ api, station });
      station.name = playlistState.get('playlist')?.name;

      station.meta = {
        title: playlistState.get('playlist')?.name,
        image: `${
          playlistState.get('playlist')?.urls.image
        }?ops=cover(400,400)`,
      };

      const queue =
        state.shuffled ?
          playlistState.get('shuffled')
        : playlistState.get('unshuffled');

      let index =
        station.seed ? queue.findIndex(item => item.id === station.seed) : 0;

      index = index === -1 ? 0 : index;

      const newQueue = await updatePlaylistQueue({
        api,
        index,
        queue,
        station,
      });

      return {
        ...state,
        index,
        queue: newQueue,
        station,
      };
    },

    async next({ api, state }) {
      const { index, queue, station } = state;

      if (isNullish(station)) {
        return state;
      }

      await getPlaylist({ api, station });

      const newIndex = index === queue.length - 1 ? 0 : index + 1;

      const newQueue = await updatePlaylistQueue({
        api,
        index: newIndex,
        queue,
        station,
      });

      return {
        ...state,
        index: newIndex,
        queue: newQueue,
      };
    },

    async previous({ api, state }) {
      const { index, queue, station } = state;

      if (isNullish(station)) {
        return state;
      }

      await getPlaylist({ api, station });

      const newIndex = index === 0 ? queue.length - 1 : index - 1;

      const newQueue = await updatePlaylistQueue({
        api,
        index: newIndex,
        queue,
        station,
      });

      return {
        ...state,
        index: newIndex,
        queue: newQueue,
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
      const shuffledQueue = playlistState.get('shuffled');
      const unshuffledQueue = playlistState.get('unshuffled');

      const newQueue = shuffled ? shuffledQueue : unshuffledQueue;
      const newIndex = newQueue.findIndex(item => item.id === queue[index].id);

      return {
        ...state,
        index: newIndex,
        queue: newQueue,
      };
    },
  });

  return playlistResolver;
}
