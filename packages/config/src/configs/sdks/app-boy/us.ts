import type { AppBoy } from '../../../schemas/sdks/app-boy.js';

export const stagingUS: AppBoy = {
  appKey: 'bfdbe1a5-aee1-4df5-9160-f01d4d71fe52',
  baseUrl: 'sdk.iad-01.braze.com',
  enabled: true,
  threshold: 100,
};

export const productionUS: AppBoy = {
  ...stagingUS,
  appKey: '73f8cae6-7de9-48ef-adc5-fcbd335f6d61',
};
