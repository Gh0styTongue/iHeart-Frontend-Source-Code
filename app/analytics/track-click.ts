import {
  type Analytics,
  eventType as EventType,
} from '@iheartradio/web.analytics';
import { toSnakeCase } from 'remeda';

import { analytics } from './create-analytics';

type TrackClickPayload = {
  pageName: string;
  location?: string;
  sectionName?: string;
  filterType?: string;
  filterSelection?: string;
  station?: Analytics.StationType;
  globalStation?: Analytics.GlobalStationType;
  tab?: string | null;
};

export const trackClick = (trackClickPayload: TrackClickPayload) => {
  const {
    pageName,
    location,
    sectionName,
    filterType,
    filterSelection,
    station,
    globalStation,
    tab,
  } = trackClickPayload;

  analytics.track({
    type: EventType.enum.Click,
    data: {
      pageName: toSnakeCase(pageName),
      window: {
        location: {
          href: window.location.href,
        },
      },
      ...(station ?
        {
          station: {
            asset: station,
          },
        }
      : {}),
      view: {
        pageName,
        ...(tab ? { tab: toSnakeCase(tab) } : {}),
        ...(globalStation ?
          {
            station: {
              asset: globalStation,
            },
          }
        : {}),
        ...(sectionName ? { section: { name: sectionName } } : {}),
      },
      event: {
        ...(location ? { location } : {}),
        ...(filterType || filterSelection ?
          {
            filter: {
              type: filterType,
              selection: filterSelection,
            },
          }
        : {}),
      },
    },
  });
};
