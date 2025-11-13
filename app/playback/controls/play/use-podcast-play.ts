import * as Playback from '@iheartradio/web.playback';

import { usePlay } from './use-play';

export type UsePodcastPlayProps = Omit<
  Playback.PodcastStation,
  'type' | 'targeting'
>;

export function usePodcastPlay(props: UsePodcastPlayProps) {
  const play = usePlay({
    ...props,
    type: Playback.StationType.Podcast,
  });

  return play;
}
