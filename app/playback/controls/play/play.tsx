import { mergeProps } from '@iheartradio/web.accomplice';
import type { ButtonProps } from '@iheartradio/web.accomplice/components/button';
import { Button } from '@iheartradio/web.accomplice/components/button';
import { Flex } from '@iheartradio/web.accomplice/components/flex';
import type { IconProps } from '@iheartradio/web.accomplice/components/icon';
import {
  type PlayButtonProps,
  PlayButton,
} from '@iheartradio/web.accomplice/components/player';
import {
  Popover,
  PopoverText,
  PopoverTitle,
} from '@iheartradio/web.accomplice/components/popover';
import { Pause } from '@iheartradio/web.accomplice/icons/pause';
import { Play } from '@iheartradio/web.accomplice/icons/play';
import { Stop } from '@iheartradio/web.accomplice/icons/stop';
import * as Analytics from '@iheartradio/web.analytics';
import type { Playback } from '@iheartradio/web.playback';
import { type ComponentProps, useMemo, useState } from 'react';

import { analytics } from '~app/analytics/create-analytics';
import { useConfig } from '~app/contexts/config';

import type { PlayerEvents } from './common';
import type { UsePlayProps } from './use-play';
import { usePlay } from './use-play';

export interface OptionalPlayProps {
  color?: ComponentProps<typeof Button>['color'];
  itemId?: number | string | null;
  size?: IconProps['size'];
  isDisabled?: boolean;
  shuffle?: boolean;
  css?: ButtonProps['css'];
  onPress?: PlayButtonProps['onPress'];
}

export type PlayControlProps = UsePlayProps & OptionalPlayProps & PlayerEvents;

const playbackControlEvent = ({
  type,
  station,
}: {
  type: any;
  station: Playback.Station;
}) => {
  if (station) {
    analytics.track({
      type,
      data: {
        event: {
          location: station.context.eventLocation ?? '',
        },
        station: {
          asset: {
            id: station.id.toString(),
            name: station.name ?? '',
          },
          playedFrom: station.context.playedFrom,
        },
        view: {
          pageName: station.context.pageName,
          ...(station.context.eventLocation === 'carousel' ?
            {
              section: {
                name: station.context.sectionName ?? '',
              },
            }
          : {}),
        },
      },
    });
  }
};

export const dispatchPlayControlAnalytics = ({
  station,
  playing,
  stoppable,
}: {
  station: Playback.Station;
  playing: boolean;
  stoppable: boolean;
}) => {
  // fire play, pause, stop analytics events based on playback state
  if (!playing) {
    playbackControlEvent({
      station,
      type: Analytics.eventType.enum.Play,
    });
  } else if (playing && !stoppable) {
    playbackControlEvent({
      station,
      type: Analytics.eventType.enum.Pause,
    });
  } else {
    playbackControlEvent({
      station,
      type: Analytics.eventType.enum.Stop,
    });
  }
};

export function PlayControl({
  color,
  css,
  size = 40,
  isDisabled,
  shuffle = false,
  onPress,
  onPlay,
  onPause,
  onStop,
  ...props
}: PlayControlProps) {
  const {
    adBreak,
    buffering,
    disabled,
    isCurrent,
    playing,
    doPlay,
    stoppable,
    tooltip,
  } = usePlay(props);
  const config = useConfig();
  const [isOpen, setIsOpen] = useState(false);

  const showPopover = adBreak && !isCurrent;

  const station = useMemo(
    () => ({
      id: props.id,
      context: props.context,
      name: props.name,
    }),
    [props.id, props.context, props.name],
  ) as Playback.Station;

  if (showPopover) {
    return (
      <Popover
        isOpen={!showPopover ? false : isOpen}
        name="ad-break-upsell"
        onOpenChange={isOpen => {
          setIsOpen(isOpen);
        }}
        placement="bottom"
        trigger={
          <PlayButton
            color={color}
            data-test="player-play-button-with-ad-break-popover"
            isDisabled={isDisabled ?? false}
            isPending={buffering === true && isCurrent}
            shuffle={shuffle}
            tooltip={tooltip}
          >
            <Play size={size} />
          </PlayButton>
        }
      >
        <Flex direction="column" gap="$16">
          <PopoverTitle>Start listening after the ad</PopoverTitle>
          <PopoverText>Want to listen to anything, anytime?</PopoverText>
          <Button
            color="red"
            css={{ fontSize: '$14', ...css }}
            href={`${config.urls.account}/subscribe`}
            kind="primary"
            size="large"
            target="_blank"
          >
            Listen with iHeart All Access
          </Button>
        </Flex>
      </Popover>
    );
  }

  return (
    <PlayButton
      color={color}
      css={css}
      data-test="player-play-button"
      isDisabled={isDisabled ?? disabled}
      isPending={buffering}
      shuffle={shuffle}
      tooltip={tooltip}
      // Chain handlers with mergeProps
      {...mergeProps(
        {
          onPress: () => {
            dispatchPlayControlAnalytics({ station, playing, stoppable });
            doPlay({ onPlay, onPause, onStop });
          },
        },
        { onPress },
      )}
    >
      {!playing && <Play size={size} />}
      {(!stoppable && playing) || (playing && adBreak) ?
        <Pause size={size} />
      : null}
      {stoppable && playing && !adBreak ?
        <Stop size={size} />
      : null}
    </PlayButton>
  );
}
