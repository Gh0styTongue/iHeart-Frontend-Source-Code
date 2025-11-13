import type { AppBoy } from '../../../schemas/sdks/app-boy.js';

export const stagingWW: AppBoy = {
  appKey: '',
  baseUrl: '',
  enabled: false,
  threshold: 100,
};

export const productionWW: AppBoy = {
  ...stagingWW,
};
