export const FEATURED_PODCAST_CATEGORY = 'Featured';

export enum Collections {
  FeaturedPodcasts = 'collections/featured-podcasts',
  PlaylistDirectory = 'collections/playlist-directory',
  PlaylistGenres = 'collections/genre-playlists',
  PodcastCategories = 'collections/podcast-categories',
  PodcastDirectory = 'collections/podcast-directory',
  PopularPodcasts = 'collections/popular-podcasts',
  PodcastNetworks = 'collections/podcast-networks',
  PlaylistDecades = 'collections/decades',
  PlaylistActivities = 'collections/perfect-for',
}

export enum Facets {
  FeaturedPlaylists = 'facets/featured-playlists',
  Decades = 'facets/decades',
  MoodsActivities = 'facets/moods-activities',
}

export enum PodcastLeads {
  PodcastArticlesLoaded = 'Podcast/PODCAST_ARTICLES_LOADED',
  ReceivedFollowed = 'Podcast/RECEIVED_FOLLOWED',
  ReceivedNetworks = 'Podcast/RECEIVED_NETWORKS',
  ReceivedPodcastCategories = 'Podcast/RECEIVED_PODCAST_CATEGORIES',
  ReceivedPodcastCategory = 'Podcast/RECEIVED_PODCAST_CATEGORY',
  ReceivedPodcasts = 'Podcast/RECEIVED_PODCASTS',
  SetIsFollowed = 'Podcast/SET_IS_FOLLOWED',
  SetPodcastCategoryIDs = 'Podcast/SET_PODCAST_CATEGORY_IDS',
  SetPodcastEpisodePlayProgress = 'Podcast/SET_PODCAST_EPISODE_PLAY_PROGRESS',
  SetPodcastHosts = 'Podcast/SET_PODCAST_HOSTS',
  SetPodcastProfile = 'Podcast/SET_PODCAST_PROFILE',
}

export enum Episode {
  ReorderPodcastEpisodes = 'Episode/REORDER_PODCAST_EPISODES',
  SetPodcastEpisodes = 'Episode/SET_PODCAST_EPISODES',
}
