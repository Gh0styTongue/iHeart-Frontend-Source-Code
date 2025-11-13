import type { Triton } from '../../../schemas/sdks/triton.js';

const desktop = {
  custom: '20730',
  talk: '23050',
};

const mobile = {
  custom: '28614',
  talk: '28615',
};

export const stagingWW: Triton = {
  desktop,
  enabled: true,
  mobile,
  sid: '151',
  threshold: 100,
};

export const productionWW: Triton = {
  ...stagingWW,
};
