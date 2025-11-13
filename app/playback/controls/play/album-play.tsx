import { mergeProps } from '@iheartradio/web.accomplice';
import type { ButtonProps } from '@iheartradio/web.accomplice/components/button';
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
import { type UseAlbumPlayProps, useAlbumPlay } from './use-album-play';
import { usePlay } from './use-play';

export type AlbumPlayProps = Omit<UseAlbumPlayProps, 'type' | 'targeting'> &
  OptionalPlayProps & {
    css?: ButtonProps['css'];
  } & {
    goToNowPlaying?: PlayerEventName | PlayerEventName[];
    albumSlug?: string;
    artistSlug?: string;
    trackTitle?: string;
  };

export function AlbumPlay({
  albumSlug,
  artistSlug,
  goToNowPlaying,
  css,
  color = 'white',
  size = 40,
  seed,
  ...props
}: AlbumPlayProps) {
  goToNowPlaying =
    Array.isArray(goToNowPlaying) ? goToNowPlaying
    : isNonNullish(goToNowPlaying) ? [goToNowPlaying]
    : [];

  const isPremium = isPremiumUser(useUser());
  const play = useAlbumPlay({ ...props, seed });
  const type =
    isPremium ? Playback.StationType.Album : Playback.StationType.PlaylistRadio;
  const { playing, stoppable } = usePlay({ ...props, type });
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
    if (albumSlug && artistSlug) {
      navigate(
        $path('/artist/:artistSlug/albums/:albumSlug/now-playing', {
          artistSlug,
          albumSlug,
        }),
      );
    } else {
      console.warn(
        'Cannot go to Now Playing tab without a artistSlug/albumSlug',
      );
    }
  }, [albumSlug, artistSlug, navigate]);

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
        {...props}
        {...playEventHandlers}
        color={color}
        css={css}
        seed={seed}
        size={size}
        type={Playback.StationType.Album}
      />
    : <PlayButton
        color={color}
        css={css}
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
