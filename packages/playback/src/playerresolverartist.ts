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
import type { Queue, Station, StationType } from './player:schemas.js';
import {
  AdFormat,
  MetadataType,
  PlayerErrorSchema,
  QueueItemType,
} from './player:schemas.js';
import type { Api, Resolver } from './player:types.js';
import { fetchPlaybackStreams } from './utility:streams.js';
import {
  buildCustomPreRollUrl,
  getCustomInStreamAdUrl,
  refreshPrerollUrl,
} from './utility:targeting.js';

export type ArtistStation = Merge<
  Station,
  {
    id: number;
    seed?: number;
    started?: number;
    type: StationType.Artist;
  }
>;

export function createArtistResolver(): CreateEmitter.Emitter<
  Resolver<ArtistStation>
> {
  const artistState = createWebStorage<{
    addedStation: PlaylistStationResponse | undefined;
    ampTargeting: GetTargetingResponse | undefined;
  }>({
    seed: {
      addedStation: undefined,
      ampTargeting: undefined,
    },
    prefix: `player:resolver:artist:state.`,
    type: 'session',
  });

  async function createArtistStation({
    api,
    station,
  }: {
    api: Api;
    station: ArtistStation;
  }) {
    const { body: addedStation } = await api.api.v2.playlists.postAddStation({
      body: {
        playedFrom: station.context.playedFrom,
      },
      params: {
        type: StationEnum.ARTIST,
        contentId: station.id,
        profileId: api.profileId,
      },
    });
    artistState.set('addedStation', addedStation);
    return addedStation;
  }

  function buildArtistQueue({
    items,
    childOriented,
  }: {
    items?: Stream[];
    childOriented: boolean;
  }): Queue {
    if (isNullish(items) || isEmpty(items)) {
      throw PlayerError.new({
        code: PlayerErrorCode.MissingStreams,
      });
    }

    return items.reduce((accumulator, item) => {
      if (item.streamUrl) {
        accumulator.push({
          id: item.content?.id as number,
          meta: {
            ...item.content,
            childOriented,
            description: item.content?.artistName,
            id: item.content?.id,
            image: item.content?.imagePath,
            subtitle: `${artistState.get('addedStation')?.name} Radio`,
            title:
              item.content?.title ?
                `${item.content?.title}${
                  item.content?.version ? ` • ${item.content.version}` : ''
                }`
              : undefined,
          },
          reporting: item.reportPayload,
          type: QueueItemType.Track,
          url: item.streamUrl,
        });
      }
      return accumulator;
    }, [] as Queue);
  }

  return createEmitter<Resolver<ArtistStation>>({
    async load({ api, state }, stationToLoad) {
      const station = { ...stationToLoad };

      const addedStation = await createArtistStation({ api, station });
      station.started = addedStation.registeredDate;
      station.name = `${addedStation.name} Radio`;

      // Base meta for display during ad breaks
      station.meta = {
        title: `${addedStation.name} Radio`,
        image: `https://i.iheart.com/v3/catalog/artist/${station.id}?ops=cover(400,400)`,
      };

      const seed = station.seed ?? station.id;
      const seedType = station.seed ? 'SONG2START' : 'ARTIST2START';

      const { items, ageLimit } = await fetchPlaybackStreams({
        api,
        stationType: StationEnum.RADIO,
        playedFrom: station.context.playedFrom,
        stationId: addedStation.id,
        seed,
        seedType,
        initial: true,
      });

      const queue = buildArtistQueue({
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

      if (isNullish(station) || isNullish(targeting)) {
        return null;
      }

      const apiTargeting = await api.api.v3.ads
        .getTargeting({
          query: { type: StationEnum.ARTIST, id: station.id },
        })
        .then(prop('body'));

      artistState.set('ampTargeting', {
        ...apiTargeting,
        'aw_0_1st.playlistid': String(station.id),
      });

      return getCustomInStreamAdUrl({
        ampTargeting: artistState.get('ampTargeting'),
        targeting,
        stationId: station.id,
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

      if (nextIndex >= queue.length) {
        try {
          const { items, ageLimit } = await fetchPlaybackStreams({
            api,
            stationType: StationEnum.RADIO,
            playedFrom: station.context.playedFrom,
            stationId: artistState.get('addedStation')?.id,
            initial: false,
          });
          newQueue = newQueue.concat(
            buildArtistQueue({
              items,
              childOriented: !!ageLimit,
            }),
          );
        } catch (error: unknown) {
          const { success } = PlayerErrorSchema.safeParse(error);

          if (success) {
            throw error;
          } else {
            throw PlayerError.new({ code: PlayerErrorCode.Generic });
          }
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
      const addedStation = artistState.get('addedStation');
      const { dfpInstanceId, targeting } = ads;

      if (isNullish(addedStation)) return null;

      const { station } = state;

      if (isNullish(station)) {
        return null;
      }

      const { body: playbackAds } = await api.api.v2.playback.postAds({
        body: {
          host: api.hostName,
          stationType: StationEnum.ARTIST,
          stationId: addedStation.id,
          includeStreamTargeting: true,
          playedFrom: station.context.playedFrom,
        },
      });

      const { ads: adItems, streamTargeting: ampTargeting } = playbackAds;

      if (ampTargeting && !isEmpty(ampTargeting)) {
        artistState.set('ampTargeting', {
          ...ampTargeting,
          'aw_0_1st.playlistid': String(station.id),
        });
      } else {
        const apiTargeting = await api.api.v3.ads
          .getTargeting({
            query: { type: StationEnum.ARTIST, id: station.id },
          })
          .then(prop('body'));

        artistState.set('ampTargeting', {
          ...apiTargeting,
          'aw_0_1st.playlistid': String(station.id),
        });
      }

      if (!isEmpty(adItems)) {
        const ampPreroll = adItems.find(ad => ad.preRoll);

        if (ampPreroll && dfpInstanceId && targeting) {
          preroll = await buildCustomPreRollUrl({
            ampPrerollUrl: ampPreroll.url,
            iu: `/${dfpInstanceId}/ccr.ihr/ihr`,
            prerollTargeting: {
              ...targeting.PreRoll,
              ...artistState.get('ampTargeting'),
            },
          });
        }
      }

      if (preroll) {
        return refreshPrerollUrl(preroll, AdFormat.Custom);
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
        type: MetadataType.Track,
        data: queue[index].meta,
      };
    },
  });
}
