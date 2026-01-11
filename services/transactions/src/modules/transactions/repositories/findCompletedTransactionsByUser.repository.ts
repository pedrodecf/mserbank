import { Injectable } from '@nestjs/common';
import { TransactionStatus } from '@prisma/client';
import { PrismaService } from '../../../infrastructure/database/prisma.service';

@Injectable()
export class FindCompletedTransactionsByUserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async execute(userId: string) {
    return this.prisma.transaction.findMany({
      where: {
        AND: [
          { status: TransactionStatus.COMPLETED },
          { OR: [{ senderUserId: userId }, { receiverUserId: userId }] },
        ],
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}
