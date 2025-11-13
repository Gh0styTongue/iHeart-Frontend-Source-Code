import type { Ads } from '../../schemas/ads.js';
import { base } from './base.js';

const production: Ads = {
  ...base,
  customAds: {
    ...base.customAds,
    enabled: false,
  },
  dfpInstanceId: 20_814_175,
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
