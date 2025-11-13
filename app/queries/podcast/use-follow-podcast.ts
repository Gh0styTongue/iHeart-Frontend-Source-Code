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
import type { GetFollowedPodcasts } from '~app/queries/podcast/use-query-followed-podcasts';
import { getQueryDataFollowedPodcasts } from '~app/queries/podcast/use-query-followed-podcasts';
import { getQueryDataPodcast } from '~app/queries/podcast/use-query-podcast';
import type { AnalyticsLocationType } from '~app/utilities/constants';
import {
  ANALYTICS_ORIGIN,
  LIBRARY_AUTHENTICATION_MESSAGE,
  PAYLOAD_TRIGGER_TYPES,
  REG_GATE_TOAST_EXIT_TYPE,
  REG_GATE_TOAST_MESSAGE_TYPE,
} from '~app/utilities/constants';

import { podcastKeys } from './constants';
import type { Podcast } from './types';

export function useFollowPodcast({
  context,
  isOnProfilePage = false,
  stationId,
  stationName,
}: {
  context: AnalyticsLocationType;
  isOnProfilePage?: boolean;
  stationId?: string | number;
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
      podcastId,
      followContext,
    }: {
      podcastId: number | string;
      followContext?: AnalyticsLocationType;
    }) => {
      if (user.isAnonymous) {
        const regGateContext: RegGateContext = {
          trigger: PAYLOAD_TRIGGER_TYPES.FOLLOW,
          origin: ANALYTICS_ORIGIN.LISTEN,
          pageName,
          location: context,
          ...(isOnProfilePage && stationId ?
            { assetId: stationId.toString() }
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
          ...(isOnProfilePage && stationId && stationName ?
            {
              globalStation: {
                id: stationId.toString(),
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
                });
              },
              content: 'Sign up',
            },
          ],
        });
      } else {
        try {
          const { status } = await amp.api.v3.podcast.followPodcast({
            params: { podcastId: Number(podcastId) },
          });
          return status === 204;
        } catch {
          return undefined;
        }
      }
    },

    onSuccess: async (data, { podcastId }) => {
      if (isNonNullish(data)) {
        queryClient.setQueryData(podcastKeys.isFollowing(podcastId), data);

        const message =
          isMobile ? 'Following podcast' : `Following ${stationName}`;

        // Only optimistically insert the followed podcast if we already have data for that query
        if (isNonNullish(queryClient.getQueryData(podcastKeys.followed))) {
          const followedPodcasts = await getQueryDataFollowedPodcasts({
            queryClient,
          });

          const followedPodcast = await getQueryDataPodcast({
            podcastId,
            queryClient,
          });

          if (followedPodcasts && followedPodcast) {
            const newFollowedPodcasts = produce(followedPodcasts, draft => {
              const lastPage = draft.pages.at(-1);
              if (lastPage) {
                lastPage.podcasts.push(followedPodcast);
              }
              return draft;
            });
            queryClient.setQueryData(podcastKeys.followed, newFollowedPodcasts);
          } else {
            await queryClient.invalidateQueries({
              queryKey: podcastKeys.followed,
            });
          }

          await queryClient.invalidateQueries({ queryKey: podcastKeys.recs });
        }

        /**
         * Update the `follow` value on the cached podcast object.
         * This is not entirely necessary, but is an optimistic approach in the scenario that something is reading the follow status of a
         * podcast object from the `usePodcastQuery` instead of `useFollowingPodcast`.
         */
        queryClient.setQueryData(
          podcastKeys.one(podcastId),
          (podcast: Podcast) => ({
            ...podcast,
            follow: data,
            followDate: Date.now(),
          }),
        );

        addToast({
          kind: 'success',
          text: message,
          actions:
            location?.pathname !== $path('/library/podcasts') ?
              [
                {
                  kind: 'tertiary',
                  color: 'gray',
                  content: 'Go to Library',
                  textColor: vars.color.gray600,
                  size: { xsmall: 'small', medium: 'large' },
                  href: $path('/library/podcasts'),
                },
              ]
            : [],
        });
      }
    },
  });

  const unfollowMutation = useMutation({
    mutationFn: async ({ podcastId }: { podcastId: number | string }) => {
      try {
        const { status } = await amp.api.v3.podcast.unfollowPodcast({
          params: { podcastId: Number(podcastId) },
        });
        return status !== 204;
      } catch {
        return undefined;
      }
    },

    onSuccess: async (data, { podcastId }) => {
      if (isNonNullish(data)) {
        const message =
          isMobile ? 'Unfollowed podcast' : `Unfollowed ${stationName}`;
        queryClient.setQueryData(podcastKeys.isFollowing(podcastId), data);
        const followedPodcasts = await getQueryDataFollowedPodcasts({
          queryClient,
        });

        const unfollowedPodcast = await getQueryDataPodcast({
          podcastId,
          queryClient,
        });

        if (followedPodcasts && unfollowedPodcast) {
          queryClient.setQueryData<InfiniteData<GetFollowedPodcasts, number>>(
            podcastKeys.followed,
            oldData => {
              if (oldData) {
                return produce(oldData, draft => {
                  return {
                    ...draft,
                    pages: draft?.pages.map(page => ({
                      ...page,
                      podcasts: page.podcasts.filter(
                        podcast => podcast.id !== unfollowedPodcast.id,
                      ),
                    })),
                  };
                });
              }
              return oldData;
            },
          );
        } else {
          await queryClient.invalidateQueries({
            queryKey: podcastKeys.followed,
          });
        }

        /**
         * Update the `follow` value on the cached podcast object.
         * This is not entirely necessary, but is an optimistic approach in the scenario that something is reading the follow status of a
         * podcast object from the `usePodcastQuery` instead of `useFollowingPodcast`.
         */
        queryClient.setQueryData(
          podcastKeys.one(podcastId),
          (podcast: Podcast) => ({
            ...podcast,
            follow: data,
          }),
        );

        await queryClient.invalidateQueries({ queryKey: podcastKeys.recs });

        addToast({
          kind: 'success',
          text: message,
        });
      }
    },
  });

  return { follow: followMutation.mutate, unfollow: unfollowMutation.mutate };
}
