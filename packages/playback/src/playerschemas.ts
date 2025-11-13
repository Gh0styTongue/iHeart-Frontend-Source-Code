import { capitalize } from 'remeda';
import { z } from 'zod';

export enum Keyboard {
  ArrowDown = 'ArrowDown',
  ArrowLeft = 'ArrowLeft',
  ArrowRight = 'ArrowRight',
  ArrowUp = 'ArrowUp',
  M = 'm',
  S = 's',
  Space = ' ',
  O = 'o',
}

export enum MetadataType {
  Ad = 'ad',
  Episode = 'episode',
  Gracenote = 'gracenote',
  InStream = 'in-stream',
  Station = 'station',
  Track = 'track',
}

export enum QueueItemFormat {
  AAC = 'aac',
  HLS = 'hls',
  MP3 = 'mp3',
}

export enum QueueItemType {
  Episode = 'episode',
  Stream = 'stream',
  Track = 'track',
  Event = 'event',
}

export enum Repeat {
  No = 0,
  Yes = 1,
  One = 2,
}

export enum StationType {
  Album = 'album',
  Artist = 'artist',
  Favorites = 'favorites',
  Live = 'live',
  Playlist = 'playlist',
  PlaylistRadio = 'playlist-radio',
  Podcast = 'podcast',
  Scan = 'scan',
  TopSongs = 'top-songs',
}

export enum PreRollStations {
  Artist = 'artist',
  Favorites = 'favorites',
  Live = 'live',
  PlaylistRadio = 'playlist-radio',
  Podcast = 'podcast',
  Scan = 'scan',
}

export enum Speed {
  Slow = 0.5,
  Normal = 1,
  Fast = 1.25,
  Faster = 1.5,
  Fastest = 2,
}

export enum Status {
  Buffering = 'buffering',
  Idle = 'idle',
  Paused = 'paused',
  Playing = 'playing',
  Restart = 'restart',
}

export enum AudioAdProvider {
  Adswizz = 'ad-providers/adswizz',
  Triton = 'ad-providers/triton',
}

export enum AdType {
  Midroll = 'midroll',
  Preroll = 'preroll',
  Instream = 'instream',
}

export enum AdStatus {
  Request = 'request',
  Complete = 'complete',
  Error = 'error',
}

export enum AdFormat {
  Custom = 'custom',
  Live = 'live',
}

export enum AdPlayerStatus {
  Buffering = 'buffering',
  Idle = 'idle',
  Paused = 'paused',
  Playing = 'playing',
  Streaming = 'streaming',
  Done = 'done',
}

export const PlayerErrorSchema = z.object({
  code: z.string().optional(),
  data: z.union([z.record(z.string(), z.any()), z.array(z.any())]).optional(),
  message: z.string(),
  name: z.string(),
});

export const AdFormatSchema = z.nativeEnum(AdFormat);

export const AdTypeSchema = z.nativeEnum(AdType);

export const AdStatusSchema = z.nativeEnum(AdStatus);

export const AdPlayerStatusSchema = z.nativeEnum(AdPlayerStatus);

export const AudioAdProviderSchema = z.nativeEnum(AudioAdProvider);

export const LivePrerollAdTargetingSchema = z.object({
  ccrcontent2: z.string().optional(),
  ccrformat: z.string().optional(),
  ccrmarket: z.string().optional(),
  ccrpos: z.string().optional(),
  cust_params: z.record(z.unknown()).optional(),
  deviceType: z.union([z.literal('mobile'), z.literal('desktop')]).optional(),
  env: z.string().optional(),
  iu: z.string().optional(),
  locale: z.string().optional(),
  playedfrom: z.string().optional(),
  profileId: z.coerce.string().optional(),
  rdp: z.string().optional(),
  url: z.string().optional(),
  us_privacy: z.string().optional(),
  visitNum: z.number().optional(),
  description_url: z.string().optional(),
});

export const CustomPrerollAdTargetingSchema = z.object({
  'aw_0_1st.ihmgenre': z.string().optional(),
  'aw_0_1st.playlistid': z.string().optional(),
  'aw_0_1st.playlisttype': z.string().optional(),
  ccrcontent3: z.string().optional(),
  cust_params: z.record(z.unknown()).optional(),
  deviceType: z.union([z.literal('mobile'), z.literal('desktop')]).optional(),
  env: z.string().optional(),
  iu: z.string().optional(),
  locale: z.string().optional(),
  playedFrom: z.string().optional(),
  profileId: z.coerce.string().optional(),
  rdp: z.string().optional(),
  seed: z.coerce.string().optional(),
  us_privacy: z.string().optional(),
  visitNum: z.number().optional(),
  description_url: z.string().optional(),
});

export const LiveInStreamAdTargetingSchema = z
  .object({
    'aw_0_1st.playerId': z.string().optional(),
    'aw_0_1st.skey': z.string().optional(),
    'device-language': z.string().optional(),
    'device-osv': z.string().optional(),
    'iheart-encr': z.string().optional(),
    'site-url': z.string().url().optional(),
    callLetters: z.string().optional(),
    clientType: z.string().optional(),
    devicename: z.string().optional(),
    dist: z.string().optional(),
    dnt: z.any().optional(),
    host: z.string().optional(),
    locale: z.string().optional(),
    modTime: z.number().optional(),
    partnertok: z.string().optional(),
    profileid: z.coerce.string().optional(),
    sessionstart: z.boolean().optional(),
    streamid: z.coerce.string().optional(),
    terminalid: z.number().optional(),
    territory: z.string().optional(),
    ua: z.string().optional(),
    us_privacy: z.string().optional(),
    zip: z.coerce.string().optional(),
  })
  .passthrough();

export const ExtraTargetingSchema = z.object({
  partnerTokens: z.object({
    coppa: z.string(),
    nonCoppa: z.string(),
  }),
});

export const LiveTargetingSchema = z.object({
  InStream: LiveInStreamAdTargetingSchema,
  PreRoll: LivePrerollAdTargetingSchema,
  Extra: ExtraTargetingSchema,
});

export const CustomInStreamAdTargetingSchema =
  LiveInStreamAdTargetingSchema.merge(
    z.object({
      ihmgenre: z.string().optional(),
      playlistid: z.string().optional(),
      playlisttype: z.string().optional(),
      sessionid: z.string().optional(),
      streamid: z.string().optional(),
      tags: z.string().optional(),
    }),
  );

export const CustomTargetingSchema = z.object({
  InStream: CustomInStreamAdTargetingSchema,
  PreRoll: CustomPrerollAdTargetingSchema,
  Extra: ExtraTargetingSchema,
});

export const AdTagSchema = z.string().url();

export const ValidCompanionResourceTypes = {
  Static: 'STATIC',
  HTML: 'HTML',
  IFrame: 'IFRAME',
} as const;

export const CompanionResourceSchema = z
  .string()
  .transform(val => val.toUpperCase());

export type CompanionResourceSchemaType = z.infer<
  typeof CompanionResourceSchema
>;

export interface ICompanionSchema {
  apiFramework?: string;
  content?: string;
  size?: {
    width: number;
    height: number;
  };
  fluidSize?: boolean;
  resourceType?: CompanionResourceSchemaType;
  resourceValue?: string;
  contentType?: string | null;
  sequenceNumber?: number;
  mainAdSequenceNumber?: number;
  adSlotId?: string | number | null;
  backupCompanions?: ICompanionSchema[];
  height?: number;
  width?: number;
  clickThroughUrl?: string | null;
}

export const CompanionSchema: z.ZodType<ICompanionSchema> = z.lazy(() =>
  z.object({
    apiFramework: z.string().optional(),
    content: z.string().optional(),
    size: z
      .object({
        width: z.number().nonnegative(),
        height: z.number().nonnegative(),
      })
      .optional(),
    fluidSize: z.boolean().optional(),
    resourceType: CompanionResourceSchema,
    contentType: z.string().nullable().optional(),
    sequenceNumber: z.number().nonnegative().optional(),
    mainAdSequenceNumber: z.number().optional(),
    adSlotId: z.number().or(z.string()).nullable().optional(),
    backupCompanions: z.array(CompanionSchema),
    height: z.number().nonnegative().optional(),
    width: z.number().nonnegative().optional(),
    clickThroughUrl: z.string().nullable().optional(),
  }),
);

export const CompanionsSchema = z.array(CompanionSchema).nullable();

export type Companion = z.infer<typeof CompanionSchema>;

export const AdPayloadSchema = z.object({
  adIndex: z.number().default(1).optional(),
  companions: CompanionsSchema,
  format: AdFormatSchema,
  tag: AdTagSchema,
  totalAds: z.number().default(1).optional(),
  type: AdTypeSchema,
});

export type Ad = z.infer<typeof AdSchema>;

export type Ads = z.infer<typeof AdsSchema>;

export type AdTag = z.infer<typeof AdTagSchema>;

export type AdPayload = z.infer<typeof AdPayloadSchema>;

export type LiveInStreamAdTargeting = z.infer<
  typeof LiveInStreamAdTargetingSchema
>;

export type CustomInStreamAdTargeting = z.infer<
  typeof CustomInStreamAdTargetingSchema
>;

export type LivePrerollAdTargeting = z.infer<
  typeof LivePrerollAdTargetingSchema
>;

export type CustomPrerollAdTargeting = z.infer<
  typeof CustomPrerollAdTargetingSchema
>;

export type PrerollAdTargeting =
  | LivePrerollAdTargeting
  | CustomPrerollAdTargeting;

export type LiveTargeting = z.infer<typeof LiveTargetingSchema>;

export type CustomTargeting = z.infer<typeof CustomTargetingSchema>;

export type Targeting = LiveTargeting | CustomTargeting;

export const KeyboardTypeSchema = z.nativeEnum(Keyboard);

export const QueueItemFormatSchema = z.nativeEnum(QueueItemFormat);

export const QueueItemTypeSchema = z.nativeEnum(QueueItemType);

export const BaseMetadataSchema = z.object({
  description: z.string().optional(),
  image: z.string().url().optional(),
  subtitle: z.string().optional(),
  title: z.string().optional(),
});

export const QueueItemMetaSchema = z.intersection(
  z.record(z.string(), z.any()),
  BaseMetadataSchema,
);

export const SourcesSchema = z.array(
  z.object({
    file: z.string().url(),
    type: QueueItemFormatSchema,
  }),
);

const metadataTransformer = (val: string, ctx: z.RefinementCtx) => {
  const clean = val.replaceAll('\\', '').replaceAll('"', '');
  const parts = clean.split(' ');
  if (parts.length <= 1) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: ".split(' ') only produced one element",
    });
    return z.NEVER;
  }
  const extracted = {
    song_spot: '',
    TPID: -1,
  };
  for (const part of parts) {
    const [key, val] = part.split('=');
    if (key === 'song_spot') {
      extracted.song_spot = val;
    } else if (key === 'TPID') {
      const TPID = Number(val);
      if (Number.isNaN(TPID) || TPID <= 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'TPID is NaN or <= 0',
        });
        return z.NEVER;
      }
      extracted.TPID = TPID;
    }
  }

  return extracted;
};

export const JWPlayerMetadataCueSchema = z.discriminatedUnion('metadataType', [
  z.object({
    metadataType: z.literal('id3'),
    metadata: z.union([
      z.object({
        title: z.string(),
      }),
      z.object({
        artist: z.string().transform(val => capitalize(val.toLowerCase())),
      }),
      z.object({
        TXXX: z.object({
          URL: z.string().transform(metadataTransformer),
        }),
      }),
      z.object({
        COMM: z.string().or(z.object({ ENG: z.string() })),
      }),
      z.object({
        WXXX: z.object({ URL: z.string().transform(metadataTransformer) }),
        url: z.string().transform(metadataTransformer),
      }),
    ]),
  }),
  z.object({
    metadataType: z.literal('discontinuity'),
    metadata: z.object({
      PTS: z.number(),
      discontinuitySequence: z.number(),
      end: z.number(),
      start: z.number(),
      tag: z.string(),
    }),
  }),
]);

export type JWPlayerMetadataCue = z.infer<typeof JWPlayerMetadataCueSchema>;

export const JWPlayerFilePlaylistItem = z.object({
  file: z.string().url(),
  preload: z.string().optional(),
  starttime: z.coerce.number().optional(),
  type: QueueItemFormatSchema.optional(),
});

export const JWPlayerSourcesPlaylistItem = z.object({
  sources: SourcesSchema,
});

export const JWPlayerSourceErrorSchema = z.object({
  response: z.object({
    url: z.string().url(),
    code: z.number(),
    text: z.string(),
  }),
});

export type JWPlayerSourceError = z.infer<typeof JWPlayerSourceErrorSchema>;

export const QueueItemSchema = z.object({
  format: QueueItemFormatSchema.optional(),
  id: z.union([z.number().nonnegative(), z.string()]),
  meta: QueueItemMetaSchema,
  reporting: z.string().optional(),
  starttime: z.number().nonnegative().optional(),
  duration: z.number().nonnegative().optional(),
  type: QueueItemTypeSchema,
  url: z.string().url(),
  sources: SourcesSchema.optional(),
});

export const QueueSchema = z.array(QueueItemSchema);

export const MetadataTypeSchema = z.nativeEnum(MetadataType);

export const MetadataSchema = z
  .discriminatedUnion('type', [
    z.object({
      type: z.literal(MetadataType.Ad),
      data: QueueItemMetaSchema,
    }),
    z.object({
      type: z.literal(MetadataType.Episode),
      data: QueueItemMetaSchema,
    }),
    z.object({
      type: z.literal(MetadataType.Gracenote),
      data: QueueItemMetaSchema,
    }),
    z.object({
      type: z.literal(MetadataType.InStream),
      data: QueueItemMetaSchema,
    }),
    z.object({
      type: z.literal(MetadataType.Station),
      data: QueueItemMetaSchema,
    }),
    z.object({
      type: z.literal(MetadataType.Track),
      data: QueueItemMetaSchema,
    }),
  ])
  .nullable();

export const RepeatSchema = z.nativeEnum(Repeat);

export const SpeedSchema = z.nativeEnum(Speed);

export const SeekValue = z.number().nonnegative().default(0);

export const StatusSchema = z.nativeEnum(Status);

export const TimeSchema = z
  .object({
    duration: SeekValue,
    position: SeekValue,
  })
  .strict();

export const StationTypeSchema = z.nativeEnum(StationType);

export const PreRollStationSchema = z.nativeEnum(PreRollStations);

export const StationSchema = z
  .object({
    context: z.object({
      pageName: z.string(),
      playedFrom: z.number().nonnegative(),
      sectionName: z.string().optional(),
      eventLocation: z.string().optional(),
      queryId: z.string().optional(),
    }),
    id: z.union([
      z.number().nonnegative(),
      z.string(),
      z.array(z.number().nonnegative()),
    ]),
    seed: z.union([z.number().nonnegative(), z.string()]).optional(),
    type: StationTypeSchema,
    name: z.string().nullable().optional(),
    meta: BaseMetadataSchema.optional(),
    targeting: LiveTargetingSchema.or(CustomTargetingSchema),
    providerId: z.number().nullable().optional(),
    artistId: z.number().optional(),
    isFirstEpisode: z.boolean().optional(),
    isLastEpisode: z.boolean().optional(),
  })
  .nullable();

export const AdSchema = z.object({
  format: AdFormatSchema,
  station: StationSchema,
  tag: AdTagSchema,
  timestamp: z.number().nonnegative(),
  type: AdTypeSchema,
  status: AdStatusSchema,
});

export const AdsSchema = z.object({
  current: AdPayloadSchema.optional(),
  companionClickThroughs: z.array(z.string().or(z.null())),
  dfpInstanceId: z.number().nullable().optional(),
  enabled: z.boolean(),
  env: z.string().nullable().optional(),
  errors: z.array(PlayerErrorSchema),
  history: z.array(AdSchema),
  sessionid: z.string().uuid().nullable(),
  sessionstart: z.boolean().nullable(),
  skipNext: z.boolean(),
  status: AdPlayerStatusSchema,
  subscriptionType: z.string().optional().default('free'),
  targeting: LiveTargetingSchema.or(CustomTargetingSchema),
  type: z.union([
    z.literal('audio'),
    z.literal('video'),
    z.literal('unknown'),
    z.literal('script'),
  ]),
  anID: z.number().nullable().optional(),
});

export const VolumeSchema = z.number().gte(0).lte(100);

export const HistoryItemSchema = z.object({
  station: StationSchema,
  item: QueueItemSchema,
  timestamp: z.number().nonnegative(),
});

export const HistorySchema = z.array(HistoryItemSchema);

export const MessageItemSchema = z.object({
  id: z.string().uuid(),
  message: z.string(),
  kind: z
    .union([
      z.literal('neutral'),
      z.literal('info'),
      z.literal('success'),
      z.literal('warning'),
    ])
    .optional()
    .default('info'),
});

export const MessagesSchema = z.object({
  messages: z.array(MessageItemSchema),
});

export type ZodObjectIdentity<
  T extends z.ZodRawShape,
  Side extends '_input' | '_output',
> = {
  [K in keyof T]: T[K][Side];
};

// This identity function creates a zod object schema but with simpler types.
// This gets around an issue where the inferred result type  was not working as expected
export function zodObjectIdentity<T extends z.ZodRawShape>(
  t: T,
): z.ZodObject<
  T,
  'strip',
  z.ZodTypeAny,
  ZodObjectIdentity<T, '_output'>,
  ZodObjectIdentity<T, '_input'>
> {
  return z.object(t);
}

export function createPlayerStateSchema<
  S extends Station,
  T extends z.ZodTypeAny = z.ZodType<S>,
>(stationSchema: T) {
  const basePlayerStateSchema = zodObjectIdentity({
    errors: z.array(PlayerErrorSchema),
    featureFlags: z
      .record(z.string(), z.union([z.boolean(), z.number()]))
      .optional(),
    history: HistorySchema,
    index: z.number().nonnegative(),
    isScanning: z.boolean(),
    metadata: MetadataSchema,
    muted: z.boolean(),
    queue: QueueSchema,
    repeat: RepeatSchema,
    retry: z.boolean(),
    shuffled: z.boolean(),
    skips: z.number().nonnegative(),
    speed: SpeedSchema,
    station: stationSchema,
    status: StatusSchema,
    time: TimeSchema,
    volume: VolumeSchema,
    pageName: z.string().optional().nullable(),
    lsid: z.string().optional(),
  });

  return basePlayerStateSchema;
}

export type HistoryItem = z.infer<typeof HistoryItemSchema>;

export type MessageItem = z.infer<typeof MessageItemSchema>;

export type Messages = z.infer<typeof MessagesSchema>;

export type Metadata = z.infer<typeof MetadataSchema>;

export type Queue = z.infer<typeof QueueSchema>;

export type QueueItem = z.infer<typeof QueueItemSchema>;

export type QueueItemMeta = z.infer<typeof QueueItemMetaSchema>;

export type PlayerState<T extends Station> = z.infer<
  ReturnType<typeof createPlayerStateSchema<T>>
>;

export type SeekValue = z.infer<typeof SeekValue>;

export type Station = NonNullable<z.infer<typeof StationSchema>>;

export type Time = z.infer<typeof TimeSchema>;

export type Volume = z.infer<typeof VolumeSchema>;

export type Sources = z.infer<typeof SourcesSchema>;
