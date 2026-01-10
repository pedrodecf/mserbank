import { Injectable } from '@nestjs/common';

@Injectable()
export class UsersService {
  findOne(userId: string) {
    // TODO: Implement with Prisma
    return { message: `Get user ${userId}` };
  }

  update(userId: string) {
    // TODO: Implement with Prisma
    return { message: `Update user ${userId}` };
  }

  updateProfilePicture(userId: string) {
    // TODO: Implement with Prisma
    return { message: `Update profile picture for user ${userId}` };
  }
}
