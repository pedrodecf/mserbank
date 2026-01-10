import { Controller, Logger } from '@nestjs/common';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import { Channel, ConsumeMessage } from 'amqplib';
import { EVENTS } from '../../../common/constants/messaging.constants';
import { TransactionCreatedEventDTO } from '../dto/events/transactionCreatedEvent.dto';
import { TransactionValidationProducer } from '../producers/transactionValidation.producer';
import { FindOneUserRepository } from '../repositories/findOneUser.repository';

@Controller()
export class TransactionCreatedConsumer {
  private readonly logger = new Logger(TransactionCreatedConsumer.name);

  constructor(
    private readonly findOneUserRepository: FindOneUserRepository,
    private readonly transactionValidationProducer: TransactionValidationProducer,
  ) {}

  @EventPattern(EVENTS.TRANSACTION_CREATED)
  async handleTransactionCreated(
    @Payload() data: TransactionCreatedEventDTO,
    @Ctx() context: RmqContext,
  ) {
    const channel = context.getChannelRef() as Channel;
    const originalMsg = context.getMessage() as ConsumeMessage;

    try {
      const sender = await this.findOneUserRepository.execute(data.senderUserId);
      if (!sender) {
        this.transactionValidationProducer.emitRejected({
          transactionId: data.transactionId,
          reason: `Sender user ${data.senderUserId} not found`,
        });
        channel.ack(originalMsg);
        return;
      }

      const receiver = await this.findOneUserRepository.execute(data.receiverUserId);
      if (!receiver) {
        this.transactionValidationProducer.emitRejected({
          transactionId: data.transactionId,
          reason: `Receiver user ${data.receiverUserId} not found`,
        });
        channel.ack(originalMsg);
        return;
      }

      this.transactionValidationProducer.emitValidated({ transactionId: data.transactionId });
      channel.ack(originalMsg);
    } catch (error) {
      this.logger.error(
        { err: error, transactionId: data.transactionId, event: EVENTS.TRANSACTION_CREATED },
        'Error processing transaction created event',
      );
      channel.nack(originalMsg, false, true);
    }
  }
}
