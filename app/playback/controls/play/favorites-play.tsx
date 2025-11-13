import { mergeProps } from '@iheartradio/web.accomplice';
import { PlayButton } from '@iheartradio/web.accomplice/components/player';
import { Play } from '@iheartradio/web.accomplice/icons/play';
import * as Playback from '@iheartradio/web.playback';
import { useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router';
import { isNonNullish, pick } from 'remeda';
import { $path } from 'safe-routes';

import { useUser } from '~app/contexts/user';

import type { PlayerEventName } from './common';
import {
  type OptionalPlayProps,
  dispatchPlayControlAnalytics,
  PlayControl,
} from './play';
import {
  type UseFavoritesPlayProps,
  useFavoritesPlay,
} from './use-favorites-play';
import { usePlay } from './use-play';

export type FavoritesPlayProps = UseFavoritesPlayProps &
  OptionalPlayProps & {
    goToNowPlaying?: PlayerEventName | PlayerEventName[];
  };

export function FavoritesPlay({
  color = 'white',
  size = 40,
  goToNowPlaying,
  ...props
}: FavoritesPlayProps) {
  goToNowPlaying =
    Array.isArray(goToNowPlaying) ? goToNowPlaying
    : isNonNullish(goToNowPlaying) ? [goToNowPlaying]
    : [];

  const { isAnonymous } = useUser();
  const play = useFavoritesPlay(props);
  const { playing, stoppable } = usePlay({
    ...props,
    type: Playback.StationType.Favorites,
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
    navigate($path('/favorites/:userId?/now-playing', { userId: props.id }));
  }, [navigate, props.id]);

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

  return isAnonymous ?
      <PlayButton
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
        isDisabled={props.isDisabled}
      >
        <Play size={size} />
      </PlayButton>
    : <PlayControl
        color={color}
        size={size}
        type={Playback.StationType.Favorites}
        {...props}
        {...playEventHandlers}
      />;
}
