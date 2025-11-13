/* eslint-disable barrel-files/avoid-barrel-files */
import { z } from 'zod';

import { accountSchema } from './account.js';
import { adsSchema } from './ads.js';
import { apiSchema } from './api.js';
import { appSchema } from './app.js';
import type { CountryCode } from './country-codes.js';
import { environmentSchema } from './environment.js';
import { featuresSchema } from './features.js';
import { sdksSchema } from './sdks/index.js';
import { urlsSchema } from './urls.js';

export const baseConfigSchema = z.object({
  account: accountSchema,
  api: apiSchema,
  environment: environmentSchema,
  features: featuresSchema.optional(),
  sdks: sdksSchema,
  urls: urlsSchema,
  app: appSchema,
  ads: adsSchema,
});

export type BaseConfig = z.infer<typeof baseConfigSchema>;

export const partialBaseConfigSchema = baseConfigSchema.deepPartial();

export type PartialBaseConfig = z.infer<typeof partialBaseConfigSchema>;

export const countryConfigSchema = z.object({
  staging: baseConfigSchema,
  production: baseConfigSchema,
  pr: baseConfigSchema,
});

export const supportedEnvironmentsEnum = countryConfigSchema.keyof();

export type Env = z.infer<typeof supportedEnvironmentsEnum>;

export type CountryConfig = z.infer<typeof countryConfigSchema>;

export const partialCountryConfigSchema = countryConfigSchema.deepPartial();

export type PartialCountryConfig = z.infer<typeof partialCountryConfigSchema>;

// export const genericCountryConfigSchema = z.record(supportedEnvironmentsEnum, baseConfigSchema);
// export type GenericCountryConfig = z.infer<typeof genericCountryConfigSchema>;

export const globalConfigSchema: z.ZodObject<{
  AU: typeof countryConfigSchema;
  CA: typeof countryConfigSchema;
  MX: typeof countryConfigSchema;
  NZ: typeof countryConfigSchema;
  US: typeof countryConfigSchema;
  WW: typeof countryConfigSchema;
}> = z.object({
  AU: countryConfigSchema,
  CA: countryConfigSchema,
  MX: countryConfigSchema,
  NZ: countryConfigSchema,
  US: countryConfigSchema,
  WW: countryConfigSchema,
});

export type GlobalConfig = z.infer<typeof globalConfigSchema>;

// export type PartialGlobalConfig = PartialDeep<GlobalConfig>;

export type GenericCountryConfig<T = PartialBaseConfig> = {
  [key in Env]: T;
};

export type PartialGlobalConfig<T = PartialBaseConfig> = {
  [key in CountryCode]: GenericCountryConfig<T>;
};

export type { Gender } from './account.js';
export { GendersEnum, gendersSchema } from './account.js';
export { type CountryCode, countryCodesEnum } from './country-codes.js';
export { type Sdks } from './sdks/index.js';
export type { Entitlements, Oauths, Subscription, User } from './user.js';
export {
  geABTestGroups,
  getSubscriptionType,
  getUserType,
  PlanCode,
  SubscriptionSource,
  SubscriptionType,
  subscriptionTypeSchema,
  userSchema,
  UserType,
} from './user.js';
