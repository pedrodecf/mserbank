import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../infrastructure/database/prisma.service';
import { CreateTransactionDTO } from '../dto/createTransaction.dto';

@Injectable()
export class CreateTransactionRepository {
  constructor(private readonly prisma: PrismaService) {}

  async execute(data: CreateTransactionDTO) {
    return this.prisma.transaction.create({
      data: {
        senderUserId: data.senderUserId,
        receiverUserId: data.receiverUserId,
        amount: data.amount,
        description: data.description,
      },
    });
  }
}
