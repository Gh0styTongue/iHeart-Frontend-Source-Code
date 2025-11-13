import type { PlayerVolumeProps } from '@iheartradio/web.accomplice/components/player';
import { PlayerVolume } from '@iheartradio/web.accomplice/components/player';

import { playback } from '../playback';

export function Volume(props: PlayerVolumeProps) {
  const player = playback.usePlayer();
  const { muted, volume } = playback.useState();

  return (
    <PlayerVolume
      isHidden={{ mobile: true, 'container-large': false }}
      muted={muted}
      onChangeEnd={value => {
        player.setVolume(value);
      }}
      onMutedChange={isMuted => {
        player.setMute(isMuted);
      }}
      volume={volume}
      {...props}
    />
  );
}
