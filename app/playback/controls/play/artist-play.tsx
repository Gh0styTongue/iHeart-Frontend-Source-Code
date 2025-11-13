import { mergeProps } from '@iheartradio/web.accomplice';
import * as Playback from '@iheartradio/web.playback';
import { useCallback } from 'react';
import { useNavigate } from 'react-router';
import { isNonNullish, pick } from 'remeda';
import { $path } from 'safe-routes';

import { useUser } from '~app/contexts/user';
import { isPremiumUser } from '~app/utilities/user';

import type { PlayerEventName } from './common';
import { type OptionalPlayProps, PlayControl } from './play';
import type { UseArtistPlayProps } from './use-artist-play';

export type ArtistPlayProps = Omit<UseArtistPlayProps, 'targeting'> &
  OptionalPlayProps & {
    goToNowPlaying?: PlayerEventName | PlayerEventName[];
    artistSlug?: string;
  };

export function ArtistPlay({
  color = 'white',
  size = 40,
  seed,
  artistSlug,
  goToNowPlaying,
  ...props
}: ArtistPlayProps) {
  goToNowPlaying =
    Array.isArray(goToNowPlaying) ? goToNowPlaying
    : isNonNullish(goToNowPlaying) ? [goToNowPlaying]
    : [];

  const isPremium = isPremiumUser(useUser());
  const navigate = useNavigate();

  const navigateToNowPlaying = useCallback(() => {
    if (artistSlug) {
      navigate(
        $path('/artist/:artistSlug/now-playing', {
          artistSlug,
        }),
      );
    } else {
      console.warn('Cannot go to Now Playing tab without an artistSlug');
    }
  }, [artistSlug, navigate]);

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
      type={Playback.StationType.Artist}
      {...mergeProps(props, {
        ...playEventHandlers,
        seed: isPremium ? seed : undefined,
      })}
    />
  );
}
