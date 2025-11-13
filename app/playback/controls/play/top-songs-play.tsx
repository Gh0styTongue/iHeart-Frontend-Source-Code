import { mergeProps } from '@iheartradio/web.accomplice';
import { PlayButton } from '@iheartradio/web.accomplice/components/player';
import { Play } from '@iheartradio/web.accomplice/icons/play';
import * as Playback from '@iheartradio/web.playback';
import { useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router';
import { isNonNullish, pick } from 'remeda';
import { $path } from 'safe-routes';

import { useUser } from '~app/contexts/user';
import { isPremiumUser } from '~app/utilities/user';

import type { PlayerEventName } from './common';
import {
  type OptionalPlayProps,
  dispatchPlayControlAnalytics,
  PlayControl,
} from './play';
import { usePlay } from './use-play';
import {
  type UseTopSongsPlayProps,
  useTopSongsPlay,
} from './use-top-songs-play';

export type TopSongsPlayProps = UseTopSongsPlayProps &
  OptionalPlayProps & {
    goToNowPlaying?: PlayerEventName | PlayerEventName[];
    artistSlug?: string | undefined;
  };

export function TopSongsPlay({
  color = 'white',
  size = 40,
  artistSlug,
  goToNowPlaying,
  seed,
  ...props
}: TopSongsPlayProps) {
  goToNowPlaying =
    Array.isArray(goToNowPlaying) ? goToNowPlaying
    : isNonNullish(goToNowPlaying) ? [goToNowPlaying]
    : [];

  const isPremium = isPremiumUser(useUser());
  const play = useTopSongsPlay({
    ...props,
    artistId: props.id,
    artistName: props.name ?? '',
    trackTitle: props.trackTitle,
    seed,
  });
  const { playing, stoppable } = usePlay({
    ...props,
    type: Playback.StationType.TopSongs,
  });
  const navigate = useNavigate();

  const station = useMemo(
    () => ({
      id: props.id,
      context: props.context,
      name: props.name,
    }),
    [props.id, props.context, props.name],
  ) as Playback.Station;

  const navigateToNowPlaying = useCallback(() => {
    if (artistSlug) {
      navigate($path('/artist/:artistSlug/now-playing', { artistSlug }));
    } else {
      console.warn('Cannot go to Now Playing tab without a artistSlug');
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

  return isPremium ?
      <PlayControl
        color={color}
        seed={seed}
        size={size}
        type={Playback.StationType.TopSongs}
        {...mergeProps(playEventHandlers, props)}
      />
    : <PlayButton
        color={color}
        {...mergeProps(
          {
            onPress: () => {
              dispatchPlayControlAnalytics({ station, playing, stoppable });
              play.doPlay(playEventHandlers);
            },
          },
          { onPress: props.onPress },
        )}
      >
        <Play size={size} />
      </PlayButton>;
}
