// eslint-disable-next-line import/no-namespace
import * as z from 'zod';

type FromShape<Shape, Output> = {
  [Key in keyof Shape]: Key extends keyof Output ?
    Shape[Key] extends z.ZodTypeAny ?
      z.ZodType<Output[Key], z.ZodTypeDef, unknown>
    : never
  : never;
};

type ToShape<Shape, Output> = {
  [Key in keyof Shape]: Key extends keyof Output ?
    Shape[Key] extends z.ZodTypeAny ?
      Shape[Key]
    : never
  : never;
};

type ThroughShape<Shape, Output> = {
  [Key in keyof Shape]: Key extends keyof Output ?
    Shape[Key] extends z.ZodTypeAny ?
      z.output<Shape[Key]> extends Output[Key] ?
        Output[Key] extends z.input<Shape[Key]> ?
          Shape[Key]
        : never
      : never
    : never
  : never;
};

type StrictShape<Shape, Output, Input> = {
  [Key in keyof Shape]: Key extends keyof Output ?
    Key extends keyof Input ?
      Shape[Key] extends z.ZodTypeAny ?
        Output[Key] extends z.output<Shape[Key]> ?
          Input[Key] extends z.input<Shape[Key]> ?
            z.ZodType<Output[Key], z.ZodTypeDef, Input[Key]>
          : never
        : never
      : never
    : never
  : never;
};

/**
 * Enforces a contract between a given TypeScript type and a Zod schema.
 * This is mostly useful to ensure a Zod schema matches an existing type, such as types that are
 * automatically generated.
 *
 * @remarks
 * This is essentially the inverse of `z.infer()`: `z.infer()` infers a type from a Zod schema. `implement` enforces a Zod schema matches a type.
 *
 * @privateRemarks
 * Stolen from {@link https://github.com/colinhacks/zod/issues/372#issuecomment-1752435804}
 *
 * @example
 * // `from()` ensures the output of the schema matches the type
 * const fooSchema = implement<{ foo: string }>().from({ foo: z.string() });
 *
 * // `to()` ensures the input of the schema matches the type
 * const fooSchema = implement<{ foo: any }>().from({ foo: z.string() });
 *
 * // `through()` ensures both the input and output of the schema match the type
 * const fooSchema = implement<{ foo: string }>().through({ foo: z.string() });
 *
 * // `strict()` allows you to pass both output and input types (in that order) which the schema has to match.
 * const fooSchema = implement<{ foo: { a: number; b:number } }, { foo: number }>()
 *                     .strict({
 *                       foo: z.object({ a: z.number(), b: z.number() }).transform(value => value.a + value.b)
 *                     });
 */
export const implement = <
  Output extends object,
  Input extends object = any,
>() => ({
  /**
   * `from()` ensures the output of the schema matches the type (the type matches the type FROM the schema)
   *
   * This is usually the one you should reach for when you want to align a type and a schema.
   */
  from: <Shape extends FromShape<Shape, Output>>(
    shape: Shape,
    params?: Parameters<typeof z.object>[1],
  ) => z.object(shape, params),

  fromSchema: <T extends z.ZodTypeDef>(schema: T) => schema,

  /**
   * `to()` ensures the input of the schema accepts the type (the type is passed TO the schema)
   *
   * This comparison is not very strict as schemas can take any input value so the best we can do is ensure the keys match.
   */
  to: <Shape extends ToShape<Shape, Output>>(
    shape: Shape,
    params?: Parameters<typeof z.object>[1],
  ) => z.object(shape, params),

  /**
   * `through()` ensures the input AND output of the schema matches the type (the type is passed through the schema and should remain the same)
   */
  through: <Shape extends ThroughShape<Shape, Output>>(
    shape: Shape,
    params?: Parameters<typeof z.object>[1],
  ) => z.object(shape, params),

  /**
   * `strict()` ensures the input AND output of the schema matches the type (the type is passed through the schema and should remain the same)
   */
  strict: <Shape extends StrictShape<Shape, Output, Input>>(
    shape: Shape,
    params?: Parameters<typeof z.object>[1],
  ) => z.object(shape, params),
});
