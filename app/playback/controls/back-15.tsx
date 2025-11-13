import { Button } from '@iheartradio/web.accomplice/components/button';
import { Flex } from '@iheartradio/web.accomplice/components/flex';
import type { IconProps } from '@iheartradio/web.accomplice/components/icon';
import { PlayerTooltip } from '@iheartradio/web.accomplice/components/player';
import { Back15 as Back15Icon } from '@iheartradio/web.accomplice/icons/back15';

import { playback } from '../playback';

export function Back15({
  isDisabled,
  size,
  isInMiniplayer = false,
}: {
  isDisabled?: boolean;
  size?: IconProps['size'];
  isInMiniplayer?: boolean;
}) {
  const player = playback.usePlayer();
  const { adBreak } = playback.useAds();
  const time = playback.useTime();

  return (
    <PlayerTooltip content="Back 15 Seconds">
      <Flex
        isHidden={
          isInMiniplayer ? { mobile: true, 'container-medium': false } : false
        }
      >
        <Button
          color="default"
          data-test="back-15-player-button"
          isDisabled={adBreak || isDisabled}
          kind="tertiary"
          onPress={() => {
            if (time.position <= 15) {
              player.seek(0);
            } else {
              player.rewind(15);
            }
          }}
          size="icon"
        >
          <Back15Icon size={size ?? 32} />
        </Button>
      </Flex>
    </PlayerTooltip>
  );
}
