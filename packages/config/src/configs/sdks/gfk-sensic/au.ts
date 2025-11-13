import type { GFKSensic } from '../../../schemas/sdks/gfk-sensic.js';

export const stagingAU: GFKSensic = {
  enabled: true,
  script: '//au-config-preproduction.sensic.net/s2s-web.js',
};

export const productionAU: GFKSensic = {
  enabled: true,
  script: '//au-config.sensic.net/s2s-web.js',
};
