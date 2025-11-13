import type { Moat } from '../../../schemas/sdks/moat.js';

export const stagingUS: Moat = {
  enabled: true,
  header: 'https://z.moatads.com/iheartprebidheader211581645343/moatheader.js',
  jwPartnerCode: 'iheartmediajwplayer830534806428',
  jwplayer: 'https://z.moatads.com/jwplayerplugin0938452/moatplugin.js',
  library: 'https://z.moatads.com/iheartprebidheader211581645343/moatheader.js',
  partnerCode: 'clearchanneldfp218445832525',
};

export const productionUS: Moat = {
  ...stagingUS,
};
