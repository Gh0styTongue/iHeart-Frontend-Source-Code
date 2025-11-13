import type { Lotame } from '../../../schemas/sdks/lotame.js';

export const stagingAU: Lotame = {
  enabled: false,
};

export const productionAU: Lotame = {
  ...stagingAU,
};
