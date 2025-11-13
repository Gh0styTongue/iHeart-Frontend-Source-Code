declare global {
  interface Window {
    newrelic?: typeof import('newrelic');
  }
}

import type { ErrorNotifierProps } from './register-notifiers.js';

export const newRelicNotifier = ({
  error,
  customAttributes,
}: ErrorNotifierProps) => {
  if (globalThis?.window === undefined) {
    return;
  }

  if (globalThis?.window?.newrelic === undefined) {
    console.log('New Relic Browser Agent Not Initialized');
    return;
  }

  const newRelicError = error.errorSource.payload as Error;

  const newRelicAttributes = customAttributes ?? {};

  globalThis?.window.newrelic.noticeError(newRelicError, newRelicAttributes);
};
