import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../infrastructure/database/prisma.service';
import { UpdateUserDTO } from '../dto/updateUser.dto';

@Injectable()
export class UpdateUserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async execute(userId: string, data: UpdateUserDTO) {
    const { bankingDetails, ...userData } = data;

    return this.prisma.user.update({
      where: { id: userId },
      data: {
        ...userData,
        ...(bankingDetails && {
          bankingDetails: {
            upsert: {
              create: bankingDetails,
              update: bankingDetails,
            },
          },
        }),
      },
    });
  }
}
