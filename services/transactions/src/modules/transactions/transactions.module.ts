import { Module } from '@nestjs/common';
import { MessagingModule } from '../../infrastructure/messaging/messaging.module';
import { CompletedTransactionsRequestedConsumer } from './consumers/completedTransactionsRequested.consumer';
import { TransactionValidationConsumer } from './consumers/transactionValidation.consumer';
import { CreateTransactionController } from './controllers/createTransaction.controller';
import { FindOneTransactionController } from './controllers/findOneTransaction.controller';
import { FindTransactionsByUserController } from './controllers/findTransactionsByUser.controller';
import { CompletedTransactionsResponseProducer } from './producers/completedTransactionsResponse.producer';
import { TransactionCreatedProducer } from './producers/transactionCreated.producer';
import { FindCompletedTransactionsByUserRepository } from './repositories/findCompletedTransactionsByUser.repository';
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
    CompletedTransactionsRequestedConsumer,
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
    CompletedTransactionsResponseProducer,
    FindCompletedTransactionsByUserRepository,
  ],
  exports: [CreateTransactionService, FindOneTransactionService, FindTransactionsByUserService],
})
export class TransactionsModule {}
