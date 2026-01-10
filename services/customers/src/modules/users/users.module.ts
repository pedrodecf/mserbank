import { Module } from '@nestjs/common';
import { MessagingModule } from '../../infrastructure/messaging/messaging.module';
import { TransactionCreatedConsumer } from './consumers/transactionCreated.consumer';
import { FindOneUserController } from './controllers/findOneUser.controller';
import { LoginController } from './controllers/login.controller';
import { UpdateProfilePictureController } from './controllers/updateProfilePicture.controller';
import { UpdateUserController } from './controllers/updateUser.controller';
import { TransactionValidationProducer } from './producers/transactionValidation.producer';
import { FindOneUserRepository } from './repositories/findOneUser.repository';
import { FindPasswordByUserIdRepository } from './repositories/findPasswordByUserId.repository';
import { FindUserByEmailRepository } from './repositories/findUserByEmail.repository';
import { UpdateProfilePictureRepository } from './repositories/updateProfilePicture.repository';
import { UpdateUserRepository } from './repositories/updateUser.repository';
import { FindOneUserService } from './services/findOneUser.service';
import { LoginService } from './services/login.service';
import { UpdateProfilePictureService } from './services/updateProfilePicture.service';
import { UpdateUserService } from './services/updateUser.service';

@Module({
  imports: [MessagingModule],
  controllers: [
    FindOneUserController,
    UpdateUserController,
    UpdateProfilePictureController,
    TransactionCreatedConsumer,
    LoginController,
  ],
  providers: [
    FindOneUserService,
    FindOneUserRepository,
    UpdateUserService,
    UpdateUserRepository,
    UpdateProfilePictureService,
    UpdateProfilePictureRepository,
    TransactionValidationProducer,
    LoginService,
    FindUserByEmailRepository,
    FindPasswordByUserIdRepository,
  ],
  exports: [FindOneUserService, UpdateUserService, UpdateProfilePictureService],
})
export class UsersModule {}
