import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../infrastructure/database/prisma.service';

@Injectable()
export class FindPasswordByUserIdRepository {
  constructor(private readonly prisma: PrismaService) {}

  async execute(userId: string) {
    return this.prisma.usersPassword.findUnique({
      where: { id: userId },
      select: {
        hash: true,
      },
    });
  }
}
