import { useMemo } from 'react';
import { useMatches } from 'react-router';

import type { RouteHandle } from '~app/types';

export function useFullScreenPlayerRoute() {
  const matches = useMatches();

  const isFullScreenPlayerRoute = useMemo(() => {
    return !!(matches.at(-1)?.handle as RouteHandle | undefined)
      ?.fullScreenPlayer;
  }, [matches]);

  return isFullScreenPlayerRoute;
}
