import { initContract } from '@ts-rest/core';
import type { SetOptional } from 'type-fest';
import { z } from 'zod';

import { HttpMethods } from '../../../httpUtils/constants.js';
import type { RenameKey } from '../../../index.js';
import type { V3 } from '../../../types/poweramp.js';
import { implement } from '../../implement.js';
import {
  idsPathParameterSchema,
  numberIdSchema,
  stringIdSchema,
} from '../../schemas/common.js';

const c = initContract();

export type GetCollection = V3.GetCollection.ResponseBody & {
  subtitle?: string;
};

export const collectionContract = c.router(
  {
    getCollections: {
      method: HttpMethods.Get,
      path: '/user/:userId/collection',
      pathParams: implement<V3.GetCollections.RequestParams>().from({
        userId: stringIdSchema,
      }),
      query: implement<V3.GetCollections.RequestQuery>().from({
        pageKey: z.string().optional(),
        limit: z.coerce.number().optional(),
        status: z.enum(['published', 'draft']).optional(),
        includePersonalized: z.coerce.boolean().optional(),
        playlistFilter: z.enum(['all', 'followed', 'created']).optional(),
        includeIds: z.coerce.boolean().optional(),
      }),
      responses: {
        200: c.type<V3.GetCollections.ResponseBody>(),
      },
    },

    postCreateCollection: {
      method: HttpMethods.Post,
      path: '/user/:userId/collection',
      pathParams: implement<V3.CreateCollection.RequestParams>().from({
        userId: stringIdSchema,
      }),
      query: implement<V3.CreateCollection.RequestQuery>().from({
        /**
         * Whether the tracks should be added to the user's library.
         * @default true
         */
        addToLibrary: z.boolean().optional(),
        /** @default true */
        includeIds: z.boolean().optional(),
      }),
      body: c.type<
        SetOptional<
          V3.CreateCollection.RequestBody,
          'shareable' | 'backfillTracks' | 'premium' | 'curated'
        >
      >(),
      responses: {
        201: c.type<V3.CreateCollection.ResponseBody>(),
      },
    },

    putReorderCollections: {
      method: HttpMethods.Put,
      path: '/user/:userId/collection',
      pathParams: implement<V3.Reorder.RequestParams>().from({
        userId: stringIdSchema,
      }),
      body: c.type<V3.Reorder.RequestBody>(),
      responses: {
        200: c.type<V3.Reorder.ResponseBody>(),
      },
    },

    getCollection: {
      method: HttpMethods.Get,
      path: '/user/:userId/collection/:id',
      pathParams: implement<V3.GetCollection.RequestParams>().from({
        id: stringIdSchema,
        userId: stringIdSchema,
      }),
      query: c.type<V3.GetCollection.RequestQuery>(),
      responses: {
        200: c.type<GetCollection>(),
      },
    },

    putUpdateCollection: {
      method: HttpMethods.Put,
      path: '/user/:userId/collection/:id',
      pathParams: implement<V3.UpdateCollection.RequestParams>().from({
        id: stringIdSchema,
        userId: stringIdSchema,
      }),
      query: implement<V3.UpdateCollection.RequestQuery>().from({
        addToLibrary: z.boolean().optional(),
        includeIds: z.boolean().optional(),
      }),
      body: c.type<V3.UpdateCollection.RequestBody>(),
      responses: {
        200: c.type<V3.UpdateCollection.ResponseBody>(),
      },
    },

    deleteCollection: {
      method: HttpMethods.Delete,
      path: '/user/:userId/collection/:ids',
      pathParams: implement<
        RenameKey<V3.DeleteCollection.RequestParams, 'id', 'ids'>
      >().to({
        ids: idsPathParameterSchema,
        userId: stringIdSchema,
      }),
      body: c.type<V3.DeleteCollection.RequestBody>(),
      responses: {
        204: c.type<V3.DeleteCollection.ResponseBody>(),
      },
    },

    followPlaylist: {
      method: HttpMethods.Put,
      path: '/user/:userId/collection/:id/followers',
      pathParams: implement<V3.FollowCollection.RequestParams>().from({
        id: stringIdSchema,
        userId: stringIdSchema,
      }),
      body: c.type<V3.FollowCollection.RequestBody>(),
      responses: {
        200: c.type<V3.FollowCollection.ResponseBody>(),
      },
    },

    unfollowPlaylist: {
      method: HttpMethods.Delete,
      path: '/user/:userId/collection/:id/followers',
      pathParams: implement<V3.UnfollowCollection.RequestParams>().from({
        id: stringIdSchema,
        userId: stringIdSchema,
      }),
      body: c.type<V3.UnfollowCollection.RequestBody>(),
      responses: {
        204: c.type<V3.UnfollowCollection.ResponseBody>(),
      },
    },

    publishPlaylist: {
      method: HttpMethods.Post,
      path: '/user/:userId/collection/:id/publish',
      pathParams: implement<V3.Publish.RequestParams>().from({
        id: stringIdSchema,
        userId: stringIdSchema,
      }),
      body: c.type<V3.Publish.RequestBody>(),
      responses: {
        200: c.type<V3.Publish.ResponseBody>(),
      },
    },

    unpublishPlaylist: {
      method: HttpMethods.Post,
      path: '/user/:userId/collection/:id/unpublish',
      pathParams: implement<V3.Unpublish.RequestParams>().from({
        id: stringIdSchema,
        userId: stringIdSchema,
      }),
      body: c.type<V3.Unpublish.RequestBody>(),
      responses: {
        204: c.type<V3.Unpublish.ResponseBody>(),
      },
    },

    restoreCollection: {
      method: HttpMethods.Put,
      path: '/user/:userId/collection/:id/restore',
      pathParams: implement<V3.Restore.RequestParams>().from({
        id: stringIdSchema,
        userId: stringIdSchema,
      }),
      body: c.type<V3.Restore.RequestBody>(),
      responses: {
        204: c.type<V3.Restore.ResponseBody>(),
      },
    },

    addTracksToCollection: {
      method: HttpMethods.Put,
      path: '/user/:userId/collection/:id/tracks',
      pathParams: implement<V3.AddTracksToCollection.RequestParams>().from({
        id: stringIdSchema,
        userId: stringIdSchema,
      }),
      query: implement<V3.AddTracksToCollection.RequestQuery>().from({
        /** @default true */
        addToLibrary: z.boolean().optional(),
      }),
      body: c.type<V3.AddTracksToCollection.RequestBody>(),
      responses: {
        200: c.type<V3.AddTracksToCollection.ResponseBody>(),
      },
    },

    removeTracksFromCollection: {
      method: HttpMethods.Delete,
      path: '/user/:userId/collection/:id/tracks',
      pathParams: implement<V3.RemoveCollectionTracks.RequestParams>().from({
        id: stringIdSchema,
        userId: stringIdSchema,
      }),
      body: c.type<V3.RemoveCollectionTracks.RequestBody>(),
      responses: {
        204: c.type<V3.RemoveCollectionTracks.ResponseBody>(),
      },
    },

    prepopulatePlaylist: {
      method: HttpMethods.Post,
      path: '/user/:userId/collection/prepopulate',
      pathParams: implement<V3.Prepopulate.RequestParams>().from({
        userId: stringIdSchema,
      }),
      body: c.type<V3.Prepopulate.RequestBody>(),
      responses: {
        200: c.type<V3.Prepopulate.ResponseBody>(),
      },
    },

    getMyMusicTracks: {
      method: HttpMethods.Get,
      path: '/user/:userId/collection/prepopulate',
      pathParams: implement<V3.GetMyMusicTracks.RequestParams>().from({
        userId: stringIdSchema,
      }),
      query: c.type<V3.GetMyMusicTracks.RequestQuery>(),
      responses: {
        200: c.type<V3.GetMyMusicTracks.ResponseBody>(),
      },
    },

    addMyMusicTracks: {
      method: HttpMethods.Put,
      path: '/user/:userId/mymusic',
      pathParams: implement<V3.AddMyMusicTracks.RequestParams>().from({
        userId: stringIdSchema,
      }),
      body: c.type<V3.AddMyMusicTracks.RequestBody>(),
      responses: {
        200: c.type<V3.AddMyMusicTracks.ResponseBody>(),
      },
    },

    removeMyMusicTracks: {
      method: HttpMethods.Delete,
      path: '/user/:userId/mymusic/:trackIds',
      pathParams: implement<V3.RemoveMyMusicTracks.RequestParams>().to({
        userId: stringIdSchema,
        trackIds: idsPathParameterSchema,
      }),
      body: c.type<V3.RemoveMyMusicTracks.RequestBody>(),
      responses: {
        204: c.type<V3.RemoveMyMusicTracks.ResponseBody>(),
      },
    },

    getMyMusicAlbums: {
      method: HttpMethods.Get,
      path: '/user/:userId/mymusic/albums',
      pathParams: implement<V3.GetMyMusicAlbums.RequestParams>().from({
        userId: stringIdSchema,
      }),
      query: c.type<V3.GetMyMusicAlbums.RequestQuery>(),
      responses: {
        200: c.type<V3.GetMyMusicAlbums.ResponseBody>(),
      },
    },

    getMyMusicAlbum: {
      method: HttpMethods.Get,
      path: '/user/:userId/mymusic/albums/:albumId',
      pathParams: implement<V3.GetMyMusicAlbum.RequestParams>().from({
        userId: stringIdSchema,
        albumId: numberIdSchema,
      }),
      responses: {
        200: c.type<V3.GetMyMusicAlbum.ResponseBody>(),
      },
    },

    getMyMusicArtist: {
      method: HttpMethods.Get,
      path: '/user/:userId/mymusic/artists/:albumId',
      pathParams: implement<V3.GetMyMusicArtist.RequestParams>().from({
        userId: stringIdSchema,
        artistId: numberIdSchema,
      }),
      query: c.type<V3.GetMyMusicArtist.RequestQuery>(),
      responses: {
        200: c.type<V3.GetMyMusicArtist.ResponseBody>(),
      },
    },

    getMyMusicImages: {
      method: HttpMethods.Get,
      path: '/user/:userId/mymusic/images',
      pathParams: implement<V3.GetMyMusicImages.RequestParams>().from({
        userId: stringIdSchema,
      }),
      responses: {
        200: c.type<V3.GetMyMusicImages.ResponseBody>(),
      },
    },

    getMyMusicTrackUpdates: {
      method: HttpMethods.Get,
      path: '/user/:userId/mymusic/tracks',
      pathParams: implement<V3.GetMyMusicTrackUpdates.RequestParams>().from({
        userId: stringIdSchema,
      }),
      query: c.type<V3.GetMyMusicTrackUpdates.RequestQuery>(),
      responses: {
        200: c.type<V3.GetMyMusicTrackUpdates.ResponseBody>(),
      },
    },

    removeRecentlyPlayed: {
      method: HttpMethods.Delete,
      path: '/user/:userId/recently-played/:id',
      pathParams: implement<V3.RemoveRecentlyPlayed.RequestParams>().from({
        userId: stringIdSchema,
        id: stringIdSchema,
      }),
      body: c.type<V3.RemoveRecentlyPlayed.RequestBody>(),
      responses: {
        204: c.type<V3.RemoveRecentlyPlayed.ResponseBody>(),
      },
    },

    getFollowStatus: {
      method: HttpMethods.Get,
      path: '/follows/user/:userId/collection/:id',
      pathParams: implement<V3.IsCollectionFollowed.RequestParams>().from({
        userId: stringIdSchema,
        id: stringIdSchema,
      }),
      responses: {
        200: c.type<never>(),
        404: c.type<never>(),
      },
    },
  },
  {
    pathPrefix: '/collection',
  },
);
