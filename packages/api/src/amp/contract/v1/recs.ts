import { initContract } from '@ts-rest/core';

import { HttpMethods } from '../../../httpUtils/constants.js';
import type { V1 } from '../../../types/amp.js';
import { implement } from '../../implement.js';
import { numberIdSchema } from '../../schemas/common.js';

const c = initContract();

export const recsContract = c.router(
  {
    getLiveStationRecs: {
      method: HttpMethods.Get,
      path: '/getLiveRadioStations',
      query: implement<V1.GetLiveStationRecs.RequestQuery>().from({
        liveRadioStationId: numberIdSchema.optional(),
      }),
      responses: {
        200: c.type<V1.GetLiveStationRecs.ResponseBody>(),
        404: c.type<never>(),
      },
    },
  },
  {
    pathPrefix: '/recs',
  },
);
