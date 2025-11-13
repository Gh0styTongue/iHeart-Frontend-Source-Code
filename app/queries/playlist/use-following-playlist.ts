import { useQuery } from '@tanstack/react-query';

import { amp } from '~app/api/amp-client';

import { playlistKeys } from './constants';

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

      return status === 200;
    },
  });

  return result.data ?? false;
}
