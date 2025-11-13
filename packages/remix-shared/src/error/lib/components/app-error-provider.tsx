import { type PropsWithChildren, useEffect } from 'react';
import { isNullish } from 'remeda';

import { ErrorContainer } from '../hooks/error-context.js';
import type { ErrorConfig } from '../types/error-config.js';
import { AppError } from './app-error.js';
import { AppErrorContainer } from './app-error-container.js';
import { AppErrorItem } from './app-error-item.js';
import { AppErrorLayout } from './app-error-layout.js';

export const AppErrorProvider = ({
  errorConfig,
  children,
}: PropsWithChildren<{ errorConfig: ErrorConfig }>) => {
  useEffect(() => {
    if (!isNullish(errorConfig.errorSource?.error?.data)) {
      console.group('AppError');
      console.error(errorConfig.errorSource?.error?.data);
      console.groupEnd();
    }
  }, [errorConfig.errorSource?.error?.data]);

  return (
    <ErrorContainer.Provider value={errorConfig}>
      {children}
    </ErrorContainer.Provider>
  );
};

AppErrorProvider.displayName = 'AppErrorProvider';
AppErrorProvider.AppErrorContainer = AppErrorContainer;
AppErrorProvider.AppErrorLayout = AppErrorLayout;
AppErrorProvider.AppError = AppError;
AppErrorProvider.AppErrorItem = AppErrorItem;
