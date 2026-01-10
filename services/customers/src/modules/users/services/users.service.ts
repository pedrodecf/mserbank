import { Injectable } from '@nestjs/common';
import { UpdateProfilePictureDTO } from '../dto/updateProfilePicture.dto';
import { UpdateUserDTO } from '../dto/updateUser.dto';

@Injectable()
export class UsersService {
  findOne(userId: string) {
    // TODO: Implement with Prisma
    return { message: `Get user ${userId}` };
  }

  update(userId: string, updateUserDto: UpdateUserDTO) {
    // TODO: Implement with Prisma
    return { message: `Update user ${userId}`, data: updateUserDto };
  }

  updateProfilePicture(userId: string, updateProfilePictureDto: UpdateProfilePictureDTO) {
    // TODO: Implement with Prisma
    return { message: `Update profile picture for user ${userId}`, data: updateProfilePictureDto };
  }
}
