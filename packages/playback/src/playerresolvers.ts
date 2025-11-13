/* eslint-disable barrel-files/avoid-namespace-import */
/* eslint-disable barrel-files/avoid-barrel-files */

import { createAlbumResolver } from './player:resolver:album.js';
import { createArtistResolver } from './player:resolver:artist.js';
import { createFavoritesResolver } from './player:resolver:favorites.js';
import { createLiveResolver } from './player:resolver:live.js';
import { createPlaylistResolver } from './player:resolver:playlist.js';
import { createPlaylistRadioResolver } from './player:resolver:playlist-radio.js';
import { createPodcastResolver } from './player:resolver:podcast.js';
import { createScanResolver } from './player:resolver:scan.js';
import { createTopSongsResolver } from './player:resolver:top-songs.js';
import * as Playback from './player:types.js';

export { type AlbumStation } from './player:resolver:album.js';
export { type ArtistStation } from './player:resolver:artist.js';
export { type FavoritesStation } from './player:resolver:favorites.js';
export { type LiveStation } from './player:resolver:live.js';
export { type PlaylistStation } from './player:resolver:playlist.js';
export { type PlaylistRadioStation } from './player:resolver:playlist-radio.js';
export { type PodcastStation } from './player:resolver:podcast.js';
export { type ScanStation } from './player:resolver:scan.js';
export { type TopSongsStation } from './player:resolver:top-songs.js';

export const resolvers: {
  [Playback.StationType.Album]: ReturnType<typeof createAlbumResolver>;
  [Playback.StationType.Artist]: ReturnType<typeof createArtistResolver>;
  [Playback.StationType.Favorites]: ReturnType<typeof createFavoritesResolver>;
  [Playback.StationType.Live]: ReturnType<typeof createLiveResolver>;
  [Playback.StationType.Playlist]: ReturnType<typeof createPlaylistResolver>;
  [Playback.StationType.PlaylistRadio]: ReturnType<
    typeof createPlaylistRadioResolver
  >;
  [Playback.StationType.Podcast]: ReturnType<typeof createPodcastResolver>;
  [Playback.StationType.Scan]: ReturnType<typeof createScanResolver>;
  [Playback.StationType.TopSongs]: ReturnType<typeof createTopSongsResolver>;
} = {
  [Playback.StationType.Album]: createAlbumResolver(),
  [Playback.StationType.Artist]: createArtistResolver(),
  [Playback.StationType.Favorites]: createFavoritesResolver(),
  [Playback.StationType.Live]: createLiveResolver(),
  [Playback.StationType.Playlist]: createPlaylistResolver(),
  [Playback.StationType.PlaylistRadio]: createPlaylistRadioResolver(),
  [Playback.StationType.Podcast]: createPodcastResolver(),
  [Playback.StationType.Scan]: createScanResolver(),
  [Playback.StationType.TopSongs]: createTopSongsResolver(),
};
