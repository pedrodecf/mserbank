import { Module } from '@nestjs/common';
import { CreateTransactionController } from './controllers/createTransaction.controller';
import { FindOneTransactionController } from './controllers/findOneTransaction.controller';
import { FindTransactionsByUserController } from './controllers/findTransactionsByUser.controller';
import { CreateTransactionRepository } from './repositories/createTransaction.repository';
import { FindOneTransactionRepository } from './repositories/findOneTransaction.repository';
import { FindTransactionsByUserRepository } from './repositories/findTransactionsByUser.repository';
import { CreateTransactionService } from './services/createTransaction.service';
import { FindOneTransactionService } from './services/findOneTransaction.service';
import { FindTransactionsByUserService } from './services/findTransactionsByUser.service';

@Module({
  controllers: [
    CreateTransactionController,
    FindOneTransactionController,
    FindTransactionsByUserController,
  ],
  providers: [
    CreateTransactionService,
    CreateTransactionRepository,
    FindOneTransactionService,
    FindOneTransactionRepository,
    FindTransactionsByUserService,
    FindTransactionsByUserRepository,
  ],
  exports: [CreateTransactionService, FindOneTransactionService, FindTransactionsByUserService],
})
export class TransactionsModule {}
