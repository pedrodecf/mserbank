-- CreateTable
CREATE TABLE "users_password" (
    "id" VARCHAR(191) NOT NULL,
    "hash" VARCHAR(255) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_password_pkey" PRIMARY KEY ("id")
);
