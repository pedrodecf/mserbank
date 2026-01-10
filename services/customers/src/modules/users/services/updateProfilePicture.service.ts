import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateProfilePictureDTO } from '../dto/updateProfilePicture.dto';
import { FindOneUserRepository } from '../repositories/findOneUser.repository';
import { UpdateProfilePictureRepository } from '../repositories/updateProfilePicture.repository';

@Injectable()
export class UpdateProfilePictureService {
  constructor(
    private readonly findOneUserRepository: FindOneUserRepository,
    private readonly updateProfilePictureRepository: UpdateProfilePictureRepository,
  ) {}

  async execute(userId: string, data: UpdateProfilePictureDTO) {
    const user = await this.findOneUserRepository.execute(userId);

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    return this.updateProfilePictureRepository.execute(userId, data.profilePicture);
  }
}
