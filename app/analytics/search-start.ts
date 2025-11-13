import { type Analytics, eventType } from '@iheartradio/web.analytics';

import { analytics } from './create-analytics';

export function searchStart(searchStartData: Analytics.SearchStart) {
  analytics.track({
    type: eventType.enum.SearchStart,
    data: searchStartData,
  });
}
