import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../infrastructure/database/prisma.service';

@Injectable()
export class FindOneUserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async execute(userId: string) {
    return this.prisma.user.findUnique({
      where: { id: userId, deletedAt: null },
      include: { bankingDetails: true },
    });
  }
}
