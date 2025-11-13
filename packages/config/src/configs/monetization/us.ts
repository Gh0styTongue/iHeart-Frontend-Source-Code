import type { Ads } from '../../schemas/ads.js';
import { base } from './base.js';

const production: Ads = {
  ...base,
  customAds: {
    ...base.customAds,
    type: 'Triton',
    url: 'https://crdl.tritondigital.com/api/ads/delivery',
  },
  headerBidding: {
    enabledBidders: [
      ...base.headerBidding.enabledBidders,
      'indexExchange',
      'amazon',
      'rubicon',
      'liveRamp',
    ],
  },
  dfpInstanceId: 6663,
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
