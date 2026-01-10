import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';
import { QUEUES } from './common/constants/messaging.constants';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

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

  console.info(`Transactions service running on port ${port}`);
  console.info(`Transactions microservice consuming from queue: ${QUEUES.TRANSACTIONS}`);
}

void bootstrap();
