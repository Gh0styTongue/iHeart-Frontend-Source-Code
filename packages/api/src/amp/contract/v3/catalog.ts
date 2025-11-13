import { initContract } from '@ts-rest/core';
import type { Merge, Simplify } from 'type-fest';
import { z } from 'zod';

import { HttpMethods } from '../../../httpUtils/constants.js';
import type {
  ComIheartPowerampCollectionServiceLinks,
  V3,
} from '../../../types/poweramp.js';
import { implement } from '../../implement.js';
import {
  idsPathParameterSchema,
  limitSchema,
  numberIdSchema,
} from '../../schemas/common.js';

const c = initContract();

export type GetArtistAlbumsResponseBody = Simplify<{
  links?: Omit<ComIheartPowerampCollectionServiceLinks, 'nextPageKey'>;
  data: Array<
    Omit<V3.GetArtistAlbums.ResponseBody['albums'][number], 'trackIds'> & {
      tracks?: Array<{
        id: number;
        title: string;
        albumInfo: { trackNumber: number };
      }>;
    }
  >;
}>;

export const catalogContract = c.router(
  {
    getGenres: {
      method: HttpMethods.Get,
      path: '/genres',
      query: c.type<V3.GetGenres.RequestQuery>(),
      summary: 'Retrieve genre information base on type',
      responses: {
        200: c.type<V3.GetGenres.ResponseBody>(),
      },
    },

    getAlbum: {
      method: HttpMethods.Get,
      path: '/album/:id',
      pathParams: implement<V3.GetAlbum.RequestParams>().from({
        id: numberIdSchema,
      }),
      responses: {
        200: c.type<
          | V3.GetAlbum.ResponseBody
          | (V3.GetAlbum.ResponseBody & { error: string })
        >(),
      },
    },

    getArtistAlbums: {
      method: HttpMethods.Get,
      pathParams: implement<V3.GetArtistAlbums.RequestParams>().from({
        id: z.number(),
      }),
      path: '/artist/:id/albums',
      query: implement<
        Merge<V3.GetArtistAlbums.RequestQuery, { pageKey?: string | undefined }>
      >().from({
        limit: limitSchema,
        pageKey: z.string().optional(),
      }),
      responses: {
        200: c.type<GetArtistAlbumsResponseBody>(),
      },
    },

    getArtistTracks: {
      method: HttpMethods.Get,
      path: '/artist/:id/tracks',
      pathParams: implement<V3.GetArtistTracks.RequestParams>().from({
        id: numberIdSchema,
      }),
      query: c.type<Partial<V3.GetArtistTracks.RequestQuery>>(),
      responses: {
        200: c.type<V3.GetArtistTracks.ResponseBody>(),
      },
    },

    getArtistAdsMeta: {
      method: HttpMethods.Get,
      path: '/artists/:artistId/ads-meta',
      pathParams: implement<V3.GetAdsMeta.RequestParams>().from({
        artistId: numberIdSchema,
      }),
      responses: {
        200: c.type<V3.GetAdsMeta.ResponseBody>(),
      },
    },

    getArtists: {
      method: HttpMethods.Get,
      path: '/artists/:ids',
      pathParams: implement<V3.GetArtists.RequestParams>().to({
        ids: idsPathParameterSchema,
      }),
      responses: {
        200: c.type<V3.GetArtists.ResponseBody>(),
      },
    },

    getTracks: {
      method: HttpMethods.Get,
      path: '/tracks/:ids',
      pathParams: implement<V3.GetTracks.RequestParams>().to({
        ids: idsPathParameterSchema,
      }),
      query: implement<V3.GetTracks.RequestQuery>().from({
        limit: limitSchema,
      }),
      responses: {
        200: c.type<V3.GetTracks.ResponseBody>(),
      },
    },

    getLyrics: {
      method: HttpMethods.Get,
      path: '/tracks/lyrics',
      query: implement<V3.GetLyrics.RequestQuery>().from({
        trackId: numberIdSchema,
        lyricsLength: numberIdSchema.optional(),
        timestamped: z.boolean().optional(),
        lyricsLengthMaxDeviation: numberIdSchema.optional(),
      }),
      responses: {
        200: c.type<V3.GetLyrics.ResponseBody>(),
      },
    },
  },
  {
    pathPrefix: '/catalog',
  },
);
