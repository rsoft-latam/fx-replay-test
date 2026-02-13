-- CreateEnum
CREATE TYPE "OrderSide" AS ENUM ('buy', 'sell');

-- CreateEnum
CREATE TYPE "OrderType" AS ENUM ('limit', 'market', 'stop');

-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('open', 'cancelled', 'executed');

-- CreateTable
CREATE TABLE "trade_orders" (
    "id" TEXT NOT NULL,
    "side" "OrderSide" NOT NULL,
    "type" "OrderType" NOT NULL,
    "amount" DECIMAL(10,2) NOT NULL,
    "price" DECIMAL(10,5) NOT NULL,
    "status" "OrderStatus" NOT NULL DEFAULT 'open',
    "pair" TEXT NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "trade_orders_pkey" PRIMARY KEY ("id")
);
