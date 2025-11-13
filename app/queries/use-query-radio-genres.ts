import type {
  AmpClient,
  ampContract,
  ClientInferResponseBody,
} from '@iheartradio/web.api/amp';
import type { ServerTimingFunction } from '@iheartradio/web.server-timing';
import type { QueryClient } from '@tanstack/react-query';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import ms from 'ms';
import { isNonNullish, prop } from 'remeda';

import { useAmpClient } from '~app/api/amp-client';
import { useRequestInfo } from '~app/hooks/use-request-info';

export type RadioGenres = ClientInferResponseBody<
  typeof ampContract.v3.catalog.getGenres
>['genres'];

type GenreType = 'custom' | 'liveStation' | 'picker';

export type RadioGenresParameters = {
  genreType: GenreType;
  time?: ServerTimingFunction;
};

const DEFAULT_GENRE_GROUP = 'Music & Entertainment';

export const genreKeys = {
  all: ['genres'] as const,
  byGenreType: ({
    genreType,
    locale,
  }: {
    genreType: GenreType;
    locale: string;
  }) => [...genreKeys.all, 'byGenreType', genreType, locale] as const,
  single: ({ id }: { id: number }) => [...genreKeys.all, 'byId', id],
} as const;

export async function getRadioGenres({
  amp,
  genreType,
  signal,
  time,
  locale,
}: RadioGenresParameters & {
  amp: AmpClient;
  locale?: string;
  signal: AbortSignal;
}): Promise<RadioGenres> {
  const fetchRadioGenres = async () =>
    amp.api.v3.catalog
      .getGenres({
        ...(locale ?
          {
            extraHeaders: {
              'X-Locale': locale,
            },
          }
        : {}),
        query: {
          genreType,
          includeEmptyGenre: false,
        },
        fetchOptions: {
          signal,
        },
      })
      .then(prop('body'))
      .then(prop('genres'));

  return isNonNullish(time) ?
      time('radio-genres', fetchRadioGenres)
    : fetchRadioGenres();
}

export async function getSingleGenreV2({
  amp,
  genreId,
  signal,
  time,
}: {
  amp: AmpClient;
  genreId: number;
  signal: AbortSignal;
  time?: ServerTimingFunction;
}): Promise<RadioGenres[number]> {
  const fetchSingleGenre = async () =>
    amp.api.v2.content
      .getGenreById({
        params: {
          id: genreId,
        },
        fetchOptions: {
          signal,
        },
      })
      .then(prop('body'))
      .then(prop('value'))
      .then(genre => ({
        id: genre.id,
        count: 1,
        genreGroup: DEFAULT_GENRE_GROUP,
        genreName: genre.name,
        sortOrder: genre.sort,
        image: genre.logo,
      }));

  return isNonNullish(time) ?
      time('single-genre', fetchSingleGenre)
    : fetchSingleGenre();
}

export async function prefetchRadioGenres({
  amp,
  genreType,
  locale,
  queryClient,
  signal,
  time,
}: RadioGenresParameters & {
  amp: AmpClient;
  locale: string;
  signal: AbortSignal;
  queryClient: QueryClient;
}) {
  await queryClient.prefetchQuery({
    queryKey: genreKeys.byGenreType({ genreType, locale }),
    queryFn: () => getRadioGenres({ amp, time, genreType, locale, signal }),
    staleTime: ms('30m'),
  });
}

export async function ensureRadioGenres({
  amp,
  genreType,
  locale,
  queryClient,
  signal,
  time,
}: RadioGenresParameters & {
  amp: AmpClient;
  locale: string;
  signal: AbortSignal;
  queryClient: QueryClient;
}) {
  return await queryClient.ensureQueryData({
    queryKey: genreKeys.byGenreType({ genreType, locale }),
    queryFn: () => getRadioGenres({ amp, time, genreType, locale, signal }),
    staleTime: ms('30m'),
  });
}

export function setQueryDataRadioGenres({
  queryClient,
  queryData,
  genreType,
  locale,
}: {
  queryClient: QueryClient;
  queryData: RadioGenres;
  genreType: GenreType;
  locale: string;
}) {
  queryClient.setQueryData(
    genreKeys.byGenreType({ genreType, locale }),
    queryData,
  );
}

// this query can be used for a combination of live station and artist genres, or only artist genres
export function useQueryRadioGenres({
  genreType,
  time,
}: RadioGenresParameters) {
  const amp = useAmpClient();
  const { locale } = useRequestInfo();

  return useQuery({
    placeholderData: keepPreviousData,
    queryKey: genreKeys.byGenreType({ genreType, locale }),
    queryFn: ({ signal }) => getRadioGenres({ amp, time, genreType, signal }),
    staleTime: ms('30m'),
  });
}

export async function ensureSingleGenre({
  amp,
  genreId,
  queryClient,
  signal,
  time,
}: {
  amp: AmpClient;
  genreId: number;
  queryClient: QueryClient;
  signal: AbortSignal;
  time: ServerTimingFunction;
}) {
  return await queryClient.ensureQueryData({
    queryKey: genreKeys.single({ id: genreId }),
    queryFn: () => getSingleGenreV2({ amp, time, genreId, signal }),
    staleTime: ms('30m'),
  });
}

export function useQuerySingleGenre({ genreId }: { genreId: number }) {
  const amp = useAmpClient();

  return useQuery({
    placeholderData: keepPreviousData,
    queryKey: genreKeys.single({ id: genreId }),
    queryFn: ({ signal }) => getSingleGenreV2({ amp, genreId, signal }),
    staleTime: ms('30m'),
  });
}
