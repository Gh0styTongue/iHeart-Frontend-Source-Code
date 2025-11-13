import type { QueryClient } from '@tanstack/react-query';
import { keepPreviousData, useInfiniteQuery } from '@tanstack/react-query';
import ms from 'ms';

import { amp } from '~app/api/amp-client';
import { useUser } from '~app/contexts/user';
import { madeForYouPlaylistIds } from '~app/utilities/constants';

import { playlistKeys } from './constants';
import type {
  GetFollowedPlaylists,
  LibraryPlaylistsFilters,
  NextPageKey,
} from './types';

const PAGE_SIZE = 15;

async function getFollowedPlaylists({
  pageKey,
  userId,
  signal,
}: {
  pageKey?: NextPageKey;
  userId: string | number;
  signal?: AbortSignal;
}): Promise<GetFollowedPlaylists> {
  return await amp.api.v3.collection
    .getCollections({
      params: { userId },
      query: {
        limit: PAGE_SIZE,
        includePersonalized: true,
        includeIds: true,
        ...(pageKey ? { pageKey } : {}),
        playlistFilter: 'all',
      },
      throwOnErrorStatus: false,
      fetchOptions: { signal },
    })
    .then(({ status, body }) =>
      status !== 200 ? { data: [], links: { nextPageKey: undefined } } : body,
    )
    .then(({ data, links }) => ({
      playlists: [...data],
      nextPageKey: links?.nextPageKey,
    }));
}

export function useQueryFollowedPlaylists({
  filters = { followed: true, personalized: true, created: true },
  signal,
}: {
  filters?: LibraryPlaylistsFilters;
  pageKey?: NextPageKey;
  signal?: AbortSignal;
}) {
  const user = useUser();
  return useInfiniteQuery({
    queryKey: playlistKeys.followed,
    queryFn: async ({ pageParam }) =>
      await getFollowedPlaylists({
        pageKey: pageParam,
        userId: user.profileId,
        signal,
      }),
    initialPageParam: undefined,
    getNextPageParam: (lastPage: { nextPageKey?: string }) =>
      lastPage.nextPageKey ?? undefined,
    staleTime: ms('30m'),
    placeholderData: keepPreviousData,
    select: data => ({
      ...data,
      pages: data.pages.map(page => {
        return {
          ...page,
          playlists: [
            ...page.playlists.reduce(
              (accumulator, playlist) => {
                if (
                  filters.personalized &&
                  madeForYouPlaylistIds.has(playlist.id)
                ) {
                  accumulator.add(playlist);
                }
                if (
                  filters.followed &&
                  String(playlist.userId) !== String(user.profileId)
                ) {
                  accumulator.add(playlist);
                }
                if (
                  filters.created &&
                  String(playlist.userId) === String(user.profileId) &&
                  !madeForYouPlaylistIds.has(playlist.id)
                ) {
                  accumulator.add(playlist);
                }
                return accumulator;
              },
              new Set() as Set<GetFollowedPlaylists['playlists'][number]>,
            ),
          ],
        };
      }),
    }),
  });
}

export async function getQueryDataFollowedPlaylists({
  queryClient,
  userId,
}: {
  queryClient: QueryClient;
  userId: string | number;
}) {
  return queryClient.ensureInfiniteQueryData<
    GetFollowedPlaylists,
    unknown,
    GetFollowedPlaylists,
    typeof playlistKeys.followed,
    string | undefined
  >({
    queryKey: playlistKeys.followed,
    queryFn: async ({ pageParam, signal }) => {
      return await getFollowedPlaylists({ pageKey: pageParam, userId, signal });
    },
    initialPageParam: undefined,
    getNextPageParam: (lastPage: GetFollowedPlaylists) =>
      lastPage.nextPageKey ?? undefined,
  });
}
