import { Injectable, NotFoundException } from '@nestjs/common';
import { FindOneUserRepository } from '../repositories/findOneUser.repository';

@Injectable()
export class FindOneUserService {
  constructor(private readonly findOneUserRepository: FindOneUserRepository) {}

  async execute(userId: string) {
    const user = await this.findOneUserRepository.execute(userId);

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    return user;
  }
}
