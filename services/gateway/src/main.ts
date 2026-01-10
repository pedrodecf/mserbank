import { NestFactory } from '@nestjs/core';
import { Logger } from 'nestjs-pino';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });

  app.useLogger(app.get(Logger));

  const port = process.env.PORT ?? 3000;
  await app.listen(port);

  const logger = app.get(Logger);
  logger.log(`API Gateway running on port ${port}`);
  logger.log(`Customers service: ${process.env.CUSTOMERS_SERVICE_URL || 'http://localhost:3001'}`);
  logger.log(
    `Transactions service: ${process.env.TRANSACTIONS_SERVICE_URL || 'http://localhost:3002'}`,
  );
}

void bootstrap();
