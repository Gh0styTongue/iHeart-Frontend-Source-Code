import { z } from 'zod';

export const liverampSchema = z.object({
  script: z.string(),
});

export type LiveRamp = z.infer<typeof liverampSchema>;
