import type { QueryClient } from '@tanstack/react-query';
import { useQuery } from '@tanstack/react-query';
import { isNonNullish, prop } from 'remeda';

import { amp } from '~app/api/amp-client';

import { podcastKeys } from './constants';

const getPodcast = async (podcastId: number | string) =>
  await amp.api.v3.podcast
    .getPodcast({
      params: { id: podcastId },
    })
    .then(prop('body'));

export function useQueryPodcast(podcastId: number | string) {
  const { profileId } = amp.getConfig();

  return useQuery({
    enabled: isNonNullish(profileId),
    queryKey: podcastKeys.one(podcastId),
    queryFn: async () => await getPodcast(podcastId),
  });
}

export async function getQueryDataPodcast({
  podcastId,
  queryClient,
}: {
  podcastId: number | string;
  queryClient: QueryClient;
}) {
  return await queryClient.ensureQueryData({
    queryKey: podcastKeys.one(podcastId),
    queryFn: async () => await getPodcast(podcastId),
  });
}
