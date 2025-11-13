import { initContract } from '@ts-rest/core';
import { z } from 'zod';

import { HttpMethods } from '../../../httpUtils/constants.js';
import type { V3 } from '../../../types/poweramp.js';
import { implement } from '../../implement.js';
import { numberIdSchema } from '../../schemas/common.js';

const c = initContract();

export const GetStationMetaResponseBodySchema = z.object({
  ads: z.object({
    audio_ad_provider: z.literal('ad-providers/triton').nullable().optional(),
    enable_triton_token: z.boolean(),
    provider_id: z.number(),
  }),
  brand: z.string().optional().nullable(),
  callLetters: z.string(),
  country: z.string(),
  email: z.string().optional().nullable(),
  description: z.string().optional(),
  feeds: z
    .object({
      feed: z.string().optional(),
      childOriented: z.coerce.boolean().optional(),
      enableTritonTracking: z.boolean().optional(),
    })
    .optional(),
  format: z.string().optional().nullable(),
  freq: z.string(),
  freq_clean: z.string().optional(),
  genres: z.array(
    z.object({
      id: z.number(),
      name: z.string(),
      isPrimary: z.boolean(),
      sortIndex: z.number(),
      country: z.string().transform(val => val.replace('countries/', '')),
    }),
  ),
  gracenote_enabled: z.boolean(),
  id: z.number(),
  isActive: z.boolean(),
  logo: z.string().optional(),
  markets: z.array(
    z.object({
      city: z.string(),
      cityId: z.number(),
      country: z.string(),
      countryId: z.number(),
      id: z.number(),
      isOrigin: z.boolean(),
      isPrimary: z.boolean(),
      name: z.string(),
      sortIndex: z.number().optional(),
      state: z.string(),
      stateId: z.number(),
    }),
  ),
  name: z.string(),
  name_clean: z.string().optional(),
  phone: z.string().optional().nullable(),
  provider: z.string().optional(),
  recentlyPlayedEnabled: z.boolean().optional(),
  sms: z.string().optional().nullable(),
  social: z
    .object({
      facebook: z.string().nullable().optional(),
      twitter: z.string().nullable().optional(),
      instagram: z.string().nullable().optional(),
      google: z.string().nullable().optional(),
      snapchat: z.string().nullable().optional(),
      tiktok: z.string().nullable().optional(),
      youtube: z.string().nullable().optional(),
      threads: z.string().nullable().optional(),
    })
    .optional(),
  streams: z.object({
    hls_stream: z.string().nullable().optional(),
    secure_hls_stream: z.string().nullable().optional(),
    pls_stream: z.string().nullable().optional(),
    secure_pls_stream: z.string().nullable().optional(),
    abacast_stream: z.string().nullable().optional(),
    shoutcast_stream: z.string().nullable().optional(),
    secure_shoutcast_stream: z.string().nullable().optional(),
    pivot_hls_stream: z.string().nullable().optional(),
    dash_stream: z.string().nullable().optional(),
    secure_dash_stream: z.string().nullable().optional(),
    secure_mp3_pls_stream: z.string().nullable().optional(),
  }),
  website: z.string().optional().nullable(),
});

export type GetStationMetaResponseBody = z.infer<
  typeof GetStationMetaResponseBodySchema
>;

export type StreamTrackHistory =
  V3.GetStreamTrackHistory.ResponseBody['data'][number];

export const livemetaContract = c.router(
  {
    getCurrentTrackMeta: {
      method: HttpMethods.Get,
      path: '/stream/:streamId/currentTrackMeta',
      pathParams: implement<V3.GetCurrentTrack.RequestParams>().from({
        streamId: numberIdSchema,
      }),
      query: implement<V3.GetCurrentTrack.RequestQuery>().from({
        /**
         * return in-stream metadata (if available) for a station even if third party listening is disabled.
         * @default false
         */
        defaultMetadata: z.boolean().optional(),
      }),
      responses: {
        200: c.type<V3.GetCurrentTrack.ResponseBody>(),
        204: c.type<never>(),
      },
    },

    getStationMeta: {
      method: HttpMethods.Get,
      path: '/stream/:stationId/station-meta',
      pathParams: implement<V3.GetStation.RequestParams>().from({
        stationId: numberIdSchema,
      }),
      responses: {
        200: implement<GetStationMetaResponseBody>().fromSchema(
          GetStationMetaResponseBodySchema,
        ),
      },
    },

    getStreamTrackHistory: {
      method: HttpMethods.Get,
      path: '/stream/:streamId/trackHistory',
      pathParams: implement<V3.GetStreamTrackHistory.RequestParams>().from({
        streamId: numberIdSchema,
      }),
      query: c.type<V3.GetStreamTrackHistory.RequestQuery>(),
      responses: {
        200: c.type<V3.GetStreamTrackHistory.ResponseBody>(),
      },
    },

    getStreamTopArtists: {
      method: HttpMethods.Get,
      path: '/stream/:streamId/topArtists',
      pathParams: implement<V3.GetStreamTopArtists.RequestParams>().from({
        streamId: numberIdSchema,
      }),
      query: c.type<V3.GetStreamTopArtists.RequestQuery>(),
      responses: {
        200: c.type<V3.GetStreamTopArtists.ResponseBody>(),
      },
    },
  },
  {
    pathPrefix: '/live-meta',
  },
);
