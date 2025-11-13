import type { AmpClient } from '@iheartradio/web.api/amp';
import type { ServerTimingFunction } from '@iheartradio/web.server-timing';
import type { QueryClient } from '@tanstack/react-query';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import ms from 'ms';
import { isNonNullish, prop } from 'remeda';

import { useAmpClient } from '~app/api/amp-client';
import { useUser } from '~app/contexts/user';
import type { Collection } from '~app/queries/playlist/types';
import type { AnalyticsLocationType } from '~app/utilities/constants';

import { playlistKeys } from './constants';

type FollowPlaylistKeys = {
  id: string;
  userId: string | number;
  followContext?: AnalyticsLocationType;
  amp: AmpClient;
};

export const getPlaylist = async ({
  id,
  userId,
  time,
  amp,
}: FollowPlaylistKeys & { time?: ServerTimingFunction }) => {
  const fetchPlaylist = async () => {
    const profile = await amp.api.v3.collection
      .getCollection({
        params: { id, userId },
      })
      .then(prop('body'));

    profile.backfillTracks = profile.backfillTracks?.slice(0, 8);

    return profile;
  };

  return isNonNullish(time) ?
      time('fetchPlaylist', fetchPlaylist)
    : fetchPlaylist();
};

type UsePlaylistQuerySelect<T> = (data: Collection) => T | undefined;

export function useQueryPlaylist<T = Collection>({
  id,
  userId,
  select,
}: {
  id: string;
  userId: string | number;
  select?: UsePlaylistQuerySelect<T>;
}) {
  const amp = useAmpClient();

  return useQuery({
    queryKey: playlistKeys.one({ id, userId }),
    queryFn: async () => await getPlaylist({ amp, id, userId }),
    staleTime: ms('30m'),
    placeholderData: keepPreviousData,
    select,
  });
}

export async function getQueryDataPlaylist({
  id,
  userId,
  queryClient,
  amp,
  time,
}: {
  id: string;
  userId: string | number;
  queryClient: QueryClient;
  amp: AmpClient;
  time?: ServerTimingFunction;
}) {
  return await queryClient.ensureQueryData<Collection>({
    queryKey: playlistKeys.one({ id, userId }),
    queryFn: async () => await getPlaylist({ amp, id, userId, time }),
  });
}

const MY_PLAYLIST_ID = 'RDn4w1jgGhmnmkW24VGDVB'; // EVERY USER has the same "My Playlist" ID
export function useQueryMyPlaylist({ amp }: { amp: AmpClient }) {
  const user = useUser();
  return useQuery({
    queryKey: playlistKeys.myPlaylist,
    queryFn: async () => {
      return await amp.api.v3.collection
        .getCollection({
          params: {
            id: MY_PLAYLIST_ID,
            userId: String(user.profileId),
          },
        })
        .then(prop('body'));
    },
    retry: false,
  });
}
