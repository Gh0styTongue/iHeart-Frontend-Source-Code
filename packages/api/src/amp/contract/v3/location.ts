import { initContract } from '@ts-rest/core';

import { HttpMethods } from '../../../httpUtils/constants.js';
import type { V3 } from '../../../types/poweramp.js';

const c = initContract();

export const locationContract = c.router({
  getLocationConfig: {
    method: HttpMethods.Get,
    path: '/locationConfig',
    query: c.type<V3.LocationConfig.RequestQuery>(),
    headers: c.type<V3.LocationConfig.RequestHeaders>(),
    responses: {
      200: c.type<V3.LocationConfig.ResponseBody>(),
    },
  },
});
