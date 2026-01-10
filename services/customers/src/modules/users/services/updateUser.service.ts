import { Injectable, NotFoundException } from '@nestjs/common';
import { FindOneUserController } from '../controllers/findOneUser.controller';
import { UpdateUserDTO } from '../dto/updateUser.dto';
import { UpdateUserRepository } from '../repositories/updateUser.repository';

@Injectable()
export class UpdateUserService {
  constructor(
    private readonly updateUserRepository: UpdateUserRepository,
    private readonly findOneUserRepository: FindOneUserController,
  ) {}

  async execute(userId: string, data: UpdateUserDTO) {
    const user = await this.findOneUserRepository.execute(userId);

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    return this.updateUserRepository.execute(userId, data);
  }
}
