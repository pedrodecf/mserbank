import { Module } from '@nestjs/common';
import { CacheModule } from './infrastructure/cache/cache.module';
import { DatabaseModule } from './infrastructure/database/database.module';
import { UsersModule } from './modules/users/users.module';

@Module({
  imports: [DatabaseModule, CacheModule, UsersModule],
})
export class AppModule {}
