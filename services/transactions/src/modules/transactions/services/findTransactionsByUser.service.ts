import { Injectable } from '@nestjs/common';
import { FindTransactionsByUserRepository } from '../repositories/findTransactionsByUser.repository';

@Injectable()
export class FindTransactionsByUserService {
  constructor(
    private readonly findTransactionsByUserRepository: FindTransactionsByUserRepository,
  ) {}

  async execute(userId: string) {
    return this.findTransactionsByUserRepository.execute(userId);
  }
}
