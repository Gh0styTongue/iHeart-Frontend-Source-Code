export type {
  FeaturedPlaylistsRequestData,
  FeaturedPodcastsRequestData,
  PopularPodcastsRequestData,
  StreamInfoWithTimesQuery,
} from './leads/index.js';
import {
  artistInterviews,
  artistNews,
  spotlightContent,
  trending,
} from './content/index.js';
import { artistContests } from './contests/artist-contests.js';
import { liveStationContests } from './contests/live-station-contests.js';
import {
  featuredPlaylists,
  featuredPodcasts,
  leads,
  playlistDirectory,
  playlistGenres,
  podcastNetworks,
  podcastTopics,
  popularPodcasts,
  stream,
} from './leads/index.js';
import { playlistDirectoriesItems } from './list/playlists-directories-items.js';
import { playlistDirectoriesMoodsGenres } from './list/playlists-directories-moods-genres.js';
import { podcastTranscription } from './podcast-transcription/index.js';
import { homepageBanner, podcastHosts, podcastNews } from './pubsub/index.js';
import { liveProfile, popularNews } from './sites/index.js';
import { recentlyPlayedEnabled } from './streamsV2/streams.js';

export * from './leads/constants.js';
export type { PlaylistSubdirectoryResponse } from './leads/index.js';
export { PlaylistSubdirectoryResponseSchema } from './leads/index.js';
export type { HomepageBannerData } from './pubsub/index.js';
export * from './sites/constants.js';
export type { PopularNewsRequestData } from './sites/index.js';

export const queries = {
  artistContests,
  artistInterviews,
  artistNews,
  leads,
  homepageBanner,
  popularPodcasts,
  featuredPodcasts,
  playlistDirectory,
  playlistDirectoriesItems,
  playlistDirectoriesMoodsGenres,
  playlistGenres,
  featuredPlaylists,
  podcastNetworks,
  podcastTranscription,
  liveProfile,
  liveStationContests,
  popularNews,
  podcastTopics,
  podcastHosts,
  podcastNews,
  recentlyPlayedEnabled,
  stream,
  trending,
  spotlightContent,
};
