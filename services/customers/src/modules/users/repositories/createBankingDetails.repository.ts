import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../infrastructure/database/prisma.service';
import { BankingDetailsDTO } from '../dto/bankingDetails.dto';

@Injectable()
export class CreateBankingDetailsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async execute(userId: string, data: BankingDetailsDTO) {
    return this.prisma.bankingDetails.create({
      data: {
        user: { connect: { id: userId } },
        agency: data.agency,
        accountNumber: data.accountNumber,
      },
    });
  }
}
