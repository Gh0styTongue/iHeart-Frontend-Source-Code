import { slugify } from '@iheartradio/web.utilities/string/slugify';
import { isTruthy } from 'remeda';
import { $path } from 'safe-routes';

import type { Genres } from '~app/api/types';

import { makeArtistSlug } from './slugs/artist-slug';
import { makeAlbumSlug } from './slugs/get-album-profile-slug';
import { makeLiveStationSlug } from './slugs/get-live-profile-slug';
import { makePlaylistSlug } from './slugs/get-playlist-profile-slug';
import { makePodcastSlug } from './slugs/get-podcast-profile-slug';

/**
 * Generates a Playlist profile link
 * @param name The playlist name
 * @param slug (Optional) The playlist slug - this is the fallback if `name` is not provided
 * @param userId The user's profile Id
 * @param id The playlist Id
 * @returns The slugified playlist URL
 *
 * Example: `/playlist/curated-by-lauv-312064750-FSmzxQXiivrukGyQWzRd5G`
 */
export function buildPlaylistUrl({
  name,
  slug,
  userId,
  id,
}: {
  name: string;
  slug?: string;
  userId: number | string;
  id: string;
}) {
  const playlistSlug = makePlaylistSlug({ name, slug, id, userId });
  if (playlistSlug) {
    return $path('/playlist/:playlistSlug', { playlistSlug });
  }
}

/**
 * Generates a Artist profile link
 * @param id The artist id
 * @param name The artist name
 * @returns The slugified artist URL
 *
 * Example: `/artist/title-fight-262247`
 */
export function buildArtistUrl({
  id,
  name,
}: {
  id: string | number;
  name: string;
}) {
  const artistSlug = makeArtistSlug(name, id);
  return $path(`/artist/:artistSlug`, { artistSlug });
}

/**
 * Generates a Album profile link
 * @param artist Object containing an `id` and `name`
 * @param artist.id The artist id
 * @param artist.name The artist name
 * @param album Object containing an `id` and `name`
 * @param album.id The album id
 * @param album.name The album name
 * @returns The slugified album URL
 *
 * Example: `/artist/title-fight-262247/albums/floral-green-172498776`
 */
export function buildAlbumUrl({
  artist,
  album,
}: {
  artist: { id: string | number; name: string };
  album: { id: number | string; name: string };
}) {
  const { id: artistId, name: artistName } = artist;
  const artistSlug = makeArtistSlug(artistName, artistId);

  const { id: albumId, name: albumName } = album;
  const albumSlug = makeAlbumSlug(albumName, albumId);

  return $path(`/artist/:artistSlug/albums/:albumSlug`, {
    artistSlug,
    albumSlug,
  });
}

/**
 * Generates a Artist Albums profile link
 * @param id The artist id
 * @param name The artist name
 * @returns The slugified artist albums URL
 *
 * Example: `/artist/dwellings-31342830/albums`
 */
export function buildArtistAlbumsUrl({
  id,
  name,
}: {
  id: string | number;
  name: string;
}) {
  const artistSlug = makeArtistSlug(name, id);
  return $path('/artist/:artistSlug/albums', { artistSlug });
}

/**
 * Generates a Song profile link
 * @param artist Object containing an `id` and `name`
 * @param artist.id The artist id
 * @param artist.name The artist name
 * @param track Object containing an `id` and `name`
 * @param track.id The track id
 * @param track.name The track name
 * @returns The slugified link
 *
 * Example: `/artist/bastille-662807/song/pompeii-23092888`
 */
export function buildSongUrl({
  artist,
  track,
}: {
  artist: { id: string | number; name: string };
  track: { id: number | string; name: string };
}) {
  const { id, name } = artist;
  const artistSlug = makeArtistSlug(name, id);

  const { id: trackId, name: trackName } = track;
  const trackSlug = `${slugify(trackName)}-${trackId}`;

  return $path(`/artist/:artistSlug/songs/:trackSlug`, {
    artistSlug,
    trackSlug,
  });
}

/**
 * Generates a Artist Top Songs profile link
 * @param id The artist id
 * @param name The artist name
 * @returns The slugified artist top songs URL
 *
 * Example: `/artist/household-219147/songs`
 */
export function buildArtistTopSongsUrl({
  id,
  name,
}: {
  id: string | number;
  name: string;
}) {
  const artistSlug = makeArtistSlug(name, id);
  return artistSlug ?
      $path('/artist/:artistSlug/songs', { artistSlug })
    : undefined;
}

/**
 * Generates a Podcast profile link
 * @param podcastId The podcast Id
 * @param slug The podcast slug
 * @returns The slugified podcast URL
 *
 * Example: `/podcast/269-smartless-68519170`
 */
export function buildPodcastUrl({
  podcastId,
  slug,
}: {
  slug?: string;
  podcastId: string | number;
}) {
  const podcastSlug = makePodcastSlug(slug, podcastId);
  return $path('/podcast/:podcastSlug', { podcastSlug });
}

/**
 * Generates a Podcast Episode profile link
 * @param podcastId The podcast Id
 * @param podcastName The podcast name
 * @param episodeId The podcast episode Id
 * @param episodeName The podcast episode name
 * @returns The slugified podcast episode URL
 *
 * Example: `/podcast/269-smartless-68519170/episode/david-beckham-177855388`
 */
export function buildPodcastEpisodeUrl({
  podcastId,
  podcastSlug,
  episodeId,
  episodeName,
}: {
  podcastId?: string | number;
  podcastSlug?: string;
  episodeId?: number | string;
  episodeName?: string;
}) {
  const finalPodcastSlug = makePodcastSlug(podcastSlug, podcastId);

  const episodeSlugAndId =
    isTruthy(episodeId) && isTruthy(episodeName) ?
      `${slugify(episodeName)}-${episodeId}`
    : isTruthy(episodeId) ? `${episodeId}`
    : null;

  return finalPodcastSlug && episodeSlugAndId ?
      $path('/podcast/:podcastSlug/episode/:episodeSlug', {
        podcastSlug: finalPodcastSlug,
        episodeSlug: episodeSlugAndId,
      })
    : undefined;
}

/**
 * Generates a Podcast search link
 * @param podcastId The podcast Id
 * @param slug The podcast slug
 * @returns The slugified podcast search URL
 *
 * Example: `/podcast/269-smartless-68519170/search`
 */
export function buildPodcastSearchUrl({
  podcastId,
  slug,
}: {
  slug?: string;
  podcastId: string | number;
}) {
  const podcastSlug = makePodcastSlug(slug, podcastId);
  return $path('/podcast/:podcastSlug/search', { podcastSlug });
}

/**
 * Generates a Live profile link
 * @param name The live station name
 * @param id The live station Id
 * @returns The slugified live station URL
 *
 * Example: `/live/wild-949-305`
 */
export function buildLiveUrl({
  name,
  id = '',
}: {
  name?: string;
  id?: number | string;
}) {
  const liveSlug = makeLiveStationSlug(name, id);
  return $path('/live/:liveSlug', { liveSlug });
}

/**
 * Generates a Live Genre profile link
 * @param genreId Genre id needed to replace (id) in "/:genreId"
 * @returns the link
 */
export function buildLiveDirectoryGenreUrl({
  genreSlug,
}: {
  genreSlug: string;
}) {
  return $path('/radio/genre/:genreSlug', { genreSlug });
}

export function buildRadioArtistGenreUrl({
  genre,
}: {
  genre: Pick<Genres[number], 'genreName' | 'id'>;
}) {
  const genreSlug = slugify(`${genre.genreName} ${genre.id}`);
  return $path('/radio/genre/:genreSlug', { genreSlug });
}

/**
 * Generates a Playlist Genre profile link
 * @param genreType Genre type needed to replace (id) in "/:genreType"
 * @param genreSlug Genre slug needed to replace (id) in "/:genreSlug"
 * @returns the link
 */
export function buildPlaylistGenreUrl({
  genreType,
  genreSlug,
}: {
  genreType: string;
  genreSlug: number | string;
}) {
  return $path('/playlist/:genreType/:genreSlug', {
    genreType,
    genreSlug: String(genreSlug),
  });
}

/**
 * Generates a Podcast Category link
 * @param categorySlug Category Slug
 * @returns string
 */
export function buildPodcastDirectoryCategoryUrl({
  categorySlug,
}: {
  categorySlug: string;
}) {
  return $path('/podcast/category/:categorySlug', {
    categorySlug,
  });
}

/**
 * Generates a Podcast Network link
 * @param networkSlug Network Slug
 * @returns string
 */
export function buildPodcastDirectoryNetworkUrl({
  networkSlug,
}: {
  networkSlug: string;
}) {
  return $path('/podcast/networks/:networkSlug', { networkSlug });
}
