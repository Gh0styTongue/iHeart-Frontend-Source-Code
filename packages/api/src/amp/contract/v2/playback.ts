import { initContract } from '@ts-rest/core';
import type { SetRequired } from 'type-fest';
import { z } from 'zod';

import { HttpMethods } from '../../../httpUtils/constants.js';
import type { V2 } from '../../../types/amp.js';
import { implement } from '../../implement.js';

const c = initContract();

const stationTypeEnum = z.enum([
  'ALBUM',
  'COLLECTION',
  'LIVE',
  'MYMUSIC',
  'PODCAST',
  'RADIO',
]);

type StationType = z.infer<typeof stationTypeEnum>;

export type GetStreamsRequestBody = {
  contentIds: Array<number>;
  stationId: string;
  stationType: StationType;
  hostName: string;
  playedFrom: number;
  limit?: number;
  startStream?: {
    contentId: number;
    reason: 'SONG2START' | 'ARTIST2START';
  };
};

export type GetAdsResponse = {
  ads: Array<{ url: string; preRoll: boolean }>;
  streamTargeting?: {
    'aw_0_1st.ihmgenre': string;
    'aw_0_1st.playlistid': string;
    'aw_0_1st.playlisttype': string;
  };
};

export const playbackContract = c.router(
  {
    postAds: {
      method: HttpMethods.Post,
      path: '/ads',
      body: c.type<SetRequired<V2.GetAds.RequestBody, 'host'>>(),
      responses: {
        200: c.type<GetAdsResponse>(),
      },
    },

    postStreams: {
      method: HttpMethods.Post,
      path: '/streams',
      body: implement<GetStreamsRequestBody>().from({
        contentIds: z.array(z.number()),
        hostName: z.string(),
        limit: z.number().optional(),
        playedFrom: z.number(),
        startStream: z
          .object({
            contentId: z.number(),
            reason: z.union([
              z.literal('SONG2START'),
              z.literal('ARTIST2START'),
            ]),
          })
          .optional(),
        stationId: z.string(),
        stationType: stationTypeEnum,
      }),
      responses: {
        200: c.type<V2.GetStreams.ResponseBody>(),
      },
    },
  },
  {
    pathPrefix: '/playback',
  },
);
