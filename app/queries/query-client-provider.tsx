import { StationType } from '@iheartradio/web.playback';
import {
  QueryClient,
  QueryClientProvider as TanstackQueryClientProvider,
} from '@tanstack/react-query';
import ms from 'ms';
import { type ReactNode, useEffect, useMemo } from 'react';

import { playback } from '~app/playback/playback';

import { useUpdateEpisodeCompleted, useUpdateEpisodeProgress } from './podcast';

declare global {
  interface Window {
    __TANSTACK_QUERY_CLIENT__: import('@tanstack/react-query').QueryClient;
  }
}

/**
 * @param suppressSubscriptions should be passed as `true` when this component is used directly in tests (otherwise the default is `false`)
 */
export function QueryClientProvider({
  children,
  suppressSubscriptions = false,
}: {
  children: ReactNode;
  suppressSubscriptions?: boolean;
}) {
  const queryClient = useMemo(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: ms('5m'),
          },
        },
      }),
    [],
  );

  useEffect(() => {
    window.__TANSTACK_QUERY_CLIENT__ = queryClient;
  }, [queryClient]);

  return (
    <TanstackQueryClientProvider client={queryClient}>
      {suppressSubscriptions ? null : <GlobalPlayerSubscriptions />}
      {children}
    </TanstackQueryClientProvider>
  );
}

function GlobalPlayerSubscriptions() {
  const player = playback.usePlayer();
  const { updateEpisodeProgress } = useUpdateEpisodeProgress();
  const { updateEpisodeCompleted } = useUpdateEpisodeCompleted();

  useEffect(
    () =>
      // @TODO: see if there's a way to subscribe specifically to podcast resolver 'setTime' and 'next'
      player.subscribe({
        // this is to update 'secondsPlayed' in a currently playing episode's query data
        setTime(_, { position }) {
          const { station, queue, index } = player.getState().deserialize();

          if (station.type === StationType.Podcast) {
            updateEpisodeProgress({
              episodeId: Number(queue[index].id),
              secondsPlayed: Math.floor(position),
            });
          }
        },
        // this is to update 'completed' in the previous episode's query data
        next() {
          const { station, queue, index } = player.getState().deserialize();

          if (station.type === StationType.Podcast) {
            const lastEpisode = queue[index - 1];
            // we only need to update if the last episode is completed
            if (lastEpisode.meta.completed === true) {
              updateEpisodeCompleted({
                completed: lastEpisode.meta.completed,
                episodeId: Number(lastEpisode.id),
              });
            }
          }
        },
      }),
    [player, updateEpisodeProgress, updateEpisodeCompleted],
  );

  return null;
}
