import * as Analytics from '@iheartradio/web.analytics';
import {
  type CreateEmitter,
  createEmitter,
} from '@iheartradio/web.utilities/create-emitter';
import {
  type CreateStorage,
  createMemoryStorage,
} from '@iheartradio/web.utilities/create-storage';
import { isNonNullish, pickBy, prop } from 'remeda';
import { v4 as uuid } from 'uuid';

import * as Playback from './player:types.js';
import {
  getAnalyticsStationData,
  getTrackAssetData,
} from './utilities:get-analytics-data.js';
import { logger } from './utility:default-logger.js';

export type AnalyticsState = {
  isScanStation: boolean;
  isStreamStart: boolean;
  isTrackStart: boolean;
  streamSessionId: string;
  streamInitTime: number;
  playbackStartTime: number;
  scanStopType: Analytics.ScanStopType;
  startPosition: number;
  trackSessionId: string;
  oldTrackSessionId: string;
  oldVolume: number;
  hadPreroll: boolean;
  queryId?: string;
};

export function createAnalyticsSubscription<Station extends Playback.Station>({
  api,
  state,
  timeState,
  analytics,
  ads,
}: {
  api: Playback.Api;
  state: CreateStorage.Storage<Playback.PlayerState<Station>>;
  timeState: CreateStorage.Storage<{ time: Playback.Time }>;
  analytics: Analytics.Analytics.AnalyticsMethods;
  ads: CreateStorage.Storage<Playback.Ads>;
}): [
  CreateEmitter.Emitter<CreateEmitter.Subscription<Playback.Player<Station>>>,
  CreateStorage.Storage<AnalyticsState>,
] {
  const analyticsState = createMemoryStorage<AnalyticsState>({
    isScanStation: false,
    isStreamStart: false,
    isTrackStart: false,
    streamSessionId: '',
    streamInitTime: 0,
    playbackStartTime: 0,
    scanStopType: 'auto_end',
    startPosition: 0,
    trackSessionId: '',
    oldTrackSessionId: '',
    oldVolume: 0,
    hadPreroll: false,
  });

  const getFollowedStatus = async (
    stationId: number | string,
    stationType: string,
  ) => {
    const user = analytics.getGlobalData().user;

    if (user?.registration?.type === 'ANONYMOUS') {
      return false;
    }

    switch (stationType) {
      case Playback.StationType.Podcast: {
        const { status } = await api.api.v3.podcast.getIsFollowingPodcast({
          params: {
            podcastId: Number(stationId),
          },
          throwOnErrorStatus: false,
        });

        return status === 200;
      }

      case Playback.StationType.Artist: {
        const { status } = await api.api.v3.profiles.getIsArtistFollowed({
          params: {
            artistId: Number(stationId),
          },
          throwOnErrorStatus: false,
        });

        return status === 204;
      }

      case Playback.StationType.Live: {
        const { status } = await api.api.v3.profiles.getIsLiveStationFollowed({
          params: {
            liveStationId: Number(stationId),
          },
          throwOnErrorStatus: false,
        });

        return status === 204;
      }

      case Playback.StationType.Playlist:
      case Playback.StationType.PlaylistRadio: {
        const { status } = await api.api.v3.collection.getFollowStatus({
          params: {
            id: stationId?.toString().split('::')[1],
            userId: user?.profileId ?? '',
          },
          throwOnErrorStatus: false,
        });

        return status === 200;
      }
    }
  };

  const fireStreamStart = async () => {
    // we only want to fire stream_start if the stream is not already started
    if (!analyticsState.get('isStreamStart')) {
      const user = analytics.getGlobalData().user;
      const { station, metadata, queue, index } = state.deserialize();

      logger.info('Firing stream start', { station, metadata });

      analyticsState.set('streamInitTime', Date.now());
      analyticsState.set('queryId', station.context?.queryId);

      if (station && metadata) {
        const data = getAnalyticsStationData({
          analyticsState: {
            playbackStartTime: analyticsState.get('playbackStartTime'),
            startPosition: analyticsState.get('startPosition'),
            streamInitTime: analyticsState.get('streamInitTime'),
            streamSessionId: analyticsState.get('streamSessionId'),
            hadPreroll: analyticsState.get('hadPreroll'),
          },
          eventType: 'stream',
          followed:
            (await getFollowedStatus(station.id?.toString(), station.type)) ??
            false,
          index,
          metadata: metadata.data,
          queue,
          station,
          user,
        });

        analytics.track({
          type: Analytics.eventType.enum.StreamStart,
          data: {
            ...data,
            view: {
              pageName: station.context.pageName,
            },
          },
        });

        analyticsState.set('isStreamStart', true);
      }
    }
  };

  const fireTrackStart = async () => {
    // we only want to fire track_start if the track is not already started
    if (!analyticsState.get('isTrackStart')) {
      const user = analytics.getGlobalData().user;
      const { station, metadata, queue, index } = state.deserialize();

      if (station && metadata) {
        const isSameTrack =
          analyticsState.get('oldTrackSessionId') ===
          analyticsState.get('trackSessionId');

        if (
          (metadata.type === Playback.MetadataType.Track ||
            metadata.type === Playback.MetadataType.Episode) &&
          !isSameTrack
        ) {
          const data = getAnalyticsStationData({
            analyticsState: {
              playbackStartTime: analyticsState.get('playbackStartTime'),
              startPosition: analyticsState.get('startPosition'),
              streamInitTime: analyticsState.get('streamInitTime'),
              streamSessionId: analyticsState.get('streamSessionId'),
              hadPreroll: analyticsState.get('hadPreroll'),
            },
            eventType: 'track',
            followed:
              (await getFollowedStatus(station.id?.toString(), station.type)) ??
              false,
            index,
            metadata: metadata.data,
            queue,
            station,
            user,
          });

          analyticsState.set(
            'oldTrackSessionId',
            analyticsState.get('trackSessionId'),
          );

          analytics.track({
            type: Analytics.eventType.enum.TrackStart,
            data: {
              station: {
                ...data.station,
                subSessionId: analyticsState.get('trackSessionId'),
              },
            },
          });
          analyticsState.set('isTrackStart', true);
        }
      }
    }
  };

  const fireStreamEnd = async ({ endReason }: { endReason: string }) => {
    // we only want to fire stream_end if stream_start has fired
    if (analyticsState.get('isStreamStart')) {
      const user = analytics.getGlobalData().user;
      const { history, index, queue, shuffled, station } = state.deserialize();
      const { station: oldStation, item } =
        history
          ?.filter(
            history => history.item.type !== Playback.QueueItemType.Event,
          )
          .at(-1) ?? {};

      logger.info('Firing stream end', { oldStation, station, item });

      if (oldStation && item?.meta) {
        const streamInitTime = analyticsState.get('streamInitTime');

        const data = getAnalyticsStationData({
          analyticsState: {
            playbackStartTime: analyticsState.get('playbackStartTime'),
            startPosition: analyticsState.get('startPosition'),
            streamInitTime,
            streamSessionId: analyticsState.get('streamSessionId'),
            hadPreroll: analyticsState.get('hadPreroll'),
          },
          eventType: 'stream',
          followed:
            (await getFollowedStatus(
              oldStation.id?.toString(),
              oldStation.type,
            )) ?? false,
          index,
          metadata: item.meta,
          queue,
          station: oldStation,
          user,
        });

        // Streams do not have a time component, so to determine `listenTime` we must take
        // `now` and subtract `streamInitTime` divided by 1000 (milliseconds -> seconds)
        const listenTime = Math.floor((Date.now() - streamInitTime) / 1000);

        let completionRate;

        // For podcasts, we can get the completion rate of the episode
        if (
          oldStation.type === Playback.StationType.Podcast &&
          oldStation.id != null
        ) {
          completionRate = await getPodcastProgress(oldStation.id.toString());
        }

        const { daySkipsRemaining, hourSkipsRemaining } =
          await getSkipDetails(listenTime);

        const queryId = analyticsState.get('queryId');

        const streamProtocol = item.format;

        analytics.track({
          type: Analytics.eventType.enum.StreamEnd,
          data: {
            station: {
              ...data.station,
              listenTime,
              hadPreroll: analyticsState.get('hadPreroll'),
              endReason,
              shuffleEnabled: shuffled,
              exitSpot: ads.get('current') ? 'ad' : 'music',
              offlineEnabled: 'No Value',
              ...pickBy(
                {
                  daySkipsRemaining,
                  hourSkipsRemaining,
                  completionRate,
                  streamProtocol,
                },
                isNonNullish,
              ),
            },
            ...(queryId && {
              search: {
                queryId,
              },
            }),
          },
        });

        analyticsState.set('isStreamStart', false);
      }
    }
  };

  const fireTrackEnd = async () => {
    // we only want to fire track_end if track_start has fired
    if (analyticsState.get('isTrackStart')) {
      const user = analytics.getGlobalData().user;
      const { history, index, queue, time } = state.deserialize();
      const { station: oldStation, item } =
        history
          ?.filter(
            history => history.item.type !== Playback.QueueItemType.Event,
          )
          .at(-1) ?? {};

      if (oldStation && item?.meta) {
        const data = getAnalyticsStationData({
          analyticsState: {
            playbackStartTime: analyticsState.get('playbackStartTime'),
            startPosition: analyticsState.get('startPosition'),
            streamInitTime: analyticsState.get('streamInitTime'),
            streamSessionId: analyticsState.get('streamSessionId'),
            hadPreroll: analyticsState.get('hadPreroll'),
          },
          eventType: 'track',
          followed:
            (await getFollowedStatus(
              oldStation.id?.toString(),
              oldStation.type,
            )) ?? false,
          index,
          metadata: item.meta,
          queue,
          station: oldStation,
          user,
        });

        const listenTime = time.position - analyticsState.get('startPosition');

        analytics.track({
          type: Analytics.eventType.enum.TrackEnd,
          data: {
            station: {
              ...data.station,
              endReason: 'new_station_start',
              listenTime: listenTime > 0 ? listenTime : time.position,
              subSessionId: analyticsState.get('trackSessionId'),
            },
          },
        });

        analyticsState.set('isTrackStart', false);
      }
    }
  };

  const getSkipDetails = async (listenTime: number) => {
    const { history } = state.deserialize();

    // Get the *last* item played, because that's what we're reporting on
    const { item } =
      history
        ?.filter(history => history.item.type !== Playback.QueueItemType.Event)
        .at(-1) ?? {};

    if (item == null || item?.reporting == null) {
      return {
        daySkipsRemaining: null,
        hourSkipsRemaining: null,
      };
    }

    const { daySkipsRemaining, hourSkipsRemaining } = await api.api.v3.playback
      .postReporting({
        body: {
          modes: [],
          offline: false,
          playedDate: Date.now(),
          replay: false,
          reportPayload: item?.reporting,
          secondsPlayed: listenTime,
          stationId: String(item?.id),
          status: 'SKIP',
        },
      })
      .then(prop('body'));

    return {
      daySkipsRemaining,
      hourSkipsRemaining,
    };
  };

  const getPodcastProgress = async (podcastId: number | string) => {
    const { body: recentlyPlayedEpisodeBody } =
      await api.api.v3.podcast.getRecentPlaybackStatus({
        params: { podcastId },
      });

    if (
      isNonNullish(recentlyPlayedEpisodeBody) &&
      recentlyPlayedEpisodeBody.data.length > 0 &&
      recentlyPlayedEpisodeBody.data[0].secondsPlayed &&
      recentlyPlayedEpisodeBody.data[0].duration
    ) {
      const completionRate =
        recentlyPlayedEpisodeBody.data[0].secondsPlayed /
        recentlyPlayedEpisodeBody.data[0]?.duration;
      return Number.parseFloat(completionRate.toFixed(2));
    }

    return 0;
  };

  const analyticsReporting = createEmitter<
    CreateEmitter.Subscription<Playback.Player<Station>>
  >({
    initialize() {
      const { volume } = state.deserialize();

      analyticsState.set('streamSessionId', uuid());
      analyticsState.set('trackSessionId', uuid());
      analyticsState.set('oldVolume', volume);
    },

    // load() fires when a new/different stream of any playback type is loaded into the player
    // we want to fire the track_end/stream_end events for the previous track/stream
    // then we want to create new stream/track session ids for the new stream/track
    load() {
      const { index, queue } = state.deserialize();

      fireTrackEnd();
      fireStreamEnd({ endReason: 'new_station_start' });

      const startPosition = queue[index]?.starttime ?? 0;
      analyticsState.set('startPosition', Math.round(startPosition));
      analyticsState.set('streamSessionId', uuid());
      analyticsState.set('trackSessionId', uuid());
      analyticsState.set('hadPreroll', false);
    },

    // play() fires whenever any playback type starts/resumes, both on initial play and after pause/stop, including during ads
    play() {
      analytics.setGlobalData({ device: { isPlaying: true } });
      analyticsState.set('playbackStartTime', Date.now());

      const { station } = state.deserialize();

      if (station?.type === Playback.StationType.Scan) {
        analyticsState.set('isScanStation', true);
      } else {
        analyticsState.set('isScanStation', false);
      }
    },

    // pause() fires for track/episode playback types (not live radio streams) whenever the user pauses playback, including during ads
    pause() {
      analytics.setGlobalData({ device: { isPlaying: false } });
      if (!ads.get('current')) {
        fireStreamEnd({ endReason: 'pause' });
      }
    },

    async reload(_, { sourceError }) {
      if (sourceError) {
        const { pageName, station, history, index, queue } =
          state.deserialize();
        const user = analytics.getGlobalData().user;
        const { item } =
          history
            ?.filter(
              history => history.item.type !== Playback.QueueItemType.Event,
            )
            .at(-1) ?? {};

        const queueItemType = queue[index].type;
        const eventType =
          [Playback.QueueItemType.Stream].includes(queueItemType) ? 'stream' : (
            'track'
          );

        const data = getAnalyticsStationData({
          analyticsState: {
            playbackStartTime: analyticsState.get('playbackStartTime'),
            startPosition: analyticsState.get('startPosition'),
            streamInitTime: analyticsState.get('streamInitTime'),
            streamSessionId: analyticsState.get('streamSessionId'),
            hadPreroll: analyticsState.get('hadPreroll'),
          },
          eventType,
          followed:
            (await getFollowedStatus(station.id.toString(), station.type)) ??
            false,
          index,
          metadata: item?.meta ?? {},
          queue,
          station,
          user,
        });

        await analytics.track({
          type: Analytics.eventType.enum.StreamFallback,
          data: {
            view: {
              pageName: pageName ?? '',
            },
            station: {
              ...data.station,
              fallbackErrorCode: sourceError?.response?.code,
              fallbackErrorDescription: sourceError?.response?.text,
            },
          },
        });
      }
    },

    // stop() fires for live radio streams whenever the user stops/pauses the stream, including during ads
    // stop() also fires for podcast playback when the last episode in the queue finishes and there are no more episodes to play
    stop(endReason = 'stop') {
      const { pageName } = state.deserialize();

      analytics.setGlobalData({ device: { isPlaying: false } });

      if (!ads.get('current')) {
        fireTrackEnd();
        fireStreamEnd({ endReason });

        if (analyticsState.get('isScanStation')) {
          analytics.track({
            type: Analytics.eventType.enum.ScanStopped,
            data: {
              view: {
                pageName: pageName ?? '',
              },
              scan: {
                stopType: 'miniplayer',
              },
            },
          });
        }
      }
    },

    // preroll() fires after 'play' everytime 'play' is called for any type of stream/track playback
    // it does NOT fire during an ad when 'play' is called after a pause/stop during the ad
    // preroll: () => {},

    adStart() {
      analyticsState.set('hadPreroll', true);
    },

    // beforeStart() fires before any type of non-ad playback starts or resumes, after 'play' and after ads
    beforeStart: () => {
      fireStreamStart();
      fireTrackStart();
    },

    fastForward() {
      const { metadata, pageName } = state.deserialize();
      if (metadata?.data?.podcastId && pageName) {
        const { time } = timeState.deserialize();

        const assets = {
          id: `${Playback.StationType.Podcast}|${metadata?.data?.podcastId}`,
          name: metadata?.data?.subtitle ?? '',
          subid: `${metadata?.type}|${metadata?.data?.id}`,
          subname: metadata?.data?.description ?? '',
        };

        analytics.track({
          type: Analytics.eventType.enum.Forward30,
          data: {
            pageName: pageName ?? '',
            station: {
              asset: assets,
              playheadPosition: time.position?.toFixed(2),
            },
            item: {
              asset: assets,
            },
          },
        });
      }
    },

    rewind() {
      const { metadata, pageName } = state.deserialize();

      if (metadata?.data?.podcastId && pageName) {
        const { time } = timeState.deserialize();
        const assets = {
          id: `${Playback.StationType.Podcast}|${metadata?.data?.podcastId}`,
          name: metadata?.data?.subtitle ?? '',
          subid: `${metadata?.type}|${metadata?.data?.id}`,
          subname: metadata?.data?.description ?? '',
        };
        analytics.track({
          type: Analytics.eventType.enum.Back15,
          data: {
            pageName: pageName ?? '',
            station: {
              asset: assets,
              playheadPosition: time.position?.toFixed(2),
            },
            item: {
              asset: assets,
            },
          },
        });
      }
    },

    // next() fires for track/episode playback types (not live radio) when the next track plays automatically or when a user clicks next/skip
    // when this happens we want to fire the track_end event for the previous track/episode
    // next() also fires for live radio station scan when the scan skips to the next station
    // when this happens we want to fire the stream_end event for the previous live station scan stream
    next(_, _internal, endReason = 'next') {
      const { queue, index, station } = state.deserialize();

      if (station?.type === Playback.StationType.Scan) {
        fireStreamEnd({ endReason });
      } else {
        fireTrackEnd();
      }

      const startPosition = queue[index]?.starttime ?? 0;
      analyticsState.set('startPosition', Math.round(startPosition));
      analyticsState.set('oldTrackSessionId', '');
      analyticsState.set('trackSessionId', uuid());
    },

    setScanning(_, { isScanning, skip }) {
      const { history, station } = state.deserialize();
      const skipScanning = isNonNullish(skip) && skip === true;

      if (!isScanning && !skipScanning) {
        const { station: oldstation } =
          history
            ?.filter(
              history => history.item.type !== Playback.QueueItemType.Event,
            )
            .at(-1) ?? {};
        if (
          station?.type === Playback.StationType.Live &&
          oldstation?.type === Playback.StationType.Scan
        ) {
          analytics.track({
            type: Analytics.eventType.enum.ScanStopped,
            data: {
              view: {
                pageName: 'home',
              },
              scan: {
                stopType: 'auto_end',
              },
            },
          });
        }
      }
    },

    setVolume(value) {
      const { history, index, queue } = state.deserialize();
      const { station, item } =
        history
          ?.filter(
            history => history.item.type !== Playback.QueueItemType.Event,
          )
          .at(-1) ?? {};
      const { volume } = state.deserialize();
      const user = analytics.getGlobalData().user;
      if (station && item?.meta) {
        const assetData = getTrackAssetData({
          index,
          metadata: {
            ...station.meta,
            ...item?.meta,
          },
          station,
          queue,
          user,
        });
        analytics.track({
          type: Analytics.eventType.enum.VolumeChange,
          data: {
            station: {
              asset: {
                id: assetData.stationId,
                name: assetData.stationName,
                ...(assetData.stationSubid && {
                  subid: assetData.stationSubid?.toString(),
                  subname: assetData.stationSubname,
                }),
              },
            },
            device: {
              oldVolume: Math.round(analyticsState.get('oldVolume')),
              newVolume: Math.round(volume),
            },
          },
        });
      }
      analyticsState.set('oldVolume', value);
    },
  });

  return [analyticsReporting, analyticsState];
}
