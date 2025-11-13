import { initContract } from '@ts-rest/core';
import { z } from 'zod';

import { HttpMethods } from '../../../httpUtils/constants.js';
import { implement } from '../../implement.js';
import { _genericIdSchema as genericIdSchema } from '../../schemas/common.js';

const c = initContract();

export type GetTargetingQuery = {
  type: 'ARTIST' | 'COLLECTION' | 'FAVORITE';
  id?: string;
};

type GetTargetingResponse = {
  'aw_0_1st.playlistid': string;
  'aw_0_1st.playlisttype': string;
  'aw_0_1st.ihmgenre': string;
};

export const adsContract = c.router(
  {
    getTargeting: {
      method: HttpMethods.Get,
      path: '/targeting',
      query: implement<GetTargetingQuery>().from({
        id: genericIdSchema.pipe(z.coerce.string()).optional(),
        type: z.enum(['ARTIST', 'COLLECTION', 'FAVORITE']),
      }),
      responses: {
        200: c.type<GetTargetingResponse>(),
      },
    },
  },
  {
    pathPrefix: '/ads',
  },
);
