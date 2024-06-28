/*
  Warnings:

  - Added the required column `runId` to the `Claim` table without a default value. This is not possible if the table is not empty.
  - Added the required column `transactionHash` to the `Claim` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Claim" ADD COLUMN     "runId" INTEGER NOT NULL,
ADD COLUMN     "transactionHash" TEXT NOT NULL;
