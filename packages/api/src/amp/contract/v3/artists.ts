import { initContract } from '@ts-rest/core';

import { HttpMethods } from '../../../httpUtils/constants.js';
import type { V3 } from '../../../types/poweramp.js';
import { implement } from '../../implement.js';
import { numberIdSchema } from '../../schemas/common.js';

const c = initContract();

export type ArtistProfile = V3.GetArtistProfile.ResponseBody;

export const artistsContract = c.router(
  {
    getArtistProfile: {
      method: HttpMethods.Get,
      path: '/profiles/:id',
      pathParams: implement<V3.GetArtistProfile.RequestParams>().from({
        id: numberIdSchema,
      }),
      responses: {
        200: c.type<ArtistProfile>(),
      },
    },

    getArtistBio: {
      method: HttpMethods.Get,
      path: '/profiles/:id/bio',
      pathParams: implement<V3.GetArtistBio.RequestParams>().from({
        id: numberIdSchema,
      }),
      responses: {
        200: c.type<V3.GetArtistBio.ResponseBody>(),
      },
    },
  },
  {
    pathPrefix: '/artists',
  },
);
