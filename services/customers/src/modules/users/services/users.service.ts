import { Injectable } from '@nestjs/common';
import { UpdateProfilePictureDTO } from '../dto/updateProfilePicture.dto';

@Injectable()
export class UsersService {
  updateProfilePicture(userId: string, updateProfilePictureDto: UpdateProfilePictureDTO) {
    // TODO: Implement with Prisma
    return { message: `Update profile picture for user ${userId}`, data: updateProfilePictureDto };
  }
}
