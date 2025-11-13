import type { Moat } from '../../../schemas/sdks/moat.js';

export const stagingNZ: Moat = {
  enabled: true,
  header: 'https://z.moatads.com/iheartprebidheader211581645343/moatheader.js',
  library: 'https://z.moatads.com/iheartprebidheader211581645343/moatheader.js',
  partnerCode: 'clearchanneldfp218445832525',
};

export const productionNZ: Moat = {
  ...stagingNZ,
};
