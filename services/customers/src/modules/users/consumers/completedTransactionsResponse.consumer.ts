import { Controller, Logger } from '@nestjs/common';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import { EVENTS } from '../../../common/constants/messaging.constants';
import { CompletedTransactionsResponseEventDTO } from '../dto/events/completedTransactionsResponseEvent.dto';
import { GetUserBalanceService } from '../services/getUserBalance.service';

@Controller()
export class CompletedTransactionsResponseConsumer {
  private readonly logger = new Logger(CompletedTransactionsResponseConsumer.name);

  constructor(private readonly getUserBalanceService: GetUserBalanceService) {}

  @EventPattern(EVENTS.COMPLETED_TRANSACTIONS_RESPONSE)
  async handleCompletedTransactionsResponse(
    @Payload() data: CompletedTransactionsResponseEventDTO,
    @Ctx() context: RmqContext,
  ) {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();

    try {
      this.logger.debug(
        {
          correlationId: data.correlationId,
          userId: data.userId,
          transactionCount: data.transactions.length,
        },
        'Received completed transactions response',
      );

      this.getUserBalanceService.resolveResponse(data);
      channel.ack(originalMsg);
    } catch (error: unknown) {
      this.logger.error(
        {
          err: error,
          correlationId: data.correlationId,
          event: EVENTS.COMPLETED_TRANSACTIONS_RESPONSE,
        },
        'Error processing completed transactions response',
      );
      channel.nack(originalMsg, false, true);
    }
  }
}
