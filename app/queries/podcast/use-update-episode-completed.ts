import { useQueryClient } from '@tanstack/react-query';

import { podcastKeys } from './constants';
import type { PodcastEpisode } from './types';

export const useUpdateEpisodeCompleted = () => {
  const queryClient = useQueryClient();

  const updateEpisodeCompleted = ({
    completed,
    episodeId,
  }: {
    completed: boolean;
    episodeId: number;
  }) => {
    queryClient.setQueryData<PodcastEpisode>(
      podcastKeys.oneEpisode(episodeId),
      oldEpisode => {
        if (oldEpisode) {
          return {
            ...oldEpisode,
            completed,
          };
        }
      },
    );
  };

  return { updateEpisodeCompleted };
};
