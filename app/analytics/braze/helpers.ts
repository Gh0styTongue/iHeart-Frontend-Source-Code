import { eventType } from '@iheartradio/web.analytics';

export const BRAZE_CUSTOM_EVENTS = {
  PageView: 'Page_View',
  StreamStart: 'Stream_Start',
};

export const eventKeyMap = {
  [eventType.enum.PageView]: BRAZE_CUSTOM_EVENTS.PageView,
  [eventType.enum.StreamStart]: BRAZE_CUSTOM_EVENTS.StreamStart,
};
