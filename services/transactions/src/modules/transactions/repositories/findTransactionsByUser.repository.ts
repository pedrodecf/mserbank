import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../infrastructure/database/prisma.service';

@Injectable()
export class FindTransactionsByUserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async execute(userId: string) {
    return this.prisma.transaction.findMany({
      where: {
        OR: [{ senderUserId: userId }, { receiverUserId: userId }],
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}
