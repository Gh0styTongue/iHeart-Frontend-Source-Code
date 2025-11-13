import * as Playback from '@iheartradio/web.playback';

import { useUser } from '~app/contexts/user';
import { isPremiumUser } from '~app/utilities/user';

import { usePlay } from './use-play';

export type UseArtistPlayProps = Omit<
  Playback.ArtistStation,
  'type' | 'targeting'
>;

export function useArtistPlay(props: UseArtistPlayProps) {
  const isPremium = isPremiumUser(useUser());

  const play = usePlay({
    ...props,
    seed: isPremium ? props.seed : undefined,
    type: Playback.StationType.Artist,
  });

  return play;
}
