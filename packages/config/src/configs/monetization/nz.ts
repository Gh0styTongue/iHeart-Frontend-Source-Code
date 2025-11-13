import type { Ads } from '../../schemas/ads.js';
import { base } from './base.js';

const production: Ads = {
  ...base,
  dfpInstanceId: 83_069_739,
  customAds: {
    ...base.customAds,
    enabled: true,
    type: 'Adswizz',
    url: '//clearchannel.deliveryengine.adswizz.com/www/delivery/',
  },
  headerBidding: {
    enabledBidders: [...base.headerBidding.enabledBidders],
  },
};

const staging: Ads = {
  ...production,
};

const pr: Ads = {
  ...production,
};

export default {
  production,
  staging,
  pr,
};
