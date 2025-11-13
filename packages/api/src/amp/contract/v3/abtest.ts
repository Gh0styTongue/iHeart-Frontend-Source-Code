import { initContract } from '@ts-rest/core';

import { ContentType, HttpMethods } from '../../../httpUtils/constants.js';
import type { AccountType } from '../../../types/amp.js';

const c = initContract();

export type PostABTestGroupRequestBody = {
  meta: {
    accountType: AccountType;
    deviceId: string;
    platform: 'web';
    lang: string;
    country: 'US' | 'CA' | 'MX' | 'AU' | 'NZ' | 'WW';
    userType: 'NONE' | 'FREE' | 'ANONYMOUS' | 'PLUS' | 'PREMIUM';
  };
  userId: string;
};

type PostABTestGroupResponseBody = {
  at: string;
  groups: Record<string, string>;
  metas: Record<any, unknown>;
};

export const abtestContract = c.router(
  {
    postABTestGroup: {
      method: HttpMethods.Post,
      contentType: ContentType.Json,
      path: '/users/groups/query',
      body: c.type<PostABTestGroupRequestBody>(),
      responses: {
        200: c.type<PostABTestGroupResponseBody>(),
      },
    },
  },
  {
    pathPrefix: '/abtest',
  },
);
