import { useQuery } from '@tanstack/react-query';

import { amp } from '~app/api/amp-client';

import { artistKeys } from './constants';

export function useFollowingArtist(artistId: number | string) {
  const result = useQuery({
    queryKey: artistKeys.isFollowing(artistId),
    queryFn: async () => {
      const { status } = await amp.api.v3.profiles.getIsArtistFollowed({
        params: { artistId: Number(artistId) },
      });

      return status === 204;
    },
    retry: false,
  });

  return result.data ?? false;
}
