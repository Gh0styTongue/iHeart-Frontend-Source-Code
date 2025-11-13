import { initContract } from '@ts-rest/core';
import { z } from 'zod';

import { HttpMethods } from '../../../httpUtils/constants.js';
import type { V3 } from '../../../types/poweramp.js';
import { implement } from '../../implement.js';

const c = initContract();

export const playbackContract = c.router(
  {
    postReporting: {
      method: HttpMethods.Post,
      path: '/reporting',
      body: implement<V3.Reporting.RequestBody>().from({
        modes: z.array(z.string()),
        offline: z.boolean().optional(),
        playedDate: z.number().default(() => Date.now()),
        playerKey: z.string().optional(),
        replay: z.boolean().optional(),
        reportPayload: z.string().optional(),
        secondsPlayed: z.number(),
        stationId: z.string().optional(),
        stationType: z
          .enum(['RADIO', 'LIVE', 'COLLECTION', 'MYMUSIC', 'ALBUM', 'PODCAST'])
          .optional(),
        status: z.enum([
          'DONE',
          'SKIP',
          'ERROR',
          'APPCLOSE2',
          'STATIONCHANGE',
          'APPCLOSE',
          'REPLAY',
          'SHUFFLE',
          'REWIND',
          'START',
          'REPORT_15',
          'PAUSE',
          'RESUME',
        ]),
      }),
      responses: {
        200: c.type<V3.Reporting.ResponseBody>(),
      },
      metadata: {
        failOnValidationMismatch: false,
      } as const,
    },

    postLiveStationReporting: {
      method: HttpMethods.Post,
      path: '/liveStation/reporting',
      body: c.type<V3.LiveStationReporting.RequestBody>(),
      responses: {
        204: c.type<V3.LiveStationReporting.ResponseBody>(),
      },
    },
  },
  { pathPrefix: '/playback' },
);
