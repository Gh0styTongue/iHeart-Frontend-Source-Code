import type { QueryClient } from '@tanstack/react-query';
import { keepPreviousData, useInfiniteQuery } from '@tanstack/react-query';
import ms from 'ms';
import { isNullish, prop } from 'remeda';

import { amp } from '~app/api/amp-client';

import { podcastKeys } from './constants';
import type { FollowedPodcast } from './types';

const PAGE_SIZE = 20;

export type GetFollowedPodcasts = {
  podcasts: FollowedPodcast[];
  hasNextPage: boolean;
  pageKey?: string;
};

function getFollowedPodcasts({
  pages,
  pageParam,
}: {
  pages?: number;
  pageParam?: string;
}): Promise<GetFollowedPodcasts> {
  const limit = isNullish(pageParam) ? (pages ?? 1) * PAGE_SIZE : PAGE_SIZE;
  return amp.api.v3.podcast
    .getPodcastFollows({
      query: {
        /**
         * NOTE: there may be an upper limit here – if there is, it is pretty high.
         * If the limit is hit for some users with MANY (100+) followed podcasts, we will need to
         * revisit how this data is fetched.
         *
         * IHRWEB-19767 - Caleb W.
         */
        limit,
        ...(pageParam ? { pageKey: pageParam } : {}),
        sortBy: 'TITLE',
        sortOrder: 'ASC',
        withNewEpisodeCounts: true,
      },
    })
    .then(prop('body'))
    .then(({ data, links }) => ({
      podcasts: data,
      hasNextPage: !isNullish(links.next),
      pageKey: links.next,
    }));
}

export function useQueryFollowedPodcasts(pages?: number) {
  return useInfiniteQuery({
    queryKey: podcastKeys.followed,
    queryFn: ({ pageParam }) => getFollowedPodcasts({ pageParam, pages }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: lastPage =>
      lastPage.hasNextPage ? lastPage.pageKey : undefined,
    staleTime: ms('2s'),
    placeholderData: keepPreviousData,
  });
}

export async function getQueryDataFollowedPodcasts({
  pages,
  queryClient,
}: {
  pages?: number;
  queryClient: QueryClient;
}) {
  return await queryClient.ensureInfiniteQueryData({
    queryKey: podcastKeys.followed,
    queryFn: ({ pageParam }) => getFollowedPodcasts({ pages, pageParam }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage: GetFollowedPodcasts) =>
      lastPage.hasNextPage ? lastPage.pageKey : undefined,
  });
}
