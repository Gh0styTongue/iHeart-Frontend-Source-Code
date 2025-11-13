import type { AppBoy } from '../../../schemas/sdks/app-boy.js';

export const stagingCA: AppBoy = {
  appKey: '1f7ef3ea-9e71-4429-9e7b-369dd44d0c33',
  baseUrl: 'sdk.iad-01.braze.com',
  enabled: true,
  groupKey: 'd93fbfca-4851-402d-bd27-cfebd9da4fe2',
  threshold: 100,
};

export const productionCA: AppBoy = {
  ...stagingCA,
  appKey: '6168f6a3-790f-401e-93cb-369a77104fc7',
};
