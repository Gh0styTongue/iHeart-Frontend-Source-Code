import type { Moat } from '../../../schemas/sdks/moat.js';

export const stagingWW: Moat = {
  enabled: false,
  header: '',
  library: '',
  partnerCode: '',
};

export const productionWW: Moat = {
  ...stagingWW,
};
