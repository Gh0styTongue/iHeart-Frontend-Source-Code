import { HTTPError } from '@iheartradio/web.api';
import { type Poweramp, StationEnum } from '@iheartradio/web.api/amp';
import {
  type CreateEmitter,
  createEmitter,
} from '@iheartradio/web.utilities/create-emitter';
import { createWebStorage } from '@iheartradio/web.utilities/create-storage';
import { throttle } from '@iheartradio/web.utilities/timing';
import { isEmpty, isNonNullish, isNullish } from 'remeda';
import type { Merge } from 'type-fest';

import { PlayerError, PlayerErrorCode } from './player:error.js';
import * as Playback from './player:types.js';
import { fetchPlaybackStreams } from './utility:streams.js';
import {
  buildCustomPreRollUrl,
  getCustomInStreamAdUrl,
  refreshPrerollUrl,
} from './utility:targeting.js';

export type PodcastStation = Merge<
  Playback.Station,
  {
    id: number;
    seed?: number;
    started?: number;
    timestamp?: Playback.Time['position'];
    type: Playback.StationType.Podcast;
    isFirstEpisode?: boolean;
    isLastEpisode?: boolean;
  }
>;

function isEpisodeCompleted(time: Playback.Time) {
  return Math.floor(time.position) >= Math.floor(time.duration);
}

export const updateResolverEpisodeProgress = throttle(
  (
    {
      api,
      state,
    }: { api: Playback.Api; state: Playback.PlayerState<PodcastStation> },
    time: Playback.Time,
  ): boolean => {
    const { index, queue, station, featureFlags } = state;

    const episode = queue[index];

    const episodeId = Number(queue[index].id);
    const podcastId = Number(station?.id);

    api.api.v3.podcast.updateEpisodeProgress({
      params: { episodeId, podcastId },
      body: {
        completed:
          featureFlags?.newPodcastPlaybackOrder ?
            episode.meta.completed || isEpisodeCompleted(time)
          : (episode.meta.completed ?? isEpisodeCompleted(time)),
        secondsPlayed: Math.floor(time.position),
      },
      throwOnErrorStatus: false,
    });

    return featureFlags?.newPodcastPlaybackOrder ?
        episode.meta.completed || isEpisodeCompleted(time)
      : (episode.meta.completed ?? isEpisodeCompleted(time));
  },
  10_000,
);

type Podcast = Poweramp.ComIheartPowerampPodcastDomainFollowedPodcast & {
  adTargeting?: { providerId: number };
};

export function createPodcastResolver(): CreateEmitter.Emitter<
  Playback.Resolver<PodcastStation>
> {
  const podcastState = createWebStorage<{
    pageKey: string | undefined;
    podcast: Podcast | undefined;
    triton?: {
      [k: number]: {
        token: string;
        expiration: number;
      };
    };
  }>({
    seed: {
      pageKey: undefined,
      podcast: undefined,
      triton: undefined,
    },
    prefix: `player:resolver:podcast:state.`,
    type: 'session',
  });

  async function fetchPodcast({
    api,
    station,
  }: {
    api: Playback.Api;
    station: PodcastStation;
  }): Promise<Podcast> {
    const { body: podcast } = await api.api.v3.podcast.getPodcast({
      params: { id: station.id },
    });

    podcastState.set('podcast', podcast);

    return podcast;
  }

  async function fetchPodcastQueue({
    api,
    initial,
    station,
    featureFlags,
  }: {
    api: Playback.Api;
    initial?: boolean;
    station: PodcastStation;
    featureFlags: Playback.PlayerState<PodcastStation>['featureFlags'];
  }): Promise<{ queue: Playback.Queue; childOriented: boolean }> {
    try {
      const episodes: Poweramp.ComIheartPowerampPodcastApiSimpleEpisode[] = [];

      // If initial load and the station has a seed, we want to fetch that episode first.
      if (initial && station.seed) {
        const { body: response } = await api.api.v3.podcast.getEpisode({
          params: { id: station.seed },
          // Passing `withProgress` to ensure we get the episode's `secondsPlayed` to avoid missing progress state.
          // Without this value, the episode appears unplayed, even if the user listened to it already.
          query: { withProgress: true },
        });

        response.episode.completed =
          featureFlags?.newPodcastPlaybackOrder ?
            response.episode.completed ||
            isEpisodeCompleted({
              duration: response.episode.duration,
              position: response.episode.secondsPlayed ?? 0,
            })
          : (response.episode.completed ??
            isEpisodeCompleted({
              duration: response.episode.duration,
              position: response.episode.secondsPlayed ?? 0,
            }));
        episodes.push(response.episode);
        podcastState.set('pageKey', response.pageKey);
      } else {
        const { body: recentlyPlayedEpisodeBody } =
          await api.api.v3.podcast.getRecentPlaybackStatus({
            params: { podcastId: station?.id },
          });

        // Otherwise, if it is initial load and there was an episode previously being listened to, play that one.
        if (initial && recentlyPlayedEpisodeBody.data.length > 0) {
          const recentlyPlayedEpisodeId =
            recentlyPlayedEpisodeBody?.data[0]?.id;

          const { body: response } = await api.api.v3.podcast.getEpisode({
            params: { id: recentlyPlayedEpisodeId },
            // Passing `withProgress` to ensure we get the episode's `secondsPlayed` to avoid missing progress state.
            // Without this value, the episode appears unplayed, even if the user listened to it already.
            query: { withProgress: true },
          });

          episodes.push(response.episode);
          podcastState.set('pageKey', response.pageKey);
        } else {
          // Else, fetch and play the latest episode (episodic) or first episode (serial).
          const { body: response } =
            await api.api.v3.podcast.getPodcastEpisodes({
              params: { id: station.id },
              query: {
                limit: initial ? 2 : 1,
                pageKey: podcastState.get('pageKey'),
                sortBy:
                  featureFlags?.newPodcastPlaybackOrder ?
                    // We want to play the first episode on initial play from the podcast profile hero.
                    // The rest of the queue should be played in ascending order, regardless of the podcast type.
                    initial ?
                      podcastState.get('podcast')?.showType === 'serial' ?
                        'startDate-asc'
                      : 'startDate-desc'
                    : 'startDate-asc'
                  : podcastState.get('podcast')?.showType === 'serial' ?
                    'startDate-asc'
                  : 'startDate-desc',
              },
            });

          // return empty queue and have the player stop.
          if (response.data.length === 0) {
            return { queue: [], childOriented: false };
          }

          for (const episode of response.data) {
            episodes.push(episode);
          }

          podcastState.set('pageKey', response.links.next);
        }
      }

      let childOriented = false;

      // enable/disable the previous/next buttons

      if (episodes[0].id) {
        const { body: episodesWithWindow } =
          await api.api.v3.podcast.getPodcastEpisodesWithWindow({
            params: { episodeId: episodes[0].id },
            query: {
              limitAfter: 1,
              limitBefore: 1,
              sortBy:
                featureFlags?.newPodcastPlaybackOrder ? 'startDate-asc'
                : podcastState.get('podcast')?.showType === 'serial' ?
                  'startDate-asc'
                : 'startDate-desc',
            },
          });

        if (episodesWithWindow.episodes[0].id === episodes[0].id) {
          station.isFirstEpisode = true;
        }

        if (episodesWithWindow.episodes?.at(-1)?.id == episodes[0].id) {
          station.isLastEpisode = true;
        }
      }

      return {
        queue: await episodes
          .reduce(
            async (accumulator, episode) => {
              return {
                ...(await accumulator),
                [Symbol.for(String(episode.id))]: {
                  id: episode.id,
                  completed: episode.completed ?? false,
                  transcriptionAvailable:
                    episode.transcriptionAvailable ?? false,
                  secondsPlayed: episode.secondsPlayed ?? 0,
                  duration: episode.duration,
                  imageUrl: episode.imageUrl ?? '',
                },
              };
            },
            Promise.resolve(
              {} as Record<
                symbol,
                {
                  id: number;
                  transcriptionAvailable: boolean;
                  secondsPlayed: number;
                  duration: number;
                  completed: boolean;
                  imageUrl: string;
                }
              >,
            ),
          )
          .then(async episodeItems => {
            const { items, ageLimit } = await fetchPlaybackStreams({
              api,
              contentIds: Object.getOwnPropertySymbols(episodeItems).reduce(
                (accumulator, current) => {
                  return [...accumulator, episodeItems[current].id];
                },
                [] as number[],
              ),
              playedFrom: station.context.playedFrom,
              stationType: StationEnum.PODCAST,
              stationId: station.id,
            });

            if (ageLimit) {
              childOriented = true;
            }

            if (isNullish(items) || items.length === 0) {
              throw PlayerError.new({ code: PlayerErrorCode.MissingStreams });
            }

            return items.reduce((streams, stream) => {
              if (stream.streamUrl && stream.content && stream.content.id) {
                const episodeItem =
                  episodeItems[Symbol.for(String(stream.content.id))];

                let streamUrl = stream.streamUrl;

                const triton = podcastState.get('triton');

                if (
                  featureFlags?.podcastTritonTokenEnabled &&
                  station.providerId &&
                  triton !== undefined &&
                  triton?.[station.providerId] &&
                  triton?.[station.providerId].token
                ) {
                  const modifiedUrl = new URL(streamUrl);
                  modifiedUrl.searchParams.set(
                    'partnertok',
                    triton[station.providerId].token.toString()!,
                  );
                  streamUrl = modifiedUrl.toString();
                }

                streams.push({
                  id: stream.content?.id as number,
                  duration: episodeItem.duration ?? stream.content.duration,
                  meta: {
                    ...stream.content,
                    childOriented,
                    description: podcastState.get('podcast')?.title,
                    image:
                      episodeItem.imageUrl ??
                      podcastState.get('podcast')?.imageUrl,
                    subtitle: stream.content?.title,
                    podcastId: podcastState.get('podcast')?.id,
                    podcastSlug: podcastState.get('podcast')?.slug,
                    title: undefined,
                    transcriptionAvailable:
                      episodeItem.transcriptionAvailable ?? false,
                    secondsPlayed:
                      episodeItem.secondsPlayed ??
                      stream.content.secondsPlayed ??
                      0,
                    duration: episodeItem.duration ?? stream.content.duration,
                    completed: episodeItem.completed,
                  },
                  reporting: stream.reportPayload,
                  starttime:
                    station.timestamp ?? episodeItem.secondsPlayed ?? 0,
                  type: Playback.QueueItemType.Episode,
                  url: streamUrl,
                });
              }

              return streams;
            }, [] as Playback.Queue);
          }),
        childOriented,
      };
    } catch (error: unknown) {
      if (error instanceof HTTPError) {
        throw PlayerError.new({
          code: PlayerErrorCode.ApiError,
          data: {
            requestUrl: await error.getRequestUrl(),
            requestPayload: await error.getRequestPayload(),
            responseErrors: await error.getResponseErrors(),
          },
        });
      } else if (error instanceof Error) {
        throw PlayerError.new({
          code: PlayerErrorCode.Generic,
          data: {
            stack: error.stack,
            cause: error.cause,
            message: error.message,
          },
        });
      } else {
        throw PlayerError.new({ code: PlayerErrorCode.Generic });
      }
    }
  }

  async function fetchPreviousPodcastQueue({
    api,
    featureFlags,
    queue,
    station,
  }: {
    api: Playback.Api;
    featureFlags: Playback.PlayerState<PodcastStation>['featureFlags'];
    queue: Playback.Queue;
    station: PodcastStation;
  }) {
    if (queue[0].id) {
      const { body: response } =
        await api.api.v3.podcast.getPodcastEpisodesWithWindow({
          params: { episodeId: queue[0].id },
          query: {
            limitAfter: 0,
            limitBefore: 1,
            sortBy:
              featureFlags?.newPodcastPlaybackOrder ? 'startDate-asc'
              : podcastState.get('podcast')?.showType === 'serial' ?
                'startDate-asc'
              : 'startDate-desc',
          },
        });

      const episodes = await response.episodes;

      if (episodes[0].id !== station.seed) {
        station.seed = episodes[0].id;
      } else {
        station.isFirstEpisode = true;
        return queue;
      }

      const newQueue = await fetchPodcastQueue({
        api,
        initial: true,
        station,
        featureFlags,
      });

      return newQueue.queue.concat(queue);
    }

    return queue;
  }

  const calculateNextIndex = async ({
    api,
    featureFlags,
    index,
    newQueue,
    station,
  }: {
    api: Playback.Api;
    featureFlags: Playback.PlayerState<PodcastStation>['featureFlags'];
    index: number;
    newQueue: Playback.Queue;
    station: PodcastStation;
  }) => {
    let nextIndex = index + 1;

    if (nextIndex >= newQueue.length && podcastState.get('pageKey')) {
      const { queue: queueItems } = await fetchPodcastQueue({
        api,
        initial: false,
        station,
        featureFlags,
      });

      if (isEmpty(queueItems)) {
        station.isLastEpisode = true;
        return null;
      }

      newQueue = newQueue.concat(queueItems);
    }

    // This **shouldn't** happen in practice, but it DID happen in test, which is why I'm accounting
    // for it here...
    //
    // If the `index` passed to this function is greater than the current length of the queue, the function
    // will fetch the next item in the queue ... but what if `index` is STILL larger than the queue array?
    // In that case, the nextIndex should be set to the last element in the queue array, hence...
    if (nextIndex >= newQueue.length) {
      nextIndex = newQueue.length - 1;
    }

    return { nextIndex, nextQueue: newQueue };
  };

  const podcastResolver = createEmitter<Playback.Resolver<PodcastStation>>({
    async load({ api, state }, stationToLoad) {
      const station = { ...stationToLoad };

      if (isNullish(station)) {
        return state;
      }

      // setting a pageKey undefined when new podcast start
      podcastState.set('pageKey', undefined);

      // Only update episode progress if a new podcast episode is being loaded
      if (
        isNonNullish(podcastState.get('podcast')) &&
        podcastState.get('podcast')?.id !== stationToLoad.id
      ) {
        const { station, queue, index, time } = state;
        const item = queue[index];
        if (item.type === Playback.QueueItemType.Episode) {
          const episodeId = Number(queue[index].id);
          const podcastId = station!.id;

          await api.api.v3.podcast.updateEpisodeProgress({
            params: { episodeId, podcastId },
            body: {
              completed: isEpisodeCompleted(time),
              secondsPlayed: Math.floor(time.position),
            },
          });
        }
      }

      const podcast = await fetchPodcast({ api, station });

      const triton = podcastState.get('triton');

      const currentSeconds = Math.floor(Date.now() / 1000);

      const tritonData =
        podcast?.adTargeting?.providerId &&
        triton?.[podcast.adTargeting.providerId];

      // if the podcastTritonTokenEnabled featured flag is disabled or we don't have already token in state for podcast providerid or it is expired then only we should make call to get triton token
      if (
        state.featureFlags?.podcastTritonTokenEnabled &&
        podcast.adTargeting?.providerId &&
        (!tritonData || tritonData?.expiration < currentSeconds) &&
        state.lsid
      ) {
        const { body: response } =
          await api.api.v3.oauth.postGenerateTritonToken({
            body: {
              lsid: state.lsid,
              providerId: podcast.adTargeting.providerId,
            },
          });

        podcastState.set('triton', {
          ...triton,
          [podcast.adTargeting.providerId]: {
            token: response.token,
            expiration: response.expirationDate,
          },
        });
      }

      station.started = Date.now();
      station.name = podcast.title;

      station.providerId = podcast.adTargeting?.providerId;

      station.meta = {
        title: podcast.title,
        image: `${podcast.imageUrl}?ops=cover(400,400)`,
      };

      const { queue } = await fetchPodcastQueue({
        api,
        initial: true,
        station,
        featureFlags: state.featureFlags,
      });

      // Timestamps get set from clicking the play button on an episode row.
      // We use that value to load the episode at the correct timestamp, THEN we delete this value.
      // Deleting the value is needed so the `timestamp` value does not interfere with where other episodes begin playback from.
      delete station.timestamp;

      return {
        ...state,
        index: 0,
        repeat: Playback.Repeat.No,
        station,
        time: {
          position: queue[0].starttime ?? 0,
          duration: queue[0].duration!,
        },
        queue,
      };
    },

    async midroll({ state, ads }) {
      const { queue, station } = state;
      const { targeting } = ads;

      if (isNullish(station) || isNullish(targeting)) {
        return null;
      }

      return getCustomInStreamAdUrl({
        queue,
        targeting,
        stationId: podcastState.get('podcast')?.id,
      });
    },

    async next({ api, state, time }) {
      const { index, queue, station, featureFlags } = state;
      if (isNullish(station)) {
        return state;
      }

      station.isFirstEpisode = false;

      let newQueue = [...queue];

      const item = newQueue[index];

      // If an item and station exist, we want to update episode progress when next is called
      // This is to retain knowledge of where you left off on the podcast episode
      if (item && station) {
        const podcastId = Number(station.id);
        const episodeId = Number(item.id);

        const completed =
          featureFlags?.newPodcastPlaybackOrder ?
            // if the newPodcastPlaybackOrder feature flag is TRUE
            // if we re-start playback on a completed/played episode we mark it as unplayed/switch completed to false
            // so we want to base the new 'completed' value only on the episode's current time/position
            isEpisodeCompleted(time)
            // if the newPodcastPlaybackOrder feature flag is FALSE
            // if we re-start playback on a completed/played episode it stays marked as played/completed
            // so if the episode's current time/position is not complete, we use the stored 'completed' value
          : isEpisodeCompleted(time) || item.meta.completed;

        await api.api.v3.podcast.updateEpisodeProgress({
          params: { episodeId, podcastId },
          body: {
            completed,
            secondsPlayed: Math.floor(time.position),
          },
        });

        item.meta.completed = completed;
        // TODO: also update state 'metadata.data' with new 'completed' value?
      }

      if (featureFlags?.newPodcastPlaybackOrder) {
        const queueData = await calculateNextIndex({
          api,
          station,
          newQueue,
          index,
          featureFlags,
        });

        if (queueData) {
          const { nextQueue, nextIndex } = queueData;

          // If the next episode is fully listened to (We do not factor in the "Mark as played" flag here)...
          if (
            isEpisodeCompleted({
              duration: nextQueue[nextIndex].duration ?? 1,
              position: nextQueue[nextIndex].meta.secondsPlayed ?? 0,
            })
          ) {
            // Reset the start time to 0 so that the episode starts from the beginning
            nextQueue[nextIndex].starttime = 0;

            return {
              ...state,
              index: nextIndex,
              queue: nextQueue,
              time: { position: 0, duration: nextQueue[nextIndex].duration! },
              station: { ...station, seed: Number(nextQueue[nextIndex].id) },
            };
          }

          newQueue = nextQueue;

          const newTime = {
            position: newQueue[nextIndex].starttime!,
            duration: newQueue[nextIndex].duration!,
          };

          return {
            ...state,
            index: nextIndex,
            queue: newQueue,
            time: newTime,
            station: { ...station, seed: Number(newQueue[nextIndex].id) },
          };
        } else {
          return null;
        }
      } else {
        // If an episode finishes and the following episode is already marked as played, we don't want to play it - instead, we want to skip that episode.
        // This loop proceeds through the queue to find the next episode that has NOT been played yet.
        // If all episodes are played and it reaches the end of the queue, it will return `null` which will cause playback to stop playing.
        let foundNextPlayableEpisode = false;

        while (!foundNextPlayableEpisode) {
          const queueData = await calculateNextIndex({
            api,
            station,
            newQueue,
            index,
            featureFlags,
          });

          if (queueData) {
            const { nextQueue, nextIndex } = queueData;

            if (!nextQueue[nextIndex]?.meta.completed) {
              foundNextPlayableEpisode = true;
              newQueue = nextQueue;

              const newTime = {
                position: newQueue[nextIndex].starttime!,
                duration: newQueue[nextIndex].duration!,
              };

              return {
                ...state,
                index: nextIndex,
                queue: newQueue,
                time: newTime,
                station: { ...station, seed: Number(newQueue[nextIndex].id) },
              };
            } else {
              continue;
            }
          } else {
            return null;
          }
        }
      }

      return null;
    },

    async pause({ api, state, time }) {
      const { index, queue, station, status } = state;

      const podcastId = Number(station?.id);
      const episodeId = Number(queue[index]?.id);

      await api.api.v3.podcast.updateEpisodeProgress({
        params: { episodeId, podcastId },
        body: {
          completed: isEpisodeCompleted(time),
          secondsPlayed: Math.floor(time.position),
        },
        throwOnErrorStatus: false,
      });

      return status;
    },

    async play({ api, state }) {
      const { index, queue, station, status, featureFlags } = state;

      const item = queue[index];
      const podcastId = Number(station?.id);
      const episodeId = Number(queue[index]?.id);
      const isComplete =
        featureFlags?.newPodcastPlaybackOrder ?
          isEpisodeCompleted({
            duration: item.duration ?? 1,
            position: item.meta.secondsPlayed ?? 0,
          })
        : item.meta.completed && item.meta.secondsPlayed >= item.meta.duration;

      if (featureFlags?.newPodcastPlaybackOrder) {
        // If the episode is completed, we reset the progress
        if (item.meta.completed || isComplete) {
          // DO NOT COPY THIS PATTERN - Manipulating the item directly is not a good practice.
          // This is a workaround since `play()` does not return the playback `state`, yet we need to update the episode progress
          // so that the `state` is up-to-date when `setTime` is called.
          item.starttime = isComplete ? 0 : (item.meta.secondsPlayed ?? 0);
          item.meta.completed = false;
          item.meta.secondsPlayed =
            isComplete ? 0 : (item.meta.secondsPlayed ?? 0);

          await api.api.v3.podcast.updateEpisodeProgress({
            params: { episodeId, podcastId },
            body: {
              completed: false,
              secondsPlayed: item.meta.secondsPlayed,
            },
            throwOnErrorStatus: false,
          });
        } else {
          // We only automatically mark an episode as unplayed if it:
          // 1. Is marked as played
          // 2. The duration of the episode is FULLY complete - i.e. secondsPlayed >= duration
          // If you are clicking play on an episode that is already marked as played AND has been played to completion, we want to set it as UNPLAYED again
          if (isComplete) {
            await api.api.v3.podcast.updateEpisodeProgress({
              params: { episodeId, podcastId },
              body: {
                completed: false,
                secondsPlayed: 0,
              },
              throwOnErrorStatus: false,
            });
          }
        }
      }

      return status;
    },

    async preroll({ state, ads, api }) {
      let preroll;

      const { station } = state;
      const { dfpInstanceId, targeting } = ads;
      const podcast = podcastState.get('podcast');

      if (isNullish(station) || isNullish(podcast)) {
        return null;
      }

      const { body: playbackAds } = await api.api.v2.playback.postAds({
        body: {
          host: api.hostName,
          stationType: StationEnum.PODCAST,
          stationId: String(podcast.id),
          includeStreamTargeting: false,
          playedFrom: station.context.playedFrom,
        },
      });

      if (playbackAds.ads) {
        const ampPreroll = playbackAds.ads.find(ad => ad.preRoll);

        if (ampPreroll && dfpInstanceId && targeting) {
          preroll = await buildCustomPreRollUrl({
            ampPrerollUrl: ampPreroll.url,
            iu: `/${dfpInstanceId}/ccr.ihr/ihr`,
            prerollTargeting: { ...targeting.PreRoll },
          });
        }
      }

      if (isNonNullish(preroll)) {
        return refreshPrerollUrl(preroll, Playback.AdFormat.Custom);
      }
      return null;
    },

    async previous({ api, state, time }) {
      const { index: preIndex, queue, station, featureFlags } = state;

      let newQueue = [...queue];

      let index = preIndex;

      if (preIndex <= 1) {
        newQueue = await fetchPreviousPodcastQueue({
          api,
          station,
          queue: newQueue,
          featureFlags,
        });
        index = 1;
      }

      const podcastId = Number(station?.id);
      const episodeId = Number(queue[preIndex]?.id);

      station.isLastEpisode = false;

      const completed = isEpisodeCompleted(time);
      await api.api.v3.podcast.updateEpisodeProgress({
        params: { episodeId, podcastId },
        body: {
          completed,
          secondsPlayed: Math.floor(time.position),
        },
        throwOnErrorStatus: false,
      });

      newQueue[index] = Object.assign(newQueue[index], {
        starttime: completed ? 0 : Math.floor(time.position),
      });

      const previousIndex = index - 1;

      const newTime = {
        position: Math.floor(newQueue[previousIndex].starttime!),
        duration: newQueue[previousIndex].duration!,
      };

      return {
        ...state,
        queue: newQueue,
        index: previousIndex,
        time: newTime,
        station: { ...station, seed: Number(newQueue[previousIndex].id) },
      };
    },

    async seek({ api, state, time }, position) {
      const timeData = { duration: time.duration, position };
      updateResolverEpisodeProgress({ api, state }, timeData);

      return timeData.position;
    },

    async setMetadata({ state }) {
      const { index, queue } = state;

      return {
        type: Playback.MetadataType.Episode,
        data: queue[index].meta,
      };
    },

    async setTime({ api, state }, time) {
      updateResolverEpisodeProgress({ api, state }, time);

      return {
        ...state,
        time,
      };
    },
  });

  return podcastResolver;
}
