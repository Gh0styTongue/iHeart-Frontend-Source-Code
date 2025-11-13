import {
  type GetTargetingResponse,
  type PlaylistStationResponse,
  type Stream,
  StationEnum,
} from '@iheartradio/web.api/amp';
import {
  type CreateEmitter,
  createEmitter,
} from '@iheartradio/web.utilities/create-emitter';
import { createWebStorage } from '@iheartradio/web.utilities/create-storage';
import { isEmpty, isNullish, prop } from 'remeda';
import type { Merge } from 'type-fest';

import { PlayerError, PlayerErrorCode } from './player:error.js';
import * as Playback from './player:types.js';
import { fetchPlaybackStreams } from './utility:streams.js';
import {
  buildCustomPreRollUrl,
  getCustomInStreamAdUrl,
  refreshPrerollUrl,
} from './utility:targeting.js';

export type FavoritesStation = Merge<
  Playback.Station,
  {
    id: number;
    seed?: number;
    started?: number;
    type: Playback.StationType.Favorites;
  }
>;

export function createFavoritesResolver(): CreateEmitter.Emitter<
  Playback.Resolver<FavoritesStation>
> {
  const favoritesState = createWebStorage<{
    addedStation: PlaylistStationResponse | undefined;
    ampTargeting: GetTargetingResponse | undefined;
  }>({
    seed: {
      addedStation: undefined,
      ampTargeting: undefined,
    },
    prefix: `player:resolver:favorites:state.`,
    type: 'session',
  });

  async function createFavoritesStation({
    api,
    station,
  }: {
    api: Playback.Api;
    station: FavoritesStation;
  }) {
    const { body: addedStation } = await api.api.v2.playlists.postAddStation({
      params: {
        type: StationEnum.FAVORITES,
        contentId: station.id,
        profileId: api.profileId,
      },
      body: {
        playedFrom: station.context.playedFrom,
      },
    });

    favoritesState.set('addedStation', addedStation);

    return addedStation;
  }

  function buildFavoritesQueue({
    items,
    childOriented,
  }: {
    items?: Stream[];
    childOriented: boolean;
  }): Playback.Queue {
    if (items === undefined || items.length === 0) {
      throw PlayerError.new({ code: PlayerErrorCode.MissingStreams });
    }

    return items.reduce((accumulator, item) => {
      if (item.streamUrl) {
        accumulator.push({
          id: item.content?.id as number,
          meta: {
            ...item.content,
            childOriented,
            description: item.content?.artistName,
            image: item.content?.imagePath,
            reporting: item.reportPayload,
            subtitle: `${
              favoritesState.get('addedStation')?.name
            } Favorites Radio`,
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

  const favoritesResolver = createEmitter<Playback.Resolver<FavoritesStation>>({
    async load({ api, state }, stationToLoad) {
      const station = { ...stationToLoad };
      const addedStation = await createFavoritesStation({ api, station });
      station.started = addedStation.registeredDate;
      station.name = addedStation.name;

      station.meta = {
        title: `${addedStation.name} Favorites Radio`,
        image: `https://i.iheart.com/v3/user/${station.id}/profile?ops=run("favorite"),cover(400,400)`,
      };

      const { items, ageLimit } = await fetchPlaybackStreams({
        api,
        playedFrom: station.context.playedFrom,
        stationId: addedStation.id,
        stationType: StationEnum.RADIO,
      });

      const queue = buildFavoritesQueue({
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

    async midroll({ state, ads, api }) {
      const { queue, station } = state;
      const { targeting } = ads;
      const addedStation = favoritesState.get('addedStation');

      if (
        isNullish(station) ||
        isNullish(targeting) ||
        isNullish(addedStation)
      ) {
        return null;
      }

      favoritesState.set(
        'ampTargeting',
        await api.api.v3.ads
          .getTargeting({
            query: {
              type: 'FAVORITE', // not using the enum because this endpoint takes a DIFFERENT value than the enum... "FAVORITE" vs "FAVORITES" - smh
              id: addedStation.id,
            },
          })
          .then(prop('body')),
      );

      return getCustomInStreamAdUrl({
        ampTargeting: favoritesState.get('ampTargeting'),
        targeting,
        stationId: favoritesState.get('addedStation')?.id,
        queue,
      });
    },

    async next({ api, state }) {
      const { index, queue, station } = state;
      if (isNullish(station)) {
        return state;
      }

      let newQueue = [...queue];

      const nextIndex = index + 1;

      if (nextIndex >= newQueue.length) {
        try {
          const { items, ageLimit } = await fetchPlaybackStreams({
            api,
            stationId: favoritesState.get('addedStation')?.id,
            playedFrom: station.context.playedFrom,
            stationType: StationEnum.RADIO,
          });

          newQueue = newQueue.concat(
            buildFavoritesQueue({
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
      const addedStation = favoritesState.get('addedStation');
      if (isNullish(addedStation)) return null;

      const { dfpInstanceId, targeting } = ads;
      const { station } = state;
      if (isNullish(station)) {
        return null;
      }

      const { body: playbackAds } = await api.api.v2.playback.postAds({
        body: {
          host: api.hostName,
          stationType: StationEnum.FAVORITES,
          stationId: addedStation.id,
          includeStreamTargeting: true,
          playedFrom: station.context.playedFrom,
        },
      });

      const { ads: adItems, streamTargeting: ampTargeting } = playbackAds;

      if (ampTargeting && !isEmpty(ampTargeting)) {
        favoritesState.set('ampTargeting', ampTargeting);
      } else if (addedStation.id) {
        favoritesState.set(
          'ampTargeting',
          await api.api.v3.ads
            .getTargeting({
              query: {
                type: 'FAVORITE', // not using the enum because this endpoint takes a DIFFERENT value than the enum... "FAVORITE" vs "FAVORITES" - smh
                id: addedStation.id,
              },
            })
            .then(prop('body')),
        );
      }

      if (!isEmpty(adItems)) {
        const ampPreroll = adItems.find(ad => ad.preRoll);

        if (ampPreroll && dfpInstanceId && targeting) {
          preroll = await buildCustomPreRollUrl({
            ampPrerollUrl: ampPreroll.url,
            iu: `/${dfpInstanceId}/ccr.ihr/ihr`,
            prerollTargeting: {
              ...targeting.PreRoll,
              ...favoritesState.get('ampTargeting'),
            },
          });
        }
      }

      if (preroll) {
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

  return favoritesResolver;
}
