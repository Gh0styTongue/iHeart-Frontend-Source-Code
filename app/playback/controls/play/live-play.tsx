import { mergeProps } from '@iheartradio/web.accomplice';
import * as Playback from '@iheartradio/web.playback';
import { useCallback } from 'react';
import { useNavigate } from 'react-router';
import { isNonNullish, pick } from 'remeda';
import { $path } from 'safe-routes';

import type { PlayerEventName } from './common';
import { type OptionalPlayProps, PlayControl } from './play';
import type { UseLivePlayProps } from './use-live-play';

export type LivePlayProps = UseLivePlayProps &
  OptionalPlayProps & {
    goToNowPlaying?: PlayerEventName | PlayerEventName[];
    liveSlug?: string | undefined;
  };

export function LivePlay({
  color,
  size = 40,
  goToNowPlaying,
  liveSlug,
  ...props
}: LivePlayProps) {
  goToNowPlaying =
    Array.isArray(goToNowPlaying) ? goToNowPlaying
    : isNonNullish(goToNowPlaying) ? [goToNowPlaying]
    : [];
  const navigate = useNavigate();

  const navigateToNowPlaying = useCallback(() => {
    if (liveSlug) {
      navigate($path('/live/:liveSlug/now-playing', { liveSlug }));
    } else {
      console.warn('Cannot go to Now Playing tab without a liveSlug');
    }
  }, [liveSlug, navigate]);

  const playEventHandlers = pick(
    {
      onPlay: () => {
        navigateToNowPlaying();
      },
      onPause: () => {
        navigateToNowPlaying();
      },
      onStop: () => {
        navigateToNowPlaying();
      },
    },
    goToNowPlaying,
  );

  return (
    <PlayControl
      color={color ?? 'defaultInverted'}
      size={size}
      type={Playback.StationType.Live}
      {...mergeProps(playEventHandlers, props)}
    />
  );
}
