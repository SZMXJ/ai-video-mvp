/*
  Warnings:

  - Made the column `idempotencyKey` on table `CreditLedger` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "CreditLedger" ALTER COLUMN "idempotencyKey" SET NOT NULL;
