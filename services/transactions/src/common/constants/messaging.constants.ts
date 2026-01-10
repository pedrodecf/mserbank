export const QUEUES = {
  CUSTOMERS: 'customers_queue',
  TRANSACTIONS: 'transactions_queue',
} as const;

export const EVENTS = {
  TRANSACTION_CREATED: 'transaction.created',
  TRANSACTION_VALIDATED: 'transaction.validated',
  TRANSACTION_REJECTED: 'transaction.rejected',
} as const;

export const RABBITMQ_CLIENT = 'RABBITMQ_CLIENT';
