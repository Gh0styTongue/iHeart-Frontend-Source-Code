import type { FollowPlaylistKeys } from './types';

// function tokenizeFilters(filters: LibraryPlaylistsFilters) {
//   return Object.entries(filters)
//     .reduce((accumulator, [key, value]) => {
//       if (value) {
//         accumulator.push(key);
//       }
//       return accumulator;
//     }, [] as string[])
//     .sort();
// }

export const playlistKeys = {
  all: ['playlists'] as const,
  followed: ['playlists', 'followed'] as const,
  created: ['playlists', 'created'] as const,
  myPlaylist: ['playlists', 'my-playlist'] as const,
  recs: ['playlists', 'recs'] as const,
  recsPersonalized: (includePersonalized: boolean) =>
    [...playlistKeys.recs, includePersonalized] as const,
  collections: (countryCode: string, category: string, subcategory: string) =>
    [
      ...playlistKeys.all,
      'collections',
      countryCode,
      category,
      subcategory,
    ] as const,
  decades: (countryCode: string, locale: string) =>
    [...playlistKeys.all, 'decades', countryCode, locale] as const,
  featured: (countryCode: string, locale: string) => [
    ...playlistKeys.all,
    'featured',
    countryCode,
    locale,
  ],
  genres: (countryCode: string, locale: string) =>
    [...playlistKeys.all, 'genres', countryCode, locale] as const,
  genresAndMoods: (countryCode: string, locale: string) =>
    [...playlistKeys.all, 'genresAndMoods', countryCode, locale] as const,
  // followedByFilter: (filters: LibraryPlaylistsFilters) =>
  //   [...playlistKeys.followed, ...tokenizeFilters(filters)] as const,
  isFollowing: ({ id, userId }: FollowPlaylistKeys) =>
    [...playlistKeys.one({ id, userId }), 'isFollowing'] as const,
  moods: (countryCode: string, locale: string) =>
    [...playlistKeys.all, 'moods', countryCode, locale] as const,
  one: ({ id, userId }: FollowPlaylistKeys) =>
    [...playlistKeys.all, `${userId}-${id}`] as const,
};

export const PLAYLIST_GENRE_TAG = 'playlist-genres/';
export const PLAYLIST_MOOD_TAG = 'activities/';
