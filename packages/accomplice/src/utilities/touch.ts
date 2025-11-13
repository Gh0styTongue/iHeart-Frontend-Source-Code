import { isNonNullish } from 'remeda';

/**
 * This is a callback ref factory that calls `preventDefault` on any `touch*` event.
 * This prevents the event from bubbling back up and causing additional PointerEvent events
 * https://ihm-it.atlassian.net/browse/IHRWEB-22503
 *
 */
export function preventDefaultTouchCallbackRef() {
  /**
   * A callback ref is executed twice in the React Lifecycle, once on mount and once on unmount.
   * On mount, the argument provided to the callback ref is the element; on unmount the argument
   * provided to callback ref is `null`
   *
   * Here we create a closure to encapsulate an AbortController. That AbortController's `signal`
   * is passed to `addEventListener` when the callback ref argument is non-nullish. When the
   * callback ref argument is nullish, the `.abort()` method of the controller is invoked which
   * tells JavasScript that the event listener tied to that signal can safely be garbage-collected
   */
  const controller = new AbortController();

  return (element: HTMLElement | null) => {
    if (isNonNullish(element)) {
      for (const key in element) {
        if (key.startsWith('on')) {
          const eventType = key.slice(2);
          if (eventType.startsWith('touch') && element) {
            element.addEventListener(
              eventType,
              (event: Event) => {
                event.preventDefault();
              },
              { signal: controller.signal },
            );
          }
        }
      }
    } else {
      controller.abort();
    }
  };
}
