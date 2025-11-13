import { createReactPlayback, resolvers } from '@iheartradio/web.playback';

import { analytics } from '~app/analytics/create-analytics';
import { amp } from '~app/api/amp-client';

export const { PlaybackProvider, ...playback } = createReactPlayback({
  api: amp,
  resolvers,
  analytics,
});
