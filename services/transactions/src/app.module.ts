import { Module } from '@nestjs/common';
import { LoggerModule } from 'nestjs-pino';
import { AuthModule } from './infrastructure/auth/auth.module';
import { DatabaseModule } from './infrastructure/database/database.module';
import { MessagingModule } from './infrastructure/messaging/messaging.module';
import { TransactionsModule } from './modules/transactions/transactions.module';

@Module({
  imports: [
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
    DatabaseModule,
    MessagingModule,
    AuthModule,
    TransactionsModule,
  ],
})
export class AppModule {}
