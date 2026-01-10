import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { User } from '@prisma/client';
import { CACHE_PREFIXES } from '../../../common/constants/cache.constants';
import { RedisService } from '../../../infrastructure/cache/redis.service';
import { FindOneUserRepository } from '../repositories/findOneUser.repository';

@Injectable()
export class FindOneUserService {
  private readonly logger = new Logger(FindOneUserService.name);

  constructor(
    private readonly findOneUserRepository: FindOneUserRepository,
    private readonly redisService: RedisService,
  ) {}

  async execute(userId: string) {
    this.logger.debug({ userId }, 'Attempting to find one user');

    const cacheKey = `${CACHE_PREFIXES.USER}:${userId}`;

    const cachedUser = await this.redisService.get<User>(cacheKey);

    if (cachedUser) {
      this.logger.log({ userId }, 'User found in cache');
      return cachedUser;
    }

    const user = await this.findOneUserRepository.execute(userId);

    if (!user) {
      this.logger.warn({ userId }, 'User not found');
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    await this.redisService.set(cacheKey, user);

    this.logger.log({ userId }, 'User found and cached');

    return user;
  }
}
