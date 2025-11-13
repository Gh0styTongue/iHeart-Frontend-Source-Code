import { createGoogleAds } from '@iheartradio/web.ads';

import { analytics } from '~app/analytics/create-analytics';

export const {
  GoogleAdsProvider,
  GoogleAds,
  setIsTakeover,
  useDisplayAdsContext,
  useSlotRegistry,
} = createGoogleAds({ analytics });

export {
  type DisplayAdsScriptsConfig,
  type HeaderBiddingConfig,
  DisplayAdsScripts,
} from '@iheartradio/web.ads';
