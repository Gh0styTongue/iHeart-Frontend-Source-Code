import { z } from 'zod';

export const appSchema = z.object({
  appleId: z.string(),
  googlePlayId: z.string(),
});

export type App = z.infer<typeof appSchema>;
