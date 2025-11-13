import { initContract } from '@ts-rest/core';
import { z } from 'zod';

import { HttpMethods } from '../../../httpUtils/constants.js';
import type { V3 } from '../../../types/poweramp.js';
import { implement } from '../../implement.js';
import {
  limitSchema,
  numberIdSchema,
  offsetSchema,
  stringIdSchema,
} from '../../schemas/common.js';

export const PresetsTypes = z.enum([
  'ARTIST',
  'COLLECTION',
  'FAVORITES',
  'LIVE',
  'PODCAST',
]);

export const PresetsSchema = z.object({
  id: z.string(),
  type: PresetsTypes,
  imageUrl: z.string().optional(), // TODO: Revisit, these aren't technically optional
  title: z.string().optional(), // TODO: Revisit, these aren't technically optional
});

export type PresetPayload = z.infer<typeof PresetsSchema>;

export const PresetRecordSchema = z.object({
  '0': PresetsSchema.optional(),
  '1': PresetsSchema.optional(),
  '2': PresetsSchema.optional(),
  '3': PresetsSchema.optional(),
  '4': PresetsSchema.optional(),
  '5': PresetsSchema.optional(),
  '6': PresetsSchema.optional(),
  '7': PresetsSchema.optional(),
  '8': PresetsSchema.optional(),
  '9': PresetsSchema.optional(),
  '10': PresetsSchema.optional(),
  '11': PresetsSchema.optional(),
  '12': PresetsSchema.optional(),
  '13': PresetsSchema.optional(),
  '14': PresetsSchema.optional(),
});

export const PresetKeys = PresetRecordSchema.keyof();

type PresetRecord = z.infer<typeof PresetRecordSchema>;

export type GetPresetsResponse = {
  presets: PresetRecord;
  profileId: string;
  modified: string;
};

export type PutPresetsRequestBody = {
  presets: PresetRecord;
};

type GetTrackThumbStatusResponseBody = 'up' | 'down';

export const ThumbRadioStationTypes = z.enum(['live', 'artist', 'track']);

export type PutThumbTrackRequestBody = {
  radioStationType: 'live' | 'artist' | 'track';
  stationId: string;
  trackId: number;
  thumbType: GetTrackThumbStatusResponseBody;
  playedFrom: number;
  deviceName: string;
  seedId: number;
};

const ThumbsStationTypeSchema = z.union([
  z.literal('Custom'),
  z.literal('Live'),
]);

export const ThumbsStationTypes = z.enum(['Custom', 'Live']);

const c = initContract();

export const profilesContract = c.router(
  {
    putProfileGenres: {
      method: HttpMethods.Put,
      path: '/tasteProfile/genres',
      body: c.type<V3.UpdateGenres.RequestBody>(),
      responses: {
        204: c.type<V3.UpdateGenres.ResponseBody>(),
      },
    },

    getFollowedArtists: {
      method: HttpMethods.Get,
      path: '/follows/artist',
      query: implement<V3.GetFollowedArtistStations.RequestQuery>().from({
        limit: limitSchema,
        offset: offsetSchema,
      }),
      responses: {
        200: c.type<V3.GetFollowedArtistStations.ResponseBody>(),
        404: c.type<{ data: [] }>(),
      },
    },

    followArtist: {
      method: HttpMethods.Put,
      path: '/follows/artist',
      body: c.type<V3.AddArtistStationIfNotExistsAndFollow.RequestBody>(),
      responses: {
        201: c.type<V3.AddArtistStationIfNotExistsAndFollow.ResponseBody>(),
        204: c.type<never>(),
      },
    },

    unfollowArtist: {
      method: HttpMethods.Delete,
      path: '/follows/artist/:artistId',
      body: c.type<never>(),
      pathParams: implement<V3.UnfollowArtist.RequestParams>().from({
        artistId: numberIdSchema,
      }),
      responses: {
        204: c.type<never>(),
      },
    },

    getIsArtistFollowed: {
      method: HttpMethods.Get,
      path: '/follows/artist/:artistId',
      pathParams: implement<V3.IsArtistFollowed.RequestParams>().from({
        artistId: numberIdSchema,
      }),
      responses: {
        204: c.type<never>(),
        404: c.type<never>(),
      },
    },

    getFollowedLiveStations: {
      method: HttpMethods.Get,
      path: '/follows/live',
      query: implement<V3.GetFollowedLiveStations.RequestQuery>().from({
        limit: limitSchema,
        offset: offsetSchema,
      }),
      responses: {
        200: c.type<V3.GetFollowedLiveStations.ResponseBody>(),
        404: c.type<{ data: [] }>(),
      },
    },

    followLiveStation: {
      method: HttpMethods.Put,
      path: '/follows/live',
      body: c.type<V3.AddLiveStationIfNotExistsAndFollow.RequestBody>(),
      responses: {
        201: c.type<V3.AddLiveStationIfNotExistsAndFollow.ResponseBody>(),
        204: c.type<never>(),
      },
    },

    unfollowLiveStation: {
      method: HttpMethods.Delete,
      path: '/follows/live/:stationId',
      body: c.type<never>(),
      pathParams: implement<V3.UnfollowLiveStation.RequestParams>().from({
        stationId: numberIdSchema,
      }),
      responses: {
        200: c.type<never>(),
        204: c.type<never>(),
      },
    },

    getIsLiveStationFollowed: {
      method: HttpMethods.Get,
      path: '/follows/live/:liveStationId',
      pathParams: implement<V3.IsLiveStationFollowed.RequestParams>().from({
        liveStationId: numberIdSchema,
      }),
      responses: {
        204: c.type<V3.IsLiveStationFollowed.ResponseBody>(),
        404: c.type<never>(),
      },
    },

    getPresets: {
      method: HttpMethods.Get,
      path: '/presets',
      responses: {
        200: c.type<GetPresetsResponse>(),
      },
    },

    putPresets: {
      method: HttpMethods.Put,
      body: c.type<PutPresetsRequestBody>(),
      path: '/presets',
      responses: {
        // This `PUT` requests supports 200 and 201 response codes
        // AMP states it only returns 201, but that is not the case
        // TODO: Update status codes (if needed) once AMP clarifies on their end
        200: c.type<PresetRecord>(),
        201: c.type<PresetRecord>(),
      },
    },

    getTrackThumbStatus: {
      method: HttpMethods.Get,
      path: '/thumbs/track/:trackId',
      responses: {
        200: c.type<GetTrackThumbStatusResponseBody>(),
        404: c.type<never>(),
        401: c.type<never>(),
      },
    },

    putThumbTrack: {
      method: HttpMethods.Put,
      path: '/thumbs',
      body: c.type<PutThumbTrackRequestBody>(),
      responses: {
        204: c.type<never>(),
        400: c.type<never>(),
      },
    },

    deleteResetThumb: {
      method: HttpMethods.Delete,
      path: '/thumbs',
      query: implement<V3.ResetThumb.RequestQuery>().from({
        stationId: stringIdSchema,
        stationType: ThumbsStationTypeSchema,
        trackId: stringIdSchema,
      }),
      body: c.type<never>(),
      responses: {
        204: c.type<never>(),
        400: c.type<never>(),
        401: c.type<never>(),
        404: c.type<never>(),
      },
    },
  },
  {
    pathPrefix: '/profiles',
  },
);
