import { vars } from '@iheartradio/web.accomplice';
import * as Playback from '@iheartradio/web.playback';
import { $path } from 'safe-routes';

import type { RegGateContext } from '~app/analytics/data';
import type { InAppMessageHandler } from '~app/analytics/in-app-message';
import {
  addRegGateToast,
  setRegGateContext,
} from '~app/analytics/reg-gate-toast';
import type { Thumbs } from '~app/contexts/thumbs/thumbs';
import { ThumbStatus } from '~app/contexts/thumbs/thumbs';
import {
  ANALYTICS_LOCATION,
  ANALYTICS_ORIGIN,
  PAYLOAD_TRIGGER_TYPES,
  REG_GATE_TOAST_EXIT_TYPE,
  REG_GATE_TOAST_MESSAGE_TYPE,
} from '~app/utilities/constants';
import { makeArtistSlug } from '~app/utilities/slugs/artist-slug';
import { makeAlbumSlug } from '~app/utilities/slugs/get-album-profile-slug';
import { makeLiveStationSlug } from '~app/utilities/slugs/get-live-profile-slug';
import { makePlaylistSlug } from '~app/utilities/slugs/get-playlist-profile-slug';
import { makePodcastSlug } from '~app/utilities/slugs/get-podcast-profile-slug';

const Titles = Object.freeze({
  Podcasts: 'Podcasts',
  Artists: 'Artists',
  Playlists: 'Playlists',
  Stations: 'Stations',
} as const);

const TitleMap = Object.freeze(
  new Map<Playback.StationType, string>([
    [Playback.StationType.Podcast, Titles.Podcasts],
    [Playback.StationType.Artist, Titles.Artists],
    [Playback.StationType.TopSongs, Titles.Artists],
    [Playback.StationType.Album, Titles.Artists],
    [Playback.StationType.Playlist, Titles.Playlists],
    [Playback.StationType.PlaylistRadio, Titles.Playlists],
    [Playback.StationType.Live, Titles.Stations],
    [Playback.StationType.Favorites, Titles.Stations],
  ]),
);

export const getContentTitle = (stationType: Playback.StationType): string => {
  return `${TitleMap.get(stationType)} You Might Like`;
};

export const addThumbToast = ({
  isLiveStation,
  thumbType,
  loginUrl,
  signUpUrl,
  onInAppMessageOpen,
  onInAppMessageExit,
  pageName,
  isInProfilePlayer,
  station,
}: {
  isLiveStation?: boolean;
  thumbType: Thumbs;
  loginUrl: URL | string;
  signUpUrl: URL | string;
  onInAppMessageOpen: InAppMessageHandler;
  onInAppMessageExit: InAppMessageHandler;
  pageName: string;
  isInProfilePlayer?: boolean;
  station?: Playback.Station | null;
}) => {
  const text =
    isLiveStation ?
      thumbType === ThumbStatus.Down ?
        "Log in to let our Djs know you've heard enough of this song"
      : 'Log in to let our Djs know you like this song'
    : thumbType === ThumbStatus.Down ?
      'Log in to thumb down & hear this song less'
    : 'Log in to thumb up & hear this song more often';

  const analyticsLocation =
    isInProfilePlayer ?
      ANALYTICS_LOCATION.NOW_PLAYING
    : ANALYTICS_LOCATION.MINIPLAYER_BUTTON;

  const regGateContext = {
    trigger: PAYLOAD_TRIGGER_TYPES.THUMBS,
    origin: ANALYTICS_ORIGIN.LISTEN,
    pageName,
    location: analyticsLocation,
    ...(isInProfilePlayer && station?.id ?
      { assetId: station.id.toString() }
    : {}),
    ...(isInProfilePlayer && station?.name ? { assetName: station.name } : {}),
  } satisfies RegGateContext;

  loginUrl = setRegGateContext(loginUrl, regGateContext);
  signUpUrl = setRegGateContext(signUpUrl, regGateContext);

  addRegGateToast({
    kind: 'info',
    text,
    onInAppMessageOpen,
    onInAppMessageExit,
    messageType: REG_GATE_TOAST_MESSAGE_TYPE.THUMBS,
    userTriggered: true,
    pageName,
    location: analyticsLocation,
    ...(isInProfilePlayer && station?.id && station?.name ?
      {
        globalStation: {
          id: station.id.toString(),
          name: station.name,
        },
      }
    : {}),
    actions: [
      {
        kind: 'tertiary',
        size: { mobile: 'small', medium: 'large' },
        color: 'gray',
        textColor: vars.color.gray600,
        href: loginUrl.toString(),
        onPress: () => {
          onInAppMessageExit({
            messageType: REG_GATE_TOAST_MESSAGE_TYPE.THUMBS,
            exitType: REG_GATE_TOAST_EXIT_TYPE.CLICK_SUCCESS,
            pageName,
          });
        },
        content: 'Log in',
      },
      {
        kind: 'tertiary',
        size: { xsmall: 'small', medium: 'large' },
        color: 'gray',
        textColor: vars.color.gray600,
        href: signUpUrl.toString(),
        onPress: () => {
          onInAppMessageExit({
            messageType: REG_GATE_TOAST_MESSAGE_TYPE.THUMBS,
            exitType: REG_GATE_TOAST_EXIT_TYPE.CLICK_SUCCESS,
            pageName,
          });
        },
        content: 'Sign up',
      },
    ],
  });
};

export const buildNowPlayingUrl = ({
  station,
  metadata,
}: {
  station: Playback.Station;
  metadata: Playback.Metadata;
}) => {
  const { name, id: stationId, type, artistId } = station;
  const { podcastSlug, artistName } = metadata?.data ?? {};
  const id = stationId.toString();

  if (!name || !id) {
    return null;
  }

  switch (type) {
    case Playback.StationType.Live: {
      const liveSlug = makeLiveStationSlug(name, id);
      return liveSlug ?
          $path('/live/:liveSlug/now-playing', { liveSlug })
        : undefined;
    }
    case Playback.StationType.Artist: {
      const [stationName] = name.split(' Radio');
      const artistSlug = makeArtistSlug(stationName, id);
      return artistSlug ?
          $path('/artist/:artistSlug/now-playing', { artistSlug })
        : undefined;
    }
    case Playback.StationType.TopSongs: {
      const artistSlug = makeArtistSlug(artistName, id);
      return artistSlug ?
          $path('/artist/:artistSlug/now-playing', { artistSlug })
        : undefined;
    }
    case Playback.StationType.Playlist:
    case Playback.StationType.PlaylistRadio: {
      const [userId, playlistId] = id.split('::');
      const [playlistName] = name.split(' Radio');

      const playlistSlug = makePlaylistSlug({
        name: playlistName,
        id: playlistId,
        userId,
      });
      return playlistSlug ?
          $path('/playlist/:playlistSlug/now-playing', { playlistSlug })
        : undefined;
    }
    case Playback.StationType.Podcast: {
      const fullPodcastSlug = makePodcastSlug(podcastSlug, id);
      return fullPodcastSlug ?
          $path('/podcast/:podcastSlug/now-playing', {
            podcastSlug: fullPodcastSlug,
          })
        : undefined;
    }
    case Playback.StationType.Album: {
      const artistSlug = makeArtistSlug(artistName, artistId);
      const albumSlug = makeAlbumSlug(name, id);
      return artistSlug && albumSlug ?
          $path('/artist/:artistSlug/albums/:albumSlug/now-playing', {
            artistSlug,
            albumSlug,
          })
        : undefined;
    }
    case Playback.StationType.Favorites: {
      return $path('/favorites/:userId?/now-playing', { userId: id });
    }
  }
};
