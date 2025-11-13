import { useHints } from './client-hints.js';
import { useRequestInfo } from './request-info.js';

/**
 * @returns the user's theme preference, or the client hint theme if the user
 * has not set a preference.
 */
export function useTheme(rootError?: boolean) {
  const hints = useHints(rootError);
  const requestInfo = useRequestInfo(rootError);
  return requestInfo.userPrefs.theme ?? hints.theme;
}
