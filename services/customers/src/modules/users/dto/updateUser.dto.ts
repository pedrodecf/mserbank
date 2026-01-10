import { createZodDto } from 'nestjs-zod';
import { updateUserSchema } from '../schemas/updateUser.schema';

export class UpdateUserDTO extends createZodDto(updateUserSchema) {}
