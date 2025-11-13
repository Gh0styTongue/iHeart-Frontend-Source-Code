import { breakpointSizes } from '@iheartradio/web.accomplice';
import { useMediaQuery } from 'usehooks-ts';

import { isBrowser } from '~app/utilities/utilities';

export function useIsMobileBreakpoint() {
  return useMediaQuery(`(max-width: ${breakpointSizes.large - 1}px)`, {
    defaultValue: false,
    initializeWithValue: isBrowser(),
  });
}
