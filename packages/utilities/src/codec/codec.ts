/**
 * Provides a consistent and type-safe interface for defining encoding/decoding logic.
 *
 * @example
 * ```ts
 * const jsonCodec = new Codec(JSON.stringify, JSON.parse);
 *
 * jsonCodec.encode({ foo: 'bar' }); // -> '{"foo":"bar"}'
 * jsonCodec.decode('{"foo":"bar"}'); // -> { foo: 'bar' }
 * ```
 */
export class Codec<A, B = string> {
  constructor(
    private readonly encodeFn: (input: A) => B,
    private readonly decodeFn: (output: B) => A,
  ) {}

  /**
   * Encode a value supported by this codec. Throws on encode error.
   */
  encode(input: A): B {
    return this.encodeFn(input);
  }

  /**
   * Decode a value encoded by this codec. Throws on decode error.
   */
  decode(output: B): A {
    return this.decodeFn(output);
  }

  /**
   * Encode a value supported by this codec, returning a result object regardless of success or failure.

   */
  safeEncode(
    input: A,
  ): { success: true; data: B } | { success: false; error: unknown } {
    try {
      return { success: true, data: this.encodeFn(input) };
    } catch (error) {
      return { success: false, error };
    }
  }

  /**
   * Decode a value encoded by this codec, returning a result object regardless of success or failure.
   */
  safeDecode(
    output: B,
  ): { success: true; data: A } | { success: false; error: unknown } {
    try {
      return { success: true, data: this.decodeFn(output) };
    } catch (error) {
      return { success: false, error };
    }
  }

  /**
   * Create an encode/decode pipeline using another Codec instance.
   */
  pipe<C>(next: Codec<B, C>): Codec<A, C> {
    return new Codec<A, C>(
      (a: A) => next.encode(this.encode(a)),
      (c: C) => this.decode(next.decode(c)),
    );
  }

  invert(): Codec<B, A> {
    return new Codec(this.decodeFn, this.encodeFn);
  }
}

export function pipeCodecs<A, B = string>(
  first: Codec<A, B>,
  ...rest: Codec<any, any>[]
): Codec<A, B> {
  return rest.reduce(
    (acc, next) =>
      new Codec<any, any>(
        input => next.encode(acc.encode(input)),
        output => acc.decode(next.decode(output)),
      ),
    first,
  );
}
