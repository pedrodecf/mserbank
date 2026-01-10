import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../infrastructure/database/prisma.service';

@Injectable()
export class UpdateProfilePictureRepository {
  constructor(private readonly prisma: PrismaService) {}

  async execute(userId: string, profilePicture: string) {
    return this.prisma.user.update({
      where: { id: userId },
      data: { profilePicture },
    });
  }
}
