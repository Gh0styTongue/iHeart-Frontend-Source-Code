import {
  type Analytics,
  eventType as EventType,
} from '@iheartradio/web.analytics';
import { useCallback } from 'react';

import { useAnalytics } from './create-analytics';

export type Station = Analytics.InAppMessageOpen['view']['station'];

export type TrackPresets = {
  item?: Analytics.StationType;
  location: string;
  pageName: string;
  station: Analytics.StationType;
  globalStation?: Analytics.StationType;
};

export function useTrackPresets() {
  const analytics = useAnalytics();

  const trackAddPreset = useCallback(
    ({ pageName, location, station, item, globalStation }: TrackPresets) => {
      analytics.track({
        type: EventType.enum.PresetAdded,
        data: {
          view: {
            pageName,
            ...(globalStation ?
              {
                station: {
                  asset: globalStation,
                },
              }
            : {}),
          },
          event: {
            location,
          },
          station: {
            asset: station,
          },
          item: {
            asset: item,
          },
        },
      });
    },
    [analytics],
  );

  const trackRemovePreset = useCallback(
    ({ pageName, location, station, item, globalStation }: TrackPresets) => {
      analytics.track({
        type: EventType.enum.PresetRemoved,
        data: {
          view: {
            pageName,
            ...(globalStation ?
              {
                station: {
                  asset: globalStation,
                },
              }
            : {}),
          },
          event: {
            location,
          },
          station: {
            asset: station,
          },
          item: {
            asset: item,
          },
        },
      });
    },
    [analytics],
  );

  return { trackAddPreset, trackRemovePreset };
}
