import { useHref } from 'react-router';

/**
 * Resolves the provided path to an absolute URL.
 *
 * @param path - A relative or absolute path
 * @returns An absolute URL created from the path. If a relative path is provided, the resulting URL will use the current document's origin (via Remix's `useHref()`). If an absolute path is provided, it will be returned as-is.
 */
export function useAbsoluteHref(path: string) {
  const relative = useHref(path);

  // Disallow `javascript:` hrefs. I would imagine supporting this is a security risk.
  if (path.startsWith('javascript:')) {
    return '';
  }

  // If the path looks like an aboslute href, use it instead of the relative based href.
  if (/\w+:.*/.test(path)) {
    return path;
  }

  return relative;
}
