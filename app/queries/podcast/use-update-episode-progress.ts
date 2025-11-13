import { useQueryClient } from '@tanstack/react-query';

import { podcastKeys } from './constants';
import type { PodcastEpisode } from './types';

export const useUpdateEpisodeProgress = () => {
  const queryClient = useQueryClient();

  const updateEpisodeProgress = ({
    episodeId,
    secondsPlayed,
  }: {
    episodeId: number;
    secondsPlayed: number;
  }) => {
    return queryClient.setQueryData<PodcastEpisode>(
      podcastKeys.oneEpisode(episodeId),
      oldEpisode => {
        if (oldEpisode) {
          return {
            ...oldEpisode,
            secondsPlayed,
          };
        }
      },
    );
  };

  return { updateEpisodeProgress };
};
