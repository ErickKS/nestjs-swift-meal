/*
  Warnings:

  - You are about to drop the column `externalId` on the `payments` table. All the data in the column will be lost.
  - You are about to drop the column `qrCode` on the `payments` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[external_id]` on the table `payments` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "payments" DROP COLUMN "externalId",
DROP COLUMN "qrCode",
ADD COLUMN     "external_id" TEXT,
ADD COLUMN     "qr_code" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "payments_external_id_key" ON "payments"("external_id");
