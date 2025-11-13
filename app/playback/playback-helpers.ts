import * as Playback from '@iheartradio/web.playback';

export const isPremiumStation = (
  stationType: Playback.StationType,
): boolean => {
  if (
    [
      Playback.StationType.Album,
      Playback.StationType.TopSongs,
      Playback.StationType.Playlist,
    ].includes(stationType)
  ) {
    return true;
  }
  return false;
};

// This method takes a "premium" station and falls back to it's "radio" counterpart
export const premiumStationFallback = (
  station: Playback.Station,
  loadAttempts: number,
): Playback.Station => {
  const defaultStation: Playback.Station = {
    id: 1469,
    context: station.context,
    type: Playback.StationType.Live,
    targeting: station.targeting,
  };

  // If we're on our second retry, just return the default station
  if (loadAttempts > 1) {
    return defaultStation;
  }

  switch (station.type) {
    case Playback.StationType.Album: {
      return {
        type: Playback.StationType.Artist,
        id: (station as Playback.AlbumStation).artistId,
        context: station.context,
        targeting: station.targeting,
      };
    }
    case Playback.StationType.TopSongs: {
      return {
        type: Playback.StationType.Artist,
        id: station.id,
        context: station.context,
        targeting: station.targeting,
      };
    }
    case Playback.StationType.Playlist: {
      const [_userId, playlistId] = (station.id as string).split('::');
      if (['chill4u', 'new4u', 'workout4u'].includes(playlistId)) {
        return defaultStation;
      }
      return {
        type: Playback.StationType.PlaylistRadio,
        id: station.id,
        context: station.context,
        targeting: station.targeting,
      };
    }
    default: {
      return defaultStation;
    }
  }
};
