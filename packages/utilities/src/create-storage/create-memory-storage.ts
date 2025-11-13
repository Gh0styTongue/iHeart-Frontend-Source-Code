import { createStorage } from './create-storage.js';
import type { BaseSchema } from './types.js';

export function createMemoryStorage<Schema extends BaseSchema<any>>(
  seed: Schema,
) {
  const cache = new Map(Object.entries(seed));

  const memoryStorage = createStorage<Schema>({
    clear() {
      cache.clear();
    },
    deserialize() {
      return Object.fromEntries(cache) as Schema;
    },

    get(key) {
      return cache.get(key);
    },

    has(key) {
      return !!cache.get(key);
    },

    remove(key) {
      cache.delete(key);
    },

    serialize(data) {
      // Clear the cache to prevent stale and inconsistent data between Local Storage and the Memory Storage
      cache.clear();

      const entries = Object.entries(data);

      for (const [key, value] of entries) {
        cache.set(key, value);
      }
    },

    seed,

    set(key, value) {
      cache.set(key, value);
    },

    size() {
      return cache.size;
    },
  });

  return memoryStorage;
}
