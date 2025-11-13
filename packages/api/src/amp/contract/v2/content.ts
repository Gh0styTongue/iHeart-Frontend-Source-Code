import { initContract } from '@ts-rest/core';
import type { Merge } from 'type-fest';
import { z } from 'zod';

import { HttpMethods } from '../../../httpUtils/constants.js';
import type {
  LiveResponse,
  ResponseObject,
  ResponseObjectV2,
  V2,
} from '../../../types/amp.js';
import type { RenameKey } from '../../../types/extra.js';
import { implement } from '../../implement.js';
import {
  limitSchema,
  offsetSchema,
  stringIdSchema,
} from '../../schemas/common.js';

const c = initContract();

export interface Market {
  name: string;
  marketId: number;
  loc: {
    lat: number;
    lon: number;
  };
  stationCount: number;
  stateAbbreviation: string;
  stateId: string;
  stateName: string;
  city: string;
  countryName: string;
  countryId: string;
  countryAbbreviation: string;
}

type GetMarketsResponse = ResponseObjectV2 & {
  total?: number;
  hits?: Array<Market>;
};

export interface City {
  name: string;
  id: string;
  abbreviation: string;
  stationCount: number;
  state: {
    name: string;
    id: string;
    abbreviation: string;
    stationCount: number;
    country: {
      name: string;
      id: string;
      abbreviation: string;
      stationCount: number;
    };
  };
}

export interface Country {
  name: string;
  id: string;
  abbreviation: string;
  stationCount: number;
}

type GetCitiesResponse = ResponseObjectV2 & {
  // TODO: Flesh this out
  hits?: Array<City> | undefined;
  total?: number | undefined;
};

type GetMarketByIdResponse = ResponseObjectV2 &
  Market & {
    type: 'MarketResponse';
  };

type GetCountriesResponse = ResponseObjectV2 & {
  hits?: Array<Country> | undefined;
  total?: number | undefined;
};

export type GetLiveStationsResponse = Merge<
  V2.GetLiveStations.ResponseBody,
  {
    hits?: Merge<
      LiveResponse,
      {
        responseType: 'LIVE';
        ads?: Record<string, string | null>;
        feeds?: Record<string, string | null>;
        social?: Record<string, string | null>;
      }
    >[];
  }
>;

export type GetGenreResponse = Merge<
  V2.GetGenre.ResponseBody,
  {
    duration: number;
    value: {
      id: number;
      name: string;
      logo: string;
      sort: number;
      display: boolean;
    };
  }
>;

export const contentContract = c.router(
  {
    getCities: {
      method: HttpMethods.Get,
      path: '/cities',
      query: c.type<V2.GetCities.RequestQuery>(),
      headers: c.type<V2.GetCities.RequestHeaders>(),
      responses: {
        200: c.type<GetCitiesResponse>(),
      },
    },

    getCountries: {
      method: HttpMethods.Get,
      path: '/countries',
      headers: c.type<V2.GetCountries.RequestHeaders>(),
      responses: {
        200: c.type<GetCountriesResponse>(),
      },
    },

    getLiveStations: {
      method: HttpMethods.Get,
      path: '/liveStations',
      headers: c.type<V2.GetLiveStations.RequestHeaders>(),
      query: implement<V2.GetLiveStations.RequestQuery>().from({
        /**
         * If false, it will only return the primary market. If true, it will return all the markets with the live station.
         * @default false
         */
        allMarkets: z.boolean().optional(),
        /** market to apply boost */
        boostMarketId: z.string().optional(),
        /** The Live Stations call letters */
        callLetters: z.string().optional(),
        changedSince: z.string().optional(),
        /** City of the markets for the station */
        city: z.string().optional(),
        /** The countryCode of the station */
        countryCode: z.string().optional(),
        /**
         * Country ID for the markets for the station
         * @format int32
         * @default 0
         */
        countryId: z.number().optional(),
        fccFacilityId: z.string().optional(),
        /** List of fields to be returned. */
        fields: z.string().optional(),
        /**
         * Genre Id of the live stations to search on.
         * @format int32
         * @default 0
         */
        genreId: z.number().optional(),
        /** To search across multiple ids, please use a comma separate list. IE: 1,2,3,4 */
        id: z.string().optional(),
        /**
         * lat of the markets associated with the station.
         * @format double
         */
        lat: z.number().optional(),
        /**
         * limit of results to come back from each type requests.
         * @format int32
         * @default 10
         */
        limit: limitSchema,
        /**
         * lng of the markets associated with the station.
         * @format double
         */
        lng: z.number().optional(),
        /** id of the market */
        marketId: stringIdSchema.optional(),
        /**
         * offset value
         * @format int32
         * @default 0
         */
        offset: offsetSchema,
        /** the primary market */
        primaryMarket: z.string().optional(),
        /**
         * Query to search on
         * @default ""
         */
        q: z.string().optional(),
        rdsPiCode: z.string().optional(),
        returnNonActive: z.string().optional(),
        /** Which value to sort on. use the prefix + on the field to change order of the sort. */
        sort: z.string().optional(),
        /** State of the markets for the station */
        stateAbbr: z.string().optional(),
        /**
         * State ID for the markets for the station
         * @format int32
         * @default 0
         */
        stateId: z.number().optional(),
        /** comma separated list of stream types */
        streamType: z.string().optional(),
        /** @default false */
        useIP: z.boolean().optional(),
        /** zipCode of the markets for the station */
        zipCode: z.string().optional(),
      }),
      responses: {
        200: c.type<GetLiveStationsResponse>(),
      },
    },

    getLiveStationGenres: {
      method: HttpMethods.Get,
      path: '/liveStationGenres',
      headers: c.type<V2.GetLiveStationGenres.RequestHeaders>(),
      query: implement<V2.GetLiveStationGenres.RequestQuery>().from({
        cityId: z.coerce.number().optional().default(0),
      }),
      responses: {
        200: c.type<
          Merge<
            V2.GetLiveStationGenres.ResponseBody,
            {
              hits: {
                id: number;
                name: string;
                count: number;
              }[];
            }
          >
        >(),
      },
    },

    getGenreById: {
      method: HttpMethods.Get,
      path: '/genre/:id',
      pathParams: implement<V2.GetGenre.RequestParams>().from({
        id: z.coerce.number(),
      }),
      headers: c.type<V2.GetGenre.RequestHeaders>(),
      query: c.type<V2.GetGenre.RequestQuery>(),
      responses: {
        200: implement<GetGenreResponse>().from({
          duration: z.number(),
          value: z.object({
            id: z.number(),
            name: z.string(),
            logo: z.string().url(),
            sort: z.number(),
            display: z.boolean(),
          }),
        }),
      },
    },

    getLiveStationsByIds: {
      method: HttpMethods.Get,
      path: '/liveStations/:ids',
      pathParams: implement<
        RenameKey<V2.GetLiveStationById.RequestParams, 'id', 'ids'>
      >().from({
        ids: z
          .number()
          .array()
          .transform(value => value.join(',')),
      }),
      query: implement<V2.GetLiveStationById.RequestQuery>().from({
        /**
         * If false, it will only return the primary market. If true, it will return all the markets with the live station.
         * @default "false"
         */
        allMarkets: z.boolean().optional(),
      }),
      responses: {
        200: c.type<V2.GetLiveStationById.ResponseBody>(),
      },
    },

    getMarkets: {
      method: HttpMethods.Get,
      path: '/markets',
      headers: c.type<V2.GetMarkets.RequestHeaders>(),
      query: c.type<Partial<V2.GetMarkets.RequestQuery>>(),
      responses: {
        200: c.type<GetMarketsResponse>(),
      },
    },

    getMarketById: {
      method: HttpMethods.Get,
      path: '/markets/:id',
      pathParams: c.type<{ id: string | number }>(),
      responses: {
        200: c.type<GetMarketByIdResponse>(),
        400: c.type<ResponseObject>(),
        404: c.type<
          ResponseObjectV2 & {
            type: 'MarketResponse';
          }
        >(),
      },
    },
  },
  {
    pathPrefix: '/content',
  },
);
