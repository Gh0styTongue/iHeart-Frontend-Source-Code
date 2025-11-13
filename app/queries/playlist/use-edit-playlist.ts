import { vars } from '@iheartradio/web.accomplice';
import { addToast } from '@iheartradio/web.accomplice/components/toast';
import type { GetCollection } from '@iheartradio/web.api/amp';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';
import { prop } from 'remeda';
import { $path } from 'safe-routes';

import { useInAppMessage } from '~app/analytics/in-app-message';
import { addRegGateToast } from '~app/analytics/reg-gate-toast';
import { useAmpClient } from '~app/api/amp-client';
import { useUser } from '~app/contexts/user';
import { useGetLoginUrl, useGetSignUpUrl } from '~app/hooks/auth-urls';
import { useGetPageName } from '~app/hooks/use-get-page-name';
import type { AddToPlaylistMutationKeys } from '~app/queries/playlist/types';
import { AddToPlaylistMutationSchema } from '~app/queries/playlist/types';
import {
  ANALYTICS_LOCATION,
  ANALYTICS_ORIGIN,
  LIBRARY_AUTHENTICATION_MESSAGE,
  PAYLOAD_TRIGGER_TYPES,
  REG_GATE_TOAST_EXIT_TYPE,
  REG_GATE_TOAST_MESSAGE_TYPE,
} from '~app/utilities/constants';
import { RegGateAnonymousUserError } from '~app/utilities/errors';
import { isPremiumUser } from '~app/utilities/user';

import { playlistKeys } from './constants';

export function useEditPlaylist(options?: {
  onSuccess?: (data: GetCollection) => void;
  onError?: (error: Error) => void;
}) {
  const queryClient = useQueryClient();
  const user = useUser();
  const pageName = useGetPageName();
  const getLoginUrl = useGetLoginUrl();
  const getSignUpUrl = useGetSignUpUrl();
  const { onInAppMessageExit, onInAppMessageOpen } = useInAppMessage();
  const amp = useAmpClient();

  const onEditPlaylistError = useCallback(
    async (error: Error) => {
      if (error instanceof RegGateAnonymousUserError) {
        const regGateContext = error.ctx;

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
          location: ANALYTICS_LOCATION.OVERFLOW_MENU,
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
        addToast({
          text: error.message,
          kind: 'error',
        });
      }

      options?.onError?.(error);
    },
    [
      getLoginUrl,
      getSignUpUrl,
      onInAppMessageExit,
      onInAppMessageOpen,
      pageName,
      options,
    ],
  );

  const addTracksMutation = useCallback(
    async (props: AddToPlaylistMutationKeys) => {
      const parsedProps = AddToPlaylistMutationSchema.parse(props);
      switch (parsedProps.intent) {
        case 'byTracks': {
          const { collectionId, tracks } = parsedProps;

          return amp.api.v3.collection
            .addTracksToCollection({
              params: { id: collectionId, userId: user.profileId },
              body: { tracks },
            })
            .then(prop('body'))
            .then(prop('data'));
        }
        case 'byAlbum': {
          const { collectionId, albumId } = parsedProps;

          const tracks = await amp.api.v3.catalog
            .getAlbum({
              params: { id: albumId },
            })
            .then(prop('body'))
            .then(prop('tracks'))
            .then(tracks => tracks.map(track => track.id));

          return amp.api.v3.collection
            .addTracksToCollection({
              params: { id: collectionId, userId: user.profileId },
              body: { tracks },
            })
            .then(prop('body'))
            .then(prop('data'));
        }
        case 'byCollection': {
          const { collectionId, sourceCollectionId, playlistUserId } =
            parsedProps;

          const tracks = await amp.api.v3.collection
            .getCollection({
              params: {
                id: sourceCollectionId,
                userId: playlistUserId,
              },
            })
            .then(prop('body'))
            .then(prop('tracks'))
            .then(tracks => tracks.map(track => track.trackId));

          return amp.api.v3.collection
            .addTracksToCollection({
              params: { id: collectionId, userId: user.profileId },
              body: {
                tracks: isPremiumUser(user) ? tracks : [...new Set(tracks)],
              },
            })
            .then(prop('body'))
            .then(prop('data'));
        }
      }
    },
    [amp.api.v3.catalog, amp.api.v3.collection, user],
  );

  const onAddTracksSuccess = useCallback(
    async (data: GetCollection) => {
      if (data && data.id) {
        queryClient.setQueryData<GetCollection>(
          playlistKeys.one({
            id: data.id,
            userId: String(user.profileId),
          }),
          (playlist: GetCollection | undefined) => {
            if (playlist) {
              const trackSet = new Set([
                ...playlist.tracks.map(track => track.trackId),
                ...data.tracks.map(track => track.trackId),
              ]);
              return {
                ...playlist,
                tracks: data.tracks,
                backfillTracks: [
                  ...(playlist.backfillTracks ?? []),
                  ...(data.backfillTracks ?? []),
                ]
                  .filter(trackId => !trackSet.has(trackId))
                  .slice(0, 8),
              };
            }
          },
        );
        options?.onSuccess?.(data);
      }
    },
    [options, queryClient, user.profileId],
  );

  const addToPlaylistMutation = useMutation({
    mutationFn: addTracksMutation,
    onSuccess: onAddTracksSuccess,
    onError: onEditPlaylistError,
  });

  const renamePlaylistMutation = useCallback(
    async ({ collectionId, name }: { collectionId: string; name: string }) => {
      if (user.isAnonymous) {
        throw new RegGateAnonymousUserError({
          trigger: PAYLOAD_TRIGGER_TYPES.FOLLOW,
          origin: ANALYTICS_ORIGIN.LISTEN,
          pageName,
        });
      } else {
        return amp.api.v3.collection
          .putUpdateCollection({
            params: { userId: user.profileId, id: collectionId },
            body: { name },
          })
          .then(prop('body'))
          .then(prop('data'));
      }
    },
    [amp.api.v3.collection, user.isAnonymous, user.profileId, pageName],
  );

  const onRenamePlaylistSuccess = useCallback(
    async (data: GetCollection) => {
      if (data && data.id) {
        queryClient.invalidateQueries({ queryKey: playlistKeys.followed });
        queryClient.setQueryData<GetCollection>(
          playlistKeys.one({
            id: data.id,
            userId: String(user.profileId),
          }),
          (playlist: GetCollection | undefined) => {
            if (playlist) {
              return {
                ...playlist,
                ...data,
              };
            }
          },
        );
        // If we've successfully renamed the playlist and we're in the browser...
        if (globalThis.window) {
          const newUrl = new URL(globalThis.window.location.href);
          // ...and we're on the playlist profile page...
          if (newUrl.pathname.includes(data.id)) {
            // ...replace the history entry with the new url so the user won't get a 404 if they
            // refresh the browser immediately (for some reason 🤷🏼‍♂️)
            newUrl.pathname = $path('/playlist/:playlistSlug', {
              playlistSlug: `${data.slug}-${data.userId}-${data.id}`,
            });
            globalThis.window.history.replaceState(null, '', newUrl);
          }
        }
      }
    },
    [queryClient, user.profileId],
  );

  const renameMutation = useMutation({
    mutationFn: renamePlaylistMutation,
    onError: onEditPlaylistError,
    onSuccess: onRenamePlaylistSuccess,
  });

  const removeTracksMutation = useCallback(
    async ({
      collectionId,
      trackIds,
    }: {
      collectionId: string;
      trackIds: string[];
    }) => {
      if (user?.isAnonymous) {
        throw new RegGateAnonymousUserError({
          trigger: PAYLOAD_TRIGGER_TYPES.FOLLOW,
          origin: ANALYTICS_ORIGIN.LISTEN,
          pageName,
          location: ANALYTICS_LOCATION.OVERFLOW_MENU,
        });
      } else {
        await amp.api.v3.collection.removeTracksFromCollection({
          params: { id: collectionId, userId: user.profileId },
          body: { tracks: trackIds },
        });

        return trackIds;
      }
    },
    [amp.api.v3.collection, pageName, user?.isAnonymous, user.profileId],
  );

  const onRemoveTracksSuccess = useCallback(
    async (
      removedTrackIds: string[],
      { collectionId }: { collectionId: string },
    ) => {
      queryClient.setQueryData<GetCollection>(
        playlistKeys.one({
          id: collectionId,
          userId: user.profileId,
        }),
        playlist => {
          if (playlist && removedTrackIds) {
            addToast({
              kind: 'success',
              text: 'Removed from Playlist',
            });
            return {
              ...playlist,
              tracks: playlist.tracks.filter(
                track => !removedTrackIds.includes(track.id),
              ),
            };
          }
        },
      );
    },
    [queryClient, user.profileId],
  );

  const removeMutation = useMutation({
    mutationFn: removeTracksMutation,
    onSuccess: onRemoveTracksSuccess,
    onError: onEditPlaylistError,
  });

  return {
    rename: renameMutation,
    addToPlaylist: addToPlaylistMutation,
    removeFromPlaylist: removeMutation,
  };
}
