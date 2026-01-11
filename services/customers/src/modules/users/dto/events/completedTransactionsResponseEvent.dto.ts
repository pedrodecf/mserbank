export class TransactionData {
  id: string;
  senderUserId: string;
  receiverUserId: string;
  amount: number;
  description: string | null;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

export class CompletedTransactionsResponseEventDTO {
  correlationId: string;
  userId: string;
  transactions: TransactionData[];
}
