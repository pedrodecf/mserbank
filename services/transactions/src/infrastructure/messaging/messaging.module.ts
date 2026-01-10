import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { QUEUES, RABBITMQ_CLIENT } from '../../common/constants/messaging.constants';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: RABBITMQ_CLIENT,
        transport: Transport.RMQ,
        options: {
          urls: [process.env.RABBITMQ_URL || 'amqp://mserbank:mserbank123@localhost:5672'],
          queue: QUEUES.CUSTOMERS,
          queueOptions: {
            durable: true,
          },
        },
      },
    ]),
  ],
  exports: [ClientsModule],
})
export class MessagingModule {}
