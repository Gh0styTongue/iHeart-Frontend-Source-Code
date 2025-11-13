import {
  type GetTargetingResponse,
  type Poweramp,
  type Stream,
  StationEnum,
} from '@iheartradio/web.api/amp';
import {
  type CreateEmitter,
  createEmitter,
} from '@iheartradio/web.utilities/create-emitter';
import { createWebStorage } from '@iheartradio/web.utilities/create-storage';
import { isEmpty, isNullish, merge, prop } from 'remeda';
import type { Merge } from 'type-fest';

import { PlayerError, PlayerErrorCode } from './player:error.js';
import * as Playback from './player:types.js';
import { fetchPlaybackStreams } from './utility:streams.js';
import {
  buildCustomPreRollUrl,
  getCustomInStreamAdUrl,
  refreshPrerollUrl,
} from './utility:targeting.js';

type UserId = number;

type PlaylistId = string;

export type PlaylistRadioStation = Merge<
  Playback.Station,
  {
    id: `${UserId}::${PlaylistId}`;
    started?: number;
    type: Playback.StationType.PlaylistRadio;
  }
>;

export function createPlaylistRadioResolver(): CreateEmitter.Emitter<
  Playback.Resolver<PlaylistRadioStation>
> {
  const playlistRadioState = createWebStorage<{
    playlist: Poweramp.ComIheartPowerampCollectionDomainCollection | undefined;
    ampTargeting: GetTargetingResponse | undefined;
  }>({
    seed: {
      playlist: undefined,
      ampTargeting: undefined,
    },
    prefix: `player:resolver:playlistradio:state.`,
    type: 'session',
  });

  async function fetchPlaylist({
    api,
    station,
  }: {
    api: Playback.Api;
    station: PlaylistRadioStation;
  }) {
    const [userId, id] = station.id.split('::');

    const { body: playlist } = await api.api.v3.collection.getCollection({
      params: { id, userId: Number(userId) },
    });

    playlistRadioState.set('playlist', playlist);

    return playlist;
  }

  function buildPlaylistRadioQueue({
    items,
    childOriented,
  }: {
    items?: Stream[];
    childOriented: boolean;
  }): Playback.Queue {
    if (isNullish(items) || isEmpty(items)) {
      throw PlayerError.new({ code: PlayerErrorCode.MissingStreams });
    }

    return items.reduce((accumulator, item) => {
      if (item.streamUrl) {
        accumulator.push({
          id: item.content?.id as number,
          meta: {
            ...item.content,
            childOriented:
              (playlistRadioState.get('playlist')?.childOriented ||
                childOriented) ??
              false,
            description: item.content?.artistName,
            image: item.content?.imagePath,
            subtitle: playlistRadioState.get('playlist')?.name ?? '',
            followed: playlistRadioState.get('playlist')?.followed,
            followable: playlistRadioState.get('playlist')?.followable,
            isCurated: playlistRadioState.get('playlist')?.curated ?? false,
            title:
              item.content?.title ?
                `${item.content?.title}${
                  item.content?.version ? ` • ${item.content.version}` : ''
                }`
              : undefined,
          },
          reporting: item.reportPayload,
          type: Playback.QueueItemType.Track,
          url: item.streamUrl,
        });
      }
      return accumulator;
    }, [] as Playback.Queue);
  }

  const playlistRadioResolver = createEmitter<
    Playback.Resolver<PlaylistRadioStation>
  >({
    async load({ api, state }, stationToLoad) {
      const station = { ...stationToLoad };
      const playlist = await fetchPlaylist({ api, station });
      station.started = Date.now();
      station.name = playlist.name;

      station.meta = {
        title: playlist.name,
        image: `${playlist.urls.image}?ops=cover(400,400)`,
      };

      station.targeting.PreRoll = {
        ...station.targeting.PreRoll,
        ...(playlist.type === 'new4u' || playlist.type === 'personalized' ?
          { seed: playlist.id }
        : {}),
      };

      const { items, ageLimit } = await fetchPlaybackStreams({
        api,
        stationId: station.id,
        playedFrom: station.context.playedFrom,
        stationType: StationEnum.COLLECTION,
      });

      const queue = buildPlaylistRadioQueue({
        items,
        childOriented: !!ageLimit,
      });

      return {
        ...state,
        index: 0,
        queue,
        station,
      };
    },

    async midroll({ state, ads }) {
      const { queue, station } = state;
      const { targeting } = ads;

      if (isNullish(station) || isNullish(targeting)) {
        return null;
      }

      return getCustomInStreamAdUrl({
        ampTargeting: playlistRadioState.get('ampTargeting'),
        queue,
        targeting,
        stationId: playlistRadioState.get('playlist')?.id,
      });
    },

    async next({ api, state }) {
      const { index, queue, station } = state;
      if (isNullish(station)) {
        return state;
      }
      let newQueue = [...queue];

      const nextIndex = index + 1;

      if (nextIndex >= queue.length) {
        try {
          const { items, ageLimit } = await fetchPlaybackStreams({
            api,
            stationId: station.id,
            playedFrom: station.context.playedFrom,
            stationType: StationEnum.RADIO,
          });
          newQueue = newQueue.concat(
            buildPlaylistRadioQueue({
              items,
              childOriented: !!ageLimit,
            }),
          );
        } catch {
          throw PlayerError.new({ code: PlayerErrorCode.ApiError });
        }
      }

      return {
        ...state,
        index: nextIndex,
        queue: [...newQueue],
      };
    },

    async preroll({ state, ads, api }) {
      let preroll;
      const { station } = state;
      const { targeting, dfpInstanceId } = ads;

      const playlist = playlistRadioState.get('playlist');

      if (isNullish(station) || isNullish(playlist)) {
        return null;
      }

      const { body: playbackAds } = await api.api.v2.playback.postAds({
        body: {
          host: api.hostName,
          stationType: StationEnum.COLLECTION,
          stationId: station.id,
          includeStreamTargeting: true,
          playedFrom: station.context.playedFrom,
        },
      });

      const { ads: adItems, streamTargeting: ampTargeting } = playbackAds;

      if (ampTargeting && !isEmpty(ampTargeting)) {
        playlistRadioState.set('ampTargeting', ampTargeting);
      } else {
        playlistRadioState.set(
          'ampTargeting',
          await api.api.v3.ads
            .getTargeting({
              query: { type: StationEnum.COLLECTION, id: playlist.id },
            })
            .then(prop('body')),
        );
      }

      if (ampTargeting && !isEmpty(adItems)) {
        const ampPreroll = adItems.find(ad => ad.preRoll);

        const prerollTargeting = merge(
          targeting.PreRoll,
          station.targeting.PreRoll,
        );

        if (ampPreroll && dfpInstanceId && targeting) {
          preroll = await buildCustomPreRollUrl({
            ampPrerollUrl: ampPreroll.url,
            iu: `/${dfpInstanceId}/ccr.ihr/ihr`,
            prerollTargeting: {
              ...prerollTargeting,
              ...playlistRadioState.get('ampTargeting'),
            },
          });
        }
      }

      if (preroll !== undefined) {
        return refreshPrerollUrl(preroll, Playback.AdFormat.Custom);
      }

      return null;
    },

    async previous({ state }) {
      const { index } = state;

      return {
        ...state,
        index: index === 0 ? index : index - 1,
      };
    },

    async setMetadata({ state }) {
      const { index, queue } = state;

      return {
        type: Playback.MetadataType.Track,
        data: queue[index].meta,
      };
    },
  });

  return playlistRadioResolver;
}
