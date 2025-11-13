import type { Lotame } from '../../../schemas/sdks/lotame.js';

export const stagingCA: Lotame = {
  enabled: false,
};

export const productionCA: Lotame = {
  ...stagingCA,
};
