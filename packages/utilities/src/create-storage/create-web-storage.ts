import cookie from 'js-cookie';
import { isNullish } from 'remeda';

import { type Logger, createLogger } from '../create-logger/index.js';
import { createMemoryStorage } from './create-memory-storage.js';
import { createStorage } from './create-storage.js';
import { StorageError } from './storage-error.js';
import type { BaseSchema, Storage } from './types.js';

export function createWebStorage<Schema extends BaseSchema<any>>({
  deserializer = JSON.parse,
  logger = createLogger(),
  serializer = JSON.stringify,
  seed,
  prefix = '',
  type,
}: {
  deserializer?: <V extends Schema[keyof Schema]>(value: string) => V;
  logger?: Logger;
  prefix?: string;
  seed: Schema;
  serializer?: <V extends Schema[keyof Schema]>(value: V) => string;
  type: 'cookie' | 'local' | 'session';
}) {
  type Stores = Record<
    typeof type,
    Pick<Storage<Schema>, 'get' | 'remove' | 'set' | 'clear'>
  >;

  const IS_SERVER = isNullish(globalThis?.document);
  const MAX_COOKIE_BYTE_SIZE = 4096;

  const stores: Stores = {
    cookie: {
      clear() {
        for (const key of Object.keys(seed)) {
          cookie.remove(prefix + key);
        }
      },
      get(key) {
        const value = cookie.get(prefix + key);

        if (value === undefined || value === 'undefined') {
          return;
        }

        return deserializer(value);
      },

      remove(key) {
        cookie.remove(prefix + key);
      },

      set(key, value) {
        const serialized = serializer(value);
        const { size } = new Blob([serialized]);

        if (size > MAX_COOKIE_BYTE_SIZE) {
          throw new StorageError(
            `The cookie with the key of "${key}" is too large. It has a byte size of "${size}" - the limit is "${MAX_COOKIE_BYTE_SIZE}".`,
            { key, value, size },
          );
        }

        if ((prefix + key)?.trim?.() === 'iheart-user') {
          console.log('setting iheart-user:', serialized);
        }

        cookie.set(prefix + key, serialized);
      },
    },

    local: {
      clear() {
        for (const key of Object.keys(seed)) {
          window.localStorage.removeItem(prefix + key);
        }
      },
      get(key) {
        const value = window.localStorage.getItem(prefix + key);

        if (isNullish(value) || value === 'undefined') {
          return;
        }

        return deserializer(value);
      },

      remove(key) {
        window.localStorage.removeItem(prefix + key);
      },

      set(key, value) {
        window.localStorage.setItem(prefix + key, serializer(value));
      },
    },

    session: {
      clear() {
        for (const key of Object.keys(seed)) {
          window.sessionStorage.removeItem(prefix + key);
        }
      },
      get(key) {
        const value = window.sessionStorage.getItem(prefix + key);

        if (isNullish(value) || value === 'undefined') {
          return;
        }

        return deserializer(value);
      },

      remove(key) {
        window.sessionStorage.removeItem(prefix + key);
      },

      set(key, value) {
        window.sessionStorage.setItem(prefix + key, serializer(value));
      },
    },
  } as Stores;

  const storage = stores[type];

  const webStorage = createStorage<Schema>({
    clear() {
      storage.clear();
    },
    deserialize() {
      return Object.keys(seed).reduce<Schema>((accumulator, key) => {
        try {
          return { ...accumulator, [key]: storage.get(key) };
        } catch (error) {
          logger.error(`Failed to deserialize "${key}".`, error);
          throw error;
        }
      }, {} as Schema);
    },

    get(key) {
      try {
        return storage.get(key);
      } catch (error) {
        logger.error(`Failed to get "${key}".`, error);
        throw error;
      }
    },

    has(key) {
      try {
        return !!storage.get(key);
      } catch (error) {
        logger.error(`Failed to check the existence of "${key}".`, error);
        throw error;
      }
    },

    remove(key) {
      try {
        storage.remove(key);
      } catch (error) {
        logger.error(`Failed to remove "${key}".`, error);
        throw error;
      }
    },

    seed,

    serialize(data) {
      for (const [key, value] of Object.entries(data)) {
        try {
          storage.set(key, value);
        } catch (error) {
          logger.error(`Failed to serialize "${key}".`, error);
          throw error;
        }
      }
    },

    set(key, value) {
      try {
        storage.set(key, value);
      } catch (error) {
        logger.error(`Failed to set "${key}".`, error);
        throw error;
      }
    },

    size() {
      return Object.keys(seed).length;
    },
  });

  const memoryStorage = createMemoryStorage<Schema>(seed);

  memoryStorage.subscribe({
    clear: webStorage.clear,
    deserialize: webStorage.deserialize,
    get: (_, key) => webStorage.get(key),
    has: (_, key) => webStorage.has(key),
    remove: (_, key) => webStorage.remove(key),
    serialize: (_, data) => webStorage.serialize(data),
    set: (_, key, value) => webStorage.set(key, value),
    size: webStorage.size,
  });

  if (IS_SERVER) {
    memoryStorage.disable();
  } else {
    const entries = Object.entries(webStorage.deserialize());

    const data = entries.reduce<Schema>(
      (accumulator, [key, value]) => ({
        ...accumulator,
        [key]: value ?? seed[key],
      }),
      {} as Schema,
    );

    memoryStorage.serialize(data);
  }

  return { ...memoryStorage, prefix };
}
