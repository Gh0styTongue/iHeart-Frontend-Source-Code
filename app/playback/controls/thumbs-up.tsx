import { Button } from '@iheartradio/web.accomplice/components/button';
import { PlayerTooltip } from '@iheartradio/web.accomplice/components/player';
import { ThumbUpFilled } from '@iheartradio/web.accomplice/icons/thumb-up-filled';
import { ThumbUpOutline } from '@iheartradio/web.accomplice/icons/thumb-up-outline';

import { ThumbStatus } from '~app/contexts/thumbs/thumbs';

import type { ThumbsControlProps } from './thumbs';

export const ThumbsUp = ({
  css,
  isPressed,
  onPress,
  isDisabled,
  size,
}: ThumbsControlProps) => {
  return (
    <PlayerTooltip content="Thumbs Up">
      <Button
        color="default"
        css={css}
        data-test="thumbs-up-button"
        isDisabled={isDisabled}
        kind="tertiary"
        onPress={() => onPress(ThumbStatus.Up)}
        size="icon"
      >
        {isPressed && !isDisabled ?
          <ThumbUpFilled size={size} />
        : <ThumbUpOutline size={size} />}
      </Button>
    </PlayerTooltip>
  );
};
