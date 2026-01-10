import { Injectable, NotFoundException } from '@nestjs/common';
import { FindOneTransactionRepository } from '../repositories/findOneTransaction.repository';

@Injectable()
export class FindOneTransactionService {
  constructor(private readonly findOneTransactionRepository: FindOneTransactionRepository) {}

  async execute(transactionId: string) {
    const transaction = await this.findOneTransactionRepository.execute(transactionId);

    if (!transaction) {
      throw new NotFoundException(`Transaction with ID ${transactionId} not found`);
    }

    return transaction;
  }
}
