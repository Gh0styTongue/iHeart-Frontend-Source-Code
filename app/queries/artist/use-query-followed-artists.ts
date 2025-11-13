import type {
  AmpClient,
  ampContract,
  ClientInferResponseBody,
} from '@iheartradio/web.api/amp';
import type { ServerTimingFunction } from '@iheartradio/web.server-timing';
import type { InfiniteData, QueryClient } from '@tanstack/react-query';
import { keepPreviousData, useInfiniteQuery } from '@tanstack/react-query';
import ms from 'ms';
import { isNonNullish } from 'remeda';

import { artistKeys } from './constants';

const PAGE_SIZE = 15;

export type GetFollowedArtists = {
  followedArtists: ClientInferResponseBody<
    typeof ampContract.v3.profiles.getFollowedArtists
  >['data'][number][];
  hasNextPage: boolean;
};

function getFollowedArtists({
  amp,
  pageParam = 1,
  time,
}: {
  amp: AmpClient;
  pageParam?: number;
  time?: ServerTimingFunction;
}) {
  const fetchFollowedArtists = async (): Promise<GetFollowedArtists> => {
    let hasNextPage = true;
    const followedArtists = await amp.api.v3.profiles
      .getFollowedArtists({
        query: { limit: PAGE_SIZE, offset: (pageParam - 1) * PAGE_SIZE },
        throwOnErrorStatus: false,
      })
      .then(({ status, body }) => {
        if (status === 404) {
          return {
            data: [],
          };
        }
        return body;
      })
      .then(({ data }) => {
        if (data.length < PAGE_SIZE) {
          hasNextPage = false;
        }
        return data;
      })
      .then(artists => artists.filter(artist => artist.artistSeed));

    return {
      followedArtists,
      hasNextPage: followedArtists.length > 0 ? hasNextPage : false,
    };
  };

  return isNonNullish(time) ?
      time('library-artist', fetchFollowedArtists)
    : fetchFollowedArtists();
}

export type FollowedArtist = Awaited<
  ReturnType<typeof getFollowedArtists>
>['followedArtists'][number];

export function useQueryFollowedArtists({ amp }: { amp: AmpClient }) {
  return useInfiniteQuery({
    queryKey: artistKeys.followed,
    queryFn: ({ pageParam }) => getFollowedArtists({ amp, pageParam }),
    initialPageParam: 1,
    getNextPageParam: (lastPage, _allPages, lastPageParam) =>
      lastPage.hasNextPage ? lastPageParam + 1 : undefined,
    placeholderData: keepPreviousData,
    staleTime: ms('30m'),
    refetchOnMount: true,
    retry: 1,
  });
}

export async function getQueryDataFollowedArtists({
  amp,
  queryClient,
}: {
  amp: AmpClient;
  queryClient: QueryClient;
}): Promise<InfiniteData<GetFollowedArtists, number>> {
  return await queryClient.ensureInfiniteQueryData({
    queryKey: artistKeys.followed,
    queryFn: ({ pageParam }) => getFollowedArtists({ amp, pageParam }),
    initialPageParam: 1,
    getNextPageParam: (
      lastPage: GetFollowedArtists,
      _allPages: GetFollowedArtists[],
      lastPageParam: number,
    ) => (lastPage.hasNextPage ? lastPageParam + 1 : undefined),
  });
}
