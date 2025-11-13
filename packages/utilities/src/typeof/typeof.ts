enum Type {
  Array = 'array',
  AsyncFunction = 'asyncfunction',
  Error = 'error',
  Function = 'function',
  Null = 'null',
  Number = 'number',
  Object = 'object',
  Promise = 'promise',
  Regexp = 'regexp',
  String = 'string',
  Symbol = 'symbol',
  Undefined = 'undefined',
}

/**
 * @remarks {@link typeOf typeOf()} returns the type of the given value.
 *
 * @param {unknown} value The value to check.
 * @returns {Type}
 *
 * @example
 *
 * ```ts
 * typeOf(''); // string
 * ```
 */
export const typeOf = (value: unknown): Type =>
  Object.prototype.toString
    .call(value)
    .slice(8, -1)
    .toLowerCase() as unknown as Type;

/**
 * @remarks {@link isAsyncFunction isAsyncFunction()} checks if a given value is an async function.
 *
 * @param {unknown} value The value to check.
 * @returns boolean
 *
 * @example
 *
 * ```ts
 * isAsyncFunction(() => {}); // false
 * isAsyncFunction(async () => {}); // true
 * ```
 */
export const isAsyncFunction = (
  value: unknown,
): value is (...args: Array<any>) => Promise<any> =>
  typeOf(value) === Type.AsyncFunction;

/**
 * @remarks {@link isError isError()} checks if a given value is an error.
 *
 * @param {unknown} value The value to check.
 * @returns boolean
 *
 * @example
 *
 * ```ts
 * isError(new Error(':())); // true
 * ```
 */
export const isError = (value: unknown): value is Error =>
  typeOf(value).includes(Type.Error);

/**
 * @remarks {@link isObject isObject()} checks if a given value is an object.
 *
 * @param {unknown} value The value to check.
 * @returns boolean
 *
 * @example
 *
 * ```ts
 * isObject({}); // true
 * ```
 */

/**
 * @remarks {@link isPromise isPromise()} checks if a given value is a promise.
 *
 * @param {unknown} value The value to check.
 * @returns boolean
 *
 * @example
 *
 * ```ts
 * isPromise(Promise.resolve()); // true
 * ```
 */
export const isPromise = (value: unknown): value is Promise<any> =>
  typeOf(value) === Type.Promise;

/**
 * @remarks {@link isRegexp isRegexp()} checks if a given value is a regular expression.
 *
 * @param {unknown} value The value to check.
 * @returns boolean
 *
 * @example
 *
 * ```ts
 * isRegexp(/\/); // true
 * ```
 */
export const isRegexp = (value: unknown): value is RegExp =>
  typeOf(value) === Type.Regexp;

/**
 * @remarks {@link isSymbol isSymbol()} checks if a given value is a symbol.
 *
 * @param {unknown} value The value to check.
 * @returns boolean
 *
 * @example
 *
 * ```ts
 * isSymbol(new Symbol()); // true
 * ```
 */
export const isSymbol = (value: unknown): value is symbol =>
  typeOf(value) === Type.Symbol;
