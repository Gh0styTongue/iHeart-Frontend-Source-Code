import { useQuery } from '@tanstack/react-query';

import { amp } from '~app/api/amp-client';

import { podcastKeys } from './constants';

export function useFollowingPodcast(podcastId: number | string) {
  const result = useQuery({
    queryKey: podcastKeys.isFollowing(podcastId),
    queryFn: async () => {
      const { status } = await amp.api.v3.podcast.getIsFollowingPodcast({
        params: { podcastId: Number(podcastId) },
      });

      return status === 200;
    },
  });

  return result.data ?? false;
}
