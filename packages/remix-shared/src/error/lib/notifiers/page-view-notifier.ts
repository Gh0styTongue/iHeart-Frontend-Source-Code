import * as WebAnalytics from '@iheartradio/web.analytics';
import { toSnakeCase } from 'remeda';

import { ErrorType } from '../types/error-config.js';
import type { ErrorNotifierProps } from './register-notifiers.js';

export const pageViewNotifier = ({ error, analytics }: ErrorNotifierProps) => {
  if (globalThis?.window === undefined) {
    return;
  }

  const status = error.errorSource.error?.status;
  const title = error.errorSource.error?.title;
  const errorType = error.errorType;

  if (
    (status >= 400 ||
      errorType === ErrorType.APP_ERROR ||
      errorType === ErrorType.UNKNOWN_ERROR) &&
    analytics
  ) {
    analytics.track({
      type: WebAnalytics.eventType.enum.PageView,
      data: {
        pageName: `${status ?? toSnakeCase(title ?? 'Something went wrong')}`,
        window: {
          location: {
            href: window.location.href,
          },
        },
      },
    });
  }
};
