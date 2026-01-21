-- DropForeignKey
ALTER TABLE "CreditLedger" DROP CONSTRAINT "CreditLedger_userId_fkey";

-- DropIndex
DROP INDEX "CreditLedger_userId_createdAt_idx";

-- DropIndex
DROP INDEX "Job_userId_createdAt_idx";

-- AlterTable
ALTER TABLE "Job" ADD COLUMN     "result" JSONB;

-- AddForeignKey
ALTER TABLE "CreditLedger" ADD CONSTRAINT "CreditLedger_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
