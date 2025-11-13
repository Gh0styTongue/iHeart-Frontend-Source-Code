import { useQuery } from '@tanstack/react-query';

import { amp } from '~app/api/amp-client';

import { liveStationKeys } from './constants';

export function useFollowingLiveStation(stationId: number | string) {
  const result = useQuery({
    queryKey: liveStationKeys.isFollowing(stationId),
    queryFn: async () => {
      const { status } = await amp.api.v3.profiles.getIsLiveStationFollowed({
        params: { liveStationId: Number(stationId) },
      });

      return status === 204;
    },
    retry: false,
  });

  return result.data ?? false;
}
