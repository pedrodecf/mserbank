import { Controller, Logger } from '@nestjs/common';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import { Channel, ConsumeMessage } from 'amqplib';
import { EVENTS } from '../../../common/constants/messaging.constants';
import { CompletedTransactionsRequestedEventDTO } from '../dto/events/completedTransactionsRequestedEvent.dto';
import { CompletedTransactionsResponseProducer } from '../producers/completedTransactionsResponse.producer';
import { FindCompletedTransactionsByUserRepository } from '../repositories/findCompletedTransactionsByUser.repository';

@Controller()
export class CompletedTransactionsRequestedConsumer {
  private readonly logger = new Logger(CompletedTransactionsRequestedConsumer.name);

  constructor(
    private readonly findCompletedTransactionsByUserRepository: FindCompletedTransactionsByUserRepository,
    private readonly completedTransactionsResponseProducer: CompletedTransactionsResponseProducer,
  ) {}

  @EventPattern(EVENTS.COMPLETED_TRANSACTIONS_REQUESTED)
  async handleCompletedTransactionsRequested(
    @Payload() data: CompletedTransactionsRequestedEventDTO,
    @Ctx() context: RmqContext,
  ) {
    const channel = context.getChannelRef() as Channel;
    const originalMsg = context.getMessage() as ConsumeMessage;

    try {
      this.logger.debug(
        { correlationId: data.correlationId, userId: data.userId },
        'Processing completed transactions request',
      );

      const transactions = await this.findCompletedTransactionsByUserRepository.execute(
        data.userId,
      );

      const transactionsData = transactions.map((transaction) => ({
        id: transaction.id,
        senderUserId: transaction.senderUserId,
        receiverUserId: transaction.receiverUserId,
        amount: transaction.amount,
        description: transaction.description,
        status: transaction.status,
        createdAt: transaction.createdAt,
        updatedAt: transaction.updatedAt,
      }));

      this.completedTransactionsResponseProducer.emit({
        correlationId: data.correlationId,
        userId: data.userId,
        transactions: transactionsData,
      });

      channel.ack(originalMsg);
    } catch (error: unknown) {
      this.logger.error(
        {
          err: error,
          correlationId: data.correlationId,
          userId: data.userId,
          event: EVENTS.COMPLETED_TRANSACTIONS_REQUESTED,
        },
        'Error processing completed transactions request',
      );
      channel.nack(originalMsg, false, true);
    }
  }
}
