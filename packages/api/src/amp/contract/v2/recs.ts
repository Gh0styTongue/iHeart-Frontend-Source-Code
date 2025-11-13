import { initContract } from '@ts-rest/core';
import type { Merge } from 'type-fest';
import { z } from 'zod';

import { HttpMethods } from '../../../httpUtils/constants.js';
import type {
  ArtistResponse,
  DLContentPayload,
  LiveResponse,
  RecTO,
  ResponseObjectV2,
  V2,
} from '../../../types/amp.js';
import { implement } from '../../implement.js';
import {
  _genericIdSchema as genericIdSchema,
  numberIdSchema,
} from '../../schemas/common.js';

const c = initContract();

// Helper type to accept numbers for zipCode values, as well as strings
type WithZipCode<T> = Merge<T, { zipCode?: number | string }>;

export type Recommendation = Merge<RecTO, { imagePath?: string }> & {
  content?: ArtistResponse | DLContentPayload | LiveResponse;
};

type RecommendationsResponse = ResponseObjectV2 & {
  profile?: number;
  values?: Recommendation[];
};

const recommendationsTemplate = z.enum(['LRRM', 'CR', 'DL']);

export const recsContract = c.router(
  {
    getUserRecommendations: {
      method: HttpMethods.Get,
      path: '/:ownerProfileId',
      pathParams: implement<V2.GetUserRecommendations.RequestParams>().from({
        ownerProfileId: numberIdSchema,
      }),
      query: c.type<WithZipCode<V2.GetUserRecommendations.RequestQuery>>(),
      responses: {
        200: c.type<RecommendationsResponse>(),
      },
    },

    getRecommendationsForGenres: {
      method: HttpMethods.Get,
      path: '/genre',
      query: implement<
        Merge<
          V2.GetRecommendationsForGenres.RequestQuery,
          {
            genreId?: string | number | undefined;
            template?: z.infer<typeof recommendationsTemplate>;
          }
        >,
        Merge<
          V2.GetRecommendationsForGenres.RequestQuery,
          {
            genreId?: string | number | (string | number)[] | undefined;
            zipCode?: string | number | undefined;
            template?: z.infer<typeof recommendationsTemplate>;
          }
        >
      >().strict({
        fields: z.string().optional(),
        /** genre ids */
        genreId: z
          .union([
            genericIdSchema,
            z.array(genericIdSchema).transform(value => value.join(',')),
          ])
          .optional(),
        /**
         * the latitude of the client
         * @format double
         */
        lat: z.number().optional(),
        /**
         * total number to return. (Required)
         * @format int32
         * @default 10
         */
        limit: z.number().optional(),
        /**
         * the longitude of the client
         * @format double
         */
        lng: z.number().optional(),
        /**
         * offset from start of list (0 is first)
         * @format int32
         * @default 0
         */
        offset: z.number().optional(),
        /**
         * - LRRM - Live Radio in Recommended Market
         * - CR - Artist Station
         * - DL - content
         */
        template: recommendationsTemplate.optional(),
        /** the zipcode of the client */
        zipCode: z
          .union([z.string(), z.number()])
          .transform(val => (typeof val !== 'string' ? val.toString() : val))
          .optional(),
      }),
      responses: {
        200: c.type<RecommendationsResponse>(),
      },
    },

    getUserRecommendationsForNewView: {
      method: HttpMethods.Get,
      path: '/new/:ownerProfileId',
      pathParams:
        implement<V2.GetUserRecommendationsForNewView.RequestParams>().from({
          ownerProfileId: numberIdSchema,
        }),
      query:
        c.type<WithZipCode<V2.GetUserRecommendationsForNewView.RequestQuery>>(),
      responses: {
        200: c.type<RecommendationsResponse>(),
      },
    },
  },
  {
    pathPrefix: '/recs',
  },
);
