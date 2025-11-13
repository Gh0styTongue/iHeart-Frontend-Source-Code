import { initContract } from '@ts-rest/core';
import type { Merge } from 'type-fest';

import { HttpMethods } from '../../../httpUtils/constants.js';
import type {
  ComIheartPowerampApiRecsDomainApiArtist,
  ComIheartPowerampApiRecsDomainApiResultSwaggerArtistItem,
  ComIheartPowerampApiRecsDomainApiResultSwaggerLiveStationItem,
  ComIheartPowerampApiRecsDomainApiResultSwaggerPlaylistItem,
  ComIheartPowerampApiRecsDomainApiResultSwaggerRecsMeta,
  ComIheartPowerampApiRecsDomainLiveStation,
  ComIheartPowerampApiRecsDomainPlaylistRecs,
  ComIheartPowerampPodcastApiPodcast,
  V3,
} from '../../../types/poweramp.js';

type GetPodcastRecsResponseBody = Merge<
  V3.GetPodcastRecs.ResponseBody,
  {
    tiles: {
      item: ComIheartPowerampPodcastApiPodcast;
      meta: ComIheartPowerampApiRecsDomainApiResultSwaggerRecsMeta;
    }[];
  }
>;

type GetMadeForYouResponse = Merge<
  V3.GetMadeForYouRecs.ResponseBody,
  {
    carouselMeta: Merge<
      V3.GetMadeForYouRecs.ResponseBody['carouselMeta'],
      { carouselType: string }
    >;
    tiles: Merge<
      ComIheartPowerampApiRecsDomainApiResultSwaggerPlaylistItem,
      { item: ComIheartPowerampApiRecsDomainPlaylistRecs }
    >[];
  }
>;

type GetGeoBasedLiveStationResponseBody = Merge<
  V3.GetGeoBasedLiveStation.ResponseBody,
  {
    tiles: Merge<
      ComIheartPowerampApiRecsDomainApiResultSwaggerLiveStationItem,
      { item: ComIheartPowerampApiRecsDomainLiveStation }
    >[];
  }
>;

type GetPlaylistRecsResponse = Merge<
  V3.GetPlaylistRecs.ResponseBody,
  {
    carouselMeta: Merge<
      V3.GetPlaylistRecs.ResponseBody['carouselMeta'],
      { carouselType: string }
    >;
    tiles: Merge<
      ComIheartPowerampApiRecsDomainApiResultSwaggerPlaylistItem,
      { item: ComIheartPowerampApiRecsDomainPlaylistRecs }
    >[];
  }
>;

export type GetGenreArtistRecsResponseBody = Merge<
  V3.GetGenreArtistRecs.ResponseBody,
  {
    tiles: Merge<
      ComIheartPowerampApiRecsDomainApiResultSwaggerArtistItem,
      { item: ComIheartPowerampApiRecsDomainApiArtist }
    >[];
  }
>;

const c = initContract();

export const recsContract = c.router(
  {
    getPodcastRecs: {
      method: HttpMethods.Get,
      path: '/podcastRecs',
      query: c.type<V3.GetPodcastRecs.RequestQuery>(),
      responses: {
        200: c.type<GetPodcastRecsResponseBody>(),
        404: c.type<never>(),
      },
    },

    getPlaylistRecs: {
      method: HttpMethods.Get,
      path: '/playlistRecs',
      query: c.type<V3.GetPlaylistRecs.RequestQuery>(),
      responses: {
        200: c.type<GetPlaylistRecsResponse>(),
        404: c.type<never>(),
      },
    },

    getArtistRecs: {
      method: HttpMethods.Get,
      path: '/artist/genre',
      query: c.type<V3.GetGenreArtistRecs.RequestQuery>(),
      responses: {
        200: c.type<GetGenreArtistRecsResponseBody>(),
        404: c.type<never>(),
      },
    },

    getLiveRecs: {
      method: HttpMethods.Get,
      path: '/live-station',
      query: c.type<V3.GetGeoBasedLiveStation.RequestQuery>(),
      responses: {
        200: c.type<GetGeoBasedLiveStationResponseBody>(),
        404: c.type<never>(),
      },
    },

    getSimilarStations: {
      method: HttpMethods.Get,
      path: '/live-station-recs',
      query: c.type<V3.GetLiveRadioStations.RequestQuery>(),
      responses: {
        200: c.type<V3.GetLiveRadioStations.ResponseBody>(),
      },
    },

    getMadeForYouRecs: {
      method: HttpMethods.Get,
      path: '/madeForYouRecs',
      query: c.type<V3.GetMadeForYouRecs.RequestQuery>(),
      responses: {
        200: c.type<GetMadeForYouResponse>(),
        404: c.type<never>(),
      },
    },
  },
  { pathPrefix: '/recs' },
);
