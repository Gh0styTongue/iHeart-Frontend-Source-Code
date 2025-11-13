import { mergeProps } from '@iheartradio/web.accomplice';
import * as Playback from '@iheartradio/web.playback';
import { useCallback } from 'react';
import { useNavigate } from 'react-router';
import { isNonNullish, pick } from 'remeda';
import { $path } from 'safe-routes';

import { makePodcastSlug } from '~app/utilities/slugs/get-podcast-profile-slug';

import type { PlayerEventName } from './common';
import { type OptionalPlayProps, PlayControl } from './play';
import type { UsePodcastPlayProps } from './use-podcast-play';

export type PodcastPlayProps = UsePodcastPlayProps &
  OptionalPlayProps & {
    goToNowPlaying?: PlayerEventName | PlayerEventName[];
    podcastSlug?: string;
  };

export function PodcastPlay({
  color = 'white',
  size = 40,
  goToNowPlaying,
  podcastSlug,
  ...props
}: PodcastPlayProps) {
  goToNowPlaying =
    Array.isArray(goToNowPlaying) ? goToNowPlaying
    : isNonNullish(goToNowPlaying) ? [goToNowPlaying]
    : [];

  const navigate = useNavigate();

  podcastSlug ??= makePodcastSlug(props.name, props.id);

  const navigateToNowPlaying = useCallback(() => {
    if (podcastSlug) {
      navigate($path('/podcast/:podcastSlug/now-playing', { podcastSlug }));
    } else {
      console.warn('Cannot go to Now Playing tab without a podcastSlug');
    }
  }, [navigate, podcastSlug]);

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
      color={color}
      size={size}
      type={Playback.StationType.Podcast}
      {...mergeProps(playEventHandlers, props)}
    />
  );
}
