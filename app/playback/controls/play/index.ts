import { AlbumPlay } from './album-play';
import { ArtistPlay } from './artist-play';
import { FavoritesPlay } from './favorites-play';
import { LivePlay } from './live-play';
import { PlayControl } from './play';
import { PlaylistPlay } from './playlist-play';
import { PodcastPlay } from './podcast-play';
import { TopSongsPlay } from './top-songs-play';
import { useAlbumPlay } from './use-album-play';
import { useArtistPlay } from './use-artist-play';
import { useFavoritesPlay } from './use-favorites-play';
import { useLivePlay } from './use-live-play';
import { usePlay } from './use-play';
import { usePlaylistPlay } from './use-playlist-play';
import { usePodcastPlay } from './use-podcast-play';
import { useTopSongsPlay } from './use-top-songs-play';

export const Play = Object.assign(PlayControl, {
  Album: AlbumPlay,
  Artist: ArtistPlay,
  Favorites: FavoritesPlay,
  Live: LivePlay,
  Playlist: PlaylistPlay,
  Podcast: PodcastPlay,
  TopSongs: TopSongsPlay,
  useAlbumPlay,
  useArtistPlay,
  useFavoritesPlay,
  useLivePlay,
  usePlay,
  usePlaylistPlay,
  usePodcastPlay,
  useTopSongsPlay,
});
