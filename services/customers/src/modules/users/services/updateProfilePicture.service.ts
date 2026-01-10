import { Injectable, NotFoundException } from '@nestjs/common';
import { CACHE_PREFIXES } from '../../../common/constants/cache.constants';
import { RedisService } from '../../../infrastructure/cache/redis.service';
import { UpdateProfilePictureDTO } from '../dto/updateProfilePicture.dto';
import { FindOneUserRepository } from '../repositories/findOneUser.repository';
import { UpdateProfilePictureRepository } from '../repositories/updateProfilePicture.repository';

@Injectable()
export class UpdateProfilePictureService {
  constructor(
    private readonly findOneUserRepository: FindOneUserRepository,
    private readonly updateProfilePictureRepository: UpdateProfilePictureRepository,
    private readonly redisService: RedisService,
  ) {}

  async execute(userId: string, data: UpdateProfilePictureDTO) {
    const user = await this.findOneUserRepository.execute(userId);

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    const updatedUser = await this.updateProfilePictureRepository.execute(
      userId,
      data.profilePicture,
    );

    await this.redisService.del(`${CACHE_PREFIXES.USER}:${userId}`);

    return updatedUser;
  }
}
