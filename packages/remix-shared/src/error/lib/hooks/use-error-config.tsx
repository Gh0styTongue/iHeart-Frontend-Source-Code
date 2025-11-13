import { useEffect, useMemo, useRef } from 'react';

import { getErrorConfig } from '../get-error-config.js';
import type { ErrorConfigProps } from '../types/error-config.js';

export function useErrorConfig({
  analytics,
  customAttributes,
  root,
  error,
  pathname,
  templates,
}: ErrorConfigProps) {
  const pathnameRef = useRef<typeof pathname>(null);
  const errorRef = useRef(null);

  const errorConfig = useMemo(
    () =>
      getErrorConfig({
        analytics,
        customAttributes,
        root,
        error,
        pathname,
        templates,
      }),
    [customAttributes, analytics, pathname, error, root, templates],
  );

  useEffect(() => {
    if (
      pathnameRef.current !== pathname ||
      JSON.stringify(error) !== JSON.stringify(errorRef.current)
    ) {
      errorRef.current = error;
      pathnameRef.current = pathname;

      errorConfig.emit();
    }
  }, [errorConfig, error, pathname]);

  return errorConfig;
}
