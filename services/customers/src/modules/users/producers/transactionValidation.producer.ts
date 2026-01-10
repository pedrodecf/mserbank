import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { EVENTS, RABBITMQ_CLIENT } from '../../../common/constants/messaging.constants';
import { TransactionRejectedEventDTO } from '../dto/events/transactionRejectedEvent.dto';
import { TransactionValidatedEventDTO } from '../dto/events/transactionValidatedEvent.dto';

@Injectable()
export class TransactionValidationProducer {
  constructor(@Inject(RABBITMQ_CLIENT) private readonly client: ClientProxy) {}

  emitValidated({ transactionId }: TransactionValidatedEventDTO) {
    this.client.emit(EVENTS.TRANSACTION_VALIDATED, { transactionId });
  }

  emitRejected({ transactionId, reason }: TransactionRejectedEventDTO) {
    this.client.emit(EVENTS.TRANSACTION_REJECTED, { transactionId, reason });
  }
}
