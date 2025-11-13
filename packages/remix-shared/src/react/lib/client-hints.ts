import { useRequestInfo } from './request-info.js';

/**
 * @returns an object with the client hints and their values
 */
export function useHints(rootError?: boolean) {
  const requestInfo = useRequestInfo(rootError);
  return requestInfo.hints;
}
