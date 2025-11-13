export function getDebug() {
  if (globalThis.window === undefined) {
    return false;
  }

  const debug = new URL(window.location.href).searchParams.get('debug');

  if (!debug) {
    return false;
  }

  return debug.includes('true') || debug.includes('playback');
}
