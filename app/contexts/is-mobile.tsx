import { invariant } from '@epic-web/invariant';
import { createContext, useContext } from 'react';
import { isNonNullish } from 'remeda';

/**
 * This context is to be used for determining whether or not a browser is "mobile", the
 * value for which comes from the Fastly layer. It is passed from Fastly to the RadioEdit
 * application via a header, and then it is passed into the app context in the Hono layer for the
 * Remix application.
 *
 * This allows us to do things like:
 * - conditionally size images
 * - only load/execute AppsFlyer for mobile browsers
 * - ... other stuff I haven't even thought of yet
 */
export const IsMobileContext = createContext<boolean | null>(null);

export function useIsMobile() {
  const ctx = useContext(IsMobileContext);
  invariant(
    isNonNullish(ctx),
    'useIsMobile() must be used within IsMobileContext',
  );
  return ctx;
}
