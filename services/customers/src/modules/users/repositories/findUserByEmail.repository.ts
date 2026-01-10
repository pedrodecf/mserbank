import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../infrastructure/database/prisma.service';

@Injectable()
export class FindUserByEmailRepository {
  constructor(private readonly prisma: PrismaService) {}

  async execute(email: string) {
    return this.prisma.user.findUnique({
      where: { email, deletedAt: null },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });
  }
}
