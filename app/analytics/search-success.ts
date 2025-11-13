import { type Analytics, eventType } from '@iheartradio/web.analytics';

import { analytics } from './create-analytics';

export function searchSuccess(searchSuccessData: Analytics.SearchSuccess) {
  analytics.track({
    type: eventType.enum.SearchSuccess,
    data: searchSuccessData,
  });
}
