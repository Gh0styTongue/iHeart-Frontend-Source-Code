import { createContext, useContext } from 'react';

import type { ErrorConfig } from '../types/error-config.js';

export const ErrorContainer = createContext<ErrorConfig | null>(null);
ErrorContainer.displayName = 'ErrorContainer';

export function useErrorContext<T>() {
  const context = useContext(ErrorContainer) as ErrorConfig<T> | null;
  if (!context) {
    throw new Error('error-* component must be rendered as child of Error');
  }
  return context;
}
