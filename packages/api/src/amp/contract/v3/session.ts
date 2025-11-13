import { initContract } from '@ts-rest/core';

import { HttpMethods } from '../../../httpUtils/constants.js';
import type { V3 } from '../../../types/poweramp.js';

const c = initContract();

export const sessionContract = c.router(
  {
    postGetShortLivedToken: {
      method: HttpMethods.Post,
      path: '/token/:userId',
      pathParams: c.type<V3.GetShortLivedToken.RequestParams>(),
      body: c.type<V3.GetShortLivedToken.RequestBody>(),
      responses: {
        200: c.type<V3.GetShortLivedToken.ResponseBody>(),
      },
    },

    postSetActiveStreamer: {
      method: HttpMethods.Post,
      path: '/setActiveStreamer',
      body: c.type<V3.SetActiveStreamer.RequestBody>(),
      responses: {
        200: c.type<string>(),
      },
    },

    postGetApiToken: {
      method: HttpMethods.Post,
      path: '/api-token',
      body: c.type<never>(),
      query: c.type<{ hostname: string; version?: string }>(),
      responses: {
        201: c.type<{ token: string }>(),
      },
    },

    isValidSession: {
      method: HttpMethods.Head,
      path: '/sessions',
      responses: {
        200: c.type<never>(),
      },
    },
  },
  { pathPrefix: '/session' },
);
