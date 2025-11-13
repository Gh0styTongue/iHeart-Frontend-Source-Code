import {
  type Analytics,
  eventType as EventType,
} from '@iheartradio/web.analytics';

import { useAnalytics } from './create-analytics';

export type Station = Analytics.StationType | undefined;
export type GlobalStation = Analytics.GlobalStationType | undefined;

export type InAppMessage = {
  exitType?: string;
  globalStation?: Analytics.GlobalStationType;
  location?: string;
  messageType: string;
  pageName: string;
  selection?: string;
  station?: Station;
  tab?: string;
  type?: string;
  userTriggered?: boolean;
};

export type InAppMessageHandler = (params: InAppMessage) => void;

export function useInAppMessage() {
  const analytics = useAnalytics();

  const onInAppMessageOpen: InAppMessageHandler = ({
    globalStation,
    location,
    messageType,
    pageName,
    station,
    tab,
    type,
    userTriggered,
  }: InAppMessage) => {
    analytics.track({
      type: EventType.enum.InAppMessageOpen,
      data: {
        event: {
          ...(location ? { location } : {}),
          ...(type ? { type } : {}),
        },
        iam: {
          messageType,
          ...(userTriggered ? { userTriggered } : {}),
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
          ...(tab ? { tab } : {}),
          ...(globalStation ?
            {
              station: {
                asset: globalStation,
              },
            }
          : {}),
        },
      },
    });
  };

  const onInAppMessageExit: InAppMessageHandler = ({
    exitType,
    globalStation,
    location,
    messageType,
    pageName,
    selection,
    station,
    tab,
    type,
    userTriggered,
  }: InAppMessage) => {
    analytics.track({
      type: EventType.enum.InAppMessageExit,
      data: {
        event: {
          ...(location ? { location } : {}),
          ...(type ? { type } : {}),
          ...(selection ? { selection } : {}),
        },
        iam: {
          messageType,
          ...(userTriggered ? { userTriggered } : {}),
          ...(exitType ? { exitType } : {}),
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
          ...(tab ? { tab } : {}),
          ...(globalStation ?
            {
              station: {
                asset: globalStation,
              },
            }
          : {}),
        },
      },
    });
  };

  return { onInAppMessageOpen, onInAppMessageExit };
}
