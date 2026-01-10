import { Module } from '@nestjs/common';
import { FindOneUserController } from './controllers/findOneUser.controller';
import { UsersController } from './controllers/users.controller';
import { FindOneUserRepository } from './repositories/findOneUser.repository';
import { UsersRepository } from './repositories/users.repository';
import { FindOneUserService } from './services/findOneUser.service';
import { UsersService } from './services/users.service';

@Module({
  controllers: [FindOneUserController, UsersController],
  providers: [FindOneUserService, FindOneUserRepository, UsersService, UsersRepository],
  exports: [FindOneUserService, UsersService],
})
export class UsersModule {}
