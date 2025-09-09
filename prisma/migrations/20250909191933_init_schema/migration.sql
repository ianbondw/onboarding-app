/*
  Warnings:

  - You are about to drop the column `status` on the `OnboardingSession` table. All the data in the column will be lost.
  - You are about to drop the column `data` on the `SectionData` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `SectionData` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `SectionData` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `Upload` table. All the data in the column will be lost.
  - You are about to drop the column `filename` on the `Upload` table. All the data in the column will be lost.
  - You are about to drop the column `mimeType` on the `Upload` table. All the data in the column will be lost.
  - You are about to drop the column `size` on the `Upload` table. All the data in the column will be lost.
  - You are about to drop the column `url` on the `Upload` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "public"."SectionData_sessionId_name_key";

-- AlterTable
ALTER TABLE "public"."OnboardingSession" DROP COLUMN "status";

-- AlterTable
ALTER TABLE "public"."SectionData" DROP COLUMN "data",
DROP COLUMN "name",
DROP COLUMN "updatedAt";

-- AlterTable
ALTER TABLE "public"."Upload" DROP COLUMN "createdAt",
DROP COLUMN "filename",
DROP COLUMN "mimeType",
DROP COLUMN "size",
DROP COLUMN "url";

-- DropEnum
DROP TYPE "public"."OnboardingStatus";

-- CreateTable
CREATE TABLE "public"."Client" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "ssn" TEXT NOT NULL,
    "dob" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "netWorth" DOUBLE PRECISION NOT NULL,
    "income" DOUBLE PRECISION NOT NULL,
    "riskTolerance" TEXT NOT NULL,
    "termsAccepted" BOOLEAN NOT NULL,

    CONSTRAINT "Client_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Client_sessionId_key" ON "public"."Client"("sessionId");

-- AddForeignKey
ALTER TABLE "public"."Client" ADD CONSTRAINT "Client_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "public"."OnboardingSession"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
