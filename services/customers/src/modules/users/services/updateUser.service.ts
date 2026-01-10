import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CACHE_PREFIXES } from '../../../common/constants/cache.constants';
import { RedisService } from '../../../infrastructure/cache/redis.service';
import { UpdateUserDTO } from '../dto/updateUser.dto';
import { FindOneUserRepository } from '../repositories/findOneUser.repository';
import { UpdateUserRepository } from '../repositories/updateUser.repository';

@Injectable()
export class UpdateUserService {
  private readonly logger = new Logger(UpdateUserService.name);
  constructor(
    private readonly updateUserRepository: UpdateUserRepository,
    private readonly findOneUserRepository: FindOneUserRepository,
    private readonly redisService: RedisService,
  ) {}

  async execute(userId: string, data: UpdateUserDTO) {
    const user = await this.findOneUserRepository.execute(userId);
    this.logger.debug({ userId }, 'Attempting to update user');

    if (!user) {
      this.logger.warn({ userId }, 'User not found');
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    const updatedUser = await this.updateUserRepository.execute(userId, data);

    await this.redisService.del(`${CACHE_PREFIXES.USER}:${userId}`);

    this.logger.log({ userId }, 'User updated and cache deleted');

    return updatedUser;
  }
}
