import { PlayerSection } from '@iheartradio/web.accomplice/components/player';
import * as Playback from '@iheartradio/web.playback';
import { isNullish } from 'remeda';

import { playback } from '../playback';
import { AlbumControls } from './album-controls';
import { ArtistControls } from './artist-controls';
import { FavoritesControls } from './favorites-controls';
import { LiveControls } from './live-controls';
import { PlaylistControls } from './playlist-controls';
import { PlaylistRadioControls } from './playlist-radio-controls';
import { PodcastControls } from './podcast-controls';
import { ScanControls } from './scan-controls';
import { TopSongsControls } from './top-songs-controls';

const controls = {
  [Playback.StationType.Album]: AlbumControls,
  [Playback.StationType.Artist]: ArtistControls,
  [Playback.StationType.Favorites]: FavoritesControls,
  [Playback.StationType.Live]: LiveControls,
  [Playback.StationType.Playlist]: PlaylistControls,
  [Playback.StationType.PlaylistRadio]: PlaylistRadioControls,
  [Playback.StationType.Podcast]: PodcastControls,
  [Playback.StationType.Scan]: ScanControls,
  [Playback.StationType.TopSongs]: TopSongsControls,
} as const;

export function ControlSet({
  context,
}: {
  context: Playback.Station['context'];
}) {
  const state = playback.useState();
  const { station } = state;

  if (isNullish(station)) {
    return null;
  }

  const Controls = controls[station.type];

  return (
    <PlayerSection data-test="player-controls">
      <Controls context={context} />
    </PlayerSection>
  );
}
