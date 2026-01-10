import { Module } from '@nestjs/common';
import { AuthModule } from './infrastructure/auth/auth.module';
import { CacheModule } from './infrastructure/cache/cache.module';
import { DatabaseModule } from './infrastructure/database/database.module';
import { MessagingModule } from './infrastructure/messaging/messaging.module';
import { UsersModule } from './modules/users/users.module';

@Module({
  imports: [DatabaseModule, CacheModule, MessagingModule, AuthModule, UsersModule],
})
export class AppModule {}
