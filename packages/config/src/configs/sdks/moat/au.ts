import type { Moat } from '../../../schemas/sdks/moat.js';

export const stagingAU: Moat = {
  enabled: true,
  header: 'https://z.moatads.com/iheartprebidheader211581645343/moatheader.js',
  library: 'https://z.moatads.com/iheartprebidheader211581645343/moatheader.js',
  partnerCode: 'clearchanneldfp218445832525',
};

export const productionAU: Moat = {
  ...stagingAU,
};
