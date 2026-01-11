import { Module } from '@nestjs/common';
import { AuthModule } from '../../infrastructure/auth/auth.module';
import { MessagingModule } from '../../infrastructure/messaging/messaging.module';
import { CompletedTransactionsResponseConsumer } from './consumers/completedTransactionsResponse.consumer';
import { TransactionCreatedConsumer } from './consumers/transactionCreated.consumer';
import { FindOneUserController } from './controllers/findOneUser.controller';
import { GetUserBalanceController } from './controllers/getUserBalance.controller';
import { LoginController } from './controllers/login.controller';
import { RegisterController } from './controllers/register.controller';
import { UpdateProfilePictureController } from './controllers/updateProfilePicture.controller';
import { UpdateUserController } from './controllers/updateUser.controller';
import { CompletedTransactionsRequestedProducer } from './producers/completedTransactionsRequested.producer';
import { TransactionValidationProducer } from './producers/transactionValidation.producer';
import { CreateBankingDetailsRepository } from './repositories/createBankingDetails.repository';
import { CreatePasswordRepository } from './repositories/createPassword.repository';
import { CreateUserRepository } from './repositories/createUser.repository';
import { FindOneUserRepository } from './repositories/findOneUser.repository';
import { FindPasswordByUserIdRepository } from './repositories/findPasswordByUserId.repository';
import { FindUserByEmailRepository } from './repositories/findUserByEmail.repository';
import { UpdateProfilePictureRepository } from './repositories/updateProfilePicture.repository';
import { UpdateUserRepository } from './repositories/updateUser.repository';
import { FindOneUserService } from './services/findOneUser.service';
import { GetUserBalanceService } from './services/getUserBalance.service';
import { LoginService } from './services/login.service';
import { RegisterService } from './services/register.service';
import { UpdateProfilePictureService } from './services/updateProfilePicture.service';
import { UpdateUserService } from './services/updateUser.service';

@Module({
  imports: [MessagingModule, AuthModule],
  controllers: [
    FindOneUserController,
    UpdateUserController,
    UpdateProfilePictureController,
    TransactionCreatedConsumer,
    CompletedTransactionsResponseConsumer,
    LoginController,
    RegisterController,
    GetUserBalanceController,
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
    RegisterService,
    CreateUserRepository,
    CreatePasswordRepository,
    CreateBankingDetailsRepository,
    GetUserBalanceService,
    CompletedTransactionsRequestedProducer,
  ],
  exports: [FindOneUserService, UpdateUserService, UpdateProfilePictureService],
})
export class UsersModule {}
