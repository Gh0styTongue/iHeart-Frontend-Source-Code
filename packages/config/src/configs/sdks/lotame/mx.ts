import type { Lotame } from '../../../schemas/sdks/lotame.js';

export const stagingMX: Lotame = {
  enabled: false,
};

export const productionMX: Lotame = {
  ...stagingMX,
};
