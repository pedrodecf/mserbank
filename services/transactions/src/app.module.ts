import { Module } from '@nestjs/common';
import { DatabaseModule } from './infrastructure/database/database.module';
import { TransactionsModule } from './modules/transactions/transactions.module';

@Module({
  imports: [DatabaseModule, TransactionsModule],
})
export class AppModule {}
