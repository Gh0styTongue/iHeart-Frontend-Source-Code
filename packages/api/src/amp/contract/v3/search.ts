import { initContract } from '@ts-rest/core';

import { HttpMethods } from '../../../httpUtils/constants.js';
import type {
  ComIheartPowerampApiSearchServiceSearchAllWithCountResponse,
  V3,
} from '../../../types/poweramp.js';

const c = initContract();

type SearchByContentTypeQuery = Omit<
  V3.SearchByContentType.RequestQuery,
  'contentType'
> & { contentType: 'EPISODE' };
type SearchByContentTypeResponseBody =
  ComIheartPowerampApiSearchServiceSearchAllWithCountResponse;

export const searchContract = c.router(
  {
    getSearchByContentType: {
      method: HttpMethods.Get,
      path: '/byContentType',
      query: c.type<SearchByContentTypeQuery>(),
      responses: {
        200: c.type<SearchByContentTypeResponseBody>(),
      },
    },
    getSearchCombined: {
      method: HttpMethods.Get,
      path: '/combined',
      query: c.type<V3.SearchCombined.RequestQuery>(),
      responses: {
        200: c.type<V3.SearchCombined.ResponseBody>(),
      },
    },
  },
  { pathPrefix: '/search' },
);
