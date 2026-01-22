/*
  Warnings:

  - A unique constraint covering the columns `[betaKey]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "betaKey" TEXT;

-- CreateTable
CREATE TABLE "StripeCheckoutSession" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "credits" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "StripeCheckoutSession_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "StripeCheckoutSession_userId_createdAt_idx" ON "StripeCheckoutSession"("userId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "User_betaKey_key" ON "User"("betaKey");

-- AddForeignKey
ALTER TABLE "StripeCheckoutSession" ADD CONSTRAINT "StripeCheckoutSession_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
