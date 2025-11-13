import { isTouchDevice } from '@iheartradio/web.accomplice';
import { useHydrated } from 'remix-utils/use-hydrated';

/**
 * Determines if the app is being viewed on a touch device
 * @returns `isTouch` which is a boolean representing whether or not the device being used is a touch device
 */
export function useIsTouch() {
  const isHydrated = useHydrated();
  return isTouchDevice() || !isHydrated;
}
