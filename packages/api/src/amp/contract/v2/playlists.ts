import { initContract } from '@ts-rest/core';
import type { Merge, Simplify } from 'type-fest';
import { z } from 'zod';

import { ContentType, HttpMethods } from '../../../httpUtils/constants.js';
import type {
  ArtistResponse,
  ErrorEntry,
  LiveResponse,
  PlaylistStationResponse,
  StationResponse,
  V2,
} from '../../../types/amp.js';
import { implement } from '../../implement.js';
import {
  fieldSchema,
  limitSchema,
  numberIdSchema,
  offsetSchema,
  stringIdSchema,
} from '../../schemas/common.js';

type GetStationsResponse = Merge<
  V2.GetStations.ResponseBody,
  {
    hits: Merge<
      PlaylistStationResponse,
      {
        content?: (LiveResponse | StationResponse | ArtistResponse)[];
        artistName?: string;
        seedArtistId?: number;
        seedProfileId?: number;
        urls?: { image: string };
        ownerId?: string;
        playlistId?: string;
      }
    >[];
  }
>;

export type GetFavoritesStationResponse = {
  duration: number;
  value: {
    name: string;
    id: string;
    variety: 'TOP_HITS' | 'MIX' | 'VARIETY';
    lastPlayedDate: number;
    registeredDate: number;
    lastModifiedDate: number;
    stationType: 'FAVORITES';
    playCount: number;
    slug: string;
    link: string;
    deviceLink: string;
    imagePath: string;
    description: string;
    seedProfileId: number;
  };
};

export type GetStationBySeedIdResponse = {
  value: {
    name: string;
    id: string;
    seedArtistId: number;
    artistName: string;
    lastPlayed: number;
  };
};

const c = initContract();

const stationTypeEnum = z.enum([
  'ARTIST',
  'CLIP',
  'COLLECTION',
  'FAVORITES',
  'LIVE',
  'N4U',
  'RADIO',
  'PODCAST',
  'TALK',
  'TALKSHOW',
  'TALKTHEME',
  'TRACK',
]);

const sortByEnum = z.enum([
  'LAST_MODIFIED_DATE',
  'LAST_PLAYED',
  'NAME',
  'PLAYCOUNT',
  'REGISTERED_DATE',
  'TYPE',
]);

export type AddStationResponseBody = Merge<
  V2.AddStation.ResponseBody,
  { errors?: ErrorEntry[] }
>;

type DeleteStationResponseBody = Merge<
  V2.DeleteStation.ResponseBody,
  { errors?: ErrorEntry[] }
>;
export const playlistsContract = c.router(
  {
    getStationsById: {
      method: HttpMethods.Get,
      path: '/:profileId/:type/:stationId',
      pathParams: implement<V2.GetStationsById.RequestParams>().from({
        profileId: numberIdSchema,
        type: stationTypeEnum,
        stationId: stringIdSchema,
      }),
      query: implement<V2.GetStationsById.RequestQuery>().from({
        // TODO: make this type aware of the response object keys
        fields: fieldSchema,
        limit: limitSchema,
        offset: offsetSchema,
        /**
         * @default "NAME"
         */
        sortBy: sortByEnum.optional(),
      }),
      responses: {
        200: c.type<V2.GetStationsById.ResponseBody>(),
      },
    },

    getStationBySeedId: {
      method: HttpMethods.Get,
      path: '/:profileId/:type/seedId/:seedId',
      pathParams: implement<V2.GetStationBySeedId.RequestParams>().from({
        profileId: numberIdSchema,
        type: stationTypeEnum,
        seedId: numberIdSchema,
      }),
      responses: {
        200: c.type<GetStationBySeedIdResponse>(),
      },
    },

    postAddStation: {
      method: HttpMethods.Post,
      contentType: ContentType.FormUrlEncoded,
      path: '/:profileId/:type/:contentId',
      pathParams: implement<V2.AddStation.RequestParams>().from({
        profileId: numberIdSchema,
        type: stationTypeEnum,
        contentId: stringIdSchema,
      }),
      body: c.type<
        Partial<
          Simplify<
            V2.AddStation.RequestBody & {
              playedFrom?: number | undefined;
              contentId?: number | undefined;
            }
          >
        >
      >(),
      responses: {
        200: c.type<AddStationResponseBody>(),
      },
    },

    postDeleteStation: {
      method: HttpMethods.Post,
      path: '/:profileId/:type/:stationId/delete',
      pathParams: implement<V2.DeleteStation.RequestParams>().from({
        profileId: numberIdSchema,
        type: stationTypeEnum,
        stationId: stringIdSchema,
      }),
      body: c.type<Partial<Simplify<V2.DeleteStation.RequestBody>>>(),
      headers: c.type<Partial<V2.DeleteStation.RequestHeaders>>(),
      responses: {
        200: c.type<DeleteStationResponseBody>(),
      },
    },

    postRenameStation: {
      method: HttpMethods.Post,
      contentType: ContentType.FormUrlEncoded,
      path: '/:profileId/:type/:stationId/rename',
      pathParams: implement<V2.RenameStation.RequestParams>().from({
        profileId: numberIdSchema,
        type: stationTypeEnum,
        stationId: stringIdSchema,
      }),
      body: c.type<V2.RenameStation.RequestBody>(),
      headers: c.type<V2.RenameStation.RequestHeaders>(),
      responses: {
        200: c.type<{ duration: number; success: boolean }>(),
      },
    },

    getStations: {
      method: HttpMethods.Get,
      path: '/:profileId',
      pathParams: implement<V2.GetStations.RequestParams>().from({
        profileId: numberIdSchema,
      }),
      query: implement<V2.GetStations.RequestQuery>().from({
        campaignId: z.string().optional(),
        fields: z.string().optional(),
        includePersonalized: z.boolean().optional(),
        limit: limitSchema,
        offset: offsetSchema,
        sortBy: sortByEnum,
        stationTypes: stationTypeEnum
          .array()
          .transform(value => value.join(','))
          .optional(),
      }),
      headers: c.type<Partial<V2.GetStations.RequestHeaders>>(),
      responses: {
        200: c.type<GetStationsResponse>(),
      },
      metadata: {
        failOnValidationMismatch: false,
      } as const,
    },

    getFavoritesStation: {
      method: HttpMethods.Get,
      path: '/:profileId/FAVORITES/seedId/:profileId',
      pathParams: implement<
        Omit<V2.GetStationBySeedId.RequestParams, 'type' | 'seedId'>
      >().from({
        profileId: numberIdSchema,
      }),
      headers: c.type<Partial<V2.GetStationBySeedId.RequestHeaders>>(),
      responses: {
        200: c.type<GetFavoritesStationResponse>(),
      },
    },
  },
  {
    pathPrefix: '/playlists',
  },
);
