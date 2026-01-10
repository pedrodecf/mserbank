import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from '@prisma/client';
import { CACHE_PREFIXES } from '../../../common/constants/cache.constants';
import { RedisService } from '../../../infrastructure/cache/redis.service';
import { FindOneUserRepository } from '../repositories/findOneUser.repository';

@Injectable()
export class FindOneUserService {
  constructor(
    private readonly findOneUserRepository: FindOneUserRepository,
    private readonly redisService: RedisService,
  ) {}

  async execute(userId: string) {
    const cacheKey = `${CACHE_PREFIXES.USER}:${userId}`;

    const cachedUser = await this.redisService.get<User>(cacheKey);

    if (cachedUser) {
      return cachedUser;
    }

    const user = await this.findOneUserRepository.execute(userId);

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    await this.redisService.set(cacheKey, user);

    return user;
  }
}
