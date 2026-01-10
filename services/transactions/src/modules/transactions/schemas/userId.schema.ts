import { z } from 'zod';

export const userIdSchema = z.object({
  userId: z.uuid('Invalid user ID'),
});
