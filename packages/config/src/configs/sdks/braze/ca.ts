import type { BrazeSchema } from '../../../schemas/sdks/braze.js';

export const stagingCA: BrazeSchema = {
  apiKey: '46c2b04a-a90e-482e-937a-d61094f4dadd',
  baseUrl: 'sdk.iad-01.braze.com',
  enableLogging: true,
};

export const productionCA: BrazeSchema = {
  apiKey: 'e1dabefe-1e5b-41b2-9f16-4aaa8ae55781',
  baseUrl: 'sdk.iad-01.braze.com',
  enableLogging: false,
};
