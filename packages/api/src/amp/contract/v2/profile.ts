import { initContract } from '@ts-rest/core';
import type { Merge } from 'type-fest';
import { z } from 'zod';

import { ContentType, HttpMethods } from '../../../httpUtils/constants.js';
import type {
  ErrorEntry,
  PlayedFromContextType,
  RadioType,
  ResponseObjectV2,
  TrackResponse,
  V2,
} from '../../../types/amp.js';
import { implement } from '../../implement.js';
import {
  limitSchema,
  numberIdSchema,
  offsetSchema,
  stringIdSchema,
} from '../../schemas/common.js';

const c = initContract();

const stationTypeEnum = z.enum(['CR', 'CRA', 'CT', 'LR', 'P', 'PC']);

type DeleteUserFavoriteResponse = {
  favoriteCount: number;
  profileId: number;
};

type GetUserFavoritesResponse = {
  duration?: number;
  profileId: number | string;
  values: Array<{
    artistName?: string;
    artistRadio?: boolean;
    artistSeed?: number | null;
    description?: string | null;
    deviceLink?: string | null;
    favorite?: boolean;
    featuredStationId?: number | null;
    id?: string;
    imagePath?: string | null;
    lastModifiedDate?: number;
    lastPlayedDate?: number;
    link?: string | null;
    name?: string;
    playCount?: number;
    presetId?: string | null;
    registeredDate?: number;
    seedProfileId?: number | null;
    slug?: string | null;
    stationType?: RadioType;
    thumbsDownElements?: Array<number>;
    thumbsUpElements?: Array<number>;
    trackSeed?: number | null;
    tracks?: TrackResponse[] | null;
    type?: PlayedFromContextType;
    variety?: number;
  }>;
};

// TODO: Flesh this out
type AddUserFavoriteResponse = Record<string, unknown> &
  Merge<ResponseObjectV2, { errors?: ErrorEntry[] }>;

export const profileContract = c.router(
  {
    postDeleteUserFavorite: {
      method: HttpMethods.Post,
      path: '/:profileId/favorites/station/:stationType/:stationId/delete',
      pathParams: implement<V2.DeleteUserFavorite.RequestParams>().from({
        profileId: numberIdSchema,
        stationType: stationTypeEnum,
        stationId: stringIdSchema,
      }),
      body: c.type<V2.DeleteUserFavorite.RequestBody>(),
      responses: {
        200: c.type<
          DeleteUserFavoriteResponse &
            Merge<ResponseObjectV2, { errors?: ErrorEntry[] }>
        >(),
      },
    },

    getUserFavorites: {
      method: HttpMethods.Get,
      path: '/:profileId/favorites',
      pathParams: implement<V2.GetUserFavorites.RequestParams>().from({
        profileId: numberIdSchema,
      }),
      query: implement<Partial<V2.GetUserFavorites.RequestQuery>>().from({
        hardFill: z.number().optional(),
        limit: limitSchema,
        offset: offsetSchema,
        campaignId: z.string().optional(),
      }),
      responses: {
        200: c.type<GetUserFavoritesResponse>(),
      },
    },

    postAddUserFavorite: {
      method: HttpMethods.Post,
      path: '/:profileId/favorites/station/:stationType/:stationId',
      contentType: ContentType.FormUrlEncoded,
      pathParams: implement<V2.AddUserFavorite.RequestParams>().from({
        profileId: numberIdSchema,
        stationType: stationTypeEnum,
        stationId: stringIdSchema,
      }),
      body: implement<V2.AddUserFavorite.RequestBody>().from({
        returnEntity: z.boolean().optional(),
      }),
      responses: {
        200: c.type<AddUserFavoriteResponse>(),
      },
    },
  },
  {
    pathPrefix: '/profile',
  },
);
