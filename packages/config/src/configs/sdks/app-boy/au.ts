import type { AppBoy } from '../../../schemas/sdks/app-boy.js';

export const stagingAU: AppBoy = {
  appKey: '6324499b-42bd-4c16-b4dc-06a353705710',
  baseUrl: 'sdk.iad-01.braze.com',
  enabled: true,
  groupKey: '37a3d445-e3ad-4514-9fd1-891613988d4a',
  threshold: 100,
};

export const productionAU: AppBoy = {
  ...stagingAU,
  appKey: 'fbca558d-e4f5-4b00-b7c8-02068e0221fb',
};
