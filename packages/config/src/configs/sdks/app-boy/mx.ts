import type { AppBoy } from '../../../schemas/sdks/app-boy.js';

export const stagingMX: AppBoy = {
  appKey: 'dbc6819c-197b-4f4b-b9fe-d6d3bc40b239',
  baseUrl: 'sdk.iad-01.braze.com',
  enabled: true,
  groupKey: 'c094ef23-7d60-4d67-a485-3430eabb37a2',
  threshold: 100,
};

export const productionMX: AppBoy = {
  ...stagingMX,
  appKey: 'bf34d60c-1401-44fb-a099-21d66e5df6e5',
};
