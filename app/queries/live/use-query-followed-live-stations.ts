import type {
  AmpClient,
  GetStationMetaResponseBody,
} from '@iheartradio/web.api/amp';
import type { ServerTimingFunction } from '@iheartradio/web.server-timing';
import type { QueryClient } from '@tanstack/react-query';
import { keepPreviousData, useInfiniteQuery } from '@tanstack/react-query';
import ms from 'ms';
import { isNonNullish, prop } from 'remeda';

import { liveStationKeys } from './constants';

export type GetFollowedLiveStations = {
  liveStations: GetStationMetaResponseBody[];
  followedStationIds: number[];
  hasNextPage: boolean;
};

const PAGE_SIZE = 15;

function getFollowedLiveStations({
  amp,
  time,
  pageParam = 1,
}: {
  amp: AmpClient;
  time?: ServerTimingFunction;
  pageParam?: number;
}): Promise<GetFollowedLiveStations> {
  const fetchFollowedLiveStations = async () => {
    const followedStationIds = await amp.api.v3.profiles
      .getFollowedLiveStations({
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
      .then(prop('data'))
      .then(followedStations =>
        followedStations.reduce(
          (accumulator, { liveStationId }) => [...accumulator, liveStationId],
          [] as number[],
        ),
      );

    const liveStations = await followedStationIds.reduce(
      async (accumulator, stationId) => {
        const stationMeta: GetStationMetaResponseBody =
          await amp.api.v3.livemeta
            .getStationMeta({
              params: { stationId },
              throwOnErrorStatus: false,
            })
            .then(prop('body'));
        (await accumulator).push(stationMeta);
        return accumulator;
      },
      Promise.resolve([] as GetStationMetaResponseBody[]),
    );

    return {
      liveStations,
      followedStationIds,
      hasNextPage: liveStations.length === PAGE_SIZE,
    };
  };

  return isNonNullish(time) ?
      time('library-live', fetchFollowedLiveStations)
    : fetchFollowedLiveStations();
}

export function useQueryFollowedLiveStations({ amp }: { amp: AmpClient }) {
  return useInfiniteQuery({
    queryKey: liveStationKeys.followed,
    queryFn: ({ pageParam }) => getFollowedLiveStations({ amp, pageParam }),
    initialPageParam: 1,
    getNextPageParam: (lastPage, _allPages, lastPageParam) =>
      lastPage.hasNextPage ? lastPageParam + 1 : undefined,
    placeholderData: keepPreviousData,
    refetchOnMount: true,
    staleTime: ms('30m'),
    retry: 1,
  });
}

export async function getQueryDataFollowedLiveStations({
  amp,
  queryClient,
}: {
  amp: AmpClient;
  queryClient: QueryClient;
}) {
  return await queryClient.ensureInfiniteQueryData({
    queryKey: liveStationKeys.followed,
    queryFn: ({ pageParam }) => getFollowedLiveStations({ amp, pageParam }),
    initialPageParam: 1,
    getNextPageParam: (
      lastPage: GetFollowedLiveStations,
      _allPages: GetFollowedLiveStations[],
      lastPageParam: number,
    ) => (lastPage.hasNextPage ? lastPageParam + 1 : undefined),
  });
}
