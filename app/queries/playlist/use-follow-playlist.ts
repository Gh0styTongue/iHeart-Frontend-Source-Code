import { vars } from '@iheartradio/web.accomplice';
import { addToast } from '@iheartradio/web.accomplice/components/toast';
import type { InfiniteData } from '@tanstack/react-query';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { produce } from 'immer';
import { useCallback } from 'react';
import { isNonNullish } from 'remeda';
import { $path } from 'safe-routes';

import { useInAppMessage } from '~app/analytics/in-app-message';
import { addRegGateToast } from '~app/analytics/reg-gate-toast';
import { amp, useAmpClient } from '~app/api/amp-client';
import { useIsMobile } from '~app/contexts/is-mobile';
import { useUser } from '~app/contexts/user';
import { useGetLoginUrl, useGetSignUpUrl } from '~app/hooks/auth-urls';
import { useGetPageName } from '~app/hooks/use-get-page-name';
import { getQueryDataFollowedPlaylists } from '~app/queries/playlist/use-query-followed-playlists';
import { getQueryDataPlaylist } from '~app/queries/playlist/use-query-playlist';
import type { AnalyticsLocationType } from '~app/utilities/constants';
import {
  ANALYTICS_ORIGIN,
  followUnfollowMessage,
  LIBRARY_AUTHENTICATION_MESSAGE,
  PAYLOAD_TRIGGER_TYPES,
  REG_GATE_TOAST_EXIT_TYPE,
  REG_GATE_TOAST_MESSAGE_TYPE,
} from '~app/utilities/constants';
import { RegGateAnonymousUserError } from '~app/utilities/errors';

import { playlistKeys } from './constants';
import type { FollowPlaylistKeys, GetFollowedPlaylists } from './types';

export function useFollowingPlaylist({
  id,
  userId,
}: {
  id: string;
  userId: string;
}) {
  const result = useQuery({
    queryKey: playlistKeys.isFollowing({ id, userId }),
    queryFn: async () => {
      const { status } = await amp.api.v3.collection.getFollowStatus({
        params: { id, userId },
        throwOnErrorStatus: false,
      });

      return status === 200 ? true : false;
    },
  });

  return result.data ?? false;
}

export function useFollowPlaylist({
  context,
  isOnProfilePage = false,
  stationId,
  stationName,
}: {
  context: AnalyticsLocationType;
  isOnProfilePage?: boolean;
  stationId?: string;
  stationName?: string;
}) {
  const queryClient = useQueryClient();
  const user = useUser();
  const { onInAppMessageExit, onInAppMessageOpen } = useInAppMessage();
  const pageName = useGetPageName();
  const getLoginUrl = useGetLoginUrl();
  const getSignUpUrl = useGetSignUpUrl();
  const amp = useAmpClient();
  const isMobile = useIsMobile();

  const onError = useCallback(
    async (error: Error) => {
      if (error instanceof RegGateAnonymousUserError) {
        const regGateContext = error.ctx;
        const followContext = error.getMeta('followContext');

        const loginUrl = getLoginUrl({ context: regGateContext });
        const signupUrl = getSignUpUrl({ context: regGateContext });

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
              href: signupUrl.toString(),
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
      }
    },
    [
      context,
      getLoginUrl,
      getSignUpUrl,
      isOnProfilePage,
      onInAppMessageExit,
      onInAppMessageOpen,
      pageName,
      stationId,
      stationName,
    ],
  );

  const followPlaylistMutation = useCallback(
    async ({ id, userId, followContext }: FollowPlaylistKeys) => {
      if (user.isAnonymous) {
        const regGateError = new RegGateAnonymousUserError({
          trigger: PAYLOAD_TRIGGER_TYPES.FOLLOW,
          origin: ANALYTICS_ORIGIN.LISTEN,
          pageName,
          location: followContext ?? context,
          ...(isOnProfilePage && stationId ?
            { assetId: stationId.toString() }
          : {}),
          ...(isOnProfilePage && stationName ? { assetName: stationName } : {}),
        });
        regGateError.addMeta('followContext', followContext);

        throw regGateError;
      } else {
        const { status } = await amp.api.v3.collection.followPlaylist({
          params: { id, userId },
          throwOnErrorStatus: false,
        });

        return status === 200;
      }
    },
    [
      amp.api.v3.collection,
      context,
      isOnProfilePage,
      pageName,
      stationId,
      stationName,
      user.isAnonymous,
    ],
  );

  const followPlaylistSuccess = useCallback(
    async (
      data: boolean,
      { id, userId }: { id: string; userId: string | number },
    ) => {
      if (isNonNullish(data)) {
        const textAddendum =
          (
            globalThis.window?.location.pathname ===
              '/library/playlists/created' ||
            globalThis.window?.location.pathname ===
              '/library/playlists/made-for-you'
          ) ?
            ' (hidden by your current filter)'
          : '';

        const message =
          isMobile ?
            `${followUnfollowMessage.followStationMobile}${textAddendum}`
          : `${stationName} ${followUnfollowMessage.followStationDesktop}${textAddendum}`;

        queryClient.setQueryData(
          playlistKeys.isFollowing({ id, userId }),
          data,
        );

        // Only optimistically insert followed playlist if we already have data for that query
        if (isNonNullish(queryClient.getQueryData(playlistKeys.followed))) {
          const followedPlaylists = await getQueryDataFollowedPlaylists({
            queryClient,
            userId: user.profileId,
          });

          const followedPlaylist = await getQueryDataPlaylist({
            id,
            userId,
            queryClient,
            amp,
          });

          if (followedPlaylists && followedPlaylist) {
            await queryClient.cancelQueries({
              queryKey: playlistKeys.followed,
            });
            const newFollowedPlaylists = produce(followedPlaylists, draft => {
              const lastPage = draft.pages.at(-1);
              if (lastPage) {
                lastPage.playlists.push(followedPlaylist);
              }
              return draft;
            });

            queryClient.setQueryData(
              playlistKeys.followed,
              () => newFollowedPlaylists,
            );
            queryClient.setQueryData(
              playlistKeys.followed,
              () => newFollowedPlaylists,
            );
          } else {
            await queryClient.invalidateQueries({
              queryKey: playlistKeys.followed,
            });
          }

          await queryClient.invalidateQueries({ queryKey: playlistKeys.recs });
        }

        addToast({
          kind: 'success',
          text: message,
          actions:
            (
              !globalThis.window?.location.pathname.startsWith(
                '/library/playlists',
              )
            ) ?
              [
                {
                  kind: 'tertiary',
                  color: 'gray',
                  content: 'Go to Library',
                  textColor: vars.color.gray600,
                  size: { xsmall: 'small', medium: 'large' },
                  href: $path('/library/playlists'),
                },
              ]
            : [],
        });
      }
    },
    [amp, isMobile, queryClient, stationName, user.profileId],
  );

  const followMutation = useMutation({
    mutationFn: followPlaylistMutation,
    onError,
    onSuccess: followPlaylistSuccess,
  });

  const unfollowPlaylistMutation = useCallback(
    async ({ id, userId }: FollowPlaylistKeys) => {
      const { status } = await amp.api.v3.collection.unfollowPlaylist({
        params: { id, userId },
        throwOnErrorStatus: false,
      });

      return status === 204;
    },
    [amp.api.v3.collection],
  );

  const unfollowPlaylistSuccess = useCallback(
    async (
      data: boolean,
      { id, userId }: { id: string; userId: string | number },
    ) => {
      if (isNonNullish(data)) {
        const message =
          isMobile ?
            followUnfollowMessage.unfollowStationMobile
          : `${stationName} ${followUnfollowMessage.unfollowStationDesktop}`;

        queryClient.setQueryData(
          playlistKeys.isFollowing({ id, userId }),
          !data,
        );

        const followedPlaylists = await getQueryDataFollowedPlaylists({
          queryClient,
          userId: user.profileId,
        });

        const unfollowedPlaylist = await getQueryDataPlaylist({
          id,
          userId,
          queryClient,
          amp,
        });

        if (followedPlaylists && unfollowedPlaylist) {
          await queryClient.cancelQueries({
            queryKey: playlistKeys.followed,
          });
          queryClient.setQueryData<
            InfiniteData<GetFollowedPlaylists, string | undefined>
          >(playlistKeys.followed, oldData => {
            if (oldData) {
              return produce(oldData, draft => {
                return {
                  ...draft,
                  pages: draft?.pages.map(page => ({
                    ...page,
                    playlists: page.playlists.filter(
                      playlist => playlist.id !== unfollowedPlaylist.id,
                    ),
                  })),
                };
              });
            }
            return oldData;
          });
        } else {
          await queryClient.invalidateQueries({
            queryKey: playlistKeys.followed,
          });
        }

        await queryClient.invalidateQueries({ queryKey: playlistKeys.recs });

        addToast({
          kind: 'success',
          text: message,
        });
      }
    },
    [amp, isMobile, queryClient, stationName, user.profileId],
  );

  const unfollowMutation = useMutation({
    mutationFn: unfollowPlaylistMutation,
    onSuccess: unfollowPlaylistSuccess,
    onError,
  });

  return { follow: followMutation.mutate, unfollow: unfollowMutation.mutate };
}
