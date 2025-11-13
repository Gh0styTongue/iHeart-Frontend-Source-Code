import { initContract } from '@ts-rest/core';
import { z } from 'zod';

import { HttpMethods } from '../../../httpUtils/constants.js';
import type { V3 } from '../../../types/poweramp.js';
import { implement } from '../../implement.js';
import { numberIdSchema } from '../../schemas/common.js';

const c = initContract();

export const privacyContract = c.router(
  {
    getPrivacySettings: {
      method: HttpMethods.Get,
      path: '/accounts/:profileId/privacySettings',
      pathParams: implement<V3.GetPrivacySettings.RequestParams>().from({
        profileId: numberIdSchema,
      }),
      responses: {
        200: implement<V3.GetPrivacySettings.ResponseBody>()
          .from({
            hasOptedOut: z.boolean(),
            usPrivacy: z.union([z.literal('1YNN'), z.literal('1YYN')]),
          })
          .catch({ hasOptedOut: false, usPrivacy: '1YNN' }),
        404: implement<V3.GetPrivacySettings.ResponseBody>().from({
          hasOptedOut: z.boolean().default(false),
          usPrivacy: z
            .union([z.literal('1YNN'), z.literal('1YYN')])
            .default('1YNN'),
        }),
      },
    },
  },
  { pathPrefix: '/privacy' },
);
