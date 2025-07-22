-- CreateEnum
CREATE TYPE "OrderItemStatus" AS ENUM ('ACTIVE', 'CANCELED');

-- AlterTable
ALTER TABLE "order_items" ADD COLUMN     "status" "OrderItemStatus" NOT NULL DEFAULT 'ACTIVE';
