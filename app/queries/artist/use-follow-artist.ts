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
import {
  getQueryDataArtist,
  getQueryDataArtistStation,
} from '~app/queries/artist/use-artist-query';
import type { GetFollowedArtists } from '~app/queries/artist/use-query-followed-artists';
import { getQueryDataFollowedArtists } from '~app/queries/artist/use-query-followed-artists';
import type { AnalyticsLocationType } from '~app/utilities/constants';
import {
  ANALYTICS_ORIGIN,
  followUnfollowMessage,
  LIBRARY_AUTHENTICATION_MESSAGE,
  PAYLOAD_TRIGGER_TYPES,
  REG_GATE_TOAST_EXIT_TYPE,
  REG_GATE_TOAST_MESSAGE_TYPE,
} from '~app/utilities/constants';

import { artistKeys } from './constants';

export function useFollowArtist({
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
      artistId,
      followContext,
    }: {
      artistId: number | string;
      followContext?: AnalyticsLocationType;
    }) => {
      const regGateContext: RegGateContext = {
        trigger: PAYLOAD_TRIGGER_TYPES.FOLLOW,
        origin: ANALYTICS_ORIGIN.LISTEN,
        pageName,
        location: followContext ?? context,
        ...(isOnProfilePage && stationId ?
          { assetId: stationId.toString() }
        : {}),
        ...(isOnProfilePage && stationName ? { assetName: stationName } : {}),
      };

      const loginUrl = getLoginUrl({ context: regGateContext });
      const signUpUrl = getSignUpUrl({ context: regGateContext });

      if (user.isAnonymous) {
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
          const { status, body } = await amp.api.v3.profiles.followArtist({
            body: { artistId: Number(artistId) },
          });

          const success = status === 204 || status === 201;
          const stationId = body?.stationId;

          return {
            success,
            stationId,
          };
        } catch {
          return {
            success: false,
            stationId: undefined,
          };
        }
      }
    },
    onSuccess: async (data, { artistId }) => {
      if (isNonNullish(data) && data.success) {
        const message =
          isMobile ?
            followUnfollowMessage.followStationMobile
          : `${stationName} ${followUnfollowMessage.followStationDesktop}`;
        queryClient.setQueryData(artistKeys.isFollowing(artistId), data);

        // Only optimistically insert the followed station if we already have data for that query
        if (isNonNullish(queryClient.getQueryData(artistKeys.followed))) {
          const followedArtists = await getQueryDataFollowedArtists({
            amp,
            queryClient,
          });

          const followedArtist = await getQueryDataArtist({
            artistId,
            queryClient,
          });

          const artistStation = await getQueryDataArtistStation({
            artistId,
            queryClient,
            profileId: user.profileId,
          });

          const followedStationId = data.stationId ?? artistStation.id;

          if (followedArtists && followedArtist && followedStationId) {
            const newFollowedArtists = produce(followedArtists, draft => {
              const lastPage = draft.pages.at(-1);
              if (lastPage) {
                lastPage.followedArtists.push({
                  stationId: followedStationId,
                  name: followedArtist.artist.name,
                  artistName: followedArtist.artist.name,
                  artistSeed: followedArtist.artist.artistId,
                  lastPlayed: artistStation.lastPlayed,
                });
              }
              return draft;
            });
            queryClient.setQueryData(
              artistKeys.followed,
              () => newFollowedArtists,
            );
          } else {
            await queryClient.invalidateQueries({
              queryKey: artistKeys.followed,
            });
          }

          await queryClient.invalidateQueries({ queryKey: artistKeys.recs });
        }

        addToast({
          kind: 'success',
          text: message,
          actions:
            (
              location?.pathname !==
              $path('/library/stations/:type', { type: 'artists' })
            ) ?
              [
                {
                  kind: 'tertiary',
                  color: 'gray',
                  content: 'Go to Library',
                  textColor: vars.color.gray600,
                  size: { xsmall: 'small', medium: 'large' },
                  href: $path('/library/stations/:type', { type: 'artists' }),
                },
              ]
            : [],
        });
      }
    },
  });

  const unfollowMutation = useMutation({
    mutationFn: async ({ artistId }: { artistId: number | string }) => {
      try {
        const { status } = await amp.api.v3.profiles.unfollowArtist({
          params: { artistId: Number(artistId) },
        });

        return status !== 204;
      } catch {
        return undefined;
      }
    },
    onSuccess: async (data, { artistId }) => {
      if (isNonNullish(data)) {
        const message =
          isMobile ?
            followUnfollowMessage.unfollowStationMobile
          : `${stationName} ${followUnfollowMessage.unfollowStationDesktop}`;
        queryClient.setQueryData(artistKeys.isFollowing(artistId), data);

        const followedArtists = await getQueryDataFollowedArtists({
          amp,
          queryClient,
        });

        const unfollowedArtist = await getQueryDataArtist({
          artistId,
          queryClient,
        });

        if (followedArtists && unfollowedArtist) {
          queryClient.setQueryData<InfiniteData<GetFollowedArtists, number>>(
            artistKeys.followed,
            oldData => {
              if (oldData) {
                return produce(oldData, draft => {
                  return {
                    ...draft,
                    pages: draft?.pages.map(page => ({
                      ...page,
                      followedArtists: page.followedArtists.filter(
                        artist =>
                          artist.artistSeed !==
                          unfollowedArtist.artist.artistId,
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
            queryKey: artistKeys.followed,
          });
        }

        await queryClient.invalidateQueries({ queryKey: artistKeys.recs });

        addToast({
          kind: 'success',
          text: message,
        });
      }
    },
  });

  return { follow: followMutation.mutate, unfollow: unfollowMutation.mutate };
}
