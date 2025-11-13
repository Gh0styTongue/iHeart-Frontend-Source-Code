import type {
  AmpClient,
  ampContract,
  ClientInferResponseBody,
} from '@iheartradio/web.api/amp';
import { StationEnum } from '@iheartradio/web.api/amp';
import type { ServerTimingFunction } from '@iheartradio/web.server-timing';
import type { QueryClient } from '@tanstack/react-query';
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import ms from 'ms';
import { useCallback } from 'react';
import { isNonNullish, prop } from 'remeda';

import { useAmpClient } from '~app/api/amp-client';
import type { RecentlyPlayedPages } from '~app/components/recently-played/mapping';
import { RecentlyPlayedMapping } from '~app/components/recently-played/mapping';
import { useUser } from '~app/contexts/user';
import { useGetPageName } from '~app/hooks/use-get-page-name';
import { logger } from '~app/utilities/logger';

export type RecentlyPlayedStation = ClientInferResponseBody<
  typeof ampContract.v2.playlists.getStations
>['hits'][number];

const INCLUDE_PLAYLIST_CAMPAIGN_ID = 'playlist_collections';

type RecentlyPlayedParameters = {
  includePlaylists?: boolean;
  isPagination?: boolean;
  pages?: number;
  stationsPerPage?: number;
  stationTypes?: StationEnum[];
  time?: ServerTimingFunction;
  enabled?: boolean;
};

export const recentlyPlayedKeys = {
  all: ['recently-played-stations'] as const,
  byType: (stationTypes: StationEnum[]) => [
    ...recentlyPlayedKeys.all,
    stationTypes.join('|'),
  ],
};

export async function getRecentlyPlayedStations({
  amp,
  includePlaylists = true,
  isPagination = false,
  pages = 1,
  profileId,
  stationsPerPage = 35,
  stationTypes = [
    StationEnum.ARTIST,
    StationEnum.COLLECTION,
    StationEnum.FAVORITES,
    StationEnum.LIVE,
    StationEnum.PODCAST,
    StationEnum.RADIO,
  ],
  time,
}: RecentlyPlayedParameters & { amp: AmpClient; profileId: number }): Promise<
  RecentlyPlayedStation[]
> {
  const fetchRecentlyPlayed = async () =>
    amp.api.v2.playlists
      .getStations({
        params: { profileId },
        query: {
          campaignId:
            includePlaylists ? INCLUDE_PLAYLIST_CAMPAIGN_ID : undefined,
          includePersonalized: true,
          sortBy: 'LAST_PLAYED',
          ...(isPagination ?
            { limit: stationsPerPage, offset: stationsPerPage * (pages - 1) }
          : { limit: stationsPerPage * pages, offset: 0 }),
          stationTypes,
        },
      })
      .then(prop('body'))
      .then(prop('hits'))
      .catch((error: unknown) => {
        logger.error(
          error instanceof Error ? error.message : JSON.stringify(error),
        );
        return [];
      }) ?? [];

  return isNonNullish(time) ?
      time('recently-played', fetchRecentlyPlayed)
    : fetchRecentlyPlayed();
}

/**
 * This prefetches the queries for Recently Played.
 *
 * @remarks This is used on hover for NavigationItem components
 * @param RecentlyPlayedParameters
 */
export async function prefetchRecentlyPlayed({
  amp,
  profileId,
  queryClient,
  stationTypes = [
    StationEnum.ARTIST,
    StationEnum.COLLECTION,
    StationEnum.FAVORITES,
    StationEnum.LIVE,
    StationEnum.PODCAST,
    StationEnum.RADIO,
  ],
  ...rest
}: RecentlyPlayedParameters & {
  queryClient: QueryClient;
  amp: AmpClient;
  profileId: number;
}) {
  await queryClient.prefetchQuery({
    queryKey: recentlyPlayedKeys.byType(stationTypes),
    queryFn: () =>
      getRecentlyPlayedStations({ amp, profileId, stationTypes, ...rest }),
    staleTime: ms('30s'),
  });
}

export function usePrefetchRecentlyPlayed() {
  const amp = useAmpClient();
  const queryClient = useQueryClient();
  const { profileId } = useUser() ?? {};

  return async (options?: RecentlyPlayedParameters) => {
    const { stationTypes, ...rest } = options ?? {
      stationTypes: [
        StationEnum.ARTIST,
        StationEnum.COLLECTION,
        StationEnum.FAVORITES,
        StationEnum.LIVE,
        StationEnum.PODCAST,
        StationEnum.RADIO,
      ],
    };

    await prefetchRecentlyPlayed({
      amp,
      profileId,
      queryClient,
      stationTypes,
      ...rest,
    });
  };
}

export function useQueryRecentlyPlayedStations({
  stationTypes = [
    StationEnum.ARTIST,
    StationEnum.COLLECTION,
    StationEnum.FAVORITES,
    StationEnum.LIVE,
    StationEnum.PODCAST,
    StationEnum.RADIO,
  ],
  enabled = true,
  ...rest
}: RecentlyPlayedParameters) {
  const amp = useAmpClient();
  const { profileId } = useUser() ?? {};
  return useQuery({
    enabled,
    queryKey: recentlyPlayedKeys.byType(stationTypes),
    queryFn: () =>
      getRecentlyPlayedStations({
        amp,
        profileId,
        stationTypes,
        ...rest,
      }),
    staleTime: ms('0'),
    placeholderData: keepPreviousData,
  });
}

export function useUpdateRecentlyPlayed(options?: { onSuccess?: () => void }) {
  const amp = useAmpClient();
  const { profileId, sessionId } = useUser() ?? {};
  const queryClient = useQueryClient();
  const pageName = useGetPageName() as RecentlyPlayedPages;

  const { onSuccess } = options ?? {};

  const addToRecentlyPlayedMutation = useCallback(
    async ({
      stationType,
      playedFrom,
      contentId,
    }: {
      stationType: StationEnum;
      playedFrom: number;
      contentId: number;
    }) => {
      const { status } = await amp.api.v2.playlists.postAddStation({
        params: {
          type: stationType,
          profileId,
          contentId,
        },
        body: {
          addToFavorites: false,
          playedFrom,
          contentId,
        },
      });

      if (stationType === StationEnum.LIVE && status === 200) {
        // This needs to happen AFTER the `postAddStation` call, so that is why these are not
        // being done in parallel with `Promise.allSettled` [DEM 2025/03/06]
        await amp.api.v1.liveRadio.postRegisterListen({
          params: {
            profileId: String(profileId),
            stationId: String(contentId),
          },
          body: {
            profileId,
            sessionId,
          },
        });
      }
    },
    [amp.api.v1.liveRadio, amp.api.v2.playlists, profileId, sessionId],
  );

  const onAddToRecentlyPlayedSuccess = useCallback(() => {
    const { stationTypes } = RecentlyPlayedMapping[pageName].common;
    queryClient.invalidateQueries({
      queryKey: recentlyPlayedKeys.byType(stationTypes),
    });
    onSuccess?.();
  }, [onSuccess, pageName, queryClient]);

  const addToRecentlyPlayed = useMutation({
    mutationFn: addToRecentlyPlayedMutation,
    onSuccess: onAddToRecentlyPlayedSuccess,
  });

  return {
    addToRecentlyPlayed: addToRecentlyPlayed.mutateAsync,
  };
}
