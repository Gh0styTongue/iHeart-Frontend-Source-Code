import { HTTPError } from '@iheartradio/web.api';
import { isRouteErrorResponse } from 'react-router';

import { isAppErrorResponse } from './guards/index.js';
import { registerNotifiers } from './notifiers/register-notifiers.js';
import {
  type ErrorConfig,
  type ErrorConfigProps,
  type ErrorDisplay,
  type ErrorFactory,
  type ErrorTemplates,
  ErrorType,
} from './types/error-config.js';

const getRouteErrorDisplay = (
  status: number,
  pathname: string,
  templates: ErrorTemplates,
  root?: boolean,
  data?: Record<string, unknown>,
): ErrorDisplay => {
  const routesTemplate = templates.routes({ root, pathname, data });
  return routesTemplate[status] ?
      {
        title: `${routesTemplate[status].HIDE_STATUS ? '' : status} ${routesTemplate[status].TITLE}`,
        description: routesTemplate[status].DESCRIPTION,
        cta: routesTemplate[status].CTA,
        icon: routesTemplate[status].ICON,
      }
    : getUnknownErrorDisplay(pathname, templates, root);
};

const getAppErrorDisplay = (
  pathname: string,
  templates: ErrorTemplates,
  root?: boolean,
): ErrorDisplay => getUnknownErrorDisplay(pathname, templates, root);

const getUnknownErrorDisplay = (
  pathname: string,
  templates: ErrorTemplates,
  root?: boolean,
): ErrorDisplay => {
  const unknownTemplate = templates.unknown({ root, pathname });
  return {
    title: unknownTemplate.TITLE,
    description: unknownTemplate.DESCRIPTION,
    cta: unknownTemplate.CTA,
    icon: unknownTemplate.ICON,
  };
};

const setError = (
  fact: ErrorFactory,
  errorDisplay: ErrorDisplay,
  errorType: ErrorFactory['errorType'],
) => {
  fact.errorType = errorType;
  fact.errorSource.title = errorDisplay.title;
  fact.errorSource.description = errorDisplay.description;
  fact.errorSource.cta = errorDisplay.cta;
  fact.errorSource.icon = errorDisplay.icon;
};

/**
 * @param {?} error - error that can't be inferred since anything can be thrown from actions/loaders
 * @param {string} pathname - current url pathname
 * @param {boolean} emit - invokes registered notifiers
 * @param {boolean} root - embeds error in full screen
 * @returns {object} - error factory
 */
export const getErrorConfig = ({
  analytics,
  customAttributes,
  error,
  pathname,
  emit = true,
  root,
  templates,
}: ErrorConfigProps): ErrorConfig => {
  const factory: ErrorFactory = {
    emit: () => {},
    errorSource: {
      cta: [],
      error,
      icon: 'error-outline',
      title: '',
      description: '',
      payload: error,
      hideStatus: false,
    },
    errorType: null,
    pathname,
  };

  if (isRouteErrorResponse(error)) {
    factory.errorSource.payload =
      error.data instanceof Object ?
        new Error(JSON.stringify(error.data))
      : new Error(error.data);
    setError(
      factory,
      templates ?
        // needed to add in the error data to show pertinent information to the user in case
        // of an oauth or app configuration error
        getRouteErrorDisplay(
          error.status,
          pathname,
          templates,
          root,
          factory.errorSource.error.data,
        )
      : ({} as ErrorDisplay),
      ErrorType.ROUTE_ERROR,
    );
  } else if (error instanceof HTTPError) {
    setError(
      factory,
      templates ?
        getRouteErrorDisplay(
          error?.response?.status ?? 418,
          pathname,
          templates,
          root,
          factory.errorSource.error.data,
        )
      : ({} as ErrorDisplay),
      ErrorType.API_ERROR,
    );
  } else if (isAppErrorResponse(error)) {
    setError(
      factory,
      templates ?
        getAppErrorDisplay(pathname, templates, root)
      : ({} as ErrorDisplay),
      ErrorType.APP_ERROR,
    );
    console.error(
      typeof error.message === 'string' ?
        error.message
      : JSON.stringify(error.message),
    );
  } else {
    setError(
      factory,
      templates ?
        getUnknownErrorDisplay(pathname, templates, root)
      : ({} as ErrorDisplay),
      ErrorType.UNKNOWN_ERROR,
    );
    console.error(error);
  }

  if (emit) {
    factory.emit = () => {
      for (const notifier of registerNotifiers()) {
        notifier({ error: factory, analytics, customAttributes });
      }
    };
  }

  return {
    emit: factory.emit,
    errorSource: factory.errorSource,
    errorType: factory.errorType,
    fromRoot: root,
  };
};
