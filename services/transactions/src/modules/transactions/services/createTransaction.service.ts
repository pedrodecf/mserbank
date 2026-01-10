import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateTransactionDTO } from '../dto/createTransaction.dto';
import { TransactionCreatedProducer } from '../producers/transactionCreated.producer';
import { CreateTransactionRepository } from '../repositories/createTransaction.repository';

@Injectable()
export class CreateTransactionService {
  constructor(
    private readonly createTransactionRepository: CreateTransactionRepository,
    private readonly transactionCreatedProducer: TransactionCreatedProducer,
  ) {}

  async execute(data: CreateTransactionDTO) {
    if (data.senderUserId === data.receiverUserId) {
      throw new BadRequestException('Sender and receiver cannot be the same user');
    }

    const transaction = await this.createTransactionRepository.execute(data);

    this.transactionCreatedProducer.emit({
      transactionId: transaction.id,
      senderUserId: transaction.senderUserId,
      receiverUserId: transaction.receiverUserId,
      amount: transaction.amount,
      description: transaction.description ?? undefined,
    });

    return transaction;
  }
}
