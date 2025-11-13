import { z } from 'zod';

export const controlledGlobalData = z.object({
  device: z.object({
    appSessionId: z.string().uuid(),
    browserHeight: z.string(),
    browserWidth: z.string(),
    callId: z.string().uuid(),
    dayOfWeek: z.union([
      z.literal('sunday'),
      z.literal('monday'),
      z.literal('tuesday'),
      z.literal('wednesday'),
      z.literal('thursday'),
      z.literal('friday'),
      z.literal('saturday'),
    ]),
    gpcEnabled: z.boolean(),
    hourOfDay: z.number().int().gte(0).lte(23),
    language: z.string(),
    refererDomain: z.string().optional(),
    screenOrientation: z.union([z.literal('landscape'), z.literal('portrait')]),
    screenResolution: z.string(),
    timezone: z.string(),
    userAgent: z.string(),
  }),
  event: z.object({
    loggedTimestamp: z.number().int().nonnegative(),
  }),
  querystring: z.record(z.string()),
  session: z.object({
    sequenceNumber: z.number().int().gte(0),
  }),
  view: z.object({
    pageURL: z.string(),
  }),
});

export const uncontrolledGlobalData = z.object({
  device: z.object({
    appVersion: z.string().optional(),
    env: z.string().optional(),
    host: z.string(),
    id: z.string().uuid().optional(),
    isPlaying: z.boolean().optional(),
    lat: z.number().optional(),
    lng: z.number().optional(),
    referer: z.string().url().optional(),
    volume: z.number().int().gte(0).lte(100).optional(),
  }),
  user: z
    .object({
      abTestGroup: z.array(z.string()).nullable().optional(),
      genreIsDefault: z.boolean().optional(),
      genreSelected: z.array(z.number().int().nonnegative()).optional(),
      isTrialEligible: z.boolean().optional(),
      numberPresets: z.number().nullable().optional(),
      profileId: z.string(),
      privacyOptOut: z.boolean().optional(),
      registration: z
        .object({
          birthYear: z.number().int().nonnegative().nullable().optional(),
          country: z.string().optional(),
          gender: z.string().optional(),
          type: z.string().optional(),
          zip: z.string().optional(),
        })
        .optional(),
      skuPromotionType: z.string().optional(),
      subscriptionTier: z.string().optional(),
    })
    .optional(),
});

export const globalData = z.intersection(
  controlledGlobalData,
  uncontrolledGlobalData,
);

export const artistAsset = z.intersection(
  z.object({
    id: z.string(),
    name: z.string(),
    type: z.literal('artist').optional(),
  }),
  z
    .discriminatedUnion('subtype', [
      z.object({
        subtype: z.literal('album'),
        subid: z.string().or(z.number()),
        subname: z.string(),
      }),
      z.object({
        subtype: z.literal('radio'),
        subid: z.string().or(z.number()).optional(),
        subname: z.string().optional(),
      }),
      z.object({
        subtype: z.literal('top-songs'),
        subid: z.string().or(z.number()),
        subname: z.string(),
      }),
    ])
    .optional(),
);

export const favoritesAsset = z.object({
  id: z.string(),
  name: z.string(),
  type: z.literal('favorites').optional(),
  subid: z.string().or(z.number()).optional(),
  subname: z.string().optional(),
  subtype: z.union([z.literal('my'), z.literal('shared')]).optional(),
});

export const liveAsset = z.object({
  id: z.string(),
  name: z.string(),
  type: z.literal('live').optional(),
});

export const playlistAsset = z.object({
  id: z.string(),
  name: z.string(),
  type: z.literal('playlist').optional(),
  subid: z.string().or(z.number()).optional(),
  subname: z.string().optional(),
  subtype: z.union([
    z.literal('curated'),
    z.literal('my'),
    z.literal('new_for_you'),
    z.literal('radio'),
    z.literal('shared_user'),
    z.literal('user').optional(),
  ]),
});

export const podcastAsset = z.object({
  id: z.string(),
  name: z.string(),
  subid: z.string().optional(),
  subname: z.string().optional(),
  subtype: z.literal('episode').optional(),
  type: z.literal('podcast').optional(),
});

export const asset = z.object({
  asset: z.union([
    artistAsset,
    favoritesAsset,
    liveAsset,
    playlistAsset,
    podcastAsset,
  ]),
});

export const media = z.object({
  hadPreroll: z.boolean(),
  isSaved: z.boolean(),
  playedFrom: z.number(),
  sessionId: z.string(),
  startPosition: z.number(),
  streamInitTime: z.number(),
  playbackStartTime: z.number().optional(),
});

export const fallback = z.object({
  fallbackErrorCode: z.number(),
  fallbackErrorDescription: z.string(),
});

export const globalstationAsset = z.object({
  id: z.string(),
  name: z.string(),
});

export const itemSelected = z.object({
  event: z.object({ location: z.string(), type: z.string().optional() }),
  station: asset.optional(),
  item: z.object({
    asset: z.object({
      id: z.string().optional(),
      name: z.string(),
    }),
  }),
  view: z.object({
    content: z
      .object({
        id: z.string().or(z.number()).optional(),
        title: z.string().optional(),
      })
      .optional(),
    item: z.object({
      row: z.number(),
      column: z.number(),
    }),
    itemPosition: z.number(),
    pageName: z.string(),
    station: z
      .object({
        asset: globalstationAsset,
      })
      .optional(),
    section: z.object({
      name: z.string().optional(),
      id: z.string().or(z.number()).optional(),
      tag: z.string().optional(),
    }),
    sectionPosition: z.number().optional(),
    tab: z.string().optional(),
  }),
});

export const stationAsset = z.object({
  id: z.string(),
  name: z.string(),
  sub: z
    .object({
      id: z.string().or(z.number()),
      name: z.string(),
    })
    .optional(),
});

export const upsellAsset = z.object({
  upsellType: z.string(),
  promotionSubscriptionTier: z.string().optional(),
  vendor: z.string().optional(),
  destination: z.string().optional(),
  deeplink: z.string().optional(),
  sku: z.string().optional(),
  partner: z.string().optional(),
  upsellVersion: z.string().optional(),
  campaign: z.string().optional(),
  paymentFrameSeen: z.boolean().optional(),
  errorMessage: z.string().optional(),
  exitType: z
    .union([
      z.literal('upgrade_success'),
      z.literal('upgrade_failure'),
      z.literal('dismiss'),
    ])
    .optional(),
});

export const click = z.object({
  event: z.object({
    location: z.string().optional(),
    filter: z
      .object({
        type: z.string().optional(),
        selection: z.string().optional(),
      })
      .optional(),
  }),
  station: z
    .object({
      asset: stationAsset,
    })
    .optional(),
  view: z.object({
    pageName: z.string(),
    tab: z.string().nullable().optional(),
    station: z
      .object({
        asset: globalstationAsset,
      })
      .optional(),
    section: z
      .object({
        name: z.string(),
      })
      .optional(),
  }),
  pageName: z.string(),
  window: z.object({
    location: z.object({
      href: z.string(),
    }),
  }),
});

export const pageView = z.object({
  pageName: z.string(),

  view: z
    .object({
      asset: stationAsset.optional(),
      stationCallLetter: z.string().optional(),
      stationFormat: z.string().optional(),
      stationMarket: z.string().optional(),
      stationMicrosite: z.string().optional(),
      tab: z.string().optional(),
    })
    .optional(),

  window: z
    .object({
      location: z.object({
        href: z.string(),
      }),
    })
    .optional(),
});

export const postLogin = z.object({
  profileId: z.string(),
  authtype: z.string().optional(),
});

export const postRegistration = z.object({
  profileId: z.string(),
  authtype: z.string().optional(),
});

export const regGateExit = z.object({
  regGate: z.object({
    exitType: z.union([z.literal('login'), z.literal('registration')]),
    trigger: z.string().optional(),
    authType: z.string(),
  }),
  event: z
    .object({
      origin: z.string().optional(),
      location: z.string().optional(),
    })
    .optional(),
  view: z
    .object({
      station: z
        .object({
          asset: globalstationAsset,
        })
        .optional(),
      pageName: z.string().optional(),
    })
    .optional(),
});

export const regGateOpen = z.object({
  regGate: z.object({
    trigger: z.string().optional(),
    authType: z.union([z.literal('login'), z.literal('registration')]),
  }),
  event: z
    .object({
      origin: z.string().optional(),
      location: z.string().optional(),
    })
    .optional(),
  view: z
    .object({
      station: z
        .object({
          asset: globalstationAsset,
        })
        .optional(),
      pageName: z.string().optional(),
    })
    .optional(),
});

export const regGateAction = z.object({
  regGate: z
    .object({
      trigger: z.string().optional(),
      authType: z.string().optional(),
    })
    .optional(),
  event: z.object({
    origin: z.string().optional(),
    location: z.string().optional(),
    action: z.string(),
    type: z.string().optional(),
  }),
  view: z.object({
    pageName: z.string(),
  }),
});

export const streamEnd = z.object({
  station: z.intersection(
    z.intersection(asset, media),
    z.object({
      listenTime: z.number(),
      completionRate: z.number().optional(),
      daySkipsRemaining: z.number().optional(),
      exitSpot: z.string(),
      fallback: z.string().optional(),
      hourSkipsRemaining: z.number().optional(),
      offlineEnabled: z.string().optional(),
      replayCount: z.number().optional(),
      shuffleEnabled: z.boolean().optional(),
      streamProtocol: z.string().optional(),
      queryId: z.string().optional(),
      endReason: z.string(),
    }),
  ),
  search: z
    .object({
      queryId: z.string().optional(),
    })
    .optional(),
});

export const streamStart = z.object({
  station: z.intersection(asset, media),
  view: z.object({
    pageName: z.string(),
  }),
});

export const streamFallback = z.object({
  station: z.intersection(asset, fallback),
  view: z.object({
    pageName: z.string(),
  }),
});

export const trackEnd = z.object({
  station: z.intersection(
    z.intersection(asset, media),
    z.object({
      endReason: z.string(),
      listenTime: z.number(),
      subSessionId: z.string(),
    }),
  ),
});

export const trackStart = z.object({
  station: z.intersection(
    z.intersection(asset, media),
    z.object({
      subSessionId: z.string(),
    }),
  ),
});

export const playbackAnalyticsPayload = z.object({
  station: z
    .object({ asset: stationAsset.optional(), playedFrom: z.number() })
    .optional(),
  event: z.object({ location: z.string().optional() }).optional(),
  view: z.object({
    pageName: z.string(),
    section: z
      .object({
        name: z.string(),
      })
      .optional(),
    station: z
      .object({
        asset: z
          .object({
            id: z.string().or(z.number()),
            name: z.string(),
          })
          .optional(),
      })
      .optional(),
  }),
});

export const search = z.object({
  station: z
    .object({
      asset: stationAsset,
    })
    .optional(),
  search: z.object({
    userSearchTerm: z.string().optional(),
    screen: z.string(),
    selectionCategory: z.string().optional(),
    queryId: z.string(),
    exitType: z.string(),
    selectionCategoryPosition: z.number(),
    sessionId: z.string(),
  }),
});

export const displayAdImpression = z.object({
  ad: z.object({
    advertiserId: z.number().optional(),
    campaignId: z.number().optional(),
    clickthroughUrl: z.string(),
    client: z.string(),
    creativeId: z.number().optional(),
    lineItemId: z.number().optional(),
    position: z.string(),
    serviceName: z.string(),
    size: z.object({
      width: z.number().optional(),
      height: z.number().optional(),
    }),
    tag: z.string().optional(),
    targeting: z.record(z.union([z.string(), z.array(z.string())])),
    viewable: z.number(),
  }),
});

export const displayAdError = z.object({
  ad: z.object({
    error: z.string(),
    position: z.string().optional(),
  }),
});

export const followUnfollow = z.object({
  station: z.intersection(asset, z.object({ savedType: z.string() })),
  event: z.object({ location: z.string() }),
});

export const forward30Back15 = z.object({
  station: z.intersection(
    z.object({ asset: podcastAsset }),
    z.object({ playheadPosition: z.string() }),
  ),
  pageName: z.string(),
  item: z.object({ asset: podcastAsset }),
});

export const appOpen = z.object({
  remote: z.object({ location: z.string() }),
  session: z.object({ initializationTime: z.number() }),
});

export const volumeChange = z.object({
  device: z.object({
    oldVolume: z.number(),
    newVolume: z.number(),
  }),
  station: asset,
});

export const appClose = z.object({
  event: z.object({ location: z.string() }),
});

export const inAppMessageOpen = z.object({
  event: z.object({
    location: z.string().optional(),
    type: z.string().optional(),
  }),
  iam: z.object({
    messageType: z.string(),
    userTriggered: z.boolean().optional(),
  }),
  station: z
    .object({
      asset: stationAsset,
    })
    .optional(),
  view: z.object({
    pageName: z.string(),
    tab: z.string().optional(),
    station: z
      .object({
        asset: globalstationAsset,
      })
      .optional(),
  }),
});

export const inAppMessageExit = z.object({
  event: z.object({
    location: z.string().optional(),
    type: z.string().optional(),
    selection: z.string().optional(),
  }),
  iam: z.object({
    messageType: z.string(),
    userTriggered: z.boolean().optional(),
    exitType: z.string().optional(),
  }),
  station: z
    .object({
      asset: stationAsset,
    })
    .optional(),
  view: z.object({
    pageName: z.string(),
    tab: z.string().optional(),
    station: z
      .object({
        asset: globalstationAsset,
      })
      .optional(),
  }),
});

export const lyricsOpen = z.object({
  lyrics: z
    .object({
      is_available: z.number(),
      type: z.string().optional(),
    })
    .optional(),
  station: z
    .object({
      asset: stationAsset,
    })
    .optional(),
  view: z.object({
    pageName: z.string(),
    tab: z.string().optional(),
    station: z
      .object({
        asset: globalstationAsset,
      })
      .optional(),
  }),
  event: z.object({ location: z.string() }),
});

export const lyricsClose = z.object({
  station: z
    .object({
      asset: stationAsset,
    })
    .optional(),
  view: z.object({
    pageName: z.string(),
    tab: z.string().optional(),
    station: z
      .object({
        asset: globalstationAsset,
      })
      .optional(),
  }),
  event: z.object({ type: z.string() }),
});

export const searchStart = z.object({
  search: z.object({
    sessionId: z.string(),
  }),
  event: z.object({
    action: z.string(),
    type: z.string(),
  }),
  station: z
    .object({
      asset: z.object({
        id: z.string(),
        name: z.string(),
      }),
    })
    .optional(),
  view: z.object({
    pageName: z.string(),
    station: z
      .object({
        asset: globalstationAsset,
      })
      .optional(),
  }),
});

export const searchSuccess = z.object({
  search: z.object({
    sessionId: z.string(),
    searchTerm: z.string(),
    queryId: z.string(),
    topHit: z
      .object({
        id: z.string().optional(),
        name: z.string(),
        sub: z
          .object({
            id: z.string().or(z.number()).optional(),
            name: z.string().optional(),
          })
          .optional(),
        type: z.string(),
      })
      .optional(),
    boostMarketId: z.string().optional(),
  }),
  view: z.object({
    pageName: z.string(),
    section: z.object({
      name: z.string(),
    }),
    filter: z.object({
      name: z.string(),
    }),
    item: z.object({
      row: z.number(),
      column: z.number(),
    }),
  }),
  event: z.object({
    type: z.string(),
  }),
  asset: z.object({
    type: z.string(),
  }),
  station: z.object({
    asset: z.object({
      id: z.string(),
      name: z.string(),
      sub: z
        .object({
          id: z.string().or(z.number()).optional(),
          name: z.string().optional(),
        })
        .optional(),
    }),
  }),
});

export const searchOpen = z.object({
  search: z.object({
    sessionId: z.string(),
  }),
  event: z.object({ location: z.string() }),
  station: z
    .object({
      name: z.string(),
    })
    .optional(),
  view: z.object({
    pageName: z.string(),
    station: z
      .object({
        asset: globalstationAsset,
      })
      .optional(),
  }),
});

export const searchAction = z.object({
  search: z.object({
    sessionId: z.string(),
    queryId: z.string().nullable(),
    userSearchTerm: z.string(),
  }),
  event: z.object({
    action: z.string(),
    type: z.string().nullable(),
  }),
  station: z
    .object({
      asset: podcastAsset,
    })
    .optional(),
  view: z.object({
    pageName: z.string(),
  }),
});

export const upsell = z.object({
  pageName: z.string(),
  station: z.object({ asset: stationAsset.optional() }).optional(),
  trigger: z.string().optional(),
  view: z.object({
    pageName: z.string().optional(),
    station: z
      .object({
        asset: globalstationAsset,
      })
      .optional(),
  }),
  event: z
    .object({
      origin: z.string().optional(),
    })
    .optional(),
  upsell: upsellAsset,
  regGate: z
    .object({
      trigger: z.string(),
    })
    .optional(),
});

export const scanStarted = z.object({
  view: z.object({
    pageName: z.string(),
  }),
  filter: z.object({
    location: z.string(),
    genre: z.string(),
  }),
});

export const stopTypeSchema = z
  .union([
    z.literal('background'),
    z.literal('miniplayer'),
    z.literal('stop_scan_button'),
    z.literal('radio_dial_play'),
    z.literal('auto_end'),
    z.literal('nav_away'),
    z.literal('preset_play'),
    z.literal('filter_change'),
  ])
  .default('auto_end');

export type ScanStopType = z.infer<typeof stopTypeSchema>;

export const scanStopped = z.object({
  view: z.object({
    pageName: z.string(),
  }),
  scan: z.object({
    stopType: stopTypeSchema,
  }),
});

export const presetAdded = z.object({
  view: z.object({
    pageName: z.string(),
    station: z.object({ asset: stationAsset.optional() }).optional(),
  }),
  event: z.object({
    location: z.string(),
  }),
  station: z.object({ asset: stationAsset.optional() }),
  item: z.object({ asset: stationAsset.optional() }),
});

export const presetRemoved = z.object({
  view: z.object({
    pageName: z.string(),
    station: z.object({ asset: stationAsset.optional() }).optional(),
  }),
  event: z.object({
    location: z.string(),
  }),
  station: z.object({ asset: stationAsset.optional() }),
  item: z.object({ asset: stationAsset.optional() }),
});

export const eventType = z.nativeEnum({
  AppClose: 'app_close',
  AppOpen: 'app_open',
  Back15: 'back_15',
  Background: 'background',
  Click: 'click',
  DisplayAdClick: 'display_ad_click',
  DisplayAdError: 'display_ad_error',
  DisplayAdImpression: 'display_ad_impression',
  FollowUnfollow: 'follow_unfollow',
  Foreground: 'foreground',
  Forward30: 'forward_30',
  InAppMessageExit: 'iam_exit',
  InAppMessageOpen: 'iam_open',
  ItemSelected: 'item_selected',
  LyricsClose: 'lyrics_close',
  LyricsOpen: 'lyrics_open',
  PageView: 'page_view',
  Pause: 'pause',
  Play: 'play',
  PostLogin: 'post_login',
  PostRegistration: 'post_registration',
  PresetAdded: 'preset_added',
  PresetRemoved: 'preset_removed',
  RegGateExit: 'reg_gate_exit',
  RegGateOpen: 'reg_gate_open',
  RegGateAction: 'reg_gate_action',
  ScanStarted: 'scan_started',
  ScanStopped: 'scan_stopped',
  ScreenView: 'screen_view',
  Search: 'search',
  SearchAction: 'search_action',
  SearchOpen: 'search_open',
  SearchStart: 'search_start',
  SearchSuccess: 'search_success',
  Stop: 'stop',
  StreamEnd: 'stream_end',
  StreamFallback: 'stream_fallback',
  StreamStart: 'stream_start',
  TrackEnd: 'track_end',
  TrackStart: 'track_start',
  UpsellOpen: 'upsell_open',
  UpsellExit: 'upsell_exit',
  VolumeChange: 'volume_change',
} as const);

type Values<T> = {
  [K in keyof T]: T[K];
}[keyof T];

export type EventType = Values<typeof eventType.enum>;

export const event = z.discriminatedUnion('type', [
  z.object({ type: z.literal(eventType.enum.AppClose), data: appClose }),
  z.object({ type: z.literal(eventType.enum.AppOpen), data: appOpen }),
  z.object({ type: z.literal(eventType.enum.Back15), data: forward30Back15 }),
  z.object({ type: z.literal(eventType.enum.Background), data: z.undefined() }),
  z.object({ type: z.literal(eventType.enum.Click), data: click }),
  z.object({
    type: z.literal(eventType.enum.DisplayAdClick),
    data: displayAdImpression,
  }),
  z.object({
    type: z.literal(eventType.enum.DisplayAdError),
    data: displayAdError,
  }),
  z.object({
    type: z.literal(eventType.enum.DisplayAdImpression),
    data: displayAdImpression,
  }),
  z.object({
    type: z.literal(eventType.enum.FollowUnfollow),
    data: followUnfollow,
  }),
  z.object({ type: z.literal(eventType.enum.Foreground), data: z.undefined() }),
  z.object({
    type: z.literal(eventType.enum.Forward30),
    data: forward30Back15,
  }),
  z.object({
    type: z.literal(eventType.enum.InAppMessageExit),
    data: inAppMessageExit,
  }),
  z.object({
    type: z.literal(eventType.enum.InAppMessageOpen),
    data: inAppMessageOpen,
  }),
  z.object({
    type: z.literal(eventType.enum.ItemSelected),
    data: itemSelected,
  }),
  z.object({ type: z.literal(eventType.enum.LyricsClose), data: lyricsClose }),
  z.object({ type: z.literal(eventType.enum.LyricsOpen), data: lyricsOpen }),
  z.object({ type: z.literal(eventType.enum.PageView), data: pageView }),
  z.object({
    type: z.literal(eventType.enum.Pause),
    data: playbackAnalyticsPayload,
  }),
  z.object({
    type: z.literal(eventType.enum.Play),
    data: playbackAnalyticsPayload,
  }),
  z.object({ type: z.literal(eventType.enum.PostLogin), data: postLogin }),
  z.object({
    type: z.literal(eventType.enum.PostRegistration),
    data: postRegistration,
  }),
  z.object({ type: z.literal(eventType.enum.PresetAdded), data: presetAdded }),
  z.object({
    type: z.literal(eventType.enum.PresetRemoved),
    data: presetRemoved,
  }),
  z.object({
    type: z.literal(eventType.enum.RegGateAction),
    data: regGateAction,
  }),
  z.object({ type: z.literal(eventType.enum.RegGateExit), data: regGateExit }),
  z.object({ type: z.literal(eventType.enum.RegGateOpen), data: regGateOpen }),
  z.object({ type: z.literal(eventType.enum.ScanStarted), data: scanStarted }),
  z.object({ type: z.literal(eventType.enum.ScanStopped), data: scanStopped }),
  z.object({ type: z.literal(eventType.enum.Search), data: search }),
  z.object({
    type: z.literal(eventType.enum.SearchAction),
    data: searchAction,
  }),
  z.object({ type: z.literal(eventType.enum.SearchOpen), data: searchOpen }),
  z.object({ type: z.literal(eventType.enum.SearchStart), data: searchStart }),
  z.object({
    type: z.literal(eventType.enum.SearchSuccess),
    data: searchSuccess,
  }),
  z.object({
    type: z.literal(eventType.enum.Stop),
    data: playbackAnalyticsPayload,
  }),
  z.object({ type: z.literal(eventType.enum.StreamEnd), data: streamEnd }),
  z.object({
    type: z.literal(eventType.enum.StreamFallback),
    data: streamFallback,
  }),
  z.object({ type: z.literal(eventType.enum.StreamStart), data: streamStart }),
  z.object({ type: z.literal(eventType.enum.TrackEnd), data: trackEnd }),
  z.object({ type: z.literal(eventType.enum.TrackStart), data: trackStart }),
  z.object({ type: z.literal(eventType.enum.UpsellOpen), data: upsell }),
  z.object({ type: z.literal(eventType.enum.UpsellExit), data: upsell }),
  z.object({
    type: z.literal(eventType.enum.VolumeChange),
    data: volumeChange,
  }),
]);

export const analyticsData = z.intersection(globalData, event);
