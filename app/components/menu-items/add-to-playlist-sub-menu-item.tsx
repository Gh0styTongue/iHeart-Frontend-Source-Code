import { vars } from '@iheartradio/web.accomplice';
import {
  MenuItem,
  MenuSeparator,
} from '@iheartradio/web.accomplice/components/menu';
import { addToast } from '@iheartradio/web.accomplice/components/toast';
import { Plus } from '@iheartradio/web.accomplice/icons/plus';
import type { GetCollection } from '@iheartradio/web.api/amp';
import { useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { isNonNullish } from 'remeda';

import type { PlaylistCollection } from '~app/api/types';
import { useEditPlaylist, useQueryPlaylist } from '~app/queries/playlist';
import type {
  AddToPlaylistIntent,
  UpdatedPlaylist,
} from '~app/queries/playlist/types';
import { PlaylistDialogActions } from '~app/utilities/constants';
import { buildPlaylistUrl } from '~app/utilities/urls';

import type { AddToPlaylistMenuProps } from './add-to-playlist-menu';

export type AddToCollectionSubmitCallback = (
  playlist?: UpdatedPlaylist,
  error?: Error,
) => void;

type AddToPlaylistMenuRow =
  | { type: 'create-playlist'; id: string }
  | { type: 'playlist'; data: PlaylistCollection; id: string; index: number };

export type AddToPlaylistMenuItemsProps = {
  albumId?: number;
  icon?: boolean;
  playlistId?: string;
  setDialog: AddToPlaylistMenuProps['setDialog'];
  setPlaylistTracks?: AddToPlaylistMenuProps['setPlaylistTracks'];
  tracks?: number[];
  triggerText?: string;
  playlistUserId?: string;
  row: AddToPlaylistMenuRow;
};

export const AddToPlaylistSubMenuItem = (
  props: AddToPlaylistMenuItemsProps,
) => {
  const {
    albumId,
    playlistId,
    setDialog,
    tracks,
    playlistUserId,
    setPlaylistTracks,
    row,
  } = props;
  const navigate = useNavigate();
  const location = useLocation();

  const playlist = useQueryPlaylist({
    id: playlistId!,
    userId: playlistUserId!,
  });

  const successAddingToPlaylist = useCallback(
    (data: GetCollection) => {
      const navigateTo = buildPlaylistUrl(data);
      const showButton =
        isNonNullish(navigateTo) && navigateTo !== location.pathname;

      addToast({
        kind: 'success',
        text: `Added to ${data.name}`,
        ...(showButton ?
          {
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
          }
        : {}),
      });
      setDialog?.(null);
    },
    [navigate, setDialog, location.pathname],
  );

  const errorAddingToPlaylist = useCallback(
    (error: Error) => {
      addToast({
        kind: 'error',
        title: `Error adding to playlist`,
        text: error.message,
      });
      setDialog?.(null);
    },
    [setDialog],
  );

  const { addToPlaylist } = useEditPlaylist({
    onError: errorAddingToPlaylist,
    onSuccess: successAddingToPlaylist,
  });
  const { mutate: addTracks } = addToPlaylist;

  const submitAddToPlaylist = useCallback(
    ({ collectionId }: { collectionId: string }) => {
      const intent: AddToPlaylistIntent | undefined =
        (tracks?.length ?? 0) > 0 ? 'byTracks'
        : isNonNullish(albumId) ? 'byAlbum'
        : isNonNullish(playlistId) ? 'byCollection'
        : undefined;

      if (intent) {
        switch (intent) {
          case 'byTracks': {
            return addTracks({
              intent,
              tracks: tracks!,
              collectionId,
            });
          }
          case 'byAlbum': {
            return addTracks({
              intent,
              albumId: albumId!,
              collectionId,
            });
          }
          case 'byCollection': {
            return addTracks({
              intent,
              sourceCollectionId: playlistId!,
              collectionId,
              playlistUserId: playlistUserId!,
            });
          }
        }
      }
    },
    [addTracks, albumId, playlistId, tracks, playlistUserId],
  );

  return (
    <>
      {row.type === 'create-playlist' ?
        <>
          <MenuItem
            data-test="create-playlist-menu-item"
            onAction={() => {
              // Here we query for the tracks, and map them into a tracks array.
              // This gives the dialog access to the tracks to add to the new playlist.
              const playlistTracks =
                playlist?.data?.tracks.map(track => track.trackId) ?? [];

              setDialog(PlaylistDialogActions.Create);
              setPlaylistTracks?.(playlistTracks);
            }}
          >
            <Plus />
            Create new playlist
          </MenuItem>
          <MenuSeparator />
        </>
      : row.type === 'playlist' ?
        <MenuItem
          data-test="playlist-menu-item"
          onAction={() => {
            submitAddToPlaylist({ collectionId: row.data.id });
          }}
        >
          {row.data.name}
        </MenuItem>
      : null}
    </>
  );
};
