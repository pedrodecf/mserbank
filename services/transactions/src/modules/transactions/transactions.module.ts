import { Module } from '@nestjs/common';
import { MessagingModule } from '../../infrastructure/messaging/messaging.module';
import { TransactionValidationConsumer } from './consumers/transactionValidation.consumer';
import { CreateTransactionController } from './controllers/createTransaction.controller';
import { FindOneTransactionController } from './controllers/findOneTransaction.controller';
import { FindTransactionsByUserController } from './controllers/findTransactionsByUser.controller';
import { TransactionCreatedProducer } from './producers/transactionCreated.producer';
import { CreateTransactionRepository } from './repositories/createTransaction.repository';
import { FindOneTransactionRepository } from './repositories/findOneTransaction.repository';
import { FindTransactionsByUserRepository } from './repositories/findTransactionsByUser.repository';
import { UpdateTransactionStatusRepository } from './repositories/updateTransactionStatus.repository';
import { CreateTransactionService } from './services/createTransaction.service';
import { FindOneTransactionService } from './services/findOneTransaction.service';
import { FindTransactionsByUserService } from './services/findTransactionsByUser.service';

@Module({
  imports: [MessagingModule],
  controllers: [
    CreateTransactionController,
    FindOneTransactionController,
    FindTransactionsByUserController,
    TransactionValidationConsumer,
  ],
  providers: [
    CreateTransactionService,
    CreateTransactionRepository,
    FindOneTransactionService,
    FindOneTransactionRepository,
    FindTransactionsByUserService,
    FindTransactionsByUserRepository,
    UpdateTransactionStatusRepository,
    TransactionCreatedProducer,
  ],
  exports: [CreateTransactionService, FindOneTransactionService, FindTransactionsByUserService],
})
export class TransactionsModule {}
