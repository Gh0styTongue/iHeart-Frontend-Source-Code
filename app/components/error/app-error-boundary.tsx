import type { SharedAppErrorBoundaryProps } from '@iheartradio/web.remix-shared/error/app-error-boundary.js';
import { AppErrorBoundary as SharedErrorBoundary } from '@iheartradio/web.remix-shared/error/app-error-boundary.js';
import { AppErrorProvider as SharedErrorProvider } from '@iheartradio/web.remix-shared/error/components/app-error-provider.js';
import { useRouteLoaderData } from 'react-router';

import { analytics } from '~app/analytics/create-analytics';
import type { loader } from '~app/root';

import { getNewRelicCustomAttributes } from './newrelic-custom-attributes';
import { ROUTE_API_ERROR } from './templates/error-route';
import { UNKNOWN_ERROR } from './templates/error-unknown';

export const AppErrorBoundary = ({
  document: Document,
  errorOverride,
}: SharedAppErrorBoundaryProps) => {
  const { appVersion, SHORT_COMMIT, requestInfo, user, userType } =
    useRouteLoaderData<typeof loader>('root') ?? {};

  const customAttrs = getNewRelicCustomAttributes({
    appVersion,
    requestInfo,
    SHORT_COMMIT,
    user,
    userType,
  });

  return (
    <SharedErrorBoundary
      analytics={analytics}
      customAttributes={customAttrs}
      document={Document}
      errorOverride={errorOverride}
      templates={{
        routes: ROUTE_API_ERROR,
        unknown: UNKNOWN_ERROR,
      }}
    >
      <SharedErrorProvider.AppErrorContainer>
        <SharedErrorProvider.AppErrorLayout>
          <SharedErrorProvider.AppErrorItem>
            <SharedErrorProvider.AppError />
          </SharedErrorProvider.AppErrorItem>
        </SharedErrorProvider.AppErrorLayout>
      </SharedErrorProvider.AppErrorContainer>
    </SharedErrorBoundary>
  );
};
