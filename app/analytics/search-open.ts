import { type Analytics, eventType } from '@iheartradio/web.analytics';

import { analytics } from './create-analytics';

export function searchOpen(searchOpenData: Analytics.SearchOpen) {
  analytics.track({
    type: eventType.enum.SearchOpen,
    data: searchOpenData,
  });
}
