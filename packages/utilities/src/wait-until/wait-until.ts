export function waitUntil(condition: () => boolean, timeout = 10_000) {
  const time = Date.now();
  let id: number;

  function callback(resolve: () => void, reject: (error: Error) => void) {
    if (condition()) {
      window.cancelAnimationFrame(id);
      resolve();
      return;
    }

    if (Date.now() - time >= timeout) {
      window.cancelAnimationFrame(id);
      reject(new Error('Timeout exceeded.'));
      return;
    }

    id = window.requestAnimationFrame(() => callback(resolve, reject));
  }

  return new Promise<void>(callback);
}
