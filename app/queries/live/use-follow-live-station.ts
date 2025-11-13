import { vars } from '@iheartradio/web.accomplice';
import { addToast } from '@iheartradio/web.accomplice/components/toast';
import type { InfiniteData } from '@tanstack/react-query';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { produce } from 'immer';
import { isNonNullish } from 'remeda';
import { $path } from 'safe-routes';

import type { RegGateContext } from '~app/analytics/data';
import { useInAppMessage } from '~app/analytics/in-app-message';
import { addRegGateToast } from '~app/analytics/reg-gate-toast';
import { amp } from '~app/api/amp-client';
import { useIsMobile } from '~app/contexts/is-mobile';
import { useUser } from '~app/contexts/user';
import { useGetLoginUrl, useGetSignUpUrl } from '~app/hooks/auth-urls';
import { useGetPageName } from '~app/hooks/use-get-page-name';
import type { GetFollowedLiveStations } from '~app/queries/live/use-query-followed-live-stations';
import { getQueryDataFollowedLiveStations } from '~app/queries/live/use-query-followed-live-stations';
import { getQueryDataLiveStation } from '~app/queries/live/use-query-live-station';
import type { AnalyticsLocationType } from '~app/utilities/constants';
import {
  ANALYTICS_ORIGIN,
  followUnfollowMessage,
  LIBRARY_AUTHENTICATION_MESSAGE,
  PAYLOAD_TRIGGER_TYPES,
  REG_GATE_TOAST_EXIT_TYPE,
  REG_GATE_TOAST_MESSAGE_TYPE,
} from '~app/utilities/constants';

import { liveStationKeys } from './constants';

export function useFollowLiveStation({
  context,
  isOnProfilePage = false,
  profileStationId,
  stationName,
}: {
  context: AnalyticsLocationType;
  isOnProfilePage?: boolean;
  profileStationId?: string | number;
  stationName?: string;
}) {
  const queryClient = useQueryClient();
  const user = useUser();
  const { onInAppMessageExit, onInAppMessageOpen } = useInAppMessage();
  const pageName = useGetPageName();
  const getLoginUrl = useGetLoginUrl();
  const getSignUpUrl = useGetSignUpUrl();
  const isMobile = useIsMobile();

  const followMutation = useMutation({
    mutationFn: async ({
      stationId,
      followContext,
    }: {
      stationId: number | string;
      followContext?: AnalyticsLocationType;
    }) => {
      if (user.isAnonymous) {
        const regGateContext: RegGateContext = {
          trigger: PAYLOAD_TRIGGER_TYPES.FOLLOW,
          origin: ANALYTICS_ORIGIN.LISTEN,
          pageName,
          location: followContext ?? context,
          ...(isOnProfilePage && profileStationId ?
            { assetId: profileStationId.toString() }
          : {}),
          ...(isOnProfilePage && stationName ? { assetName: stationName } : {}),
        };

        const loginUrl = getLoginUrl({ context: regGateContext });
        const signUpUrl = getSignUpUrl({ context: regGateContext });

        addRegGateToast({
          kind: 'info',
          text: LIBRARY_AUTHENTICATION_MESSAGE,
          onInAppMessageOpen,
          onInAppMessageExit,
          messageType: REG_GATE_TOAST_MESSAGE_TYPE.FOLLOW,
          userTriggered: true,
          pageName,
          location: followContext ?? context,
          ...(isOnProfilePage && profileStationId && stationName ?
            {
              globalStation: {
                id: profileStationId.toString(),
                name: stationName,
              },
            }
          : {}),
          actions: [
            {
              kind: 'tertiary',
              size: { mobile: 'small', medium: 'large' },
              color: 'gray',
              textColor: vars.color.gray600,
              href: loginUrl.toString(),
              onPress: () => {
                onInAppMessageExit({
                  messageType: REG_GATE_TOAST_MESSAGE_TYPE.FOLLOW,
                  exitType: REG_GATE_TOAST_EXIT_TYPE.CLICK_SUCCESS,
                  pageName,
                  location: followContext ?? context,
                });
              },
              content: 'Log in',
            },
            {
              kind: 'tertiary',
              size: { xsmall: 'small', medium: 'large' },
              color: 'gray',
              textColor: vars.color.gray600,
              href: signUpUrl.toString(),
              onPress: () => {
                onInAppMessageExit({
                  messageType: REG_GATE_TOAST_MESSAGE_TYPE.FOLLOW,
                  exitType: REG_GATE_TOAST_EXIT_TYPE.CLICK_SUCCESS,
                  pageName,
                  location: followContext ?? context,
                });
              },
              content: 'Sign up',
            },
          ],
        });
      } else {
        try {
          const { status } = await amp.api.v3.profiles.followLiveStation({
            body: { liveStationId: Number(stationId) },
          });

          return status === 204 || status === 201;
        } catch {
          return undefined;
        }
      }
    },
    onSuccess: async (data, { stationId }) => {
      if (isNonNullish(data)) {
        const message =
          isMobile ?
            followUnfollowMessage.followStationMobile
          : `${stationName} ${followUnfollowMessage.followStationDesktop}`;
        queryClient.setQueryData(liveStationKeys.isFollowing(stationId), data);

        // Only optimistically insert followed station if we already have data for that query
        if (isNonNullish(queryClient.getQueryData(liveStationKeys.followed))) {
          /**
           * There is an issue with AMP where after making the PUT request to follow the station and then
           * invalidating the followed stations query to refetch the updated list - the GET request to AMP
           * returns a cached response, with the newly followed station absent. This logic performs an
           * optimistic update of the followed stations query data. [DEM 2025/05/15]
           */
          // Get the query data for followed stations
          const followedStations = await getQueryDataFollowedLiveStations({
            amp,
            queryClient,
          });

          // Get the query data (Station Meta) for the station that was unfollowed
          const followedStation = await getQueryDataLiveStation({
            stationId,
            queryClient,
          });

          // If we get both...
          if (followedStations && followedStation) {
            await queryClient.cancelQueries({
              queryKey: liveStationKeys.followed,
            });
            // Construct a new state, using `produce` from immer to ensure we get a new object
            const newFollowedStations = produce(followedStations, draft => {
              const lastPage = draft.pages.at(-1);
              if (lastPage) {
                lastPage.liveStations.push(followedStation);
                lastPage.followedStationIds.push(followedStation.id);
              }
              return draft;
            });
            // Then set the query data
            queryClient.setQueryData(
              liveStationKeys.followed,
              // must use the function form to ensure that the component re-renders
              () => newFollowedStations,
            );
          } else {
            // if we didn't get either piece of data, just invalidate the query and hope for the best
            await queryClient.invalidateQueries({
              queryKey: liveStationKeys.followed,
            });
          }

          await queryClient.invalidateQueries({
            queryKey: liveStationKeys.recs,
          });
        }

        addToast({
          kind: 'success',
          text: message,
          actions:
            (
              location?.pathname !==
              $path('/library/stations/:type', { type: 'live' })
            ) ?
              [
                {
                  kind: 'tertiary',
                  color: 'gray',
                  content: 'Go to Library',
                  textColor: vars.color.gray600,
                  size: { xsmall: 'small', medium: 'large' },
                  href: $path('/library/stations/:type', { type: 'live' }),
                },
              ]
            : [],
        });
      }
    },
  });

  const unfollowMutation = useMutation({
    mutationFn: async ({ stationId }: { stationId: number | string }) => {
      try {
        const { status } = await amp.api.v3.profiles.unfollowLiveStation({
          params: { stationId: Number(stationId) },
        });

        return status !== 204;
      } catch {
        return undefined;
      }
    },
    onSuccess: async (data, { stationId }) => {
      if (isNonNullish(data)) {
        const message =
          isMobile ?
            followUnfollowMessage.unfollowStationMobile
          : `${stationName} ${followUnfollowMessage.unfollowStationDesktop}`;
        queryClient.setQueryData(liveStationKeys.isFollowing(stationId), data);

        /**
         * There is an issue with AMP where after making the PUT request to unfollow the station and then
         * invalidating the followed stations query to refetch the updated list - the GET request to AMP
         * returns a cached response, with the unfollowed station still present. This logic performs an
         * optimistic update of the followed stations query data. [DEM 2025/05/15]
         */
        // Get the query data for followed stations
        const followedStations = await getQueryDataFollowedLiveStations({
          amp,
          queryClient,
        });

        // Get the query data (Station Meta) for the station that was unfollowed
        const unfollowedStation = await getQueryDataLiveStation({
          stationId,
          queryClient,
        });

        // If we get both...
        if (followedStations && unfollowedStation) {
          await queryClient.cancelQueries({
            queryKey: liveStationKeys.followed,
          });
          // update the query data for followed stations in-place
          queryClient.setQueryData<
            InfiniteData<GetFollowedLiveStations, number>
          >(liveStationKeys.followed, oldData => {
            // must use the function form of `setQueryData` to trigger the component to re-render
            if (oldData) {
              // this could be undefined
              // using `produce` from immer to ensure that we absolutely get a new object
              return produce(oldData, draft => {
                return {
                  ...draft,
                  pages: draft?.pages.map(page => ({
                    ...page,
                    // filter out the unfollowed station
                    liveStations: page.liveStations.filter(
                      station => station.id !== unfollowedStation.id,
                    ),
                    // and remove the station id from the array of ids
                    followedStationIds: page.followedStationIds.filter(
                      id => id !== unfollowedStation.id,
                    ),
                  })),
                };
              });
            }
            // this is to satisfy TypeScript where `oldData` may equal undefined
            return oldData;
          });
          // If we didn't get both the followed stations query data and the unfollowed station,
          // then simply invalidate the followed stations query and hope for the best
        } else {
          await queryClient.invalidateQueries({
            queryKey: liveStationKeys.followed,
          });
        }

        await queryClient.invalidateQueries({ queryKey: liveStationKeys.recs });

        addToast({
          kind: 'success',
          text: message,
        });
      }
    },
  });

  return { follow: followMutation.mutate, unfollow: unfollowMutation.mutate };
}
