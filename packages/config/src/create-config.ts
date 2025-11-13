import { isPlainObject, mergeDeep } from 'remeda';
import type { PartialDeep } from 'type-fest';
import type { z } from 'zod';

import {
  type BaseConfig,
  type CountryCode,
  type GlobalConfig,
  type PartialBaseConfig,
  type PartialCountryConfig,
  type PartialGlobalConfig,
  partialBaseConfigSchema,
  supportedEnvironmentsEnum,
} from './schemas/index.js';

type ConfigFactory<T extends z.ZodObject<z.ZodRawShape>> = {
  schema: T;
  config: Partial<z.infer<T>>;
};

/**
 * Create a config factory
 * @param c a config type or a generic country config (config type with prod and nonProd props)
 * @returns an object that exposes the config and an extend method
 */
export function createConfig<T extends z.ZodObject<z.ZodRawShape>>(
  c: ConfigFactory<T>['config'],
  schema: ConfigFactory<T>['schema'],
) {
  const config: GlobalConfig = {
    AU: {
      staging: {},
      pr: {},
      production: {},
    },
    CA: {
      staging: {},
      pr: {},
      production: {},
    },
    MX: {
      staging: {},
      pr: {},
      production: {},
    },
    NZ: {
      staging: {},
      pr: {},
      production: {},
    },
    US: {
      staging: {},
      pr: {},
      production: {},
    },
    WW: {
      staging: {},
      pr: {},
      production: {},
    },
  } as GlobalConfig;

  for (const k of Object.keys(c) as CountryCode[]) {
    const configObject = c[k];
    // if top-level keys include nonProd or prod

    // then slot the values into the correct object
    if (configObject?.staging) {
      config[k].staging = mergeDeep(config[k].staging, configObject.staging);
    }
    if (configObject?.production) {
      config[k].production = mergeDeep(
        config[k].production,
        configObject.production,
      );
    }
    if (configObject?.pr) {
      config[k].pr = mergeDeep(config[k].pr, configObject.pr);
    }
  }

  // config = schema.parse(config);

  /**
   * Extends the config object
   * @param extendedConfig extended config - a config type or a generic country config (config type with prod and nonProd props)
   * @param location location - if a config type is provided, this parameter controls whether or not the object gets
   * extended into both prod and nonProd, nonProd only or prod only
   */
  function extend(
    extendedConfig: PartialDeep<PartialGlobalConfig> | PartialBaseConfig,
    location?: boolean,
  ): void {
    // Look at the keys - the factory can take an object that is a bare config ({ ads: { foo: bar }}),
    // or one with staging/production keys ({ production: { ads: { foo: bar }}, staging: { ads: { foo: bar }}})
    for (const c of Object.keys(config) as CountryCode[]) {
      for (const k in extendedConfig) {
        const configObject = (extendedConfig as Record<string, unknown>)[k];

        // if top-level keys include staging or production
        if (isCountryConfig(configObject)) {
          // then slot the values into the correct object
          if (configObject.staging) {
            config[c].staging = mergeDeep(
              config[c].staging,
              configObject.staging,
            ) as BaseConfig;
          }
          if (configObject.production) {
            config[c].production = mergeDeep(
              config[c].production,
              configObject.production,
            ) as BaseConfig;
          }
          if (configObject.pr) {
            config[c].pr = mergeDeep(
              config[c].pr,
              configObject.pr,
            ) as BaseConfig;
          }
          // else if it's a bare config
          // and `l` (location) is undefined
        } else if (isBaseConfig(extendedConfig)) {
          if (location === undefined) {
            // put values into staging, production and pr
            config[c].staging = mergeDeep(config[c].staging, {
              [k]: configObject,
            });
            config[c].production = mergeDeep(config[c].production, {
              [k]: configObject,
            });
            config[c].pr = mergeDeep(config[c].pr, { [k]: configObject });
            // else if l is true
          } else if (location) {
            // put the values into prod and pr
            config[c].production = mergeDeep(config[c].production, {
              [k]: configObject,
            });
            config[c].pr = mergeDeep(config[c].pr, { [k]: configObject });
          } else {
            // put the values into staging
            config[c].staging = mergeDeep(config[c].staging, {
              [k]: configObject,
            });
          }
        } else {
          console.error(
            'could not figure out how to extend config with:',
            extendedConfig,
          );
        }
      }
    }
  }

  return {
    config,
    extend,
    validate: validateConfig(config, schema),
  };
}

/**
 * Ensures no config key is undefined
 */
export const validateConfig = <T extends z.ZodObject<z.ZodRawShape>>(
  config: ConfigFactory<T>['config'],
  schema: ConfigFactory<T>['schema'],
) => {
  return () => {
    const result = schema.safeParse(config);

    if (!result.success) {
      console.error(formatError(result.error));
    }

    return result.success;
  };
};

function isCountryConfig(value: unknown): value is PartialCountryConfig {
  return (
    isPlainObject(value) &&
    Object.keys(value).every(key =>
      (supportedEnvironmentsEnum.options as string[]).includes(key),
    )
  );
}

function isBaseConfig(value: unknown): value is PartialBaseConfig {
  const result = partialBaseConfigSchema.safeParse(value);
  return result.success;
}

export function formatError(error: z.ZodError) {
  return error.issues
    .map(issue => {
      const path = issue.path.join('.');

      return `Path ${path}: ${issue.code} - ${issue.message}`;
    })
    .join('\n');
}
