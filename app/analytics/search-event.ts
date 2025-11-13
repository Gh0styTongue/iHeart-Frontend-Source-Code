import { type Analytics, eventType } from '@iheartradio/web.analytics';

import { analytics } from './create-analytics';

export function searchEvent(searchData: Analytics.Search) {
  analytics.track({
    type: eventType.enum.Search,
    data: {
      ...(searchData.station && { station: searchData.station }),
      search: searchData.search,
    },
  });
}
