import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { LoggerModule } from 'nestjs-pino';
import { AuthModule } from './infrastructure/auth/auth.module';
import { CacheModule } from './infrastructure/cache/cache.module';
import { DatabaseModule } from './infrastructure/database/database.module';
import { envSchema } from './infrastructure/env/env';
import { EnvModule } from './infrastructure/env/env.module';
import { MessagingModule } from './infrastructure/messaging/messaging.module';
import { UsersModule } from './modules/users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      validate: (env) => envSchema.parse(env),
    }),
    LoggerModule.forRoot({
      pinoHttp: {
        level: process.env.NODE_ENV !== 'production' ? 'debug' : 'info',
        transport:
          process.env.NODE_ENV !== 'production'
            ? {
                target: 'pino-pretty',
                options: {
                  colorize: true,
                  singleLine: false,
                  translateTime: 'SYS:standard',
                },
              }
            : undefined,
        customAttributeKeys: {
          req: 'request',
          res: 'response',
          err: 'error',
        },
        autoLogging: {
          ignore: (req) => req.url === '/health',
        },
      },
    }),
    EnvModule,
    DatabaseModule,
    CacheModule,
    MessagingModule,
    AuthModule,
    UsersModule,
  ],
})
export class AppModule {}
