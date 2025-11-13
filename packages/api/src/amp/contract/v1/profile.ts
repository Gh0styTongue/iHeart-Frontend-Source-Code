import { initContract } from '@ts-rest/core';
import type { SetOptional } from 'type-fest';
import { z } from 'zod';

import { ContentType, HttpMethods } from '../../../httpUtils/constants.js';
import { type V1, AccountType } from '../../../types/amp.js';
import type { FixErrorNaming } from '../../../types/extra.js';
import { implement } from '../../implement.js';
import { numberIdSchema } from '../../schemas/common.js';

const c = initContract();

export type UpdateProfileResponse =
  FixErrorNaming<V1.UpdateProfile.ResponseBody>;

export const profileContract = c.router(
  {
    getProfile: {
      method: HttpMethods.Get,
      path: '/:ownerProfileId/getProfile',
      description:
        "Returns user's profile. You can have this return the users Facebook friends as well. It also has the option of returning friends most recent plays.",
      pathParams: implement<V1.GetUserProfile.RequestParams>().from({
        ownerProfileId: numberIdSchema,
      }),
      query: implement<V1.GetUserProfile.RequestQuery>().from({
        /**
         * If `true`, will return any favorites. If `false`, returns none.
         * @default false
         */
        includeFavorites: z.boolean().optional(),
        /** @default false */
        includeFriends: z.boolean().optional(),
        /** @default false */
        includeFriendsPlays: z.boolean().optional(),
        /** @default false */
        includePreferences: z.boolean().optional(),
        /** @default false */
        includeSubscriptions: z.boolean().optional(),
        /**
         * Logged in user's `profileId`
         * @format int64
         */
        profileId: numberIdSchema,
        /** Logged in user's `sessionId` */
        sessionId: z.string().optional(),
        /** @default true */
        usePeriodDelimiterInPrefKeys: z.boolean().optional(),
      }),
      summary: "Get a user's profile",
      responses: {
        // 200: c.type<UserProfileResponse & UserProfileRestValue>(),
        200: implement<{
          accountType: string;
          email: string;
          zipCode?: string;
          gender?: string;
          birthYear?: number;
          birthMonth?: number;
          birthDay?: number;
          birthDate: number | null;
          phoneNumber?: string;
          name?: string;
          marketName: string | null;
        }>().from({
          accountType: z.union([
            z.literal(AccountType.ANONYMOUS),
            z.literal(AccountType.IHR),
            z.literal(AccountType.APPLE),
            z.literal(AccountType.GOOGLE),
            z.literal(AccountType.FACEBOOK),
            z.literal(AccountType.IHR_FACEBOOK),
          ]),
          email: z.string(),
          zipCode: z.coerce.string().optional().catch(undefined),
          gender: z.union([
            z.literal('male'),
            z.literal('female'),
            z.literal('unspecified'),
          ]),
          birthYear: z.coerce.number().optional().catch(undefined),
          birthMonth: z.coerce.number().optional().catch(undefined),
          birthDay: z.coerce.number().optional().catch(undefined),
          phoneNumber: z.string().optional().catch(undefined),
          name: z.string().optional().catch(undefined),
          marketName: z.string().nullable(),
          birthDate: z.coerce.number().nullable(),
        }),
      },
    },

    postUpdateProfile: {
      contentType: ContentType.FormUrlEncoded,
      method: HttpMethods.Post,
      path: '/updateProfile',
      body: c.type<V1.UpdateProfile.RequestBody>(),
      summary: "Update a user's profile",
      responses: {
        200: c.type<SetOptional<V1.UpdateProfile.ResponseBody, 'success'>>(),
      },
    },
  },
  {
    pathPrefix: '/profile',
  },
);
