import { Button } from '@iheartradio/web.accomplice/components/button';
import { Flex } from '@iheartradio/web.accomplice/components/flex';
import {
  MenuContent,
  MenuItem,
  MenuTrigger,
} from '@iheartradio/web.accomplice/components/menu';
import { PlayerTooltip } from '@iheartradio/web.accomplice/components/player';
import { Text } from '@iheartradio/web.accomplice/components/text';
import * as Playback from '@iheartradio/web.playback';

import { playback } from '../playback';

export function PlaybackSpeed({
  isHidden,
  isInMiniPlayer = false,
}: {
  isHidden?: boolean;
  isInMiniPlayer?: boolean;
}) {
  const player = playback.usePlayer();
  const state = playback.useState();

  if (state.station?.type !== Playback.StationType.Podcast) {
    return null;
  }

  return (
    <MenuTrigger>
      <PlayerTooltip content="Change Playback Speed">
        <Flex
          isHidden={
            isInMiniPlayer ?
              (isHidden ?? { mobile: true, 'container-medium': false })
            : false
          }
        >
          <Button color="default" kind="tertiary" size="icon">
            <Flex
              alignItems="center"
              height="3.2rem"
              justifyContent="center"
              padding="$8 $0"
              textAlign="center"
              width="3.2rem"
            >
              <Text
                as="p"
                kind={{ mobile: 'caption-3', large: 'caption-1' }}
              >{`${state.speed}x`}</Text>
            </Flex>
          </Button>
        </Flex>
      </PlayerTooltip>
      <MenuContent>
        <MenuItem onAction={() => player.setSpeed(Playback.Speed.Slow)}>
          0.5x
        </MenuItem>
        <MenuItem onAction={() => player.setSpeed(Playback.Speed.Normal)}>
          1x
        </MenuItem>
        <MenuItem onAction={() => player.setSpeed(Playback.Speed.Fast)}>
          1.25x
        </MenuItem>
        <MenuItem onAction={() => player.setSpeed(Playback.Speed.Faster)}>
          1.5x
        </MenuItem>
        <MenuItem onAction={() => player.setSpeed(Playback.Speed.Fastest)}>
          2x
        </MenuItem>
      </MenuContent>
    </MenuTrigger>
  );
}
