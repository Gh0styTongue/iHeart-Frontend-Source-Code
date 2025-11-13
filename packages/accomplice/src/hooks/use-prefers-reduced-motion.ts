import { useEffect, useMemo, useState } from 'react';
import { isNullish } from 'remeda';

export function usePrefersReducedMotion(): boolean {
  const media = useMemo<MediaQueryList>(() => {
    if (isNullish(globalThis?.window))
      return { matches: false } as MediaQueryList;
    return window.matchMedia('(prefers-reduced-motion: reduce)');
  }, []);

  const [prefersReducedMotion, setPrefersReducedMotion] = useState<boolean>(
    media.matches,
  );

  useEffect(() => {
    function listen(e: MediaQueryListEvent) {
      setPrefersReducedMotion(e.matches);
    }

    media.addEventListener('change', listen);

    return () => media.removeEventListener('change', listen);
  }, [media]);

  return prefersReducedMotion;
}
