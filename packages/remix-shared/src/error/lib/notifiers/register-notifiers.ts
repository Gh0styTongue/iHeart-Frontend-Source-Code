import type { Analytics } from '@iheartradio/web.analytics';

import type { ErrorFactory } from '../types/error-config.js';
import { newRelicNotifier } from './newrelic-notifier.js';
import { pageViewNotifier } from './page-view-notifier.js';

export type ErrorNotifierProps = {
  error: ErrorFactory;
  analytics?: Analytics.Analytics;
  customAttributes?: { [key: string]: string | number | boolean };
};

export type ErrorNotifier = (props: ErrorNotifierProps) => void;

export const registerNotifiers = (): ErrorNotifier[] => [
  newRelicNotifier,
  pageViewNotifier,
];
