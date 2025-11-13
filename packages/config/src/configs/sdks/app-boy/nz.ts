import type { AppBoy } from '../../../schemas/sdks/app-boy.js';

export const stagingNZ: AppBoy = {
  appKey: 'f3617dd0-4790-44ff-9b32-92ebf0a3cacb',
  baseUrl: 'sdk.iad-01.braze.com',
  enabled: true,
  groupKey: '81c5da77-06a5-46e1-b1a3-f025c3190642',
  threshold: 100,
};

export const productionNZ: AppBoy = {
  ...stagingNZ,
  appKey: '9bd86d0f-68d1-4110-a794-d4524da89e76',
};
