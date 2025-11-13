import * as Playback from '@iheartradio/web.playback';
import { difference, isNonNullish, isNullish, pickBy } from 'remeda';

import { playback } from '../../playback';
import type { PlayControlProps } from './play';

export function useIsCurrentStation(props: PlayControlProps): boolean {
  const stationToLoad = pickBy<PlayControlProps>(
    props,
    isNonNullish,
  ) as Playback.Station;

  const currentState = playback.useState();

  if (isNullish(currentState.station)) {
    return true;
  }

  if (
    currentState.station?.type === Playback.StationType.Scan &&
    stationToLoad.type === Playback.StationType.Live
  ) {
    return currentState.queue[currentState.index].id === stationToLoad.id;
  }

  if (
    currentState.station?.type !== stationToLoad.type ||
    (Array.isArray(currentState.station.id) && Array.isArray(stationToLoad.id) ?
      difference(currentState.station.id, stationToLoad.id).length > 0 ||
      difference(stationToLoad.id, currentState.station.id).length > 0
    : currentState.station?.id !== stationToLoad.id)
  ) {
    return false;
  }

  switch (stationToLoad.type) {
    case Playback.StationType.Album:
    case Playback.StationType.Playlist:
    case Playback.StationType.TopSongs: {
      if (isNullish(stationToLoad.seed)) {
        return true;
      }

      return props.isControlSet ?
          currentState.station.id === stationToLoad.id
        : currentState.queue[currentState.index].id === stationToLoad.seed;
    }
    case Playback.StationType.Podcast: {
      if (isNullish(stationToLoad.seed)) {
        return true;
      }

      return currentState.queue[currentState.index].id === stationToLoad.seed;
    }
    case Playback.StationType.Artist:
    case Playback.StationType.Favorites:
    case Playback.StationType.Live:
    case Playback.StationType.PlaylistRadio: {
      return true;
    }
    case Playback.StationType.Scan: {
      return (
          Array.isArray(currentState.station.id) &&
            Array.isArray(stationToLoad.id)
        ) ?
          difference(currentState.station.id, stationToLoad.id).length === 0 &&
            difference(stationToLoad.id, currentState.station.id).length === 0
        : currentState.station.id === stationToLoad.id;
    }
  }
}
