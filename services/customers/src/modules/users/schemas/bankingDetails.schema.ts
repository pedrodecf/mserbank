import { z } from 'zod';

export const bankingDetailsSchema = z.object({
  agency: z.string().min(1, 'Agency is required'),
  accountNumber: z.string().min(1, 'Account number is required'),
});
