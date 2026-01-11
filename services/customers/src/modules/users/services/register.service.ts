import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { createHash } from 'node:crypto';
import { RegisterDTO } from '../dto/register.dto';
import { CreateBankingDetailsRepository } from '../repositories/createBankingDetails.repository';
import { CreatePasswordRepository } from '../repositories/createPassword.repository';
import { CreateUserRepository } from '../repositories/createUser.repository';
import { FindUserByEmailRepository } from '../repositories/findUserByEmail.repository';

@Injectable()
export class RegisterService {
  private readonly logger = new Logger(RegisterService.name);

  constructor(
    private readonly createUserRepository: CreateUserRepository,
    private readonly createPasswordRepository: CreatePasswordRepository,
    private readonly findUserByEmailRepository: FindUserByEmailRepository,
    private readonly createBankingDetailsRepository: CreateBankingDetailsRepository,
  ) {}

  async execute(data: RegisterDTO) {
    this.logger.debug({ email: data.email }, 'Attempting user registration');

    const userAlreadyExists = await this.findUserByEmailRepository.execute(data.email);

    if (userAlreadyExists) {
      this.logger.warn({ email: data.email }, 'Registration failed: email already in use');
      throw new BadRequestException('Email already in use');
    }

    const user = await this.createUserRepository.execute(data.name, data.email);

    this.logger.log({ userId: user.id, email: user.email }, 'User created successfully');

    const hashedPassword = await bcrypt.hash(data.password, 10);

    await this.createPasswordRepository.execute(user.id, hashedPassword);

    this.logger.log({ userId: user.id, email: user.email }, 'Password created successfully');

    await this.createBankingDetailsRepository.execute(user.id, {
      agency: this.generateAgencyFromUserId(user.id),
      accountNumber: this.generateAccountFromUserId(user.id),
    });

    this.logger.log({ userId: user.id, email: user.email }, 'Banking details created successfully');

    this.logger.log({ userId: user.id, email: user.email }, 'User totally registered successfully');

    return {
      message: 'User created successfully',
    };
  }

  private generateAccountFromUserId(userId: string): string {
    return createHash('sha256').update(userId).digest('hex').replace(/\D/g, '').slice(0, 10);
  }

  private generateAgencyFromUserId(userId: string): string {
    return createHash('md5').update(userId).digest('hex').replace(/\D/g, '').slice(0, 4);
  }
}
