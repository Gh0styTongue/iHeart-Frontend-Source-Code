import type { HTTPError } from '@iheartradio/web.api';

import type { ErrorNotifierProps } from '../notifiers/register-notifiers.js';
import type { CTAIconItem, CTAItemData } from './cta-props.js';
import type {
  ROUTE_API_ERROR_FACT,
  UNKNOWN_ERROR_FACT,
} from './error-display.js';
import type { ErrorResponse } from './error-response.js';

export type ErrorDisplay = Omit<
  ErrorFactory['errorSource'],
  'payload' | 'error'
>;

export type NewRelicConfig = {
  BROWSER: {
    APM_APP_ID: string;
    APP_ID: string;
    ENTITY_GUID: string;
  };
  APM: {
    APP_ID: string;
    ENTITY_GUID: string;
  };
};

export type ErrorFactory<T = any> = {
  emit: () => void;
  errorSource: {
    cta: CTAItemData[];
    description: string;
    error: T;
    icon: CTAIconItem;
    payload: Error | HTTPError | ErrorResponse;
    title: string;
    hideStatus?: boolean;
  };
  errorType: ErrorType | null;
  pathname: string;
};

export type ErrorConfigProps<T = any> = {
  emit?: boolean;
  error: T;
  pathname: string;
  root?: boolean;
  templates?: ErrorTemplates;
  analytics?: ErrorNotifierProps['analytics'];
  customAttributes?: ErrorNotifierProps['customAttributes'];
};

export type ErrorTemplates = {
  routes: ROUTE_API_ERROR_FACT;
  unknown: UNKNOWN_ERROR_FACT;
};

export type ErrorConfig<T = any> = Readonly<
  Pick<ErrorFactory<T>, 'emit' | 'errorSource' | 'errorType'> & {
    fromRoot?: boolean;
  }
>;

export enum ErrorType {
  API_ERROR = 'apiError',
  APP_ERROR = 'appError',
  ROUTE_ERROR = 'routeError',
  UNKNOWN_ERROR = 'unknownError',
}
