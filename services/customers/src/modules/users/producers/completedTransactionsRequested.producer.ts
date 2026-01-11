import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { EVENTS, RABBITMQ_CLIENT } from '../../../common/constants/messaging.constants';
import { CompletedTransactionsRequestedEventDTO } from '../dto/events/completedTransactionsRequestedEvent.dto';

@Injectable()
export class CompletedTransactionsRequestedProducer {
  private readonly logger = new Logger(CompletedTransactionsRequestedProducer.name);

  constructor(@Inject(RABBITMQ_CLIENT) private readonly client: ClientProxy) {}

  emit(payload: CompletedTransactionsRequestedEventDTO) {
    this.client.emit(EVENTS.COMPLETED_TRANSACTIONS_REQUESTED, payload);
    this.logger.debug(
      { correlationId: payload.correlationId, userId: payload.userId },
      'Requested completed transactions',
    );
  }
}
