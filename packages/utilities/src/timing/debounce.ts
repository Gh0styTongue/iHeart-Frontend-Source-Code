import { funnel } from 'remeda';

export type Debouncer<
  F extends (...args: any) => unknown,
  IsNullable extends boolean = true,
> = {
  readonly call: (
    ...args: Parameters<F>
  ) => ReturnType<F> | (true extends IsNullable ? undefined : never);
  readonly cancel: () => void;
  readonly flush: () => ReturnType<F> | undefined;
  readonly isPending: boolean;
  readonly cachedValue: ReturnType<F> | undefined;
};

type DebounceOptions = {
  readonly waitMs?: number;
  readonly maxWaitMs?: number;
};

/**
 * A reference implementation of the now deprecated `debounce` function using
 * the `funnel` function instead. While you update your codebase you can copy
 * this function as-is and use it as a drop-in replacement; but we recommend
 * eventually inlining the call to `funnel` so you can adjust the function to
 * your specific needs.
 *
 * The following tests in this file are the original tests for debounce.
 *
 * @see debounce
 */
export function debounce<F extends (...args: any) => any>(
  func: F,
  options: DebounceOptions & { readonly timing?: 'trailing' },
): Debouncer<F>;
export function debounce<F extends (...args: any) => any>(
  func: F,
  options:
    | (DebounceOptions & { readonly timing: 'both' })
    | (Omit<DebounceOptions, 'maxWaitMs'> & { readonly timing: 'leading' }),
): Debouncer<F, false /* call CAN'T return null */>;
export function debounce<F extends (...args: any) => any>(
  func: F,
  {
    timing,
    waitMs,
    maxWaitMs,
  }: DebounceOptions & {
    readonly timing?: 'both' | 'leading' | 'trailing';
  },
) {
  if (maxWaitMs !== undefined && waitMs !== undefined && maxWaitMs < waitMs) {
    throw new Error(
      `debounce: maxWaitMs (${maxWaitMs.toString()}) cannot be less than waitMs (${waitMs.toString()})`,
    );
  }

  let cachedValue: ReturnType<F> | undefined;

  const debouncingFunnel = funnel(
    (args: Parameters<F>) => {
      // Every time the function is invoked the cached value is updated.
      cachedValue = func(...args) as ReturnType<F>;
    },
    {
      // Debounce stores the latest args it was called with for the next
      // invocation of the callback.
      reducer: (_, ...args: Parameters<F>) => args,
      minQuietPeriodMs: waitMs ?? maxWaitMs ?? 0,
      ...(maxWaitMs !== undefined && { maxBurstDurationMs: maxWaitMs }),
      ...(timing === 'leading' ? { triggerAt: 'start' }
      : timing === 'both' ? { triggerAt: 'both' }
      : { triggerAt: 'end' }),
    },
  );

  return {
    call: (...args: Parameters<F>) => {
      debouncingFunnel.call(...args);
      return cachedValue;
    },

    flush: () => {
      debouncingFunnel.flush();
      return cachedValue;
    },

    cancel: () => {
      debouncingFunnel.cancel();
    },

    get isPending() {
      return !debouncingFunnel.isIdle;
    },

    get cachedValue() {
      return cachedValue;
    },
  };
}
