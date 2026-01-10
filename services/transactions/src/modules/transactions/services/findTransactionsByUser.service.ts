import { Injectable, Logger } from '@nestjs/common';
import { FindTransactionsByUserRepository } from '../repositories/findTransactionsByUser.repository';

@Injectable()
export class FindTransactionsByUserService {
  private readonly logger = new Logger(FindTransactionsByUserService.name);

  constructor(
    private readonly findTransactionsByUserRepository: FindTransactionsByUserRepository,
  ) {}

  async execute(userId: string) {
    this.logger.debug({ userId }, 'Attempting to find transactions by user');

    const transactions = await this.findTransactionsByUserRepository.execute(userId);

    if (transactions.length === 0) {
      this.logger.warn({ userId }, 'No transactions found');
      return [];
    }

    this.logger.log({ userId }, 'Transactions found');

    return transactions;
  }
}
