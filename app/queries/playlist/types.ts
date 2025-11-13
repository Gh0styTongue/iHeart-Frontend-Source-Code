import type {
  AmpClient,
  ampContract,
  ClientInferResponseBody,
} from '@iheartradio/web.api/amp';
import type { PlaylistSubdirectoryResponse } from '@iheartradio/web.api/webapi';
import type { CountryCode } from '@iheartradio/web.config';
import type { ServerTimingFunction } from '@iheartradio/web.server-timing';
import { z } from 'zod';

import type { AnalyticsLocationType } from '~app/utilities/constants';

export type GetCollections = ClientInferResponseBody<
  typeof ampContract.v3.collection.getCollections
>;
export type FollowedPlaylist = GetCollections['data'][number];
export type NextPageKey = Exclude<
  GetCollections['links'],
  undefined
>['nextPageKey'];
export type Collection = ClientInferResponseBody<
  typeof ampContract.v3.collection.getCollection
>;

export type PlaylistRec = Pick<
  ClientInferResponseBody<
    typeof ampContract.v3.recs.getPlaylistRecs
  >['tiles'][number]['item'],
  'name' | 'description' | 'id' | 'userId' | 'followed' | 'premium' | 'curated'
> & { urls: { image?: string; web?: string } };

export type FollowPlaylistKeys = {
  id: string;
  userId: string | number;
  followContext?: AnalyticsLocationType;
};

export type CreatePlaylistKeys = {
  name: string;
  tracks?: number[];
  albumId?: number;
};

export const AddToPlaylistMutationSchema = z.discriminatedUnion('intent', [
  z.object({
    intent: z.literal('byTracks'),
    tracks: z.array(z.number()),
    collectionId: z.string(),
  }),
  z.object({
    intent: z.literal('byAlbum'),
    albumId: z.number(),
    collectionId: z.string(),
  }),
  z.object({
    intent: z.literal('byCollection'),
    collectionId: z.string(),
    sourceCollectionId: z.string(),
    playlistUserId: z.union([z.string(), z.number()]),
  }),
]);

export type AddToPlaylistMutationKeys = z.infer<
  typeof AddToPlaylistMutationSchema
>;
export type AddToPlaylistIntent = AddToPlaylistMutationKeys['intent'];

export type UpdatedPlaylist = ClientInferResponseBody<
  typeof ampContract.v3.collection.addTracksToCollection
>['data'];

export type FeaturedPlaylistsParameters = {
  time?: ServerTimingFunction;
  countryCode: CountryCode;
  locale: string;
};

export type LibraryPlaylistsFilters = {
  followed: boolean;
  personalized: boolean;
  created: boolean;
};

export type GetFollowedPlaylists = {
  playlists: FollowedPlaylist[];
  nextPageKey?: NextPageKey;
};

export type PlaylistCollectionParams = {
  amp: AmpClient;
  countryCode: string;
  category: string;
  locale: string;
  subcategory: string;
  time?: ServerTimingFunction;
  signal?: AbortSignal;
};

export type PlaylistSubdirectory =
  PlaylistSubdirectoryResponse['playlist_subdirectory'];
export type SubdirectoryPlaylist = PlaylistSubdirectory[number];

export type PlaylistDecadesParameters = {
  time?: ServerTimingFunction;
  countryCode: CountryCode;
  locale: string;
};

export type PlaylistGenresParameters = {
  time?: ServerTimingFunction;
  countryCode: CountryCode;
  locale: string;
};

export type PlaylistGenresAndMoodsParameters = {
  country: CountryCode;
  locale: string;
  time?: ServerTimingFunction;
};

export type PlaylistGenres = {
  [genre: string]: {
    tags: string[];
    title: string;
  };
};

export type PlaylistMoods = {
  [mood: string]: {
    tags: string[];
    title: string;
  };
};

export type PlaylistGenresAndMoodsResponse = {
  genres: PlaylistGenres;
  moods: PlaylistMoods;
};

export type PlaylistMoodsParameters = {
  time?: ServerTimingFunction;
  countryCode: CountryCode;
  locale: string;
};
