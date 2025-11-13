/**
 * Checks if thrown from native Error Constructor
 * @param {?} error - error that was thrown/caught
 * @returns - Error type guard
 */
export const isAppErrorResponse = (error: unknown): error is Error =>
  error instanceof Error;
