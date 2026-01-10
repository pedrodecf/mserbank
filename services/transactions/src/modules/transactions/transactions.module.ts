import { Module } from '@nestjs/common';
import { CreateTransactionController } from './controllers/createTransaction.controller';
import { CreateTransactionRepository } from './repositories/createTransaction.repository';
import { CreateTransactionService } from './services/createTransaction.service';

@Module({
  controllers: [CreateTransactionController],
  providers: [CreateTransactionService, CreateTransactionRepository],
  exports: [CreateTransactionService],
})
export class TransactionsModule {}
