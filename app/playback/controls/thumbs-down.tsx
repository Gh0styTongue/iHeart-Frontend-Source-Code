import { Button } from '@iheartradio/web.accomplice/components/button';
import { PlayerTooltip } from '@iheartradio/web.accomplice/components/player';
import { ThumbDownFilled } from '@iheartradio/web.accomplice/icons/thumb-down-filled';
import { ThumbDownOutline } from '@iheartradio/web.accomplice/icons/thumb-down-outline';

import { ThumbStatus } from '~app/contexts/thumbs/thumbs';

import type { ThumbsControlProps } from './thumbs';

export const ThumbsDown = ({
  css,
  isPressed,
  onPress,
  isDisabled,
  size,
}: ThumbsControlProps) => {
  return (
    <PlayerTooltip content="Thumbs Down">
      <Button
        color="default"
        css={css}
        data-test="thumbs-down-button"
        isDisabled={isDisabled}
        kind="tertiary"
        onPress={() => onPress(ThumbStatus.Down)}
        size="icon"
      >
        {isPressed && !isDisabled ?
          <ThumbDownFilled size={size} />
        : <ThumbDownOutline size={size} />}
      </Button>
    </PlayerTooltip>
  );
};
