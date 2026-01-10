import { Injectable } from '@nestjs/common';

@Injectable()
export class TransactionsService {
  create() {
    // TODO: Implement with Prisma
    return { message: 'Create transaction' };
  }

  findOne(transactionId: string) {
    // TODO: Implement with Prisma
    return { message: `Get transaction ${transactionId}` };
  }

  findByUser(userId: string) {
    // TODO: Implement with Prisma
    return { message: `Get transactions for user ${userId}` };
  }
}
