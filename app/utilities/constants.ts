import { METADATA_DOMAIN } from '@iheartradio/web.remix-shared/metadata/constants.js';
import type { Routes as RouteParams } from 'safe-routes';

import type { Market } from '~app/api/types';

// Currently these are the only three "Made for you" playlists we provide users with.
// If this changes in the future, we will need to update this array, or find a way to dynamically
// grab these ids, such as a new API endpoint. Additionally, the ids are stored in a Set since
// a Set is more performant than a Map.
export const madeForYouPlaylistIds = new Set(['new4u', 'chill4u', 'workout4u']);
export const NON_MUSIC_GENRES = [9, 15, 98, 93];
export const NON_PLAYLIST_GENRE = [3, 10, 13, 8, 19];

export const DEFAULT_POPULAR_GENRES = 102;
export const PODCAST_POPULAR_CATEGORY_ID = 82;
export const DEFAULT_TIMEZONE = 'America/New_York';
export const DEFAULT_TIMEZONE_ABBREVIATION = 'EST';

export const INPUT_MAX_LENGTH_DEFAULT = 100;

export const ITEMS_FOR_ARTIST_PROFILE = 12;
export const ITEMS_FOR_ALBUM_PROFILE = 12;
export const METADATA_APP_LOGO =
  'https://www.iheart.com/public/assets/fb_logo.png';
export const METADATA_APPLE_TOUCH_ICON =
  'https://www.iheart.com/public/assets/apple-touch-icon.png';
export const METADATA_GLOBAL_TITLE =
  'Listen to Your Favorite Music, Podcasts, and Radio Stations for Free!';
export const METADATA_GLOBAL_KEYWORDS =
  'iHeart, iHeartRadio, Internet, Music, Talk, Listen, Live, Artist, Song, Playlist, On Demand, Discover, Personalized, Free, App, Online';
export const METADATA_GLOBAL_DESCRIPTION =
  'All your favorite music, podcasts, and radio stations available for free. Listen to thousands of live radio stations or create your own artist stations and playlists. Get the latest music and podcasts, from your favorite artists and creators.';
export const METADATA_PLAYER_DIMENSIONS = { width: '450', height: '300' };
export const METADATA_DEFAULT_CANONICAL = `https://www.${METADATA_DOMAIN}/`;
export const METADATA_DEFAULT_IMAGE = METADATA_APP_LOGO;
export const DELETE_PLAYLIST_ACTION = 'DELETE_PLAYLIST_ACTION';
export const RENAME_PLAYLIST_ACTION = 'RENAME_PLAYLIST_ACTION';
export const ALL_GENRE = 'All Genres';
export const ADD_TO_PLAYLIST_AUTHENTICATION_MESSAGE =
  'Log in to add this to your playlist and access Your Library';
export const ADD_TO_PRESET_AUTHENTICATION_MESSAGE =
  'Log in to preset your favorite content for quick and easy access';
export const LISTEN_LYRICS_MESSAGE =
  'Log in to access lyrics for millions of songs.';
export const RECENTLY_PLAYED_MESSAGE = 'Log in to edit Recently Played';
export const SCAN_AUTHENTICATION_MESSAGE =
  'Log in to scan your favorite live radio stations';
export const LIBRARY_AUTHENTICATION_MESSAGE =
  'Log in to save your favorites and access Your Library';

type Routes = keyof RouteParams;
type RouteMap = { [key: string]: Routes | RouteMap };

export type ItemSelectedParams = {
  pageName: string;
  index: number;
  sectionPosition: number;
  itemPosition: number;
  section: string;
  tab?: string;
  globalStation?: { id: string; name: string };
};

export const Routes = Object.freeze({
  Album: Object.freeze({
    Tracklist: '/artist/:artistSlug/albums/:albumSlug',
    NowPlaying: '/artist/:artistSlug/albums/:albumSlug/now-playing',
  }),
  Artist: Object.freeze({
    Contests: '/artist/:artistSlug/contests',
    Artist: '/artist/:artistSlug',
    NowPlaying: '/artist/:artistSlug/now-playing',
  }),
  ArtistAlbums: '/artist/:artistSlug/albums',
  ArtistSongs: '/artist/:artistSlug/songs',
  Favorites: Object.freeze({
    Station: '/favorites/:userId?',
    NowPlaying: '/favorites/:userId?/now-playing',
  }),
  Home: '/',
  Library: Object.freeze({
    Playlists: Object.freeze({
      Added: '/library/playlists/added',
      Created: '/library/playlists/created',
      MadeForYou: '/library/playlists/made-for-you',
      Root: '/library/playlists',
    }),
    Podcasts: '/library/podcasts',
    Root: '/library',
  }),
  Live: Object.freeze({
    Contests: '/live/:liveSlug/contests',
    Station: '/live/:liveSlug',
    NowPlaying: '/live/:liveSlug/now-playing',
  }),
  Playlist: Object.freeze({
    Directory: '/playlist',
    Tracklist: '/playlist/:playlistSlug',
    NowPlaying: '/playlist/:playlistSlug/now-playing',
  }),
  Podcast: Object.freeze({
    About: '/podcast/:podcastSlug/about',
    Categories: '/podcast/category/:categorySlug',
    Directory: '/podcast',
    Episodes: '/podcast/:podcastSlug',
    Networks: '/podcast/networks/:networkSlug',
    NowPlaying: '/podcast/:podcastSlug/now-playing',
    Search: '/podcast/:podcastSlug/search',
  }),
  Radio: '/radio',
  RecentlyPlayed: '/recently-played',
  Search: '/search',
}) satisfies RouteMap;

export const HideSearchElevationRoutes = [
  Routes.Artist.Artist,
  Routes.Album.Tracklist,
  Routes.Favorites.Station,
  Routes.Live.Station,
  Routes.Playlist.Tracklist,
  Routes.Podcast.Episodes,
] as const;

export const REG_GATE_TRIGGER_TYPES = {
  ADD_TO_PLAYLIST: 'add_to_playlist',
  ADD_TO_PRESET: 'add_to_preset',
  ARTIST_STATION_FAVORITE: 'artist_station_favorite',
  ARTIST_STATION_THUMB: 'artist_station_thumb',
  FEATURED_PODCASTS: 'featured_podcasts',
  LISTEN_LYRICS: 'listen_lyrics',
  LIVE_STATION_FAVORITE: 'live_station_favorite',
  LIVE_STATION_THUMB: 'live_station_thumb',
  LOG_IN: 'log_in',
  MADE_FOR_YOU: 'made_for_you',
  PLAYLIST_FAVORITE: 'playlist_favorite',
  PODCAST_FAVORITE: 'podcast_favorite',
  RECENTLY_PLAYED: 'recently_played',
  SIGN_UP: 'sign_up',
  SCAN: 'scan',
} as const;

export type AnalyticsContext =
  (typeof AnalyticsContext)[keyof typeof AnalyticsContext];
export const AnalyticsContext = {
  Row: 'row',
  Carousel: 'carousel',
  Grid: 'grid',
  List: 'list',
  Overflow: 'overflow',
};

export enum LibraryActions {
  Follow = 'FOLLOW',
  Unfollow = 'UNFOLLOW',
  Delete = 'DELETE',
}

export enum FollowUnfollowContentTypes {
  Artist = 'artist',
  Live = 'live',
  Podcast = 'podcast',
  Playlist = 'playlist',
}

export enum AnalyticsSaveTypes {
  Follow = 'follow',
  Unfollow = 'unfollow',
}

export enum PlaylistDialogActions {
  Rename = 'rename',
  Delete = 'delete',
  Create = 'create',
}

export enum ShareDialogActions {
  Share = 'share',
}

export enum EducationalFeatures {
  PodcastFilter = 'education-podcastFilter',
}

export const UPDATE_PREFERENCES = 'UPDATE_PREFERENCES' as const;

export const defaultUSMarket: Market = {
  city: 'New York',
  countryAbbreviation: 'US',
  countryId: '1',
  countryName: 'United States',
  loc: {
    lat: 40.748_001_098_632_81,
    lon: -73.986_000_061_035_16,
  },
  marketId: 159,
  name: 'NEWYORK-NY',
  stateAbbreviation: 'NY',
  stateId: '37',
  stateName: 'New York',
  stationCount: 73,
} as const;

export const defaultMXMarket: Market = {
  city: 'Ciudad de México',
  countryAbbreviation: 'MX',
  countryId: '4',
  countryName: 'México',
  loc: {
    lat: 19.420_000_076_293_945,
    lon: -99.129_997_253_417_97,
  },
  marketId: 802,
  name: 'CIUDADDEMEXICO-CMX',
  stateAbbreviation: 'CMX',
  stateId: '367',
  stateName: 'Ciudad de México',
  stationCount: 104,
} as const;

export const delayInPopOverCloseForMobile = 1000;

export const defaultHeroBackgroundColor = '$brand-white';

export const LYRICSEVENTS = {
  AUTODISMISS: 'auto_dismiss',
  CLICKSUCESS: 'click_success',
  DISMISS: 'dismiss',
  EXIT: 'exit',
  EXPAND: 'lyrics_expand',
  INCORRECTLYRICS: 'incorrect_lyrics',
  LOCATION: 'profile_player_button',
  LYRICSNOTSYNC: 'lyrics_not_sync',
  NOWPLAYINGTAB: 'now_playing',
  REQUESTLYRICS: 'request_lyrics',
  SCREEN: 'lyrics',
  SKIP: 'skip',
  SONGEND: 'song_end',
  STOP: 'stop',
  SYNCTOSONG: 'sync_to_song',
} as const;

export const PRESETS_EVENTS = {
  ADD_PRESETS: 'add_presets',
  CLICK_SUCCESS: 'click_success',
  MINI_PLAYER: 'miniplayer_button',
  MINIPLAYER_OVERFLOW: 'miniplayer_overflow',
  NOW_PLAYING: 'now_playing',
  OVERFLOW_MENU: 'overflow_menu',
  PRESETS_LOGIN: 'presets_login',
  PRESETS_MENU: 'presets_menu',
  PRESETS: 'presets',
  PROFILE_PLAYER: 'profile_player',
  REMOVE_PRESETS: 'remove_presets',
  USER_DISMISS: 'user_dismiss',
} as const;

export const REG_GATE_TOAST_MESSAGE_TYPE = {
  PRESETS: 'presets_reg_gate',
  SCAN: 'scan_reg_gate',
  RECENTLY_PLAYED: 'recently_played_reg_gate',
  LYRICS: 'lyrics_reg_gate',
  FOLLOW: 'follow_reg_gate',
  THUMBS: 'thumbs_reg_gate',
  ADD_TO_PLAYLIST: 'add_playlists_reg_gate',
} as const;

export const UPSELL_MESSAGE_TYPE = {
  SKIP: 'skip_upsell',
  PRIMIUM: 'premium_song_upsell',
  PLAYLIST: 'playlist_upsell',
  SHUFFLE: 'shuffle_upsell',
} as const;

export const REG_GATE_TOAST_EXIT_TYPE = {
  AUTO_DISMISS: 'auto_dismiss',
  USER_DISMISS: 'user_dismiss',
  CLICK_SUCCESS: 'click_success',
} as const;

export type PayloadTriggerType =
  (typeof PAYLOAD_TRIGGER_TYPES)[keyof typeof PAYLOAD_TRIGGER_TYPES];
export const PAYLOAD_TRIGGER_TYPES = {
  ADD_TO_PLAYLIST: 'add_to_playlist',
  FOLLOW: 'follow',
  LYRICS: 'lyrics',
  PLAYLIST: 'playlist',
  PREMIUM: 'premium_song',
  PRESETS_POPOVER: 'presets_popover',
  PRESETS: 'presets',
  RECENTLY_PLAYED: 'recently_played',
  SCAN: 'scan',
  SHUFFLE: 'shuffle',
  SKIP: 'skip',
  THUMBS: 'thumbs',
} as const;

export const ANALYTICS_ORIGIN = {
  LISTEN: 'listen',
} as const;

export const ANALYTICS_LOCATION = {
  NOW_PLAYING: 'now_playing',
  MINIPLAYER_BUTTON: 'miniplayer_button',
  MINIPLAYER_OVERFLOW: 'miniplayer_overflow',
  PROFILE_PLAYER: 'profile_player',
  OVERFLOW_MENU: 'overflow_menu',
  CAROUSEL: 'carousel',
  ROW: 'row',
  HERO: 'hero_button',
  HERO_COLLAPSED: 'hero_button_collapsed',
} as const;

export type RegGateToastMessageType =
  (typeof REG_GATE_TOAST_MESSAGE_TYPE)[keyof typeof REG_GATE_TOAST_MESSAGE_TYPE];

export type RegGateToastExitType =
  (typeof REG_GATE_TOAST_EXIT_TYPE)[keyof typeof REG_GATE_TOAST_EXIT_TYPE];

export type AnalyticsLocationType =
  (typeof ANALYTICS_LOCATION)[keyof typeof ANALYTICS_LOCATION];

export const stickyItems = {
  desktopLeftNav: '31.6rem',
  desktopPlayerHeight: '8.8rem',
  desktopSearch: '6.4rem',
  largeProfileTab: '27.8rem',
  largeProfileTabCollapsed: '13.6rem',
  mediumHeroHeight: '21.4rem',
  mediumHeroHeightCollapsed: '7.2rem',
  mediumProfileTab: '26.2rem',
  mediumProfileTabCollapsed: '12rem',
  mobileHeroHeight: '12.8rem',
  mobileHeroHeightCollapsed: '4.8rem',
  mobileNav: '4.8rem',
  mobilePlayerHeight: '6.4rem',
  mobileProfileTab: '17.6rem',
  mobileProfileTabCollapsed: '9.6rem',
} as const;

export const fallbackImage =
  'https://i.iheart.com/v3/url/aHR0cHM6Ly92aWEucGxhY2Vob2xkZXIuY29tLzUwMD90ZXh0PTE=' as const;

export const isServer = typeof window === 'undefined' || 'Deno' in globalThis;
export const isClient = !isServer;

export const followUnfollowMessage = {
  followStationMobile: 'Added to Library',
  followStationDesktop: 'added to Library',
  unfollowStationMobile: 'Removed from Library',
  unfollowStationDesktop: 'removed from Library',
};

export const domainForSocialShare = 'https://www.iheart.com';
