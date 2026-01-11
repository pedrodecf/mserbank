import { z } from 'zod';

export const updateUserSchema = z
  .object({
    name: z.string().min(1, 'Name is required').optional(),
    email: z.email('Invalid email format').optional(),
    address: z.string().optional().nullable(),
    bankingDetails: z
      .object({
        nickname: z.string().min(1).optional().nullable(),
      })
      .optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field must be provided',
  });
