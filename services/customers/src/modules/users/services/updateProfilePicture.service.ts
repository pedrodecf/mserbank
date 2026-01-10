import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CACHE_PREFIXES } from '../../../common/constants/cache.constants';
import { RedisService } from '../../../infrastructure/cache/redis.service';
import { UpdateProfilePictureDTO } from '../dto/updateProfilePicture.dto';
import { FindOneUserRepository } from '../repositories/findOneUser.repository';
import { UpdateProfilePictureRepository } from '../repositories/updateProfilePicture.repository';

@Injectable()
export class UpdateProfilePictureService {
  private readonly logger = new Logger(UpdateProfilePictureService.name);

  constructor(
    private readonly findOneUserRepository: FindOneUserRepository,
    private readonly updateProfilePictureRepository: UpdateProfilePictureRepository,
    private readonly redisService: RedisService,
  ) {}

  async execute(userId: string, data: UpdateProfilePictureDTO) {
    this.logger.debug({ userId }, 'Attempting to update profile picture');

    const user = await this.findOneUserRepository.execute(userId);

    if (!user) {
      this.logger.warn({ userId }, 'User not found');
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    const updatedUser = await this.updateProfilePictureRepository.execute(
      userId,
      data.profilePicture,
    );

    this.logger.log({ userId }, 'Profile picture updated');

    await this.redisService.del(`${CACHE_PREFIXES.USER}:${userId}`);

    this.logger.log({ userId }, 'Profile picture updated and cache deleted');

    return updatedUser;
  }
}
