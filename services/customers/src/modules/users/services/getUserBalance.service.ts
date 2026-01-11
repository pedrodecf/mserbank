import { Injectable, Logger } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { CACHE_PREFIXES, CACHE_TTL, REQUEST_TIMEOUT } from 'src/common/constants/cache.constants';
import { RedisService } from 'src/infrastructure/cache/redis.service';
import { CompletedTransactionsResponseEventDTO } from '../dto/events/completedTransactionsResponseEvent.dto';
import { CompletedTransactionsRequestedProducer } from '../producers/completedTransactionsRequested.producer';

@Injectable()
export class GetUserBalanceService {
  private readonly logger = new Logger(GetUserBalanceService.name);

  private readonly pendingRequests = new Map<
    string,
    {
      resolve: (value: CompletedTransactionsResponseEventDTO) => void;
      reject: (error: Error) => void;
      timeout: NodeJS.Timeout;
    }
  >();

  constructor(
    private readonly redisService: RedisService,
    private readonly completedTransactionsRequestedProducer: CompletedTransactionsRequestedProducer,
  ) {}

  async execute(userId: string): Promise<{ balance: number }> {
    this.logger.debug({ userId }, 'Getting user balance');

    const cacheKey = `${CACHE_PREFIXES.USER_BALANCE}:${userId}`;
    const cachedBalance = await this.redisService.get<{ balance: number }>(cacheKey);

    if (cachedBalance) {
      return cachedBalance;
    }

    const correlationId = randomUUID();
    const responsePromise = new Promise<CompletedTransactionsResponseEventDTO>(
      (resolve, reject) => {
        const timeout = setTimeout(() => {
          this.pendingRequests.delete(correlationId);
          reject(new Error(`Timeout waiting for correlationId ${correlationId}`));
        }, REQUEST_TIMEOUT.TEN_SECONDS);

        this.pendingRequests.set(correlationId, { resolve, reject, timeout });
      },
    );

    this.completedTransactionsRequestedProducer.emit({
      correlationId,
      userId,
    });

    const response = await responsePromise;

    let balance = 0;
    for (const transaction of response.transactions) {
      if (transaction.senderUserId === userId) balance -= transaction.amount;
      if (transaction.receiverUserId === userId) balance += transaction.amount;
    }

    const balanceData = { balance };
    await this.redisService.set(cacheKey, balanceData, CACHE_TTL.ONE_HOUR);

    return balanceData;
  }

  public resolveResponse(data: CompletedTransactionsResponseEventDTO): void {
    const pending = this.pendingRequests.get(data.correlationId);

    if (!pending) {
      this.logger.warn({ correlationId: data.correlationId }, 'No pending request found');
      return;
    }

    clearTimeout(pending.timeout);
    this.pendingRequests.delete(data.correlationId);
    pending.resolve(data);
  }
}
