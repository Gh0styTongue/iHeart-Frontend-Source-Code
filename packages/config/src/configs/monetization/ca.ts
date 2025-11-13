import type { Ads } from '../../schemas/ads.js';
import { base } from './base.js';

const production: Ads = {
  ...base,
  customAds: {
    ...base.customAds,
    enabled: false,
  },
  adInterval: 300_000,
  dfpInstanceId: 5479,
  headerBidding: {
    enabledBidders: [...base.headerBidding.enabledBidders, 'indexExchange'],
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
