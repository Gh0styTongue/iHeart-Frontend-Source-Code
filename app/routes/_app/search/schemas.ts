import { z } from 'zod';

export const searchStatusSchema = z.enum([
  'ResultsFound',
  'NoResults',
  'Empty',
  'Error',
]);

export type SearchStatusType = z.infer<typeof searchStatusSchema>;

export const SearchStatus = searchStatusSchema.enum;

const searchFilterSchemaEnum = z.enum([
  'all',
  'live',
  'artists',
  'podcasts',
  'songs',
  'albums',
  'playlists',
]);
export const SearchFilter = searchFilterSchemaEnum.enum;

export type SearchFilterType = z.infer<typeof searchFilterSchemaEnum>;

export const searchFilterSchema = searchFilterSchemaEnum
  .nullable()
  // This is required instead of `default()` as that only handles `undefined`
  .transform(value => value ?? 'all');

export const searchTermSchema = z
  .string()
  .trim()
  .max(100)
  .nullable()
  .transform(search => search ?? '');

export const nextPageSchema = z.string().nullable().optional();

export const searchTypeEnum = z.enum([
  'KEYWORDS',
  'STATION',
  'ARTIST',
  'ALBUM',
  'PODCAST',
  'TRACK',
  'PLAYLIST',
]);
export const SearchType = searchTypeEnum.enum;

const ArtistResultSchema = z.object({
  typeName: z.literal(searchTypeEnum.enum.ARTIST),
  id: z.number(),
  image: z.string().url().optional(),
  name: z.string(),
});
export type ArtistResult = z.infer<typeof ArtistResultSchema>;

const AlbumResultSchema = z.object({
  artistId: z.number(),
  artistName: z.string(),
  explicitLyrics: z.boolean(),
  id: z.number(),
  image: z.string().url(),
  title: z.string(),
  typeName: z.literal(searchTypeEnum.enum.ALBUM),
});
export type AlbumResult = z.infer<typeof AlbumResultSchema>;

const TrackResultSchema = z.object({
  albumName: z.string(),
  albumId: z.number(),
  artistId: z.number(),
  artistName: z.string(),
  explicitLyrics: z.boolean(),
  id: z.number(),
  image: z.string().url(),
  title: z.string(),
  typeName: z.literal(searchTypeEnum.enum.TRACK),
});
export type TrackResult = z.infer<typeof TrackResultSchema>;

const PlaylistResultSchema = z.object({
  description: z.string().optional(),
  id: z.string(),
  name: z.string(),
  reportingKey: z.string(),
  typeName: z.literal(searchTypeEnum.enum.PLAYLIST),
  urls: z.object({
    web: z.string().url(),
    image: z.string().url(),
  }),
  userId: z.string(),
});
export type PlaylistResult = z.infer<typeof PlaylistResultSchema>;

const PodcastResultSchema = z.object({
  description: z.string().optional(),
  id: z.number(),
  image: z.string().url(),
  title: z.string(),
  typeName: z.literal(searchTypeEnum.enum.PODCAST),
});
export type PodcastResult = z.infer<typeof PodcastResultSchema>;

const StationResultSchema = z.object({
  description: z.string().nullable().optional(),
  id: z.number(),
  imageUrl: z.string().url(),
  name: z.string(),
  typeName: z.literal(searchTypeEnum.enum.STATION),
});
export type StationResult = z.infer<typeof StationResultSchema>;

const KeywordResultSchema = z.object({
  contentId: z.string(),
  contentType: z.string().nullable().optional(),
  description: z.string().nullable().optional(),
  id: z.number(),
  isFavorites: z.boolean().optional(),
  isMyPlaylist: z.boolean().optional(),
  imageUrl: z.string().url().nullable().optional(),
  name: z.string().nullable().optional(),
  typeName: z.literal(searchTypeEnum.enum.KEYWORDS),
  webUrl: z.string(),
});
export type KeywordResult = z.infer<typeof KeywordResultSchema>;

export const SearchResultSchema = z.discriminatedUnion('typeName', [
  ArtistResultSchema,
  AlbumResultSchema,
  TrackResultSchema,
  PlaylistResultSchema,
  PodcastResultSchema,
  StationResultSchema,
  KeywordResultSchema,
]);

export type SearchResult = z.infer<typeof SearchResultSchema>;
