import { z } from 'zod';

/**
 * Schema which accepts either string or number. Useful for things like `pathParams` where the
 * value will be inlined into a URL string: it's good to allow either string or number inputs
 * but the output will be stringified either way.
 *
 * It's usually better to opt for a more specific schema type.
 */
const genericIdSchema = z.union([z.string(), z.number()]);

export { genericIdSchema as _genericIdSchema };

export const genericPathIdSchema = genericIdSchema.pipe(z.coerce.string());

/**
 * Schema which coerces any value to a number (such as `profileId`)
 */
export const numberIdSchema = genericIdSchema.pipe(z.coerce.number());

/**
 * Schema which coerces any value to a string
 */
export const stringIdSchema = genericIdSchema.pipe(z.coerce.string());

/**
 * Schema for an array of number or string IDs which will be transformed into a comma-separated string.
 *
 * @example
 * idsPathParameterSchema.parse([9591, '9122', 2281]) // => "9591,9122,2281"
 */
export const idsPathParameterSchema = z
  .union([z.number(), z.string()])
  .array()
  .transform(ids => ids.join(','));

/**
 * Schema for an optional `limit` search parameter
 */
export const limitSchema = z.number().optional();

/**
 * Schema for an optional `offset` search parameter
 */
export const offsetSchema = z.number().optional();

/**
 * Schema for an optional `fields` search parameter. AMP expects a comma-separated string of field names to be returned in the response.
 * According to the AMP docs, this is not actually implemented on their end in many places.
 */
export const fieldSchema = z
  .union([z.string(), z.array(z.string()).transform(value => value.join(','))])
  .optional();

export const subscriptionTypeSchema = z.enum([
  'FREE',
  'PREMIUM',
  'PLUS',
  'NONE',
]);
