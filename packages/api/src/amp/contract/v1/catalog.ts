import { initContract } from '@ts-rest/core';

import { HttpMethods } from '../../../httpUtils/constants.js';
import type { V1 } from '../../../types/amp.js';
import { implement } from '../../implement.js';
import { numberIdSchema } from '../../schemas/common.js';

const c = initContract();

export const catalogContract = c.router(
  {
    getFavoritesStationById: {
      method: HttpMethods.Get,
      path: '/getFavoritesStationById',
      query: implement<V1.GetFavoritesStationById.RequestQuery>().from({
        id: numberIdSchema,
      }),
      responses: {
        200: c.type<V1.GetFavoritesStationById.ResponseBody>(),
        404: c.type<never>(),
      },
    },
  },
  { pathPrefix: '/catalog' },
);
