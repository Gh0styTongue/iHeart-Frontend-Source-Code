import type { QueryClient } from '@tanstack/react-query';
import { useQuery } from '@tanstack/react-query';

import { amp } from '~app/api/amp-client';

import { liveStationKeys } from './constants';

const getLiveStation = async (stationId: number | string) => {
  const { body } = await amp.api.v3.livemeta.getStationMeta({
    params: { stationId: Number(stationId) },
  });

  return body;
};

export function useQueryLiveStation(stationId: number | string) {
  const result = useQuery({
    queryKey: liveStationKeys.one(stationId),
    queryFn: async () => await getLiveStation(stationId),
  });

  return result.data;
}

export async function getQueryDataLiveStation({
  stationId,
  queryClient,
}: {
  stationId: number | string;
  queryClient: QueryClient;
}) {
  return await queryClient.ensureQueryData({
    queryKey: liveStationKeys.one(stationId),
    queryFn: async () => await getLiveStation(stationId),
  });
}
