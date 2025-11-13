import { z } from 'zod';

export const countryCodesEnum = z.enum(['AU', 'CA', 'MX', 'NZ', 'US', 'WW']);

export type CountryCode = z.infer<typeof countryCodesEnum>;
