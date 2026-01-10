import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { EVENTS, RABBITMQ_CLIENT } from '../../../common/constants/messaging.constants';

@Injectable()
export class TransactionValidationProducer {
  constructor(@Inject(RABBITMQ_CLIENT) private readonly client: ClientProxy) {}

  emitValidated(transactionId: string) {
    this.client.emit(EVENTS.TRANSACTION_VALIDATED, { transactionId });
  }

  emitRejected(transactionId: string, reason: string) {
    this.client.emit(EVENTS.TRANSACTION_REJECTED, { transactionId, reason });
  }
}
