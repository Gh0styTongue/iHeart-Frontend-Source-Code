import { createLogger } from '@iheartradio/web.utilities/create-logger';

export const logger = createLogger({
  namespace: '@iheartradio/web.playback',
  pretty: true,
  enabled: false,
});
