import { createZodDto } from 'nestjs-zod';
import { registerSchema } from '../schemas/register.schema';

export class RegisterDTO extends createZodDto(registerSchema) {}
