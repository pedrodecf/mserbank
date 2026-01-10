import { createZodDto } from 'nestjs-zod';
import { updateProfilePictureSchema } from '../schemas/updateProfilePicture.schema';

export class UpdateProfilePictureDTO extends createZodDto(updateProfilePictureSchema) {}
