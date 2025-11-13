import { implement } from '@iheartradio/web.api';
import type {
  ampContract,
  ClientInferResponseBody,
} from '@iheartradio/web.api/amp';
import { z } from 'zod';

export const ThemeFormSchema = z.object({
  theme: z.enum(['system', 'light', 'dark']),
});

export type Market = NonNullable<
  ClientInferResponseBody<typeof ampContract.v2.content.getMarkets>['hits']
>[number];

export const marketSchema = implement<Market>().from(
  {
    name: z.string(),
    marketId: z.number(),
    loc: z.object({
      lat: z.number(),
      lon: z.number(),
    }),
    stationCount: z.number(),
    stateAbbreviation: z.string(),
    stateId: z.string(),
    stateName: z.string(),
    city: z.string(),
    countryName: z.string(),
    countryId: z.string(),
    countryAbbreviation: z.string(),
  },
  {
    required_error: 'Market is missing required fields',
    invalid_type_error: 'Market has invalid type',
  },
);

export const marketCookieSchema = z.object(
  {
    market: marketSchema.optional(),
    geoMarket: marketSchema.optional(),
  },
  {
    required_error: 'Session cookie is missing required fields',
    invalid_type_error: 'Session cookie has invalid type',
  },
);
