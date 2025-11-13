import type * as Analytics from '@iheartradio/web.analytics';

import * as Playback from './player:types.js';

export enum PlaylistTypes {
  Default = 'default',
  Generated = 'generated',
  New4U = 'new4u',
  Personalized = 'personalized',
  User = 'user',
}

type getPlaylistAssetIdArgs = {
  isCurated: boolean;
  profileId: string | undefined;
  playlistUserId: string;
  playlistId: string;
  playlistType: string;
  userType: string | undefined;
  isAnonymous: boolean;
};

function getStreamAssetData({
  index,
  metadata,
  queue,
  station,
  user,
}: {
  index: Playback.PlayerState<Playback.Station>['index'];
  metadata: Playback.QueueItem['meta'];
  queue: Playback.Queue;
  station: Playback.Station;
  user: Analytics.Analytics.GlobalData['user'];
}) {
  switch (station.type) {
    case Playback.StationType.Artist: {
      return {
        stationId: `${Playback.StationType.Artist}|${station.id}`,
        stationName: station.name,
        stationType: Playback.StationType.Artist,
        stationSubtype: 'radio',
      };
    }
    case Playback.StationType.Album: {
      return {
        stationId: `${Playback.StationType.Artist}|${metadata.artistId}`,
        stationName: metadata.artistName,
        stationType: Playback.StationType.Artist,
        stationSubid: `${Playback.StationType.Album}|${metadata?.albumId}`,
        stationSubname: metadata.albumName,
        stationSubtype: Playback.StationType.Album,
      };
    }
    case Playback.StationType.TopSongs: {
      return {
        stationId: `${Playback.StationType.Artist}|${metadata.artistId}`,
        stationName: metadata.artistName,
        stationType: Playback.StationType.Artist,
        stationSubid: `top_songs|${station.id}`,
        stationSubname: station.name,
        stationSubtype: Playback.StationType.TopSongs,
      };
    }
    case Playback.StationType.Favorites: {
      return {
        stationId: `my_favorites_radio|${station.id}`,
        stationName: metadata.subtitle,
        stationType: Playback.StationType.Favorites,
        stationSubtype:
          String(station.id) === user?.profileId ? 'my' : 'shared',
      };
    }
    case Playback.StationType.Live: {
      return {
        stationId: `${Playback.StationType.Live}|${metadata.id}`,
        stationName: metadata.name,
        stationType: Playback.StationType.Live,
      };
    }
    case Playback.StationType.Scan: {
      return {
        stationId: `${Playback.StationType.Live}|${queue[index].id}`,
        stationName: queue[index].meta.name,
        stationType: Playback.StationType.Live,
      };
    }

    case Playback.StationType.PlaylistRadio:
    case Playback.StationType.Playlist: {
      const [userId, id] = String(station.id).split('::');
      const assetId = getPlaylistAssetId({
        isCurated: metadata.isCurated,
        profileId: user?.profileId,
        playlistUserId: userId,
        playlistId: id,
        playlistType: metadata.playlistType,
        userType: user?.subscriptionTier,
        isAnonymous: user?.registration?.type === 'ANONYMOUS',
      });
      return {
        stationId: assetId,
        stationName: station.name ?? metadata.subtitle ?? '',
        stationType: Playback.StationType.Playlist,
      };
    }

    case Playback.StationType.Podcast: {
      return {
        stationId: `${Playback.StationType.Podcast}|${metadata.podcastId}`,
        stationName: station.name,
        stationType: Playback.StationType.Podcast,
        stationSubid: `episode|${metadata.id}`,
        stationSubname: metadata.subtitle,
        stationSubtype: 'episode',
      };
    }
    default: {
      return {
        stationId: `${station.type}|${station.id}`,
        stationName: station.name,
      };
    }
  }
}

export function getTrackAssetData({
  metadata,
  station,
  user,
}: {
  index: Playback.PlayerState<Playback.Station>['index'];
  metadata: Playback.QueueItem['meta'];
  queue: Playback.Queue;
  station: Playback.Station;
  user: Analytics.Analytics.GlobalData['user'];
}) {
  switch (station.type) {
    case Playback.StationType.Artist: {
      return {
        stationId: `${Playback.StationType.Artist}|${station.id}`,
        stationName: metadata.artistName,
        stationType: Playback.StationType.Artist,
        stationSubtype: 'radio',
        stationSubid: `song|${metadata.id}`,
        stationSubname: metadata.title,
      };
    }
    case Playback.StationType.Album: {
      return {
        stationId: `${Playback.StationType.Album}|${metadata.albumId}`,
        stationName: metadata.albumName,
        stationType: Playback.StationType.Artist,
        stationSubid: `song|${metadata.id}`,
        stationSubname: metadata.title,
        stationSubtype: Playback.StationType.Album,
      };
    }
    case Playback.StationType.TopSongs: {
      return {
        stationId: `top_songs|${station.id}`,
        stationName: station.name,
        stationType: Playback.StationType.Artist,
        stationSubid: `song|${metadata.id}`,
        stationSubname: metadata.title,
        stationSubtype: Playback.StationType.TopSongs,
      };
    }
    case Playback.StationType.Favorites: {
      return {
        stationId: `my_favorites_radio|${station.id}`,
        stationName: metadata.subtitle,
        stationType: Playback.StationType.Favorites,
        stationSubid: `song|${metadata.id}`,
        stationSubname: metadata.title,
        stationSubtype:
          String(station.id) === user?.profileId ? 'my' : 'shared',
      };
    }

    // track events don't fire for live or scan playback

    case Playback.StationType.PlaylistRadio:
    case Playback.StationType.Playlist: {
      const [userId, id] = String(station.id).split('::');
      const assetId = getPlaylistAssetId({
        isCurated: metadata.isCurated,
        profileId: user?.profileId,
        playlistUserId: userId,
        playlistId: id,
        playlistType: metadata.playlistType,
        userType: user?.subscriptionTier,
        isAnonymous: user?.registration?.type === 'ANONYMOUS',
      });
      return {
        stationId: assetId,
        stationName: station.name ?? metadata.subtitle,
        stationType: Playback.StationType.Playlist,
        stationSubid: `song|${metadata.id}`,
        stationSubname: metadata.title,
      };
    }

    case Playback.StationType.Podcast: {
      return {
        stationId: `${Playback.StationType.Podcast}|${metadata.podcastId}`,
        stationName: metadata.subtitle,
        stationType: Playback.StationType.Podcast,
        stationSubid: `episode|${metadata.id}`,
        stationSubname: metadata.description,
        stationSubtype: 'episode',
      };
    }
    default: {
      return {
        stationId: `${station.type}|${station.id}`,
        stationName: metadata.title,
      };
    }
  }
}

function getPlaylistAssetId({
  isCurated,
  profileId,
  playlistUserId,
  playlistId,
  playlistType,
  userType,
  isAnonymous,
}: getPlaylistAssetIdArgs) {
  if (playlistType === PlaylistTypes.New4U) {
    return `new_for_you_playlist|${profileId}`;
  }

  let idPrefix = 'my_playlist';

  if (isCurated) {
    if (isAnonymous || userType === 'NONE') {
      idPrefix = 'playlist_radio';
    } else {
      idPrefix = 'curated_playlist';
    }
  } else if (
    profileId === playlistUserId &&
    playlistType !== PlaylistTypes.Default
  ) {
    idPrefix = 'user_playlist';
  } else if (profileId !== playlistUserId) {
    idPrefix = 'shared_user_playlist';
  }

  return `${idPrefix}|${playlistUserId}::${playlistId}`;
}

type PlaybackAnalyticsData = Extract<
  Analytics.Analytics.Event,
  { type: 'stream_start' | 'stream_end' | 'track_start' | 'track_end' }
>['data'];

export function getAnalyticsStationData({
  analyticsState,
  eventType,
  followed,
  index,
  metadata,
  queue,
  station,
  user,
}: {
  analyticsState: {
    streamSessionId: string;
    streamInitTime: number;
    playbackStartTime: number;
    startPosition: number;
    hadPreroll: boolean;
  };
  eventType: 'stream' | 'track';
  followed: boolean;
  index: Playback.PlayerState<Playback.Station>['index'];
  metadata: Playback.QueueItem['meta'];
  queue: Playback.Queue;
  station: Playback.Station;
  user: Analytics.Analytics.GlobalData['user'];
}): PlaybackAnalyticsData {
  const assetData =
    eventType === 'stream' ?
      getStreamAssetData({ index, metadata, queue, station, user })
    : getTrackAssetData({ index, metadata, queue, station, user });

  return {
    station: {
      asset: {
        id: assetData.stationId,
        name: assetData.stationName,
        ...(assetData.stationType && {
          type: assetData.stationType,
        }),
        ...(assetData.stationSubtype && {
          subtype: assetData.stationSubtype,
        }),
        ...(assetData.stationSubid && {
          subid: assetData.stationSubid,
        }),
        ...(assetData.stationSubname && {
          subname: assetData.stationSubname,
        }),
      },
      hadPreroll: analyticsState.hadPreroll,
      isSaved: followed,
      playbackStartTime: analyticsState.playbackStartTime,
      playedFrom: station.context.playedFrom,
      sessionId: analyticsState.streamSessionId,
      startPosition: analyticsState.startPosition,
      streamInitTime: analyticsState.streamInitTime,
    },
  } as PlaybackAnalyticsData;
}
