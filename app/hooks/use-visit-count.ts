import ms from 'ms';
import { useEffect } from 'react';
import { useLocalStorage } from 'usehooks-ts';

import { isBrowser } from '~app/utilities/utilities';

interface VisitCountState {
  visitNum: number;
  lastVisited: number;
}

const VISIT_COUNT_KEY = 'visit-count';
let ran = false;

/**
 * This hook should only run once client-side on initial render.
 * It is tracking a value which is incremented only on initial page load.
 *
 * This logic is done client side because the value is used client-side and storing it in a cookie
 * caused other issues (namely breaking Fastly cache because every response has a different "Set-Cookie" header).
 */
export function useVisitCount(): VisitCountState {
  const [value, setValue] = useLocalStorage<VisitCountState>(
    VISIT_COUNT_KEY,
    { visitNum: 1, lastVisited: Date.now() },
    {
      initializeWithValue: isBrowser(),
      serializer: JSON.stringify,
      deserializer: JSON.parse,
    },
  );

  useEffect(() => {
    if (!ran) {
      ran = true;
      setValue({
        lastVisited: Date.now(),
        visitNum:
          value.lastVisited < Date.now() - ms('24h') ? 1 : value.visitNum + 1,
      });
    }
  }, []);

  return ran ? value : (
      { visitNum: value.visitNum + 1, lastVisited: Date.now() }
    );
}
