import { useHydrated } from 'remix-utils/use-hydrated';

export function useWindowLocation(): Location | null {
  const isSsr = useHydrated();
  return !isSsr ? null : window.location;
}
