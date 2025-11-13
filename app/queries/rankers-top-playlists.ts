import type { WebApi, WebAPIClient } from '@iheartradio/web.api/webapi';
import { type CountryCode, countryCodesEnum } from '@iheartradio/web.config';
import type { ServerTimingFunction } from '@iheartradio/web.server-timing';
import type { QueryClient, UseQueryResult } from '@tanstack/react-query';
import { useQuery } from '@tanstack/react-query';
import ms from 'ms';

import { useWebApiClient } from '~app/api/webapi-client';
import { logger } from '~app/utilities/logger';

import { getPlaylistGenresAndMoods } from './playlist';

export type RankersTopPlaylistsParameters = {
  country?: CountryCode;
  genre: string;
  locale: string;
  mood: string;
  time?: ServerTimingFunction;
};

export type PlaylistGenres = {
  [genre: string]: {
    tags: string[];
    title: string;
  };
};

export type PlaylistMoods = {
  [mood: string]: {
    tags: string[];
    title: string;
  };
};

export type RankersTopPlaylistsResponse = {
  data: (NonNullable<
    NonNullable<
      NonNullable<
        WebApi.PlaylistsDirectoriesItemsQuery['playlists']['directories']['list']['items'][number]['children']
      >[number]
    >['resource']
  > & { id: string; title: string })[];
  genre: string;
  genres: PlaylistGenres;
  mood: string;
  moods: PlaylistMoods;
};

export const DEFAULT_PLAYLIST_MOOD = 'all';
export const DEFAULT_PLAYLIST_GENRE = 'all';
export const PLAYLIST_GENRE_KEY = 'playlist-genre';
export const PLAYLIST_MOOD_KEY = 'playlist-mood';
export const TOP_PLAYLISTS_KEY = 'rankers-top-playlists';

export async function getRankersTopPlaylists({
  country = countryCodesEnum.Enum.US,
  genre,
  locale,
  mood,
  time,
  webapiClient,
  signal,
}: RankersTopPlaylistsParameters & {
  webapiClient: WebAPIClient;
  signal: AbortSignal;
}): Promise<RankersTopPlaylistsResponse> {
  const fetchRankersTopPlaylists = async () => {
    try {
      const { genres, moods } = await getPlaylistGenresAndMoods({
        country,
        locale,
        time,
        webapiClient,
        signal,
      });

      const { children: playlists = [] } =
        (
          await webapiClient.request(
            webapiClient.queries.playlistDirectoriesItems({
              countryCode: country,
              locale,
              tags: [
                ...new Set([
                  ...(genres?.[genre]?.tags ?? []),
                  ...(moods?.[mood]?.tags ?? []),
                ]),
              ],
            }),
            { signal },
          )
        )?.playlists?.directories?.list?.items?.[0] ?? {};

      const data = playlists
        ?.filter(item => item?.resource?.title)
        ?.slice(0, 10)
        ?.map<RankersTopPlaylistsResponse['data'][number]>(playlist => ({
          ...playlist?.resource,
          id: String(playlist?.id),
          title: String(playlist?.resource?.title),
        }));

      if (data === undefined) {
        throw new Error('There are no "playlists" that exist for this query.');
      }

      const payload = {
        data,
        genre,
        genres,
        mood,
        moods,
      } satisfies RankersTopPlaylistsResponse;

      return payload;
    } catch (error: any) {
      logger.error(error?.message, { error });

      const payload = {
        data: [],
        genre: DEFAULT_PLAYLIST_GENRE,
        genres: {},
        mood: DEFAULT_PLAYLIST_MOOD,
        moods: {},
      } satisfies RankersTopPlaylistsResponse;

      return payload;
    }
  };

  if (time === undefined) {
    return fetchRankersTopPlaylists();
  }

  return time(TOP_PLAYLISTS_KEY, fetchRankersTopPlaylists);
}

export async function prefetchRankersTopPlaylists({
  country = countryCodesEnum.Enum.US,
  genre = DEFAULT_PLAYLIST_GENRE,
  locale = 'en-US',
  mood = DEFAULT_PLAYLIST_MOOD,
  queryClient,
  time,
  webapiClient,
  signal,
}: RankersTopPlaylistsParameters & {
  queryClient: QueryClient;
  webapiClient: WebAPIClient;
  signal: AbortSignal;
}) {
  await queryClient.prefetchQuery({
    queryKey: [country, locale, genre, mood],
    queryFn: () =>
      getRankersTopPlaylists({
        country,
        genre,
        locale,
        mood,
        time,
        webapiClient,
        signal,
      }),
    staleTime: ms('30m'),
  });
}

export function useQueryRankersTopPlaylists({
  country = countryCodesEnum.Enum.US,
  genre = DEFAULT_PLAYLIST_GENRE,
  locale = 'en-US',
  mood = DEFAULT_PLAYLIST_MOOD,
  time,
}: RankersTopPlaylistsParameters): UseQueryResult<
  RankersTopPlaylistsResponse,
  Error
> {
  const webapiClient = useWebApiClient();
  return useQuery({
    placeholderData: previousData => previousData,
    queryKey: [country, locale, genre, mood],
    queryFn: ({ signal }) =>
      getRankersTopPlaylists({
        country,
        genre,
        locale,
        mood,
        time,
        webapiClient,
        signal,
      }),
    staleTime: ms('30m'),
  });
}
