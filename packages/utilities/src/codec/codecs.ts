import { decodeBase64, encodeBase64 } from '@std/encoding/base64';
import { decodeBase64Url, encodeBase64Url } from '@std/encoding/base64url';
import { transliterate } from 'transliteration';

import { Codec } from './codec.js';

export const jsonCodec = new Codec<any>(
  decoded => JSON.stringify(decoded).normalize('NFD'),
  encoded => JSON.parse(encoded),
);

export const uriCodec = new Codec<string>(
  encodeURIComponent,
  decodeURIComponent,
);

/**
 * Encode a string to its base64 representation and decode back to the original string.
 *
 * The encoded representation is NOT guaranteed to be URL-safe.
 * It is possible that the output will contain URL special characters such as `/` or `=`.
 *
 * If you need URL safe encoded values, see {@link base64UrlCodec}.
 */
export const base64Codec = new Codec<string>(encodeBase64, val =>
  new TextDecoder().decode(decodeBase64(val)),
);

/**
 * Encode a string to its base64url representation and decode back to the original string.
 *
 * This differs from standard base64 in that the encoded values are URL-safe.
 *
 * Decoding base64url values with `atob()` should work almost the same as decoding standard base64 values.
 * However, full compatibility between base64 and base64url cannot be guaranteed. If you need
 * guaranteed compatibility with standard base64 functions, use {@link base64Codec} instead.
 */
export const base64UrlCodec = new Codec<string>(encodeBase64Url, val =>
  new TextDecoder().decode(decodeBase64Url(val)),
);

/**
 * Normalizes strings to remove diacritics, smart quotes, and other weird characters.
 */
export const stringNormalizeCodec = new Codec<string>(
  s => transliterate(s),
  s => s,
);
