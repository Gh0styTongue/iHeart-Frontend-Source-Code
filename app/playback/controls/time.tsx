import { vars } from '@iheartradio/web.accomplice';
import { Badge } from '@iheartradio/web.accomplice/components/badge';
import { Box } from '@iheartradio/web.accomplice/components/box';
import { Flex } from '@iheartradio/web.accomplice/components/flex';
import { Grid } from '@iheartradio/web.accomplice/components/grid';
import type { PlayerTimeControlProps } from '@iheartradio/web.accomplice/components/player';
import { PlayerTimeControl } from '@iheartradio/web.accomplice/components/player';
import { Slider } from '@iheartradio/web.accomplice/components/slider';
import * as Playback from '@iheartradio/web.playback';
import { useDebounceCallback } from 'usehooks-ts';

import { useUser } from '~app/contexts/user';
import { isPremiumUser } from '~app/utilities/user';

import { playback } from '../playback';

export function Time({
  showSliderWithBadge,
}: {
  showSliderWithBadge?: boolean;
}) {
  const player = playback.usePlayer();
  const { adBreak } = playback.useAds();
  const time = playback.useTime();
  const isPremium = isPremiumUser(useUser());
  const { isScanning, station, status } = playback.useState();
  const isLiveStation = station?.type === Playback.StationType.Live;
  const isScanStation = station?.type === Playback.StationType.Scan;
  const isPodcast = station?.type === Playback.StationType.Podcast;

  const seek = useDebounceCallback(
    (value: number) => {
      player.seek(value);
    },
    500,
    { leading: true },
  );

  // If you are an AA account, or content is a podcast - you can scrub progress bar on FSP and large+ breakpoints,
  // Otherwise (any other user type), you can not scrub,
  // Regardless, the spec is that any user can not scrub progress bar on mobile breakpoints due to the design, justifying to the use of `isLarge`.
  const position = isLiveStation && !adBreak ? 0 : time.position;

  // We only disable progress bar if it's a live station or if playback is not playing or paused
  const isDisabled =
    (isLiveStation && !adBreak) || status === Playback.Status.Buffering;

  const badge =
    isLiveStation || (isScanStation && !isScanning) ?
      Playback.StationType.Live
    : undefined;

  const isInteractive =
    (isPremium || isPodcast) && !isScanStation ?
      // isFullScreen || isForAllBreakpoints || isLarge
      true
    : false;

  return (
    <PlayerTime
      badge={badge}
      duration={time.duration}
      interactive={isInteractive}
      isDisabled={isDisabled}
      onChangeEnd={value => {
        seek(value);
      }}
      position={position}
      showSliderWithBadge={showSliderWithBadge}
    />
  );
}

type PlayerTimeProps = PlayerTimeControlProps & {
  badge?: string;
  showSliderWithBadge?: boolean;
};

export function PlayerTime({
  badge,
  position,
  isDisabled = false,
  showSliderWithBadge,
  duration,
  interactive,
  ...props
}: PlayerTimeProps) {
  return (
    <Flex alignContent="center" alignItems="center" justifyContent="center">
      {badge ?
        <Grid
          alignItems="center"
          gridTemplateAreas={`"container"`}
          gridTemplateColumns="1fr"
          justifyContent="center"
          width="100%"
        >
          <Badge
            css={{
              backgroundColor: vars.color.brandRed,
              color: vars.color.brandWhite,
              gridArea: 'container',
              zIndex: 1,
              justifySelf: 'center',
            }}
            size="small"
          >
            {badge}
          </Badge>
          {showSliderWithBadge ?
            <Box gridArea="container">
              <Slider
                aria-label="Adjust Playback Progress"
                data-test="progress-bar-player-control"
                interactive={false}
                isDisabled={true}
                step={1}
              />
            </Box>
          : null}
        </Grid>
      : <PlayerTimeControl
          {...props}
          duration={duration}
          interactive={interactive}
          isDisabled={isDisabled}
          position={position}
        />
      }
    </Flex>
  );
}

PlayerTime.displayName = 'Player.Time';
