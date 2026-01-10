import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../infrastructure/database/prisma.service';

@Injectable()
export class CreatePasswordRepository {
  constructor(private readonly prisma: PrismaService) {}

  async execute(userId: string, hash: string) {
    return this.prisma.usersPassword.create({
      data: { id: userId, hash },
    });
  }
}
