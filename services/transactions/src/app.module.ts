import { Module } from '@nestjs/common';
import { AuthModule } from './infrastructure/auth/auth.module';
import { DatabaseModule } from './infrastructure/database/database.module';
import { MessagingModule } from './infrastructure/messaging/messaging.module';
import { TransactionsModule } from './modules/transactions/transactions.module';

@Module({
  imports: [DatabaseModule, MessagingModule, AuthModule, TransactionsModule],
})
export class AppModule {}
