import { Controller, Logger } from '@nestjs/common';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import { TransactionStatus } from '@prisma/client';
import { Channel, ConsumeMessage } from 'amqplib';
import { EVENTS } from '../../../common/constants/messaging.constants';
import { TransactionRejectedEventDTO } from '../dto/events/transactionRejectedEvent.dto';
import { TransactionValidatedEventDTO } from '../dto/events/transactionValidatedEvent.dto';
import { UpdateTransactionStatusRepository } from '../repositories/updateTransactionStatus.repository';

@Controller()
export class TransactionValidationConsumer {
  private readonly logger = new Logger(TransactionValidationConsumer.name);

  constructor(
    private readonly updateTransactionStatusRepository: UpdateTransactionStatusRepository,
  ) {}

  @EventPattern(EVENTS.TRANSACTION_VALIDATED)
  async handleTransactionValidated(
    @Payload() data: TransactionValidatedEventDTO,
    @Ctx() context: RmqContext,
  ) {
    const channel = context.getChannelRef() as Channel;
    const originalMsg = context.getMessage() as ConsumeMessage;

    try {
      await this.updateTransactionStatusRepository.execute(
        data.transactionId,
        TransactionStatus.COMPLETED,
      );
      channel.ack(originalMsg);
    } catch (error) {
      this.logger.error(
        { err: error, transactionId: data.transactionId, event: EVENTS.TRANSACTION_VALIDATED },
        'Error processing transaction validated event',
      );
      channel.nack(originalMsg, false, true);
    }
  }

  @EventPattern(EVENTS.TRANSACTION_REJECTED)
  async handleTransactionRejected(
    @Payload() data: TransactionRejectedEventDTO,
    @Ctx() context: RmqContext,
  ) {
    const channel = context.getChannelRef() as Channel;
    const originalMsg = context.getMessage() as ConsumeMessage;

    try {
      await this.updateTransactionStatusRepository.execute(
        data.transactionId,
        TransactionStatus.FAILED,
      );
      this.logger.warn(
        { transactionId: data.transactionId, reason: data.reason },
        'Transaction rejected',
      );
      channel.ack(originalMsg);
    } catch (error) {
      this.logger.error(
        { err: error, transactionId: data.transactionId, event: EVENTS.TRANSACTION_REJECTED },
        'Error processing transaction rejected event',
      );
      channel.nack(originalMsg, false, true);
    }
  }
}
