import { Module } from '@nestjs/common';
import { CreateTransactionController } from './controllers/createTransaction.controller';
import { FindOneTransactionController } from './controllers/findOneTransaction.controller';
import { CreateTransactionRepository } from './repositories/createTransaction.repository';
import { FindOneTransactionRepository } from './repositories/findOneTransaction.repository';
import { CreateTransactionService } from './services/createTransaction.service';
import { FindOneTransactionService } from './services/findOneTransaction.service';

@Module({
  controllers: [CreateTransactionController, FindOneTransactionController],
  providers: [
    CreateTransactionService,
    CreateTransactionRepository,
    FindOneTransactionService,
    FindOneTransactionRepository,
  ],
  exports: [CreateTransactionService, FindOneTransactionService],
})
export class TransactionsModule {}
