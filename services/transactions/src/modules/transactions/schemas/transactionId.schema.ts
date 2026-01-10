import { z } from 'zod';

export const transactionIdSchema = z.object({
  transactionId: z.uuid('Invalid transaction ID'),
});
