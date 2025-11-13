import type { Companion } from './player:schemas.js';
// import type { Playback } from './player:types.js';

export enum VASTPerformanceMarkers {
  Start = 'before-getCompanionVAST',
  End = 'after-getCompanionVAST',
  Name = 'roundTrip-getCompanionVAST',
}

export type ParsedMetadata = {
  TPID?: number;
  song_spot?: 'F' | 'M' | 'T';
};

export type CommentAdMarkers = {
  identifier: string;
  offset: number;
  start: number;
  end: number;
  duration: number;
} & { [k: string]: any };

export type SplotBockMarkers = {
  offset: number;
  duration: number;
};

export type ParsedComment = {
  adContext?: string | null; // The VAST url
  adMarkers?: Partial<CommentAdMarkers>[];
  spotBlockMarker?: Partial<SplotBockMarkers>;
};

export type RawMetadata = {
  COMM?: string;
  // COMM?: string | { ENG: string };
  // TXXX?: {
  //   URL?: string;
  // };
};

type TimeEvent = {
  uri: string;
  offset?: number | null;
};

type Event = Omit<TimeEvent, 'offset'>;

export type CompanionAd = {
  id?: string;
  height: number;
  width: number;
  altText?: string | null;
  uri: string;
  clickThrough?: string;
  creativeType?: string;
  events?: CompanionEvents;
};

export type Creative = Companion & {
  events?: CreativeEvents;
};

export type CreativeEvents = {
  creativeView?: Event[];
};

export type CreativeWithCompanion = {
  creative: Creative;
  companion: CompanionAd;
};

export type Creatives = {
  STATIC?: CreativeWithCompanion;
  HTML?: CreativeWithCompanion;
  IFRAME?: CreativeWithCompanion;
};

export type CompanionEvents = {
  mute?: Event[];
  unmute?: Event[];
};

export type CompanionVAST = {
  id?: string | number;
  creatives: Creatives;
  duration?: number | null;
  tag?: string;
};

export type ProcessedCompanions = Array<{
  companion: CompanionVAST;
  delay: number;
  identifier?: string;
  previousAdMarkers?: CommentAdMarkers;
  offsetTimeEvents?: number;
}>;

export type ProcessedMetadata = {
  type: 'companion';
  data: ProcessedCompanions;
};
// | {
//     type: 'meta';
//     data: Playback.Metadata;
//   }
