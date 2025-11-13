import type {
  AmpClient,
  ampContract,
  ClientInferResponses,
} from '@iheartradio/web.api/amp';
import type { ServerTimingFunction } from '@iheartradio/web.server-timing';
import type { QueryClient } from '@tanstack/react-query';
import { useQuery } from '@tanstack/react-query';
import ms from 'ms';
import { isNonNullish, prop } from 'remeda';

import { useAmpClient } from '~app/api/amp-client';
import { useRequestInfo } from '~app/hooks/use-request-info';

import { getRadioGenres } from './use-query-radio-genres';

export type Country = Exclude<
  ClientInferResponses<
    typeof ampContract.v2.content.getCountries
  >['body']['hits'],
  undefined
>[number];
export type Market = Exclude<
  ClientInferResponses<
    typeof ampContract.v2.content.getMarkets
  >['body']['hits'],
  undefined
>[number] & { displayName: string };
export type MarketGenre = {
  id: number;
  name: string;
  count: number;
};
export type LiveStation = Exclude<
  ClientInferResponses<
    typeof ampContract.v2.content.getLiveStations
  >['body']['hits'],
  undefined
>[number];

export const radioDialKeys = {
  all: ['radio-dial'],
  countries: () => [...radioDialKeys.all, 'countries'] as const,
  markets: (countryCode: string) =>
    [...radioDialKeys.all, countryCode, 'markets'] as const,
  marketByZipCode: (zipCode?: string) =>
    [...radioDialKeys.all, 'marketByZipCode', zipCode] as const,
  geoMarket: (id: string | number) =>
    [...radioDialKeys.all, String(id), 'geoMarket'] as const,
  genres: () => [...radioDialKeys.all, 'genres'] as const,
  stations: (marketId: number, genreId: number, countryCode: string) =>
    [...radioDialKeys.all, marketId, genreId, countryCode] as const,
} as const;

// Radio Dial Countries BEGIN
export async function getCountries({
  amp,
  signal,
  time,
}: {
  amp: AmpClient;
  signal: AbortSignal;
  time?: ServerTimingFunction;
}): Promise<Country[]> {
  const fetchCountries = async () =>
    amp.api.v2.content
      .getCountries({
        fetchOptions: {
          signal,
        },
      })
      .then(prop('body'))
      .then(prop('hits'))
      .then(countries => countries ?? []);

  return isNonNullish(time) ?
      time('radio-dial-countries', fetchCountries)
    : fetchCountries();
}

export async function prefetchRadioDialCountries({
  queryClient,
  amp,
  signal,
  time,
}: {
  queryClient: QueryClient;
  amp: AmpClient;
  signal: AbortSignal;
  time?: ServerTimingFunction;
}) {
  await queryClient.prefetchQuery({
    queryKey: radioDialKeys.countries(),
    queryFn: () => getCountries({ amp, signal, time }),
    staleTime: ms('30m'),
  });
}

export function useQueryRadioDialCountries() {
  const amp = useAmpClient();

  return useQuery({
    queryKey: radioDialKeys.countries(),
    queryFn: ({ signal }) => getCountries({ amp, signal }),
    staleTime: ms('30m'),
  });
}

// Radio Dial Countries END

// Radio Dial Markets BEGIN
export async function getMarkets({
  amp,
  countryCode,
  signal,
  time,
}: {
  amp: AmpClient;
  countryCode: string;
  signal: AbortSignal;
  time?: ServerTimingFunction;
}): Promise<Market[]> {
  const fetchMarkets = async () =>
    amp.api.v2.content
      .getMarkets({
        query: {
          countryCode,
          limit: 0,
          sortBy: 'city',
        },
        fetchOptions: {
          signal,
        },
      })
      .then(prop('body'))
      .then(prop('hits'))
      .then(markets =>
        isNonNullish(markets) && markets.length > 0 ? markets : [],
      )
      .then(markets => {
        // Create a `displayName` that formats it how we want to display it, e.g. "New York, NY"
        const mappedMarkets = markets.map(market => ({
          ...market,
          displayName: `${market.city}, ${market.stateAbbreviation}`,
        }));
        // Add "All Locations" to the front of the array
        mappedMarkets.unshift({
          marketId: 0,
          displayName: 'All Locations',
        } as Market);
        return mappedMarkets;
      });

  return isNonNullish(time) ?
      time('fetch-radio-dial-markets', fetchMarkets)
    : fetchMarkets();
}

export async function prefetchRadioDialMarkets({
  amp,
  countryCode,
  queryClient,
  signal,
  time,
}: {
  countryCode: string;
  queryClient: QueryClient;
  amp: AmpClient;
  signal: AbortSignal;
  time?: ServerTimingFunction;
}) {
  await queryClient.prefetchQuery({
    queryKey: radioDialKeys.markets(countryCode),
    queryFn: () => getMarkets({ amp, countryCode, signal, time }),
    staleTime: ms('30m'),
  });
}

export function useQueryRadioDialMarkets({
  countryCode,
}: {
  countryCode: string;
}) {
  const amp = useAmpClient();

  return useQuery({
    queryKey: radioDialKeys.markets(countryCode),
    queryFn: ({ signal }) => getMarkets({ amp, countryCode, signal }),
    staleTime: ms('30m'),
  });
}

// Radio Dial Markets END

export async function queryMarketByZipCode({
  amp,
  zipCode,
}: {
  amp: AmpClient;
  zipCode?: string;
}): Promise<Omit<Market, 'displayName'> | null> {
  return zipCode ?
      ((await amp.api.v2.content
        .getMarkets({
          query: {
            zipCode,
            limit: 0,
          },
        })
        .then(prop('body'))
        .then(prop('hits'))
        .then(markets => markets?.at(0) ?? null)
        .catch(() => null)) ?? null)
    : null;
}

export function useQueryMarketByZipCode({ zipCode }: { zipCode?: string }) {
  const amp = useAmpClient();
  return useQuery({
    queryKey: radioDialKeys.marketByZipCode(zipCode),
    queryFn: () => queryMarketByZipCode({ amp, zipCode }),
  });
}

// Radio Dial Geo Market BEGIN
export async function getMarketById({
  amp,
  id,
}: {
  id?: number;
  amp: AmpClient;
}): Promise<Market | null> {
  return id ?
      ((await amp.api.v2.content
        .getMarketById({ params: { id } })
        .then(prop('body'))
        .then(market => market as Market)
        .catch(() => ({}) as Market)) ?? null)
    : null;
}

export async function prefetchRadioDialGeoMarket({
  amp,
  queryClient,
  id,
}: {
  id: number;
  queryClient: QueryClient;
  amp: AmpClient;
}) {
  await queryClient.prefetchQuery({
    queryKey: radioDialKeys.geoMarket(id),
    queryFn: () => getMarketById({ amp, id }),
    staleTime: ms('30m'),
  });
}

export function useQueryRadioDialGeoMarket({ id }: { id: number }) {
  const amp = useAmpClient();

  return useQuery({
    queryKey: radioDialKeys.geoMarket(id),
    queryFn: () => getMarketById({ amp, id }),
    staleTime: ms('30m'),
  });
}

// Radio Dial Geo Market END

// Radio Dial Genres BEGIN
const EXCLUDED_GENRE_IDS = Object.freeze(
  new Set([
    94, // "Artist Hosted Stations"
    95, // "Hosts and DJs"
    1207, // "Sales Channels"
  ]),
);

export async function getMarketGenres({
  amp,
  locale,
  signal,
  time,
}: {
  amp: AmpClient;
  locale?: string;
  signal: AbortSignal;
  time?: ServerTimingFunction;
}): Promise<MarketGenre[]> {
  return await getRadioGenres({
    amp,
    genreType: 'liveStation',
    locale,
    signal,
    time,
  })
    .then(genres =>
      genres
        .filter(genre => !EXCLUDED_GENRE_IDS.has(genre.id))
        .map(genre => ({
          name: genre.genreName,
          id: genre.id,
          count: genre.count,
        })),
    )
    .then(filteredGenres => [
      {
        id: 0,
        name: 'All Genres',
        count: Number.POSITIVE_INFINITY,
      } as MarketGenre,
      ...filteredGenres,
    ]);
}

export async function prefetchRadioDialGenres({
  amp,
  queryClient,
  locale,
  signal,
  time,
}: {
  amp: AmpClient;
  queryClient: QueryClient;
  locale: string;
  signal: AbortSignal;
  time?: ServerTimingFunction;
}) {
  await queryClient.prefetchQuery({
    queryKey: radioDialKeys.genres(),
    queryFn: () => getMarketGenres({ amp, signal, locale, time }),
    staleTime: ms('30m'),
  });
}

export async function ensureRadioDialGenres({
  amp,
  queryClient,
  locale,
  signal,
  time,
}: {
  amp: AmpClient;
  queryClient: QueryClient;
  locale: string;
  signal: AbortSignal;
  time?: ServerTimingFunction;
}) {
  return queryClient.ensureQueryData({
    queryKey: radioDialKeys.genres(),
    queryFn: () => getMarketGenres({ amp, signal, locale, time }),
    staleTime: ms('30m'),
  });
}

export function setRadioDialGenresQueryData({
  queryClient,
  queryData,
}: {
  queryClient: QueryClient;
  queryData: MarketGenre[];
}) {
  queryClient.setQueryData(radioDialKeys.genres(), queryData);
}

export function useQueryRadioDialGenres() {
  const amp = useAmpClient();
  const { locale } = useRequestInfo();
  return useQuery({
    queryKey: radioDialKeys.genres(),
    queryFn: ({ signal }) => getMarketGenres({ amp, signal, locale }),
    staleTime: ms('30m'),
  });
}

// Radio Dial Genres END

// Radio Dial Stations BEGIN
export async function getFilteredLiveStations({
  amp,
  marketId,
  genreId,
  countryCode,
}: {
  amp: AmpClient;
  marketId: number;
  genreId: number;
  countryCode: string;
}): Promise<LiveStation[]> {
  const stations = await amp.api.v2.content
    .getLiveStations({
      query: {
        ...(marketId > 0 ? { marketId } : {}),
        genreId,
        countryCode,
        limit: 25, // max number of stations to scan is 25, so setting that limit here
        ...(marketId === 0 ? { sort: 'cume' } : {}),
      },
    })
    .then(prop('body'))
    .then(prop('hits'))
    .then(stations =>
      isNonNullish(stations) && stations.length > 0 ? stations : [],
    )
    .then(stations => stations.map(includeFrequencyInStationName));

  return stations;
}

export async function prefetchRadioDialStations({
  amp,
  marketId,
  genreId,
  countryCode,
  queryClient,
}: {
  amp: AmpClient;
  marketId: number;
  genreId: number;
  countryCode: string;
  queryClient: QueryClient;
}) {
  await queryClient.prefetchQuery({
    queryKey: radioDialKeys.stations(marketId, genreId, countryCode),
    queryFn: () =>
      getFilteredLiveStations({ amp, marketId, genreId, countryCode }),
    staleTime: ms('30m'),
  });
}

export function useQueryRadioDialStations({
  marketId,
  genreId,
  countryCode,
}: {
  marketId: number;
  genreId: number;
  countryCode: string;
}) {
  const amp = useAmpClient();
  return useQuery({
    queryKey: radioDialKeys.stations(marketId, genreId, countryCode),
    queryFn: () =>
      getFilteredLiveStations({ amp, marketId, genreId, countryCode }),
    staleTime: ms('30m'),
  });
}

// Radio Dial Stations END

// Misc. Functions
export function includeFrequencyInStationName(
  station: LiveStation,
): LiveStation {
  // We only append the frequency to the end of the station name if:
  // 1. A frequency is present in the station object
  // 2. The station's name doesn't include the exact frequency value (Including decimal places)
  // Ex: "The BIG 98" will be "The BIG 98 (97.9)" since the frequency exists on the station object, and is not included in the station name
  if (station.freq && !station.name?.includes(String(station.freq))) {
    station.name = `${station.name} (${station.freq})`;
  }

  return station;
}
