export type CatalogType =
  | 'track'
  | 'artist'
  | 'album'
  | 'live'
  | 'show'
  | 'podcast'
  | 'theme'
  | 'episode'
  | 'favorites';

export type CatalogId = number | string;

export type Macro =
  | 'favorite'
  | 'od'
  | 'circle'
  | 'liveplaylistoldformat1'
  | 'liveplaylist'
  | 'next';

export type ImageFormat =
  | 'auto'
  | 'source'
  | 'webp'
  | '-webp'
  | 'png'
  | '-png'
  | 'jpg'
  | '-jpg'
  | 'jpeg'
  | '-jpeg'
  | 'gif'
  | '-gif';

export type AnchorDirection = 'top' | 'right' | 'bottom' | 'left';

export type MergeComposite =
  | 'over'
  | 'multiply'
  | 'copy_opacity'
  | 'dsatop'
  | 'dstin';

export const GravityRegions = Object.freeze({
  Center: 'center',
  North: 'north',
  Northeast: 'northeast',
  East: 'east',
  Southeast: 'southeast',
  South: 'south',
  Southwest: 'southwest',
  West: 'west',
  Northwest: 'northwest',
} as const);

export type GravityRegion =
  (typeof GravityRegions)[keyof typeof GravityRegions];
