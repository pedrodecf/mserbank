import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { EVENTS, RABBITMQ_CLIENT } from '../../../common/constants/messaging.constants';
import { TransactionCreatedEventDTO } from '../dto/events/transactionCreatedEvent.dto';

@Injectable()
export class TransactionCreatedProducer {
  constructor(@Inject(RABBITMQ_CLIENT) private readonly client: ClientProxy) {}

  emit(payload: TransactionCreatedEventDTO) {
    this.client.emit(EVENTS.TRANSACTION_CREATED, payload);
  }
}
