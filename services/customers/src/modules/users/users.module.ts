import { Module } from '@nestjs/common';
import { MessagingModule } from '../../infrastructure/messaging/messaging.module';
import { TransactionCreatedConsumer } from './consumers/transactionCreated.consumer';
import { FindOneUserController } from './controllers/findOneUser.controller';
import { LoginController } from './controllers/login.controller';
import { RegisterController } from './controllers/register.controller';
import { UpdateProfilePictureController } from './controllers/updateProfilePicture.controller';
import { UpdateUserController } from './controllers/updateUser.controller';
import { TransactionValidationProducer } from './producers/transactionValidation.producer';
import { CreatePasswordRepository } from './repositories/createPassword.repository';
import { CreateUserRepository } from './repositories/createUser.repository';
import { FindOneUserRepository } from './repositories/findOneUser.repository';
import { FindPasswordByUserIdRepository } from './repositories/findPasswordByUserId.repository';
import { FindUserByEmailRepository } from './repositories/findUserByEmail.repository';
import { UpdateProfilePictureRepository } from './repositories/updateProfilePicture.repository';
import { UpdateUserRepository } from './repositories/updateUser.repository';
import { FindOneUserService } from './services/findOneUser.service';
import { LoginService } from './services/login.service';
import { RegisterService } from './services/register.service';
import { UpdateProfilePictureService } from './services/updateProfilePicture.service';
import { UpdateUserService } from './services/updateUser.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [MessagingModule],
  controllers: [
    FindOneUserController,
    UpdateUserController,
    UpdateProfilePictureController,
    TransactionCreatedConsumer,
    LoginController,
    RegisterController,
  ],
  providers: [
    FindOneUserService,
    FindOneUserRepository,
    UpdateUserService,
    UpdateUserRepository,
    UpdateProfilePictureService,
    UpdateProfilePictureRepository,
    TransactionValidationProducer,
    JwtService,
    LoginService,
    FindUserByEmailRepository,
    FindPasswordByUserIdRepository,
    RegisterService,
    CreateUserRepository,
    CreatePasswordRepository,
  ],
  exports: [FindOneUserService, UpdateUserService, UpdateProfilePictureService],
})
export class UsersModule {}
