import { Injectable } from '@nestjs/common';
import { TransactionStatus } from '@prisma/client';
import { PrismaService } from '../../../infrastructure/database/prisma.service';

@Injectable()
export class UpdateTransactionStatusRepository {
  constructor(private readonly prisma: PrismaService) {}

  async execute(transactionId: string, status: TransactionStatus) {
    return this.prisma.transaction.update({
      where: { id: transactionId },
      data: { status },
    });
  }
}
