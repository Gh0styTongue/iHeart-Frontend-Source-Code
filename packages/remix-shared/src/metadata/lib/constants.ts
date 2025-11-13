export const METADATA_TWITTER_HANDLE = '@iHeartRadio';
export const METADATA_DOMAIN = 'iheart.com';
export const METADATA_TITLE_SEPARATOR = '|';
export const METADATA_APP_NAME = 'iHeart';
export const METADATA_VIDEO_TYPE = 'text/html';
export const METADATA_AUDIO_TYPE = 'audio/vnd.facebook.bridge';
export const METADATA_DESCRIPTION_LENGTH = 165;

// TODO: expand with more types/sub-types, ref: https://ogp.me/#types
export enum METADATA_OPENGRAPH_TYPES {
  Website = 'website',
  Station = 'music.radio_station',
  Video = 'video',
  Playlist = 'music.playlist',
  Album = 'music.album',
  Song = 'music.song',
  Songs = 'profile',
}

export enum METADATA_OPENGRAPH_SUB_TYPES {
  Musician = 'music:musician',
  Creator = 'music:creator',
}

export enum METADATA_TWITTER_CARDS {
  Summary = 'summary',
  Audio = 'audio',
  SummaryLarge = 'summary_large_image',
}

export enum METADATA_LINK_REL_VALUES {
  Canonical = 'canonical',
  ImageSource = 'image_src',
}

export const METADATA_DEFAULT_IMAGE = `https://i.iheart.com/v3/re/assets.brands/684080ee590940633d98561b?ops=resize(480,0),quality(90)`;
export const METADATA_DEFAULT_CANONICAL = `https://www.${METADATA_DOMAIN}/`;
export const METADATA_GLOBAL_KEYWORDS =
  'iHeart, iHeartRadio, Radio, Internet, Music, Talk, Listen, Live, Artist, Song, Playlist, On Demand, Discover, Personalized, Free, App, Online';
export const METADATA_GLOBAL_TITLE =
  'Listen to Your Favorite Music, Podcasts, and Radio Stations for Free!';
export const METADATA_APPLE_TOUCH_ICON = METADATA_DEFAULT_IMAGE;
export const METADATA_GLOBAL_DESCRIPTION =
  'All your favorite music, podcasts, and radio stations available for free. Listen to thousands of live radio stations or create your own artist stations and playlists. Get the latest music and podcasts, from your favorite artists and creators.';
