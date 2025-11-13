import { funnel } from 'remeda';

/**
 * A reference implementation of the Lodash `throttle` function using the
 * Remeda `funnel` function. While migrating from Lodash you can copy this
 * function as-is into your code base and use it as a drop-in replacement; but
 * we recommend eventually inlining the call to `funnel` so you can adjust the
 * function to your specific needs.
 *
 * This is a simplified implementation which ignores the Lodash capability to
 * track the return value of the callback function, but it is most likely the
 * more common use-case. For a more complete (and more complex) implementation
 * that also does that see the reference implementation for
 * `throttleWithCachedValue` in the other test file.
 *
 * The following tests in this file are based on the Lodash tests for throttle.
 * They have been adapted to work with our testing framework, have been fixed
 * or expanded slightly were it felt necessary, and have been modernized for
 * better readability. The names of the test cases have been preserved to ease
 * comparing them to the original tests.
 *
 * Note that this means that whenever Lodash offered a concrete spec, we made
 * sure our reference implementation respects it, but there might be untested
 * use-cases that would have differing runtime behaviors.
 *
 * @see Lodash Documentation: https://lodash.com/docs/4.17.15#throttle
 * @see Lodash Implementation: https://github.com/lodash/lodash/blob/4.17.21/lodash.js#L10965
 * @see Lodash Typing: https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/lodash/common/function.d.ts#L1347
 */
export function throttle<F extends (...args: any) => void>(
  func: F,
  wait = 0,
  {
    leading = true,
    trailing = true,
  }: { readonly leading?: boolean; readonly trailing?: boolean } = {},
) {
  const {
    call,
    // Lodash v4 doesn't provide access to the `isIdle` (called `pending` in
    // Lodash v5) information.
    isIdle: _isIdle,
    ...rest
  } = funnel(
    (args: Parameters<F>) => {
      if (!leading && !trailing) {
        // In Lodash you can disable both the trailing and leading edges of the
        // throttle window, effectively causing the function to never be
        // invoked. Remeda uses the invokedAt enum exactly to prevent such a
        // situation; so to simulate Lodash we need to only pass the callback
        // when at least one of them is enabled.
        return;
      }

      // Funnel provides more control over the args, but lodash simply passes
      // them through, to replicate this behavior we need to spread the args
      // array maintained via the reducer below.
      func(...args);
    },
    {
      // Throttle stores the latest args it was called with for the next
      // invocation of the callback.
      reducer: (_, ...args: Parameters<F>) => args,
      minQuietPeriodMs: wait,
      maxBurstDurationMs: wait,
      ...(trailing ?
        leading ? { triggerAt: 'both' }
        : { triggerAt: 'end' }
      : { triggerAt: 'start' }),
    },
  );
  // Lodash uses a legacy JS-ism to attach helper functions to the main
  // callback of `throttle`. In Remeda we return a proper object where the
  // callback is one of the available properties. Here we destructure and then
  // reconstruct the object to fit the Lodash API.
  return Object.assign(call, rest);
}
