import { initContract } from '@ts-rest/core';
import type { SetRequired } from 'type-fest';

import { ContentType, HttpMethods } from '../../../httpUtils/constants.js';
import type { V1 } from '../../../types/amp.js';

const c = initContract();

export const subscriptionContract = c.router(
  {
    /**
     * @deprecated
     */
    postReportStreamOne: {
      method: HttpMethods.Post,
      path: '/reportStreamOne',
      contentType: ContentType.FormUrlEncoded,
      body: c.type<
        SetRequired<
          V1.ReportStreamOne.RequestBody,
          'playedFrom' | 'playerKey' | 'host' | 'sessionId'
        >
      >(),
      responses: {
        200: c.type<V1.ReportStreamOne.ResponseBody>(),
      },
    },

    /**
     * @deprecated
     */
    postReportStreamTwo: {
      method: HttpMethods.Post,
      path: '/reportStreamTwo',
      contentType: ContentType.FormUrlEncoded,
      body: c.type<
        SetRequired<
          V1.ReportStreamTwo.RequestBody,
          'playedFrom' | 'playerKey' | 'host' | 'sessionId'
        >
      >(),
      responses: {
        200: c.type<V1.ReportStreamTwo.ResponseBody>(),
      },
    },

    /**
     * @deprecated
     */
    postReportStreamDone: {
      method: HttpMethods.Post,
      path: '/reportStreamDone',
      contentType: ContentType.FormUrlEncoded,
      body: c.type<
        SetRequired<
          V1.ReportStreamDone.RequestBody,
          'playedFrom' | 'playerKey' | 'sessionId'
        >
      >(),
      responses: {
        200: c.type<V1.ReportStreamDone.ResponseBody>(),
      },
    },
  },
  { pathPrefix: '/subscription' },
);
