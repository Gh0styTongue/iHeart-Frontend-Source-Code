import { initContract } from '@ts-rest/core';

import { HttpMethods } from '../../../httpUtils/constants.js';
import type { V3 } from '../../../types/poweramp.js';

const c = initContract();

export const oauthContract = c.router(
  {
    postGenerateTritonToken: {
      method: HttpMethods.Post,
      path: '/triton/token',
      body: c.type<V3.GenerateTritonToken.RequestBody>(),
      responses: {
        200: c.type<V3.GenerateTritonToken.ResponseBody>(),
      },
    },
  },
  {
    pathPrefix: '/oauth',
  },
);
