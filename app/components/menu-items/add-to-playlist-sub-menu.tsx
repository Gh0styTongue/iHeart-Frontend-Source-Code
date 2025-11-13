import {
  Menu,
  MenuItem,
  MenuPopover,
  SubmenuTrigger,
} from '@iheartradio/web.accomplice/components/menu';
import { Playlist } from '@iheartradio/web.accomplice/icons/playlist';
import type { AmpClient } from '@iheartradio/web.api/amp';
import { useMemo } from 'react';
import { useAsyncList } from 'react-stately';
import { isEmpty, prop } from 'remeda';

import { useAmpClient } from '~app/api/amp-client';
import type { PlaylistCollection } from '~app/api/types';
import { useUser } from '~app/contexts/user';
import type { UpdatedPlaylist } from '~app/queries/playlist/types';

import type { AddToPlaylistMenuProps } from './add-to-playlist-menu';
import { AddToPlaylistSubMenuItem } from './add-to-playlist-sub-menu-item';

export type AddToCollectionSubmitCallback = (
  playlist?: UpdatedPlaylist,
  error?: Error,
) => void;

export type AddToPlaylistMenuItemsProps = {
  albumId?: number;
  icon?: boolean;
  playlistId?: string;
  setDialog: AddToPlaylistMenuProps['setDialog'];
  setPlaylistTracks?: AddToPlaylistMenuProps['setPlaylistTracks'];
  tracks?: number[];
  triggerText?: string;
  playlistUserId?: string;
};

type AddToPlaylistMenuRow =
  | { type: 'create-playlist'; id: string }
  | { type: 'playlist'; data: PlaylistCollection; id: string; index: number };

const getCreatedPlaylists = async ({
  userId,
  cursor,
  signal,
  amp,
}: {
  userId: string;
  cursor?: string;
  signal?: AbortSignal;
  amp: AmpClient;
}) =>
  await amp.api.v3.collection
    .getCollections({
      params: { userId },
      query: {
        includePersonalized: false,
        playlistFilter: 'created',
        ...(cursor ? { pageKey: cursor } : {}),
      },
      fetchOptions: { signal },
    })
    .then(prop('body'));

export const AddToPlaylistSubMenu = (props: AddToPlaylistMenuItemsProps) => {
  const {
    albumId,
    icon,
    playlistId,
    setDialog,
    tracks,
    triggerText,
    playlistUserId,
    setPlaylistTracks,
  } = props;
  const user = useUser();
  const amp = useAmpClient();

  const list = useAsyncList<PlaylistCollection>({
    async load({ signal, cursor }) {
      const { data, links } = await getCreatedPlaylists({
        userId: String(user.profileId),
        signal,
        cursor,
        amp,
      });

      return {
        items: data.filter(playlist => playlist.id !== 'new4u') ?? [],
        cursor: links?.nextPageKey,
      };
    },
  });

  const items: Array<AddToPlaylistMenuRow> = useMemo(
    () => [
      { type: 'create-playlist', id: 'create-playlist' },
      ...list.items.map((item, index) => ({
        type: 'playlist' as const,
        data: item,
        id: `playlist-${item.id}`,
        index,
      })),
    ],
    [list.items],
  );

  if (isEmpty(triggerText)) {
    return (
      <>
        {items.length > 1 ?
          items.map(row => (
            <AddToPlaylistSubMenuItem
              albumId={albumId}
              key={row.id}
              playlistId={playlistId}
              playlistUserId={playlistUserId}
              row={row}
              setDialog={setDialog}
              setPlaylistTracks={setPlaylistTracks}
              tracks={tracks}
            />
          ))
        : null}
      </>
    );
  }

  return (
    <SubmenuTrigger data-test="add-to-playlist-sub-menu">
      {icon ?
        <MenuItem>
          <Playlist size={18} /> {triggerText}
        </MenuItem>
      : <MenuItem>{triggerText}</MenuItem>}
      <MenuPopover>
        <Menu<AddToPlaylistMenuRow> items={items}>
          {row => {
            return (
              <AddToPlaylistSubMenuItem
                albumId={albumId}
                playlistId={playlistId}
                playlistUserId={playlistUserId}
                row={row}
                setDialog={setDialog}
                setPlaylistTracks={setPlaylistTracks}
                tracks={tracks}
              />
            );
          }}
        </Menu>
      </MenuPopover>
    </SubmenuTrigger>
  );
};
