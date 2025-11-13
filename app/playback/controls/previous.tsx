// import { SubscriptionType } from '@iheartradio/web.config';
// import { useUser } from '~app/contexts/user';
import { Button } from '@iheartradio/web.accomplice/components/button';
import { Flex } from '@iheartradio/web.accomplice/components/flex';
import type { IconProps } from '@iheartradio/web.accomplice/components/icon';
import { PlayerTooltip } from '@iheartradio/web.accomplice/components/player';
import { SkipBack } from '@iheartradio/web.accomplice/icons/skip-back';
import * as Playback from '@iheartradio/web.playback';
import { useCallback } from 'react';

import { playback } from '../playback';

const PREVIOUS_THRESHOLD = 2;
const PREVIOUS_THRESHOLD_FOR_PODCASTS = 6;

export function Previous({
  disabled,
  size,
  isInMiniplayer = false,
}: {
  disabled?: boolean;
  size?: IconProps['size'];
  isInMiniplayer?: boolean;
}) {
  const player = playback.usePlayer();
  const state = playback.useState();
  const time = playback.useTime();
  const { adBreak } = playback.useAds();

  // const toast = useToast();
  // const user = useUser();

  const isPodcast = state.station?.type === Playback.StationType.Podcast;

  const isDisabled = adBreak || disabled;

  const previous = useCallback(() => {
    // IF podcast episode progess is greater than 6 seconds,
    // OR any other content progess is greater than 2 seconds,
    // THEN return to the beginning of the episode/song
    if (
      (isPodcast && time.position >= PREVIOUS_THRESHOLD_FOR_PODCASTS) ||
      (!isPodcast && time.position >= PREVIOUS_THRESHOLD)
    ) {
      player.seek(0);
      return;
    }

    // TODO: Implement skipping logic
    // if (
    //   (state.skipsRemaining <= 0 && user?.subscription.type === SubscriptionType.FREE) ||
    //   user?.subscription.type === SubscriptionType.NONE
    // ) {
    //   toast(<Notification kind="error">You have reached your skip limit.</Notification>);
    //   return;
    // }

    player.previous();
  }, [isPodcast, player, time.position]);

  return (
    <PlayerTooltip content="Previous">
      <Flex
        isHidden={
          isInMiniplayer ? { mobile: true, 'container-medium': false } : false
        }
      >
        <Button
          color="default"
          data-test="previous-player-button"
          isDisabled={isDisabled || (isPodcast && state.station.isFirstEpisode)}
          kind="tertiary"
          onPress={() => {
            previous();
          }}
          size="icon"
        >
          <SkipBack size={size ?? 32} />
        </Button>
      </Flex>
    </PlayerTooltip>
  );
}
