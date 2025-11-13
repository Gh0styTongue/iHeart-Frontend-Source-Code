const wordSeparators =
  // eslint-disable-next-line regexp/no-dupe-characters-character-class
  /[\s!"#$%&'()*+,./:;<=>?@[\\\]^_`{|}~\u2000-\u206F\u2E00-\u2E7F-]+/;
// eslint-disable-next-line regexp/no-obscure-range
const capital_plus_lower = /[A-Z\u00C0-Ý][a-zà-ÿ]/g;
// eslint-disable-next-line regexp/no-obscure-range
const capitals = /[A-Z\u00C0-Ý]+/g;

const emojis = /[\u203C-\u3299]|[\uD83C-\uDBFF][\uDC00-\uDFFF]/g;

/**
 * Converts a given string to kebab-case.
 *
 * This implementation is distinct from many other kebab-case converters in that it:
 * - Handles Unicode capital and lowercase letters, including accented characters.
 * - Detects word boundaries not only by spaces and common separators, but also by transitions from capital to lowercase letters (e.g., "MyVariable" → "my-variable").
 * - Treats consecutive capital letters as separate words (e.g., "APIResponse" → "api-response").
 * - Uses regular expressions to robustly split words and handle a wide range of punctuation and Unicode symbols.
 * - Removes Emoji
 *
 * Compared to simpler implementations (such as those using only `.replace(/[A-Z]/g, ...)` or splitting on spaces/underscores), this function provides more accurate kebab-case conversion for complex strings, acronyms, and internationalized text.
 *
 * @param str - The input string to convert.
 * @returns The kebab-case version of the input string.
 */
export function kebabCase(str: string) {
  // 1) Remove any emojis
  str = str.replaceAll(emojis, '');

  // Replace word starts with space + lower case equivalent for later parsing
  // 2) treat cap + lower as start of new word
  str = str.replaceAll(capital_plus_lower, function (match) {
    // match is one caps followed by one non-cap
    return ' ' + (match[0].toLowerCase() || match[0]) + match[1];
  });

  // 3) treat all remaining capitals as words
  str = str.replaceAll(capitals, function (match) {
    // match is a series of caps
    return ' ' + match.toLowerCase();
  });

  return str
    .trim()
    .split(wordSeparators)
    .join('-')
    .replaceAll(/^-/g, '')
    .replaceAll(/-\s*$/g, '');
}
