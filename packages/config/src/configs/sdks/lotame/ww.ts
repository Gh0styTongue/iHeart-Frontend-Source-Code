import type { Lotame } from '../../../schemas/sdks/lotame.js';

export const stagingWW: Lotame = {
  enabled: false,
};

export const productionWW: Lotame = {
  ...stagingWW,
};
