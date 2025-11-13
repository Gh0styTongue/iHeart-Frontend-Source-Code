import { useConfig } from '~app/contexts/config';

import { useRequestInfo } from './use-request-info';
import { useWindowLocation } from './use-window-location';

/**
 * Get the current location of the page, determined by
 * - `window.location.pathname` if it exists and is not empty
 * - `requestInfo.path` if it exists and is not empty
 * - `/` otherwise
 * @returns the current location of the page
 */
export function useCurrentLocation() {
  const windowLocation = useWindowLocation();
  const requestInfo = useRequestInfo();
  const { urls } = useConfig();

  return new URL(
    windowLocation?.pathname ?? requestInfo.path ?? '/',
    windowLocation?.origin ?? requestInfo.origin ?? urls.listen,
  );
}
