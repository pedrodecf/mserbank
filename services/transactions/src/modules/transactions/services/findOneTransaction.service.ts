import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { FindOneTransactionRepository } from '../repositories/findOneTransaction.repository';

@Injectable()
export class FindOneTransactionService {
  private readonly logger = new Logger(FindOneTransactionService.name);

  constructor(private readonly findOneTransactionRepository: FindOneTransactionRepository) {}

  async execute(transactionId: string, currentUserId: string) {
    this.logger.debug({ transactionId, currentUserId }, 'Attempting to find one transaction');

    const transaction = await this.findOneTransactionRepository.execute(transactionId);

    if (!transaction) {
      this.logger.warn({ transactionId }, 'Transaction not found');
      throw new NotFoundException(`Transaction with ID ${transactionId} not found`);
    }

    if (
      transaction.senderUserId !== currentUserId &&
      transaction.receiverUserId !== currentUserId
    ) {
      this.logger.warn(
        { transactionId, currentUserId },
        'Access denied: ownership validation failed',
      );
      throw new NotFoundException(`Transaction with ID ${transactionId} not found`);
    }

    this.logger.log({ transactionId, currentUserId }, 'Transaction found');

    return transaction;
  }
}
