import type {
  ampContract,
  ClientInferResponseBody,
} from '@iheartradio/web.api/amp';
import { isNonNullish, isNullish } from 'remeda';
import { z } from 'zod';

import { countryCodesEnum } from './country-codes.js';

export const subscriptionTypeSchema = z.enum([
  'FREE',
  'PREMIUM',
  'PLUS',
  'NONE',
]);

export const SubscriptionType = subscriptionTypeSchema.enum;

export function getSubscriptionType(user?: User) {
  return isNullish(user) || isNullish(user?.subscription) ?
      SubscriptionType.NONE
    : subscriptionTypeSchema
        .catch(SubscriptionType.NONE)
        .default(SubscriptionType.NONE)
        .parse(user.subscription.type);
}

export const UserType = {
  Anonymous: 'ANONYMOUS',
  Free: subscriptionTypeSchema.enum.FREE,
  None: subscriptionTypeSchema.enum.NONE,
  Plus: subscriptionTypeSchema.enum.PLUS,
  Premium: subscriptionTypeSchema.enum.PREMIUM,
} as const;

export type UserType = (typeof UserType)[keyof typeof UserType];

export function getUserType(user?: User): UserType {
  return isNullish(user) || user?.isAnonymous || isNullish(user?.subscription) ?
      'ANONYMOUS'
    : getSubscriptionType(user);
}

export function geABTestGroups(user?: User) {
  return isNullish(user) || isNullish(user?.abTestGroups) ?
      null
    : user?.abTestGroups;
}

export const planCodeSchema = z.enum([
  'all_access_annual',
  'all_access_family',
  'all_access',
  'plus',
  'free',
]);
export const PlanCode = planCodeSchema.enum;

export const subscriptionSourceSchema = z.enum([
  'GOOGLE',
  'APPLE',
  'NAPSTER',
  'AMAZON',
  'ROKU',
  'NO_RECEIPT',
  'RECURLY',
  'UNKNOWN',
]);
export const SubscriptionSource = subscriptionSourceSchema.enum;

export const userSchema = z
  .object({
    abTestGroups: z.record(z.string(), z.string()).optional().nullable(),
    accountType: z.string().optional(),
    birthYear: z.coerce.number().optional().nullable(),
    birthMonth: z.coerce
      .number()
      .optional()
      .nullable()
      .transform(value => (value === null ? undefined : value)),
    birthDay: z.coerce
      .number()
      .optional()
      .nullable()
      .transform(value => (value === null ? undefined : value)),
    phoneNumber: z
      .string()
      .optional()
      .nullable()
      .transform(value => (value === null ? undefined : value)),
    name: z.string().optional().nullable(),
    marketName: z
      .string()
      .optional()
      .nullable()
      .transform(value => (value === null ? undefined : value)),

    profileId: z.coerce.number(),
    sessionId: z.string(),
    // oauths needed to be made optional, as we can *only* get that information at the time of login
    // all other endpoints to get user information do not expose this information... it may be that we
    // will want to refactor this dependency out of the application in the future [DEM 2024/08/09]
    oauths: z
      .array(
        z.object({
          oauthUuid: z.string().optional(),
          type: z.string().optional(),
        }),
      )
      .optional(),
    deviceId: z.string().optional(),
    email: z.string().email().optional(),
    emailHashes: z.string().array().length(3).optional(),
    country: countryCodesEnum.default(countryCodesEnum.enum.WW),
    entitlements: z.array(z.string()).optional().default([]),
    gender: z
      .string()
      .optional()
      .nullable()
      .transform(value => (value === null ? undefined : value)),
    privacy: z
      .object({
        hasOptedOut: z.boolean(),
        usPrivacy: z.string().optional(),
      })
      .optional(),
    subscription: z
      .object({
        isFamilyPlanParent: z.boolean().optional(),
        productId: z.string().optional(),
        hasNapsterBillingHistory: z.boolean(),
        promosRedeemed: z.array(z.string()),
        source: z.string().optional(),
        type: subscriptionTypeSchema,
        isTrial: z.boolean(),
        isOnHold: z.boolean().optional(),

        /** @format epoch */
        terminationDate: z.number().optional(),

        /** @format epoch */
        lastTrialExpirationDate: z.number().optional(),
        isTrialEligible: z.boolean(),
        isAutoRenewing: z.boolean(),

        /** @format epoch */
        expiry: z.number().optional(),
        isEligibleForAnotherTrial: z.boolean(),

        /** @format epoch */
        lastModified: z.number().optional(),
      })
      .optional(),
    isAnonymous: z.boolean().default(true),
    zipCode: z
      .string()
      .optional()
      .nullable()
      .transform(value => (value === null ? undefined : value)),
  })
  .superRefine((user, context) => {
    const hasAnonOauth = user.oauths?.some(value => value.type === 'ANONYMOUS');

    if (hasAnonOauth && !user.isAnonymous) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: '"ANONYMOUS" oauth found but user.anonymous is false',
      });
    }

    if (
      isNullish(user.accountType) &&
      isNonNullish(user.profileId) &&
      isNonNullish(user.sessionId)
    ) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'accountType is nullish, but credentials are present',
      });
    }

    if (hasAnonOauth && user.accountType !== 'ANONYMOUS') {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message:
          '"ANONYMOUS" oauth found but user.accountType is not "ANONYMOUS"',
      });
    }
  });

export type User = z.infer<typeof userSchema>;

export type Subscription = ClientInferResponseBody<
  typeof ampContract.v3.subscription.getSubscriptionStatus
>['subscription'];

export type Entitlements = ClientInferResponseBody<
  typeof ampContract.v3.subscription.getSubscriptionStatus
>['entitlements'];

// generated AMP type is singular - even though it's an array,
// pluralizing here to more accurately describe that it IS an array
export type Oauths = ClientInferResponseBody<
  typeof ampContract.v1.account.postCreateUser
>['oauths'];
