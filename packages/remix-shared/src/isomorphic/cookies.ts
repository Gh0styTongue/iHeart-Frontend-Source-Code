// This file and package export was created so as not to taint the client bundles with
// server-only code.
import {
  TOKEN_COOKIE_NAME,
  TOKEN_COOKIE_OPTIONS,
} from '@iheartradio/web.api/amp';
import { userSchema } from '@iheartradio/web.config/schemas';
import ms from 'ms';
import { createCookie, createCookieSessionStorage } from 'react-router';
import { createTypedCookie } from 'remix-utils/typed-cookie';
import { createTypedSessionStorage } from 'remix-utils/typed-session';
import { z } from 'zod';

import { marketCookieSchema } from '../lib/schemas.js';

export const ApiTokenCookieJar = createTypedCookie({
  cookie: createCookie(TOKEN_COOKIE_NAME, TOKEN_COOKIE_OPTIONS),
  schema: z
    .object({
      token: z.string().optional(),
      expiration: z.number().optional(),
    })
    .nullable(),
});

export const _deprecatedUserCookie = createCookie('iheartradio-user', {
  path: '/',
  sameSite: 'lax',
  httpOnly: true,
});

export const deprecatedUserCookie = createTypedCookie({
  cookie: _deprecatedUserCookie,
  schema: z.object({ user: userSchema.optional() }).catch({ user: undefined }),
});

export const _userCookie = createCookie('iheart-user', {
  domain: 'iheart.com',
  httpOnly: false,
  sameSite: 'none',
  secure: true,
});

export const UserCookieJar = createTypedCookie({
  cookie: _userCookie,
  schema: z
    .object({
      user: userSchema.optional(),
    })
    .nullable()
    .catch({ user: undefined }),
});

export type UserCookie = Awaited<ReturnType<typeof UserCookieJar.parse>>;

export const PinToListenCookie = 'tryOutListen';

export const TryOutListenCookieJar = createCookie(PinToListenCookie, {
  path: '/',
  sameSite: 'lax',
  httpOnly: true,
  encode: value => (value ? 'true' : 'false'),
});

export const LoginRegistrationCookieJar = createCookie(
  'iheartradio-account-auth',
  {
    path: '/',
    sameSite: 'lax',
    httpOnly: true,
  },
);

export const ShowDialogCookieJar = createTypedCookie({
  cookie: createCookie('showed-user-education-dialog', {
    path: '/',
    sameSite: 'lax',
    httpOnly: true,
  }),
  schema: z
    .object({
      showUserEducationModal: z.boolean(),
    })
    .nullable(),
});

export const expireCookieIn24hours = (now = new Date()) => {
  return new Date(now.getTime() + ms('24 hours'));
};

export const expireCookieIn90days = (now = new Date()) => {
  return new Date(now.getTime() + ms('90 days'));
};

export const MARKET_COOKIE_NAME = 'iheart-session' as const;

const marketCookie = createCookie(MARKET_COOKIE_NAME, {
  domain: 'iheart.com',
  httpOnly: false,
  sameSite: 'none',
  secure: true,
});

const marketTypedCookie = createTypedCookie({
  cookie: marketCookie,
  schema: marketCookieSchema.default({}).catch({}),
});

export const MarketCookie = marketTypedCookie;

const marketSessionStorage = createCookieSessionStorage({
  cookie: MarketCookie,
});

const marketTypedSessionStorage = createTypedSessionStorage({
  sessionStorage: marketSessionStorage,
  schema: marketCookieSchema,
});

export const MarketSession = marketTypedSessionStorage;
