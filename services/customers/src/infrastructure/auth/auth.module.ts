import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule, JwtModuleOptions } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import type { StringValue } from 'ms';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      global: true,
      imports: [ConfigModule],
      useFactory: (configService: ConfigService): JwtModuleOptions => {
        const secret = configService.get<string>('JWT_SECRET', 'secret-key');
        const expiresIn = configService.get<string>('JWT_EXPIRES_IN', '1h') as StringValue;

        const finalSecret = secret && secret.trim() !== '' ? secret : 'secret-key';

        if (!finalSecret || finalSecret.trim() === '') {
          throw new Error('JWT_SECRET must have a value');
        }

        return {
          secret: finalSecret,
          signOptions: {
            expiresIn,
          },
        };
      },
      inject: [ConfigService],
    }),
  ],
  providers: [JwtStrategy],
  exports: [JwtModule, PassportModule],
})
export class AuthModule {}
