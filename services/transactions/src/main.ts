import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { Logger } from 'nestjs-pino';
import { AppModule } from './app.module';
import { QUEUES } from './common/constants/messaging.constants';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });

  app.useLogger(app.get(Logger));

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [process.env.RABBITMQ_URL || 'amqp://mserbank:mserbank123@localhost:5672'],
      queue: QUEUES.TRANSACTIONS,
      queueOptions: {
        durable: true,
      },

      noAck: false,
    },
  });

  app.setGlobalPrefix('api');

  await app.startAllMicroservices();

  const port = process.env.PORT ?? 3002;
  await app.listen(port);

  const logger = app.get(Logger);
  logger.log(`Transactions service running on port ${port}`);
  logger.log(`Transactions microservice consuming from queue: ${QUEUES.TRANSACTIONS}`);
}

void bootstrap();
