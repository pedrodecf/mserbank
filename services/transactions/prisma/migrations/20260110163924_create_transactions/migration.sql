-- CreateEnum
CREATE TYPE "TransactionStatus" AS ENUM ('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED');

-- CreateTable
CREATE TABLE "transactions" (
    "id" TEXT NOT NULL,
    "senderUserId" TEXT NOT NULL,
    "receiverUserId" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "description" TEXT,
    "status" "TransactionStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "transactions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "transactions_senderUserId_idx" ON "transactions"("senderUserId");

-- CreateIndex
CREATE INDEX "transactions_receiverUserId_idx" ON "transactions"("receiverUserId");
