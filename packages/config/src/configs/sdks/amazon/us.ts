import type { Amazon } from '../../../schemas/sdks/amazon.js';

export const stagingUS: Amazon = {
  pubId: '3901',
  script: '//c.amazon-adsystem.com/aax2/apstag.js',
};

export const productionUS: Amazon = {
  ...stagingUS,
};
