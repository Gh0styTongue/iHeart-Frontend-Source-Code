import * as Playback from '@iheartradio/web.playback';

import { usePlay } from './use-play';

export type UseLivePlayProps = Omit<Playback.LiveStation, 'type' | 'targeting'>;

export function useLivePlay({ ...props }: UseLivePlayProps) {
  const play = usePlay({
    ...props,
    type: Playback.StationType.Live,
  });

  return play;
}
