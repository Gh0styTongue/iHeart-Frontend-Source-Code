import type { Moat } from '../../../schemas/sdks/moat.js';

export const stagingMX: Moat = {
  enabled: false,
  header:
    'https://z.moatads.com/bellmediaprebidheader755367530455/moatheader.js',
  library:
    'https://z.moatads.com/bellmediaprebidheader755367530455/moatheader.js',
  partnerCode: 'clearchanneldfp218445832525',
};

export const productionMX: Moat = {
  ...stagingMX,
};
