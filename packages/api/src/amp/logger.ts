import { createLogger } from '@iheartradio/web.utilities/create-logger';

export const logger = createLogger({
  enabled: true,
  namespace: '@iheartradio/web.api/amp',
  pretty: true,
});
