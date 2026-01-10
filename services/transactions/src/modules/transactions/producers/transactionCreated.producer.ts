import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { EVENTS, RABBITMQ_CLIENT } from '../../../common/constants/messaging.constants';

interface TransactionCreatedPayload {
  transactionId: string;
  senderUserId: string;
  receiverUserId: string;
  amount: number;
  description?: string;
}

@Injectable()
export class TransactionCreatedProducer {
  constructor(@Inject(RABBITMQ_CLIENT) private readonly client: ClientProxy) {}

  emit(payload: TransactionCreatedPayload) {
    this.client.emit(EVENTS.TRANSACTION_CREATED, payload);
  }
}
