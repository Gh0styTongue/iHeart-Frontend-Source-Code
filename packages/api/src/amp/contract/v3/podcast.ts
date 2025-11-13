import { initContract } from '@ts-rest/core';
import type { Merge } from 'type-fest';
import { z } from 'zod';

import { HttpMethods } from '../../../httpUtils/constants.js';
import type { V3 } from '../../../types/poweramp.js';
import { implement } from '../../implement.js';
import { numberIdSchema } from '../../schemas/common.js';

const c = initContract();

export type GetPodcast = V3.GetPodcast.ResponseBody;
export const PodcastFilterIdValues = {
  UNPLAYED: z.literal('UNPLAYED'),
  SEASON: z.literal('SEASON'),
  YEAR: z.literal('YEAR'),
  DOWNLOADED: z.literal('DOWNLOADED'),
  ALL: z.literal('ALL'),
} as const;

export const PodcastSortValues = {
  ASC: z.literal('asc'),
  DESC: z.literal('desc'),
} as const;

export const ActionTypeValues = {
  MARK_AS_PLAYED_ACTION: 'MARK_AS_PLAYED_ACTION',
  MARK_AS_UNPLAYED_ACTION: 'MARK_AS_UNPLAYED_ACTION',
  PREFERENCES: 'PREFERENCES',
} as const;

export const PodcastFilterIdSchema = z
  .union([
    PodcastFilterIdValues.UNPLAYED,
    PodcastFilterIdValues.SEASON,
    PodcastFilterIdValues.YEAR,
    PodcastFilterIdValues.DOWNLOADED,
    PodcastFilterIdValues.ALL,
  ])
  .optional();

export const PodcastMarkAsPlayedSchema = z
  .union([
    z.literal(ActionTypeValues.MARK_AS_PLAYED_ACTION),
    z.literal(ActionTypeValues.MARK_AS_UNPLAYED_ACTION),
    z.literal(ActionTypeValues.PREFERENCES),
  ])
  .optional();

export const PodcastFilterSchema = z
  .object({
    id: PodcastFilterIdSchema,
    value: z.string().optional(),
  })
  .optional();

export const PodcastSortSchema = z
  .union([PodcastSortValues.ASC, PodcastSortValues.DESC])
  .optional();
export const PodcastFilterAndSortSchema = z.object({
  filter: PodcastFilterSchema,
  sort: PodcastSortSchema,
});
export type PodcastFilter = z.infer<typeof PodcastFilterSchema>;
export type PodcastSort = z.infer<typeof PodcastSortSchema>;
export type PodcastFilterAndSort = z.infer<typeof PodcastFilterAndSortSchema>;

export type PodcastPreferencesPayload = Merge<
  V3.UpdateUserPodcastFilterPreferences.RequestBody,
  {
    filter?: NonNullable<
      V3.UpdateUserPodcastFilterPreferences.RequestBody['filter']
    >[number];
  }
>;

export type UpdateFilterPreferences =
  V3.UpdateUserPodcastFilterPreferences.ResponseBody;

export const podcastContract = c.router(
  {
    getPodcastCategories: {
      method: HttpMethods.Get,
      path: '/categories',
      responses: {
        200: c.type<V3.GetAllCategories.ResponseBody>(),
      },
    },

    getPodcastCategory: {
      method: HttpMethods.Get,
      path: '/categories/:id',
      pathParams: implement<V3.GetCategory.RequestParams>().from({
        id: numberIdSchema,
      }),
      query: c.type<V3.GetCategory.RequestQuery>(),
      responses: {
        200: c.type<V3.GetCategory.ResponseBody>(),
      },
    },

    getPodcastDirectory: {
      method: HttpMethods.Get,
      path: '/directory',
      responses: {
        200: c.type<V3.GetDirectory.ResponseBody>(),
      },
    },

    getEpisode: {
      method: HttpMethods.Get,
      path: '/episodes/:id',
      pathParams: c.type<V3.GetEpisode.RequestParams>(),
      query: c.type<V3.GetEpisode.RequestQuery>(),
      responses: {
        200: c.type<V3.GetEpisode.ResponseBody>(),
      },
    },

    getRecentlyPlayedEpisodes: {
      method: HttpMethods.Get,
      path: '/episodes/recentlyPlayed',
      responses: {
        200: c.type<V3.GetRecentlyPlayedEpisode.ResponseBody>(),
      },
    },

    getPodcastFollows: {
      method: HttpMethods.Get,
      path: '/follows',
      query: c.type<V3.GetFollows.RequestQuery>(),
      responses: {
        200: c.type<V3.GetFollows.ResponseBody>(),
      },
    },

    getIsFollowingPodcast: {
      method: HttpMethods.Get,
      path: '/follows/:podcastId',
      pathParams: implement<V3.IsPodcastFollowed.RequestParams>().from({
        podcastId: numberIdSchema,
      }),
      query: c.type<never>(),
      responses: {
        200: c.type<never>(),
        404: c.type<never>(),
      },
    },

    followPodcast: {
      method: HttpMethods.Put,
      path: '/follows/:podcastId',
      pathParams: implement<V3.FollowPodcast.RequestParams>().from({
        podcastId: numberIdSchema,
      }),
      body: c.type<V3.FollowPodcast.RequestBody>(),
      query: c.type<V3.FollowPodcast.RequestQuery>(),
      responses: {
        204: c.type<V3.FollowPodcast.ResponseBody>(),
      },
    },

    unfollowPodcast: {
      method: HttpMethods.Delete,
      path: '/follows/:podcastId',
      pathParams: implement<V3.UnfollowPodcast.RequestParams>().from({
        podcastId: numberIdSchema,
      }),
      body: c.type<V3.UnfollowPodcast.RequestBody>(),
      query: c.type<V3.UnfollowPodcast.RequestQuery>(),
      responses: {
        204: c.type<V3.UnfollowPodcast.ResponseBody>(),
      },
    },

    updateFollowedPodcastSettings: {
      method: HttpMethods.Put,
      path: '/follows/:podcastId/settings',
      pathParams: c.type<V3.UpdateFollowedPodcastSettings.RequestParams>(),
      body: c.type<V3.UpdateFollowedPodcastSettings.RequestBody>(),
      responses: {
        204: c.type<V3.UpdateFollowedPodcastSettings.ResponseBody>(),
      },
    },

    getPodcast: {
      method: HttpMethods.Get,
      path: '/podcasts/:id',
      pathParams: implement<V3.GetPodcast.RequestParams>().from({
        id: numberIdSchema,
      }),
      responses: {
        200: c.type<V3.GetPodcast.ResponseBody>(),
      },
    },

    getPodcastEpisodes: {
      method: HttpMethods.Get,
      path: '/podcasts/:id/episodes',
      pathParams: c.type<V3.GetPodcastEpisodes.RequestParams>(),
      query: c.type<V3.GetPodcastEpisodes.RequestQuery>(),
      responses: {
        200: c.type<
          V3.GetPodcastEpisodes.ResponseBody & { meta: Record<string, unknown> }
        >(),
      },
    },

    getPodcastEpisodesWithWindow: {
      method: HttpMethods.Get,
      path: '/episodes/:episodeId/window',
      pathParams: c.type<V3.GetEpisodeWithWindowExternal.RequestParams>(),
      query: c.type<V3.GetEpisodeWithWindowExternal.RequestQuery>(),
      responses: {
        200: c.type<
          V3.GetEpisodeWithWindowExternal.ResponseBody & {
            meta: Record<string, unknown>;
          }
        >(),
      },
    },

    updateEpisodeProgress: {
      method: HttpMethods.Put,
      path: '/podcasts/:podcastId/progress/:episodeId',
      pathParams: c.type<V3.UpdateEpisodeProgress.RequestParams>(),
      body: implement<V3.UpdateEpisodeProgress.RequestBody>().from({
        completed: z.boolean().optional(),
        secondsPlayed: z.number().nonnegative(),
      }),
      responses: {
        204: c.type<V3.UpdateEpisodeProgress.ResponseBody>(),
        400: c.type<never>(),
      },
    },

    removeEpisodeProgress: {
      method: HttpMethods.Delete,
      path: '/podcasts/:podcastId/progress/:episodeId',
      pathParams: c.type<V3.RemoveEpisodeProgress.RequestParams>(),
      body: c.type<V3.RemoveEpisodeProgress.RequestBody>(),
      responses: {
        204: c.type<V3.RemoveEpisodeProgress.ResponseBody>(),
      },
    },

    getUnlistenedEpisodeCount: {
      method: HttpMethods.Get,
      path: '/podcasts/:podcastId/unlistenedEpisodeCount',
      pathParams: c.type<V3.GetUnlistenedCount.RequestParams>(),
      responses: {
        200: c.type<V3.GetUnlistenedCount.ResponseBody>(),
      },
    },

    updateLastViewed: {
      method: HttpMethods.Patch,
      path: '/podcasts/lastViewed',
      body: c.type<V3.UpdatePodcastProfileLastViewed.RequestBody>(),
      responses: {
        204: c.type<V3.UpdatePodcastProfileLastViewed.ResponseBody>(),
      },
    },

    getPodcastBySlug: {
      method: HttpMethods.Get,
      path: '/podcasts/slug/:slug',
      pathParams: c.type<V3.GetPodcastBySlug.RequestParams>(),
      responses: {
        200: c.type<V3.GetPodcastBySlug.ResponseBody>(),
      },
    },

    getProgressByUser: {
      method: HttpMethods.Get,
      path: '/progress',
      query: c.type<V3.GetProgressByUser.RequestQuery>(),
      responses: {
        200: c.type<V3.GetProgressByUser.ResponseBody>(),
      },
    },
    getPodcastFilterPreferences: {
      method: HttpMethods.Get,
      path: '/podcasts/:podcastId/preferences',
      pathParams: c.type<V3.GetUserFilterPreferencesForPodcast.RequestParams>(),
      responses: {
        200: z.object({
          profileId: z.number(),
          podcastId: z.number(),
          filterAndSort: implement<
            Merge<
              V3.GetUserFilterPreferencesForPodcast.ResponseBody,
              {
                filter?: NonNullable<
                  V3.GetUserFilterPreferencesForPodcast.ResponseBody['filter']
                >[number];
              }
            >
          >().from({
            // Exclude 'ALL' option from the service call
            filter: PodcastFilterSchema.unwrap()
              .merge(
                z.object({
                  id: z
                    .union([
                      PodcastFilterIdValues.DOWNLOADED,
                      PodcastFilterIdValues.SEASON,
                      PodcastFilterIdValues.UNPLAYED,
                      PodcastFilterIdValues.YEAR,
                    ])
                    .optional(),
                }),
              )
              .optional(),
            sort: PodcastSortSchema,
          }),
        }),
      },
    },
    updatePodcastFilterPreferences: {
      method: HttpMethods.Put,
      path: '/podcasts/:podcastId/preferences',
      pathParams: c.type<V3.UpdateUserPodcastFilterPreferences.RequestParams>(),
      body: implement<PodcastPreferencesPayload>().from({
        // Exclude 'ALL' option from the service call
        filter: PodcastFilterSchema.unwrap()
          .merge(
            z.object({
              id: z
                .union([
                  PodcastFilterIdValues.DOWNLOADED,
                  PodcastFilterIdValues.SEASON,
                  PodcastFilterIdValues.UNPLAYED,
                  PodcastFilterIdValues.YEAR,
                ])
                .optional(),
            }),
          )
          .optional(),
        sort: PodcastSortSchema,
      }),
      responses: {
        200: c.type<V3.UpdateUserPodcastFilterPreferences.ResponseBody>(),
        400: c.type<never>(),
      },
    },

    deletePodcastFilterPreferences: {
      method: HttpMethods.Delete,
      path: '/podcasts/:podcastId/preferences',
      pathParams:
        c.type<V3.DeleteUserFilterPreferencesForPodcast.RequestParams>(),
      body: c.type<V3.DeleteUserFilterPreferencesForPodcast.RequestBody>(),
      responses: {
        204: c.type<V3.DeleteUserFilterPreferencesForPodcast.ResponseBody>(),
      },
    },

    getRecentPlaybackStatus: {
      method: HttpMethods.Get,
      path: '/podcasts/:podcastId/recently-played/progress',
      pathParams: c.type<V3.GetRecentPlaybackStatus.RequestParams>(),
      responses: {
        200: c.type<V3.GetRecentPlaybackStatus.ResponseBody>(),
        400: c.type<never>(),
        401: c.type<never>(),
      },
    },
  },
  { pathPrefix: '/podcast' },
);
