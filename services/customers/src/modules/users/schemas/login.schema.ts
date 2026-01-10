import { PASSWORD_REGEX } from 'src/common/constants/regex.constants';
import { z } from 'zod';

export const loginSchema = z.object({
  email: z.email('Invalid email format'),
  password: z
    .string()
    .regex(
      PASSWORD_REGEX,
      'Password must be at least 8 characters and contain at least one uppercase letter, one lowercase letter, one number and one special character',
    ),
});
