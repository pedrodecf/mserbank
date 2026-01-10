import { Module } from '@nestjs/common';
import { FindOneUserController } from './controllers/findOneUser.controller';
import { UpdateProfilePictureController } from './controllers/updateProfilePicture.controller';
import { UpdateUserController } from './controllers/updateUser.controller';
import { FindOneUserRepository } from './repositories/findOneUser.repository';
import { UpdateProfilePictureRepository } from './repositories/updateProfilePicture.repository';
import { UpdateUserRepository } from './repositories/updateUser.repository';
import { FindOneUserService } from './services/findOneUser.service';
import { UpdateProfilePictureService } from './services/updateProfilePicture.service';
import { UpdateUserService } from './services/updateUser.service';

@Module({
  controllers: [FindOneUserController, UpdateUserController, UpdateProfilePictureController],
  providers: [
    FindOneUserService,
    FindOneUserRepository,
    UpdateUserService,
    UpdateUserRepository,
    UpdateProfilePictureService,
    UpdateProfilePictureRepository,
  ],
  exports: [FindOneUserService, UpdateUserService, UpdateProfilePictureService],
})
export class UsersModule {}
