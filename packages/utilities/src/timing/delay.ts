/**
 * Returns a promise that resolves after a specified number of milliseconds.
 *
 * @param wait - The number of milliseconds to wait before resolving the promise.
 * @returns A promise that resolves after the specified delay.
 */
export async function delay(wait: number) {
  return new Promise(resolve => setTimeout(resolve, wait));
}
