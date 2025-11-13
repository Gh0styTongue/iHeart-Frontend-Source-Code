import type { GetStationMetaResponseBody } from '@iheartradio/web.api/amp';
import {
  type CreateEmitter,
  createEmitter,
} from '@iheartradio/web.utilities/create-emitter';
import { createWebStorage } from '@iheartradio/web.utilities/create-storage';
import { isNonNullish, isNullish, prop } from 'remeda';
import type { Merge } from 'type-fest';

import { PlayerError, PlayerErrorCode } from './player:error.js';
import * as Playback from './player:types.js';
import {
  DEFAULT_PREROLL_PARAMS,
  LIVE_ADS_INTERVAL,
} from './utility:constants.js';
import { shouldAdPlay } from './utility:should-ad-play.js';
import {
  buildLiveInstreamTargeting,
  buildLivePreRollUrl,
  cachebuster,
  getLiveAdUnit,
  refreshPrerollUrl,
} from './utility:targeting.js';

enum StreamType {
  HLS = 'secure_hls_stream',
  MP3 = 'secure_mp3_pls_stream',
  PLS = 'secure_pls_stream',
  Shoutcast = 'secure_shoutcast_stream',
}

export type LiveStation = Merge<
  Playback.Station,
  {
    id: number;
    type: Playback.StationType.Live;
  }
>;

export type ValidStream = {
  url: string;
  format: Playback.QueueItemFormat;
  type: StreamType;
};

const format = {
  [StreamType.HLS]: Playback.QueueItemFormat.HLS,
  [StreamType.MP3]: Playback.QueueItemFormat.MP3,
  [StreamType.PLS]: Playback.QueueItemFormat.AAC,
  [StreamType.Shoutcast]: Playback.QueueItemFormat.AAC,
} as const;

const order = [
  StreamType.HLS,
  StreamType.Shoutcast,
  StreamType.PLS,
  StreamType.MP3,
] as const;

const PLS_STREAM_REGEX = /File\d=(?<stream>.*)/g;

export function createLiveResolver(): CreateEmitter.Emitter<
  Playback.Resolver<LiveStation>
> {
  const liveState = createWebStorage<{
    addedStation: GetStationMetaResponseBody | undefined;
  }>({
    seed: {
      addedStation: undefined,
    },
    prefix: `player:resolver:live:state.`,
    type: 'session',
  });

  const liveResolver = createEmitter<Playback.Resolver<LiveStation>>({
    async load({ api, state, ads }, stationToLoad) {
      const station = { ...stationToLoad };
      const { targeting, subscriptionType } = ads;

      const liveStation = await api.api.v3.livemeta
        .getStationMeta({
          params: { stationId: station.id },
        })
        .then(prop('body'));

      liveState.set('addedStation', liveStation);

      if (
        liveStation === undefined ||
        liveStation.streams === undefined ||
        Object.keys(liveStation.streams).length === 0
      ) {
        throw PlayerError.new({ code: PlayerErrorCode.MissingStreams });
      }

      const {
        ads: stationAdsConfig,
        callLetters,
        description,
        feeds,
        id,
        logo,
        name,
        streams,
      } = liveStation;

      if (isNonNullish(targeting) && isNonNullish(stationAdsConfig)) {
        targeting.InStream = {
          ...targeting.InStream,
          ...buildLiveInstreamTargeting(targeting, {
            ads: stationAdsConfig,
            callLetters,
            feeds,
            id,
            subscriptionType,
          }),
        };
      }

      station.meta = {
        title: name,
        image: `${logo}?ops=cover(400,400)`,
      };
      station.name = name;

      const validStreams = order
        .filter(type => streams[type])
        .map(type => ({
          url: streams[type],
          format: format[type],
          type,
        }))
        .filter((stream): stream is ValidStream => !!stream);

      if (validStreams.length === 0) {
        throw new Error(PlayerError.MissingStreams.message);
      }

      const ord = cachebuster();

      const parsedStreams = await validStreams.reduce<Promise<ValidStream[]>>(
        async (accumulator, stream) => {
          if (stream.type !== StreamType.PLS) {
            const streamUrl = new URL(stream.url);
            for (const [key, value] of Object.entries(
              targeting?.InStream ?? {},
            )) {
              if (value) streamUrl.searchParams.set(key, String(value));
            }
            streamUrl.searchParams.set('ord', ord);
            return [
              ...(await accumulator),
              {
                ...stream,
                url: streamUrl.toString(),
              },
            ];
          }

          try {
            const response = await window.fetch(stream.url);
            const plsTextContent = await response.text();

            const matches = [...plsTextContent.matchAll(PLS_STREAM_REGEX)]
              .filter(match => !!match.groups && 'stream' in match.groups)
              .reduce<ValidStream[]>((accumulator, match) => {
                try {
                  const streamUrl = new URL(match.groups!.stream);
                  for (const [key, value] of Object.entries(
                    targeting?.InStream ?? {},
                  )) {
                    if (value) streamUrl.searchParams.set(key, String(value));
                  }
                  streamUrl.searchParams.set('ord', ord);
                  accumulator.push({
                    url: streamUrl.toString(),
                    format: format[stream.type],
                    type: stream.type,
                  });
                } catch {
                  /* empty */
                }
                return accumulator;
              }, []);

            return [...(await accumulator), ...matches];
          } catch {
            return accumulator;
          }
        },
        Promise.resolve([]),
      );

      if (parsedStreams.length === 0) {
        throw PlayerError.new({ code: PlayerErrorCode.MissingStreams });
      }

      const queue: Playback.Queue = parsedStreams.map(stream => ({
        format: stream.format,
        id: station.id,
        meta: {
          ...liveStation,
          childOriented: feeds?.childOriented ?? false,
          description,
          image: logo,
          subtitle: name,
        },
        type: Playback.QueueItemType.Stream,
        url: stream.url,
      }));

      return {
        ...state,
        index: 0,
        queue,
        station,
      };
    },

    async preroll({ ads, api, logger, state }) {
      let preroll;
      const { station } = state;
      const { targeting, dfpInstanceId } = ads;

      if (
        (await shouldAdPlay({
          ads,
          interval: LIVE_ADS_INTERVAL,
          format: Playback.AdFormat.Live,
          type: Playback.AdType.Preroll,
        })) === false
      ) {
        return null;
      }
      const { userPrivacyOptOut = false } = api.getConfig();

      const liveStation = liveState.get('addedStation');
      if (isNullish(liveStation)) {
        return null;
      }

      const {
        callLetters,
        format: stationFormat,
        markets,
        provider,
      } = liveStation;

      if (isNullish(station)) {
        return null;
      }

      const primaryMarket =
        markets?.filter(market => market.isPrimary)?.[0] ?? markets?.[0];

      if (dfpInstanceId) {
        const iu = getLiveAdUnit({
          provider,
          callLetters,
          market: primaryMarket?.name,
          dfpInstanceId: Number(dfpInstanceId),
          postfix: undefined,
        });

        if (iu && targeting) {
          preroll = await buildLivePreRollUrl(
            {
              iu,
              ...DEFAULT_PREROLL_PARAMS,
              cust_params: {
                ...targeting.PreRoll,
                ccrpos: '7005',
                ccrcontent2: 'LIVE',
                ccrformat: stationFormat,
                ccrmarket: primaryMarket?.name,
                playedfrom: String(station.context),
              },
            },
            userPrivacyOptOut,
            logger,
          );
        }
      }

      if (preroll !== undefined) {
        return refreshPrerollUrl(preroll, Playback.AdFormat.Live);
      }

      return null;
    },

    // It was noticed that LiveStations were not getting populated to "Recently Played"
    // This `postAddStation` call is required to register the 'listen' so that it will
    // be returned correctly from `/api/v2/playlists/{profileId}` [DEM 2024/07/01]
    async play({ api, state }) {
      const { profileId, sessionId } = api.getConfig();
      if (profileId && sessionId) {
        await api.api.v2.playlists.postAddStation({
          params: {
            type: 'LIVE',
            profileId,
            contentId: state.station.id,
          },
          body: {
            addToFavorites: false,
            playedFrom: state.station.context.playedFrom,
            contentId: state.station.id,
          },
        });

        // This needs to happen AFTER the `postAddStation` call, so that is why these are not
        // being done in parallel with `Promise.allSettled` [DEM 2025/03/06]
        await api.api.v1.liveRadio.postRegisterListen({
          params: {
            profileId: String(profileId),
            stationId: String(state.station.id),
          },
          body: {
            profileId: Number(profileId),
            sessionId,
          },
        });
      }
      return state.status;
    },

    async setMetadata({ state }) {
      const { index, queue } = state;

      return {
        type: Playback.MetadataType.Station,
        data: queue[index].meta,
      };
    },
  });

  return liveResolver;
}
