import { z } from 'zod';

export const indexExhangeSchema = z.object({
  en: z.string().optional(),
  fr: z.string().optional(),
});

export type IndexExchange = z.infer<typeof indexExhangeSchema>;
