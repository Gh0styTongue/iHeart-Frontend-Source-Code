import { z } from 'zod';

export const jwPlayerSchema = z.object({
  script: z.string().url(),
  config: z.record(z.string(), z.string()).optional(),
});

export type JWP = z.infer<typeof jwPlayerSchema>;
