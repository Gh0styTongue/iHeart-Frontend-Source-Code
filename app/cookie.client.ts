import type { User } from '@iheartradio/web.config';
import cookie from 'js-cookie';
import { isPlainObject } from 'remeda';

export function decodeData<T>(value?: string): T {
  try {
    return (
      value ?
        JSON.parse(decodeURIComponent(myEscape(atob(value))))
      : {}) as T;
  } catch {
    return {} as T;
  }
}

// See: https://github.com/zloirock/core-js/blob/master/packages/core-js/modules/es.escape.js
function myEscape(value: string) {
  const str = value.toString();
  let result = '';
  let index = 0;
  let chr: string, code: number;
  while (index < str.length) {
    chr = str.charAt(index++);
    // eslint-disable-next-line unicorn/better-regex, unicorn/prefer-regexp-test
    if (/[\w*+\-./@]/.exec(chr)) {
      result += chr;
    } else {
      // eslint-disable-next-line unicorn/prefer-code-point
      code = chr.charCodeAt(0);
      result +=
        code < 256 ? '%' + hex(code, 2) : '%u' + hex(code, 4).toUpperCase();
    }
  }
  return result;
}
function hex(code: number, length: number) {
  let result = code.toString(16);
  while (result.length < length) result = '0' + result;
  return result;
}

export function getUserFromCookie() {
  const rawCookieValue = cookie.get('iheart-user');
  const decoded = decodeData(rawCookieValue);

  const userFromCookie =
    decoded && isPlainObject(decoded) && decoded.user ?
      (decoded.user as User)
    : null;

  return userFromCookie;
}
