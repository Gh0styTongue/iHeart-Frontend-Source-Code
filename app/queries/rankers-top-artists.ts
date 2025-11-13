import type {
  AmpClient,
  ampContract,
  ClientInferResponseBody,
} from '@iheartradio/web.api/amp';
import { type CountryCode, countryCodesEnum } from '@iheartradio/web.config';
import type { ServerTimingFunction } from '@iheartradio/web.server-timing';
import type { QueryClient, UseQueryResult } from '@tanstack/react-query';
import { useQuery } from '@tanstack/react-query';
import ms from 'ms';

import { logger } from '~app/utilities/logger';

import { type RadioGenres, getRadioGenres } from './use-query-radio-genres';

export type ArtistRecs = Exclude<
  ClientInferResponseBody<
    typeof ampContract.v2.recs.getRecommendationsForGenres
  >['values'],
  undefined
>;

export type RankersTopArtistsParameters = {
  amp: AmpClient;
  genre: number;
  time?: ServerTimingFunction;
};

export type RankersTopArtistsResponse = {
  data: ArtistRecs;
  genre: RadioGenres[number]['id'];
  genres: RadioGenres;
};

export const DEFAULT_ARTIST_GENRE = 102;

export const ARTIST_GENRE_KEY = 'artist-genre';

export const RANKERS_TOP_ARTISTS_KEY = 'rankers-top-artists';

export async function getRankersTopArtists({
  amp,
  genre = DEFAULT_ARTIST_GENRE,
  time,
  signal,
}: RankersTopArtistsParameters & {
  signal: AbortSignal;
}): Promise<RankersTopArtistsResponse> {
  const fetchRankersTopArtists = async () => {
    try {
      const genres = await getRadioGenres({
        amp,
        time,
        genreType: 'custom',
        signal,
      });

      const found = genres.find(item => item?.id === genre);

      const selected = found ? found.id : DEFAULT_ARTIST_GENRE;

      const recsReponse = await amp.api.v2.recs.getRecommendationsForGenres({
        query: {
          genreId: selected,
          template: 'CR',
          limit: 10,
        },
      });

      const data = recsReponse?.body.values ?? [];

      return {
        data,
        genre: selected,
        genres,
      };
    } catch (error: unknown) {
      logger.error(
        error instanceof Error ? error.message : JSON.stringify(error),
      );

      return {
        data: [],
        genre: DEFAULT_ARTIST_GENRE,
        genres: [],
      } as unknown as RankersTopArtistsResponse;
    }
  };

  if (time === undefined) {
    return fetchRankersTopArtists();
  }

  return time(RANKERS_TOP_ARTISTS_KEY, fetchRankersTopArtists);
}

export async function prefetchRankersTopArtists({
  amp,
  country = countryCodesEnum.Enum.US,
  locale = 'en-US',
  genre = DEFAULT_ARTIST_GENRE,
  queryClient,
  signal,
}: RankersTopArtistsParameters & {
  country?: CountryCode;
  locale?: string;
  queryClient: QueryClient;
  signal: AbortSignal;
}) {
  await queryClient.prefetchQuery({
    queryKey: [country, locale, RANKERS_TOP_ARTISTS_KEY, genre],
    queryFn: () =>
      getRankersTopArtists({
        amp,
        genre,
        signal,
      }),
    staleTime: ms('30m'),
  });
}

export function useQueryRankersTopArtists({
  amp,
  country = countryCodesEnum.Enum.US,
  locale = 'en-US',
  genre = DEFAULT_ARTIST_GENRE,
}: RankersTopArtistsParameters & {
  country?: CountryCode;
  locale?: string;
}): UseQueryResult<RankersTopArtistsResponse, Error> {
  return useQuery({
    placeholderData: previousData => previousData,
    queryKey: [country, locale, RANKERS_TOP_ARTISTS_KEY, genre],
    queryFn: ({ signal }) =>
      getRankersTopArtists({
        amp,
        genre,
        signal,
      }),
    staleTime: ms('30m'),
  });
}
