import { initContract } from '@ts-rest/core';

import { ContentType, HttpMethods } from '../../../httpUtils/constants.js';
import type { V1 } from '../../../types/amp.js';

const c = initContract();

export const liveRadioContract = c.router(
  {
    postRegisterListen: {
      contentType: ContentType.FormUrlEncoded,
      method: HttpMethods.Post,
      path: '/:profileId/:stationId/registerListen',
      body: c.type<V1.RegisterListen.RequestBody>(),
      summary: "Update a user's profile",
      responses: {
        200: c.type<V1.RegisterListen.ResponseBody>(),
      },
    },
  },
  {
    pathPrefix: '/liveRadio',
  },
);
