import type { Lotame } from '../../../schemas/sdks/lotame.js';

export const stagingUS: Lotame = {
  clientId: 4086,
  enabled: false,
  publisherId: 4085,
  threshold: 100,
  tp: 'CLCH',
};

export const productionUS: Lotame = {
  ...stagingUS,
};
