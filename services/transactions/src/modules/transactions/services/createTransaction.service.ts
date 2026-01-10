import { BadRequestException, ForbiddenException, Injectable, Logger } from '@nestjs/common';
import { CreateTransactionDTO } from '../dto/createTransaction.dto';
import { TransactionCreatedProducer } from '../producers/transactionCreated.producer';
import { CreateTransactionRepository } from '../repositories/createTransaction.repository';

@Injectable()
export class CreateTransactionService {
  private readonly logger = new Logger(CreateTransactionService.name);

  constructor(
    private readonly createTransactionRepository: CreateTransactionRepository,
    private readonly transactionCreatedProducer: TransactionCreatedProducer,
  ) {}

  async execute(data: CreateTransactionDTO, currentUserId: string) {
    this.logger.debug(
      { senderUserId: data.senderUserId, receiverUserId: data.receiverUserId, amount: data.amount },
      'Attempting to create transaction',
    );

    if (data.senderUserId === data.receiverUserId) {
      this.logger.warn(
        { senderUserId: data.senderUserId },
        'Transaction creation failed: sender and receiver are the same',
      );
      throw new BadRequestException('Sender and receiver cannot be the same user');
    }

    if (data.senderUserId !== currentUserId) {
      this.logger.warn(
        { senderUserId: data.senderUserId, currentUserId },
        'Transaction creation failed: ownership validation',
      );
      throw new ForbiddenException('You can only create transactions as yourself');
    }

    const transaction = await this.createTransactionRepository.execute(data);

    this.logger.log(
      {
        transactionId: transaction.id,
        senderUserId: transaction.senderUserId,
        receiverUserId: transaction.receiverUserId,
        amount: transaction.amount,
      },
      'Transaction created successfully',
    );

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
