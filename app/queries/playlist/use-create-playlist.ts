import { vars } from '@iheartradio/web.accomplice';
import { addToast } from '@iheartradio/web.accomplice/components/toast';
import type { GetCollection } from '@iheartradio/web.api/amp';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';
import { useNavigate } from 'react-router';
import { isNonNullish, prop } from 'remeda';

import { useAmpClient } from '~app/api/amp-client';
import { useUser } from '~app/contexts/user';
import type { CreatePlaylistKeys } from '~app/queries/playlist/types';
import { buildPlaylistUrl } from '~app/utilities/urls';

import { playlistKeys } from './constants';

export function useCreatePlaylist() {
  const queryClient = useQueryClient();
  const user = useUser();
  const navigate = useNavigate();
  const amp = useAmpClient();

  const createPlaylistMutation = useCallback(
    async ({ name, tracks = [], albumId }: CreatePlaylistKeys) => {
      const trackIds =
        isNonNullish(albumId) ?
          await amp.api.v3.catalog
            .getAlbum({
              params: { id: albumId },
            })
            .then(prop('body'))
            .then(prop('tracks'))
            .then(tracks => tracks.map(track => track.id))
        : tracks;

      return await amp.api.v3.collection
        .postCreateCollection({
          params: { userId: user.profileId },
          body: {
            name,
            tracks: trackIds,
          },
        })
        .then(prop('body'))
        .then(prop('data'));
    },
    [amp.api.v3.catalog, amp.api.v3.collection, user.profileId],
  );

  const createPlaylistSuccess = useCallback(
    async (data: GetCollection) => {
      if (isNonNullish(data)) {
        queryClient.setQueryData(
          playlistKeys.isFollowing({
            id: data.id,
            userId: String(user.profileId),
          }),
          true,
        );
        queryClient.invalidateQueries({ queryKey: playlistKeys.followed });
        queryClient.invalidateQueries({ queryKey: playlistKeys.recs });

        addToast({
          kind: 'success',
          text: 'Playlist created',
          actions: [
            {
              kind: 'tertiary',
              color: 'gray',
              content: 'Go to playlist',
              size: 'large',
              textColor: vars.color.gray600,
              onPress: () => {
                const url = buildPlaylistUrl(data);
                if (url) {
                  navigate(url);
                }
              },
            },
          ],
        });
      }
    },
    [navigate, queryClient, user.profileId],
  );

  return useMutation({
    mutationFn: createPlaylistMutation,
    onSuccess: createPlaylistSuccess,
  });
}
