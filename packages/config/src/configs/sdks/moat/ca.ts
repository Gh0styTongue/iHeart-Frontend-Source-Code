import type { Moat } from '../../../schemas/sdks/moat.js';

export const stagingCA: Moat = {
  enabled: true,
  header:
    'https://z.moatads.com/bellmediaprebidheader755367530455/moatheader.js',
  library:
    'https://z.moatads.com/bellmediaprebidheader755367530455/moatheader.js',
  partnerCode: 'bellmediaprebidheader755367530455',
};

export const productionCA: Moat = {
  ...stagingCA,
};
