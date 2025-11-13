import { Button } from '@iheartradio/web.accomplice/components/button';
import { Flex } from '@iheartradio/web.accomplice/components/flex';
import type { IconProps } from '@iheartradio/web.accomplice/components/icon';
import { PlayerTooltip } from '@iheartradio/web.accomplice/components/player';
import { Forward30 as Forward30Icon } from '@iheartradio/web.accomplice/icons/forward30';

import { playback } from '../playback';

export function Forward30({
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

  return (
    <PlayerTooltip content="Forward 30 Seconds">
      <Flex
        isHidden={
          isInMiniplayer ? { mobile: true, 'container-medium': false } : false
        }
      >
        <Button
          color="default"
          data-test="forward-30-player-button"
          isDisabled={adBreak || isDisabled}
          kind="tertiary"
          onPress={() => {
            player.fastForward(30);
          }}
          size="icon"
        >
          <Forward30Icon size={size ?? 32} />
        </Button>
      </Flex>
    </PlayerTooltip>
  );
}
