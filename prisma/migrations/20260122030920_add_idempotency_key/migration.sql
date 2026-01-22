/*
  Warnings:

  - Made the column `betaKey` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "User" ALTER COLUMN "betaKey" SET NOT NULL;
