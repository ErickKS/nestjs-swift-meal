/*
  Warnings:

  - Made the column `external_id` on table `payments` required. This step will fail if there are existing NULL values in that column.
  - Made the column `qr_code` on table `payments` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "payments" ALTER COLUMN "external_id" SET NOT NULL,
ALTER COLUMN "qr_code" SET NOT NULL;
