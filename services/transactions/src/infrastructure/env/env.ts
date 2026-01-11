import { z } from 'zod';

export const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'testing', 'homolog', 'production', 'test']),
  PORT: z.coerce.number().optional().default(3333),
  DATABASE_URL: z.string().min(1),
  RABBITMQ_URL: z.string().min(1),
  JWT_SECRET: z.string().min(1),
  JWT_EXPIRES_IN: z.string().min(1),
});

export type Env = z.infer<typeof envSchema>;
