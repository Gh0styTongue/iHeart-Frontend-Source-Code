import * as Playback from '@iheartradio/web.playback';
import { useCallback, useMemo } from 'react';

import {
  AdsTargetingState,
  useTargetingReady,
} from '~app/contexts/monetization';
import { useUser } from '~app/contexts/user';
import { isPremiumUser } from '~app/utilities/user';

import { playback } from '../../playback';
import type { DoPlayProps } from './use-play';
import { usePlay } from './use-play';

export type UsePlaylistPlayProps = Omit<
  Playback.PlaylistRadioStation | Playback.PlaylistStation,
  'targeting'
> & { itemId?: string | number | null };

export function usePlaylistPlay(props: UsePlaylistPlayProps) {
  const isPremium = isPremiumUser(useUser());
  const player = playback.usePlayer();
  const checkReadyToLoad = useTargetingReady();

  const type = useMemo(
    () =>
      isPremium ?
        Playback.StationType.Playlist
      : Playback.StationType.PlaylistRadio,
    [isPremium],
  );

  const doLoadAndPlay = useCallback(async () => {
    await player.load({
      ...props,
      type,
      targeting: AdsTargetingState.get('targetingParams'),
    });
    await player.play();
  }, [player, props, type]);

  const play = usePlay({
    ...props,
    type,
  });

  const doCheck = useCallback(
    function doCheck(doPlayProps?: DoPlayProps) {
      globalThis.window.setTimeout(() => {
        if (checkReadyToLoad()) {
          doLoadAndPlay();
          doPlayProps?.onPlay?.();
        } else {
          doCheck();
        }
      }, 100);
    },
    [checkReadyToLoad, doLoadAndPlay],
  );

  const doPlay = useCallback(
    function doPlay(doPlayProps?: DoPlayProps) {
      if (isPremium) {
        play.doPlay(doPlayProps);
        return;
      }

      if (checkReadyToLoad()) {
        doLoadAndPlay();
        doPlayProps?.onPlay?.();
      } else {
        doCheck(doPlayProps);
      }
    },
    [checkReadyToLoad, doCheck, doLoadAndPlay, isPremium, play],
  );

  return { ...play, doPlay } as const;
}
