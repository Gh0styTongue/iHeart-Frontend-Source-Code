import { initContract } from '@ts-rest/core';

import { HttpMethods } from '../../../httpUtils/constants.js';
import type { TasteProfileResponseRV, V2 } from '../../../types/amp.js';
import { implement } from '../../implement.js';
import { numberIdSchema } from '../../schemas/common.js';

const c = initContract();

export const tasteContract = c.router(
  {
    getTasteProfile: {
      method: HttpMethods.Get,
      path: '/:ownerProfileId',
      pathParams: implement<V2.GetTasteProfile.RequestParams>().from({
        ownerProfileId: numberIdSchema,
      }),
      query: c.type<V2.GetTasteProfile.RequestQuery>(),
      summary: "Get a user's taste profile",
      responses: {
        200: c.type<TasteProfileResponseRV>(),
      },
    },

    postAddSuppressedStations: {
      method: HttpMethods.Post,
      path: '/:ownerProfileId/suppress/stations/add',
      pathParams: implement<V2.AddSuppressedStations.RequestParams>().from({
        ownerProfileId: numberIdSchema,
      }),
      body: c.type<Pick<V2.AddSuppressedStations.RequestBody, 'stations'>>(),
      responses: {
        200: c.type<V2.AddSuppressedStations.ResponseBody>(),
      },
    },
  },
  {
    pathPrefix: '/taste',
  },
);
