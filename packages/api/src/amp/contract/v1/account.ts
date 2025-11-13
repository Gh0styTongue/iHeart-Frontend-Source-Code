import { initContract } from '@ts-rest/core';
import type { SetOptional } from 'type-fest';
import { z } from 'zod';

import { ContentType, HttpMethods } from '../../../httpUtils/constants.js';
import { type V1, AccountType } from '../../../types/amp.js';
import type { FixErrorNaming, FixOauthNaming } from '../../../types/extra.js';
import { implement } from '../../implement.js';

const c = initContract();

type LoginRequestRequiredFields = 'deviceId' | 'deviceName' | 'host';
type LoginRequestRequired = Required<
  Pick<V1.Login.RequestBody, LoginRequestRequiredFields>
>;

type LoginRequest = V1.Login.RequestBody & LoginRequestRequired;

type LoginResponseBody = FixErrorNaming<FixOauthNaming<V1.Login.ResponseBody>>;

type CreateUserResponse = FixErrorNaming<
  FixOauthNaming<V1.CreateUser.ResponseBody>
>;

type LoginWithShortLivedTokenResponseBody = FixErrorNaming<
  FixOauthNaming<V1.LoginWithShortLivedToken.ResponseBody>
>;

type LoginOrCreateOauthUserResponseBody = FixErrorNaming<
  FixOauthNaming<V1.LoginOrCreateOauthUser.ResponseBody>
>;

type RemoveOauthCredResponse = FixErrorNaming<V1.RemoveOauthCred.ResponseBody>;

type SetNewPwResponse = FixErrorNaming<V1.SetNewPassword.ResponseBody>;

type UpdateOauthCredResponse =
  FixErrorNaming<V1.UpdateAccessToken.ResponseBody>;

type UpgradeAnonAccountResponseBody = FixErrorNaming<
  FixOauthNaming<V1.UpgradeAnonAccount.ResponseBody>
>;

type UpdatePwResponse = FixErrorNaming<V1.UpdatePw.ResponseBody>;

export const accountContract = c.router(
  {
    postChangeEmail: {
      method: HttpMethods.Post,
      path: '/changeEmail',
      contentType: ContentType.FormUrlEncoded,
      body: c.type<V1.ChangeEmail.RequestBody>(),
      responses: {
        200: c.type<
          FixErrorNaming<SetOptional<V1.ChangeEmail.ResponseBody, 'success'>>
        >(),
      },
    },

    postCreateUser: {
      method: HttpMethods.Post,
      path: '/createUser',
      contentType: ContentType.FormUrlEncoded,
      body: c.type<V1.CreateUser.RequestBody>(),
      responses: {
        200: c.type<
          SetOptional<CreateUserResponse, 'success' | 'profileId' | 'newUser'>
        >(),
      },
    },

    postResetPassword: {
      method: HttpMethods.Post,
      path: '/resetPw',
      contentType: ContentType.FormUrlEncoded,
      body: c.type<V1.ResetPw.RequestBody>(),
      responses: {
        200: c.type<V1.ResetPw.ResponseBody>(),
      },
    },

    postLogin: {
      method: HttpMethods.Post,
      path: '/login',
      contentType: ContentType.FormUrlEncoded,
      body: c.type<LoginRequest>(),
      responses: {
        200: c.type<SetOptional<LoginResponseBody, 'profileId'>>(),
      },
    },

    postLoginWithShortLivedToken: {
      method: HttpMethods.Post,
      path: '/loginWithShortLivedToken',
      contentType: ContentType.FormUrlEncoded,
      body: c.type<V1.LoginWithShortLivedToken.RequestBody>(),
      responses: {
        200: c.type<
          SetOptional<LoginWithShortLivedTokenResponseBody, 'profileId'>
        >(),
      },
    },

    // TODO: ensure this is correct
    postLoginOrCreateOauthUser: {
      method: HttpMethods.Post,
      path: '/loginOrCreateOauthUser;',
      contentType: ContentType.FormUrlEncoded,
      // TODO: mostly this
      query: c.type<{
        longProfileId?: boolean;
        params?: Record<string, unknown>;
      }>(),
      body: c.type<
        SetOptional<V1.LoginOrCreateOauthUser.RequestBody, 'subscriptionId'>
      >(),
      responses: {
        200: implement<LoginOrCreateOauthUserResponseBody>()
          .from({
            errors: z
              .array(
                z.object({
                  description: z.string(),
                  code: z.number(),
                  debugInfo: z.string().optional().catch(undefined),
                  httpCode: z.number(),
                }),
              )
              .optional()
              .catch(undefined),
            sessionId: z.string(),
            profileId: z.number(),
            countryCode: z.union([
              z.literal('US'),
              z.literal('CA'),
              z.literal('AU'),
              z.literal('NZ'),
              z.literal('MX'),
              z.literal('WW'),
            ]),
            accountType: z.nativeEnum(AccountType),
            oauths: z.array(
              z.object({
                oauthUuid: z.string(),
                type: z.string(),
              }),
            ),
          })
          .passthrough(),
      },
    },

    postRemoveOauthCred: {
      method: HttpMethods.Post,
      path: '/removeOauthCred',
      contentType: ContentType.FormUrlEncoded,
      body: c.type<V1.RemoveOauthCred.RequestBody>(),
      responses: {
        200: c.type<SetOptional<RemoveOauthCredResponse, 'success'>>(),
      },
    },

    postSetEmailCred: {
      method: HttpMethods.Post,
      path: '/setEmailCred',
      contentType: ContentType.FormUrlEncoded,
      body: c.type<V1.SetEmailCredentials.RequestBody>(),
      responses: {
        200: c.type<V1.SetEmailCredentials.ResponseBody>(),
      },
    },

    postSetNewPw: {
      method: HttpMethods.Post,
      path: '/setNewPw',
      contentType: ContentType.FormUrlEncoded,
      body: c.type<V1.SetNewPassword.RequestBody>(),
      responses: {
        200: c.type<SetOptional<SetNewPwResponse, 'success'>>(),
      },
    },

    postUpdateOauthCred: {
      method: HttpMethods.Post,
      path: '/updateOauthCred',
      body: c.type<V1.UpdateAccessToken.RequestBody>(),
      contentType: ContentType.FormUrlEncoded,
      responses: {
        200: c.type<SetOptional<UpdateOauthCredResponse, 'success'>>(),
      },
    },

    postUpdatePw: {
      method: HttpMethods.Post,
      path: '/updatePw',
      body: c.type<V1.UpdatePw.RequestBody>(),
      contentType: ContentType.FormUrlEncoded,
      responses: {
        200: c.type<SetOptional<UpdatePwResponse, 'success'>>(),
      },
    },

    postUpgradeAnonAccount: {
      method: HttpMethods.Post,
      path: '/upgradeAnonAccount',
      // TODO: is this needed?
      body: c.type<V1.UpgradeAnonAccount.RequestBody>(),
      contentType: ContentType.FormUrlEncoded,
      responses: {
        200: c.type<
          SetOptional<
            UpgradeAnonAccountResponseBody,
            'success' | 'profileId' | 'newUser'
          >
        >(),
      },
    },

    getUserExists: {
      method: HttpMethods.Get,
      path: '/userExists',
      query: c.type<V1.UserExists.RequestQuery>(),
      responses: {
        200: c.type<V1.UserExists.ResponseBody>(),
      },
    },
  },
  {
    pathPrefix: '/account',
  },
);
