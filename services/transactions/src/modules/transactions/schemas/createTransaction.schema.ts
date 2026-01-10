import { z } from 'zod';

export const createTransactionSchema = z.object({
  senderUserId: z.uuid('Invalid sender user ID'),
  receiverUserId: z.uuid('Invalid receiver user ID'),
  amount: z.number().int().positive('Amount must be a positive integer (in cents)'),
  description: z.string().optional(),
});
