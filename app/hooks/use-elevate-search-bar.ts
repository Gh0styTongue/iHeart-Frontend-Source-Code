import { useMemo } from 'react';
import { useMatches } from 'react-router';
import { isPlainObject } from 'remeda';

import type { RouteHandle } from '~app/types';

export function useElevateSearchBar() {
  const matches = useMatches();

  const elevateSearchBar = useMemo(() => {
    for (const match of matches.toReversed()) {
      if (
        isPlainObject(match.handle) &&
        (match.handle as RouteHandle).hideSearchElevation
      ) {
        return false;
      }
    }

    return true;
  }, [matches]);

  return elevateSearchBar;
}
