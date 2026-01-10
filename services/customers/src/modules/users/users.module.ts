import { Module } from '@nestjs/common';
import { FindOneUserController } from './controllers/findOneUser.controller';
import { UpdateUserController } from './controllers/updateUser.controller';
import { UsersController } from './controllers/users.controller';
import { FindOneUserRepository } from './repositories/findOneUser.repository';
import { UpdateUserRepository } from './repositories/updateUser.repository';
import { UsersRepository } from './repositories/users.repository';
import { FindOneUserService } from './services/findOneUser.service';
import { UpdateUserService } from './services/updateUser.service';
import { UsersService } from './services/users.service';

@Module({
  controllers: [FindOneUserController, UpdateUserController, UsersController],
  providers: [
    FindOneUserService,
    FindOneUserRepository,
    UpdateUserService,
    UpdateUserRepository,
    UsersService,
    UsersRepository,
  ],
  exports: [FindOneUserService, UpdateUserService, UsersService],
})
export class UsersModule {}
