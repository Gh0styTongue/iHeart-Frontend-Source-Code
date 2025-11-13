import { mergeProps } from '@iheartradio/web.accomplice';
import { PlayButton } from '@iheartradio/web.accomplice/components/player';
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
import {
  type UsePlaylistPlayProps,
  usePlaylistPlay,
} from './use-playlist-play';

export type PlaylistPlayProps = (Omit<UsePlaylistPlayProps, 'type'> & {
  type?: Playback.StationType.Playlist | Playback.StationType.PlaylistRadio;
  isDisabled?: boolean;
}) &
  OptionalPlayProps & {
    goToNowPlaying?: PlayerEventName | PlayerEventName[];
    playlistSlug?: string | undefined;
  };

export function PlaylistPlay({
  color = 'white',
  type = Playback.StationType.Playlist,
  isDisabled = false,
  itemId,
  playlistSlug,
  goToNowPlaying,
  size = 40,
  ...props
}: PlaylistPlayProps) {
  goToNowPlaying =
    Array.isArray(goToNowPlaying) ? goToNowPlaying
    : isNonNullish(goToNowPlaying) ? [goToNowPlaying]
    : [];

  const userIsPremium = isPremiumUser(useUser());
  const { doPlay, playing, stoppable } = usePlaylistPlay({
    ...props,
    type,
    itemId,
  });

  const station = useMemo(
    () => ({
      id: props.id,
      context: props.context,
      name: props.name,
    }),
    [props.id, props.context, props.name],
  ) as Playback.Station;

  const navigate = useNavigate();

  const navigateToNowPlaying = useCallback(() => {
    if (playlistSlug) {
      navigate(
        $path('/playlist/:playlistSlug/now-playing', {
          playlistSlug,
        }),
      );
    } else {
      console.warn('Cannot go to Now Playing tab without a playlistSlug');
    }
  }, [navigate, playlistSlug]);

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

  if (type === Playback.StationType.Playlist) {
    return userIsPremium ?
        <PlayControl
          color={color}
          isDisabled={isDisabled}
          itemId={itemId}
          onPress={() => {
            navigateToNowPlaying();
          }}
          seed={(props as Playback.PlaylistStation)?.seed}
          type={Playback.StationType.Playlist}
          {...mergeProps(playEventHandlers, props)}
        />
      : <PlayButton
          color={color}
          {...mergeProps(
            {
              onPress: () => {
                dispatchPlayControlAnalytics({ station, playing, stoppable });
                doPlay(playEventHandlers);
              },
            },
            { onPress: props.onPress },
          )}
        />;
  }

  return userIsPremium ?
      <PlayControl
        color={color}
        isDisabled={isDisabled}
        itemId={itemId}
        onPress={() => {
          navigateToNowPlaying();
        }}
        seed={(props as Playback.PlaylistStation)?.seed}
        size={size}
        type={Playback.StationType.Playlist}
        {...mergeProps(playEventHandlers, props)}
      />
      // if playlist profile hero... return play button with shuffle = true; else ...
    : <PlayControl
        color={color}
        isDisabled={isDisabled}
        itemId={itemId}
        onPress={() => {
          navigateToNowPlaying();
        }}
        shuffle={true}
        size={size}
        type={Playback.StationType.PlaylistRadio}
        {...mergeProps(playEventHandlers, props)}
      />;
}
