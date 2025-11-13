import { ThemeEnum } from '@iheartradio/web.accomplice';
import type { ComponentType, PropsWithChildren } from 'react';
import { useLocation, useRouteError } from 'react-router';

import type { DocumentSharedProps } from '../../lib/document.js';
import { AppErrorProvider } from './components/index.js';
import { useErrorConfig } from './hooks/use-error-config.js';
import type { ErrorNotifierProps } from './notifiers/register-notifiers.js';
import type { ErrorTemplates } from './types/error-config.js';
import type { ErrorResponse } from './types/error-response.js';

export type SharedAppErrorBoundaryProps = {
  document?: ComponentType<DocumentSharedProps>;
  errorOverride?: unknown;
  analytics?: ErrorNotifierProps['analytics'];
  customAttributes?: ErrorNotifierProps['customAttributes'];
};

type AppErrorBoundaryProps = {
  templates: ErrorTemplates;
} & SharedAppErrorBoundaryProps;

export const AppErrorBoundary = ({
  analytics,
  customAttributes,
  children,
  document: Document,
  errorOverride,
  templates,
}: PropsWithChildren<AppErrorBoundaryProps>) => {
  const { pathname, search } = useLocation();
  const caughtError = useRouteError();

  let error = errorOverride || caughtError;

  const queryErrorOverride = new URLSearchParams(search).get('error');
  if (queryErrorOverride && /^\d{3}$/.test(queryErrorOverride)) {
    error = {
      // network error
      status: +queryErrorOverride,
      statusText: '',
      internal: false,
      data: {},
    } as ErrorResponse;
  } else if (queryErrorOverride && queryErrorOverride.length > 4) {
    error = new Error(queryErrorOverride); // app error
  } else if (queryErrorOverride) {
    error = null; // unknown error
  }

  const errorConfig = useErrorConfig({
    analytics,
    customAttributes,
    error,
    pathname,
    root: !!Document,
    templates,
  });

  return Document ?
      <Document
        theme={ThemeEnum.light}
        {...{
          children: (
            <>
              <AppErrorProvider errorConfig={errorConfig}>
                {children}
              </AppErrorProvider>
            </>
          ),
        }}
      />
    : <AppErrorProvider errorConfig={errorConfig}>{children}</AppErrorProvider>;
};
