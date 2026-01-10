import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateTransactionDTO } from '../dto/createTransaction.dto';
import { CreateTransactionRepository } from '../repositories/createTransaction.repository';

@Injectable()
export class CreateTransactionService {
  constructor(private readonly createTransactionRepository: CreateTransactionRepository) {}

  async execute(data: CreateTransactionDTO) {
    if (data.senderUserId === data.receiverUserId) {
      throw new BadRequestException('Sender and receiver cannot be the same user');
    }

    return this.createTransactionRepository.execute(data);
  }
}
