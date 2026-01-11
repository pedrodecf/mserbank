import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Logger } from 'nestjs-pino';
import { AppModule } from './app.module';
import { QUEUES } from './common/constants/messaging.constants';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { EnvService } from './infrastructure/env/env.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });

  app.useLogger(app.get(Logger));

  app.useGlobalFilters(new HttpExceptionFilter());

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

  app.getHttpAdapter().get('/health', (req, res) => {
    res.status(200).json({ status: 'ok' });
  });

  const config = new DocumentBuilder()
    .setTitle('MSERBank Transactions API')
    .setDescription('API for transaction management in MSERBank')
    .setVersion('1.0')
    .addTag('transactions', 'Transaction-related operations')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Enter JWT token',
      },
      'access-token',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  await app.startAllMicroservices();

  const envService = app.get(EnvService);

  const port = envService.get('PORT');

  await app.listen(port);

  const logger = app.get(Logger);
  logger.log(`Transactions service running on port ${port}`);
  logger.log(`Transactions microservice consuming from queue: ${QUEUES.TRANSACTIONS}`);
  logger.log(`Swagger documentation available at http://localhost:${port}/api/docs`);
}

void bootstrap();
