import { kebabCase } from './kebab-case.js';

/**
 * From underscore.string, escape reg ex char in a string
 * @param str String to be processed
 * @return String after regex is escaped
 */
function _escapeRegExp(str: string): string {
  if (!str) return '';
  return String(str).replaceAll(/([!$()*+./:=?[\\\]^{|}])/g, '\\$1');
}

function defaultToWhiteSpace(characters: null | RegExp | string): string {
  if (characters === null) return '\\s';
  if (characters instanceof RegExp) return characters.source;
  return `[${_escapeRegExp(characters)}]`;
}

const from = 'ąàáäâãåæćęèéëêìíïîłńòóöôõðøùúüûñçżź';
const to = 'aaaaaaaaceeeeeiiiilnooooooouuuunczz';
const regex = new RegExp(defaultToWhiteSpace(from), 'g');

/**
 * Converts a string into a URL-friendly slug.
 *
 * This function performs several normalization steps:
 * - Removes apostrophes.
 * - Converts accented and special characters to their ASCII equivalents.
 * - Converts the string to lowercase.
 * - Removes non-word characters except spaces and hyphens.
 * - Normalizes Unicode characters and removes diacritics.
 * - Converts the cleaned string to kebab-case.
 *
 * @see {@link kebabCase}
 *
 * @param value - The input string to be slugified.
 * @returns The slugified version of the input string.
 */
export function slugify(value: string): string {
  // Do some cleanup first

  const cleanString = value
    .replaceAll("'", '')
    .toLocaleLowerCase()
    .replace(regex, c => {
      const index = from.indexOf(c);
      return to.charAt(index) ?? '-';
    })
    .replaceAll(/[^\s\w-]/g, '') // Removes any non-word characters or white spaces.
    .normalize('NFKD')
    .replaceAll(/[\u0300-\u036F]/g, '');

  return kebabCase(cleanString);
}
