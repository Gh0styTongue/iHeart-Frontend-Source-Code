import type { LiveRamp } from '../../../schemas/sdks/live-ramp.js';

export const stagingUS: LiveRamp = {
  script: 'https://ats.rlcdn.com/ats.js',
};

export const productionUS: LiveRamp = {
  ...stagingUS,
};
