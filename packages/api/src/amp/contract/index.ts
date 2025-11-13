/* eslint-disable barrel-files/avoid-barrel-files */
import { initContract } from '@ts-rest/core';

import { v1Contract } from './v1/index.js';
import { v2Contract } from './v2/index.js';
import { v3Contract } from './v3/index.js';

const c = initContract();

export const ampContract = c.router(
  {
    v1: v1Contract,
    v2: v2Contract,
    v3: v3Contract,
  },
  {
    strictStatusCodes: true,
  },
);

export type {
  GetGenreResponse,
  GetLiveStationsResponse,
} from './v2/content.js';
export type {
  AddStationResponseBody,
  GetFavoritesStationResponse,
} from './v2/playlists.js';
export type { Recommendation } from './v2/recs.js';
export type { ArtistProfile } from './v3/artists.js';
export type { GetCollection } from './v3/collection.js';
export type {
  GetStationMetaResponseBody,
  StreamTrackHistory,
} from './v3/livemeta.js';
export { GetStationMetaResponseBodySchema } from './v3/livemeta.js';
export type {
  GetPodcast,
  PodcastFilter,
  PodcastFilterAndSort,
  PodcastPreferencesPayload,
  PodcastSort,
  UpdateFilterPreferences,
} from './v3/podcast.js';
export {
  ActionTypeValues,
  PodcastFilterAndSortSchema,
  PodcastFilterIdSchema,
  PodcastFilterIdValues,
  PodcastFilterSchema,
  PodcastSortSchema,
  PodcastSortValues,
} from './v3/podcast.js';
export type {
  GetPresetsResponse,
  PresetKeys,
  PresetPayload,
  PresetsTypes,
  PutPresetsRequestBody,
  PutThumbTrackRequestBody,
} from './v3/profiles.js';
export {
  PresetsSchema,
  ThumbRadioStationTypes,
  ThumbsStationTypes,
} from './v3/profiles.js';
export type { GetGenreArtistRecsResponseBody } from './v3/recs.js';
