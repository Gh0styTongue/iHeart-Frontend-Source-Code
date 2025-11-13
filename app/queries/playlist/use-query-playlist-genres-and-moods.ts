import type { WebAPIClient } from '@iheartradio/web.api/webapi';
import { countryCodesEnum } from '@iheartradio/web.config';
import type { QueryClient } from '@tanstack/react-query';
import { useQuery } from '@tanstack/react-query';
import ms from 'ms';
import { isNonNullish } from 'remeda';

import { useWebApiClient } from '~app/api/webapi-client';
import { logger } from '~app/utilities/logger';

import {
  PLAYLIST_GENRE_TAG,
  PLAYLIST_MOOD_TAG,
  playlistKeys,
} from './constants';
import type {
  PlaylistGenres,
  PlaylistGenresAndMoodsParameters,
  PlaylistGenresAndMoodsResponse,
  PlaylistMoods,
} from './types';

export async function getPlaylistGenresAndMoods({
  country,
  locale,
  time,
  webapiClient,
  signal,
}: PlaylistGenresAndMoodsParameters & {
  webapiClient: WebAPIClient;
  signal: AbortSignal;
}): Promise<PlaylistGenresAndMoodsResponse> {
  const fetchPlaylistGenresAndMoods = async () => {
    try {
      const { directories } = (
        await webapiClient.request(
          webapiClient.queries.playlistDirectoriesMoodsGenres({
            countryCode: country,
            locale,
          }),
          { signal },
        )
      ).playlists;

      const genres =
        directories.genres.items[0].children?.reduce<PlaylistGenres>(
          (accumulator, genre) => {
            const key = genre?.tags
              ?.find(tag => tag.includes(PLAYLIST_GENRE_TAG))
              ?.replace(PLAYLIST_GENRE_TAG, '');

            if (key && genre) {
              const metadata = genre.metadata.find(meta =>
                meta.locales.find(item => item.includes(locale)),
              );

              accumulator[key] = {
                tags: genre.tags ?? [],
                title: String(metadata?.title),
              };
            }

            return accumulator;
          },
          {},
        );

      if (genres === undefined) {
        throw new Error('There are no "genres" that exist for this query.');
      }

      const moods = directories.moods.items[0].children?.reduce<PlaylistMoods>(
        (accumulator, mood) => {
          const key = mood?.tags
            ?.find(tag => tag.includes(PLAYLIST_MOOD_TAG))
            ?.replace(PLAYLIST_MOOD_TAG, '');

          if (key && mood) {
            const metadata = mood.metadata.find(meta =>
              meta.locales.find(item => item.includes(locale)),
            );

            accumulator[key] = {
              tags: mood.tags ?? [],
              title: String(metadata?.title),
            };
          }

          return accumulator;
        },
        {},
      );

      if (moods === undefined) {
        throw new Error('There are no "moods" that exist for this query.');
      }

      const payload = {
        genres,
        moods,
      };

      return payload;
    } catch (error: any) {
      logger.error(error?.message, { error });

      return {
        genres: {},
        moods: {},
      };
    }
  };

  return isNonNullish(time) ?
      time('playlist-genres-and-moods', fetchPlaylistGenresAndMoods)
    : fetchPlaylistGenresAndMoods();
}

export async function prefetchPlaylistGenresAndMoods({
  country = countryCodesEnum.Enum.US,
  locale = 'en-US',
  queryClient,
  time,
  webapiClient,
  signal,
}: PlaylistGenresAndMoodsParameters & {
  queryClient: QueryClient;
  webapiClient: WebAPIClient;
  signal: AbortSignal;
}) {
  await queryClient.prefetchQuery({
    queryKey: playlistKeys.genresAndMoods(country, locale),
    queryFn: () =>
      getPlaylistGenresAndMoods({
        country,
        locale,
        time,
        webapiClient,
        signal,
      }),
    staleTime: ms('30m'),
  });
}

export function useQueryPlaylistGenresAndMoods({
  country = countryCodesEnum.Enum.US,
  locale = 'en-US',
  time,
}: PlaylistGenresAndMoodsParameters) {
  const webapiClient = useWebApiClient();
  return useQuery({
    placeholderData: previousData => previousData,
    queryKey: playlistKeys.genresAndMoods(country, locale),
    queryFn: ({ signal }) =>
      getPlaylistGenresAndMoods({
        country,
        locale,
        time,
        webapiClient,
        signal,
      }),
    staleTime: ms('30m'),
  });
}
