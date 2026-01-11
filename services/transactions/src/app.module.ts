import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { LoggerModule } from 'nestjs-pino';
import { AuthModule } from './infrastructure/auth/auth.module';
import { DatabaseModule } from './infrastructure/database/database.module';
import { MessagingModule } from './infrastructure/messaging/messaging.module';
import { TransactionsModule } from './modules/transactions/transactions.module';
import { envSchema } from './infrastructure/env/env';
import { EnvModule } from './infrastructure/env/env.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      validate: (env) => envSchema.parse(env),
    }),
    LoggerModule.forRoot({
      pinoHttp: {
        level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
        serializers: {
          req(req) {
            return {
              method: req.method,
              url: req.url,
              id: req.id,
            };
          },
          res(res) {
            return {
              statusCode: res.statusCode,
            };
          },
          err(err) {
            return {
              type: err.type,
              message: err.message,
              stack: process.env.NODE_ENV === 'production' ? undefined : err.stack,
            };
          },
        },
        customLogLevel: (req, res, err) => {
          if (res.statusCode >= 500 || err) return 'error';
          if (res.statusCode >= 400) return 'warn';
          return 'info';
        },
        autoLogging: {
          ignore: (req) => req.url === '/health',
        },
        formatters: {
          level(label) {
            return { level: label };
          },
        },
        transport:
          process.env.NODE_ENV !== 'production'
            ? {
                target: 'pino-pretty',
                options: {
                  colorize: true,
                  singleLine: true,
                  translateTime: 'SYS:standard',
                  ignore: 'pid,hostname',
                },
              }
            : undefined,
      },
    }),
    EnvModule,
    DatabaseModule,
    MessagingModule,
    AuthModule,
    TransactionsModule,
  ],
})
export class AppModule {}
