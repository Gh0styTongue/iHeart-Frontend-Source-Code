import { initContract } from '@ts-rest/core';
import { z } from 'zod';

import { HttpMethods } from '../../../httpUtils/constants.js';
import { implement } from '../../implement.js';
import { _genericIdSchema as genericIdSchema } from '../../schemas/common.js';

type MarketByZipCodeRequestQuery = {
  zipcode: string;
};

type MarketByZipCodeResponse = {
  market_id: string;
  market_name: string;
  market_state: string;
  streams: string[];
};

const c = initContract();

export const t3Contract = c.router(
  {
    getMarketByZipcode: {
      method: HttpMethods.Get,
      path: '/liveRadio/market_by_zip_code',
      query: implement<MarketByZipCodeRequestQuery>().from({
        zipcode: genericIdSchema.pipe(z.coerce.string()),
      }),
      responses: {
        200: c.type<MarketByZipCodeResponse>(),
      },
    },
  },
  {
    pathPrefix: '/t3',
  },
);
