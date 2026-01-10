import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { JwtPayload } from '../../../infrastructure/auth/jwt.strategy';
import { LoginDTO } from '../../users/dto/login.dto';
import { FindPasswordByUserIdRepository } from '../repositories/findPasswordByUserId.repository';
import { FindUserByEmailRepository } from '../repositories/findUserByEmail.repository';

@Injectable()
export class LoginService {
  constructor(
    private readonly findUserByEmailRepository: FindUserByEmailRepository,
    private readonly findPasswordByUserIdRepository: FindPasswordByUserIdRepository,
    private readonly jwtService: JwtService,
  ) {}

  async execute(data: LoginDTO) {
    const user = await this.findUserByEmailRepository.execute(data.email);

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const userPassword = await this.findPasswordByUserIdRepository.execute(user.id);

    if (!userPassword) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const isPasswordValid = await bcrypt.compare(data.password, userPassword.hash);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
    };

    const accessToken = this.jwtService.sign(payload);

    return {
      accessToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    };
  }
}
