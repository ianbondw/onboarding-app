/*
  Warnings:

  - A unique constraint covering the columns `[advisorId,email]` on the table `Client` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "public"."Client_email_key";

-- AlterTable
ALTER TABLE "public"."Client" ADD COLUMN     "concernsNarrative" TEXT,
ADD COLUMN     "goalsNarrative" TEXT,
ADD COLUMN     "introNarrative" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Client_advisorId_email_key" ON "public"."Client"("advisorId", "email");
