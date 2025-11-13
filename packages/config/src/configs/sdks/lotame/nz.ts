import type { Lotame } from '../../../schemas/sdks/lotame.js';

export const stagingNZ: Lotame = {
  clientId: 7065,
  enabled: true,
  publisherId: 5304,
  threshold: 100,
  tp: 'IHNZ',
  legacyLotame: false,
};

export const productionNZ: Lotame = {
  ...stagingNZ,
};
