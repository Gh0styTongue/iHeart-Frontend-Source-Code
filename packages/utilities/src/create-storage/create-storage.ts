import { createEmitter } from '../create-emitter/index.js';
import type { BaseSchema, Storage, StorageMethods } from './types.js';

export function createStorage<Schema extends BaseSchema<any>>(
  schema: StorageMethods<Schema>,
): Storage<Schema> {
  const storage = createEmitter<StorageMethods<Schema>>(schema);

  return storage;
}
