import { createZodDto } from 'nestjs-zod';
import { loginSchema } from '../schemas/login.schema';

export class LoginDTO extends createZodDto(loginSchema) {}
