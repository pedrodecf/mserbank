import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { EVENTS, RABBITMQ_CLIENT } from '../../../common/constants/messaging.constants';
import { CompletedTransactionsResponseEventDTO } from '../dto/events/completedTransactionsResponseEvent.dto';

@Injectable()
export class CompletedTransactionsResponseProducer {
  private readonly logger = new Logger(CompletedTransactionsResponseProducer.name);

  constructor(@Inject(RABBITMQ_CLIENT) private readonly client: ClientProxy) {}

  emit(payload: CompletedTransactionsResponseEventDTO) {
    this.client.emit(EVENTS.COMPLETED_TRANSACTIONS_RESPONSE, payload);
    this.logger.debug(
      {
        correlationId: payload.correlationId,
        userId: payload.userId,
        transactionCount: payload.transactions.length,
      },
      'Sent completed transactions response',
    );
  }
}
