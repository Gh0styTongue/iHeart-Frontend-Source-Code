export function invariant(
  condition: unknown,
  message?: string | (() => string),
): asserts condition {
  if (!condition) {
    const error = new Error(
      typeof message === 'function' ? message() : (
        (message ?? 'Invariant failed')
      ),
    );
    error.name = 'InvariantError';
    throw error;
  }
}
