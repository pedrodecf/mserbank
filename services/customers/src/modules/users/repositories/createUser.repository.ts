import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../infrastructure/database/prisma.service';

@Injectable()
export class CreateUserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async execute(name: string, email: string) {
    return this.prisma.user.create({
      data: { name, email },
    });
  }
}
