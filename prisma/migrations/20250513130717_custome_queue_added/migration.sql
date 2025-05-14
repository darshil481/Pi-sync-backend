-- CreateEnum
CREATE TYPE "QueueName" AS ENUM ('EVENT_SYNCING');

-- CreateTable
CREATE TABLE "queue" (
    "id" SERIAL NOT NULL,
    "name" "QueueName" NOT NULL,
    "message" JSONB NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "queue_pkey" PRIMARY KEY ("id")
);
