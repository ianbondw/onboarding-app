/*
  Warnings:

  - You are about to drop the column `sessionId` on the `Client` table. All the data in the column will be lost.
  - You are about to alter the column `netWorth` on the `Client` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(65,30)`.
  - You are about to alter the column `income` on the `Client` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(65,30)`.
  - You are about to drop the `SectionData` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Upload` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[email]` on the table `Client` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[onboardingSessionId]` on the table `Client` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `investableAssets` to the `Client` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Client` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `dob` on the `Client` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `riskTolerance` on the `Client` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "public"."OnboardingStatus" AS ENUM ('DRAFT', 'SUBMITTED');

-- CreateEnum
CREATE TYPE "public"."RiskTolerance" AS ENUM ('Low', 'Medium', 'High');

-- DropForeignKey
ALTER TABLE "public"."Client" DROP CONSTRAINT "Client_sessionId_fkey";

-- DropForeignKey
ALTER TABLE "public"."SectionData" DROP CONSTRAINT "SectionData_sessionId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Upload" DROP CONSTRAINT "Upload_sessionId_fkey";

-- DropIndex
DROP INDEX "public"."Client_sessionId_key";

-- AlterTable
ALTER TABLE "public"."Client" DROP COLUMN "sessionId",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "investableAssets" DECIMAL(65,30) NOT NULL,
ADD COLUMN     "kycCitizenship" TEXT,
ADD COLUMN     "kycEmploymentStatus" TEXT,
ADD COLUMN     "kycSourceOfFunds" TEXT,
ADD COLUMN     "onboardingSessionId" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
DROP COLUMN "dob",
ADD COLUMN     "dob" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "netWorth" SET DATA TYPE DECIMAL(65,30),
ALTER COLUMN "income" SET DATA TYPE DECIMAL(65,30),
DROP COLUMN "riskTolerance",
ADD COLUMN     "riskTolerance" "public"."RiskTolerance" NOT NULL;

-- AlterTable
ALTER TABLE "public"."OnboardingSession" ADD COLUMN     "status" "public"."OnboardingStatus" NOT NULL DEFAULT 'DRAFT',
ADD COLUMN     "submittedAt" TIMESTAMP(3);

-- DropTable
DROP TABLE "public"."SectionData";

-- DropTable
DROP TABLE "public"."Upload";

-- CreateIndex
CREATE UNIQUE INDEX "Client_email_key" ON "public"."Client"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Client_onboardingSessionId_key" ON "public"."Client"("onboardingSessionId");

-- AddForeignKey
ALTER TABLE "public"."Client" ADD CONSTRAINT "Client_onboardingSessionId_fkey" FOREIGN KEY ("onboardingSessionId") REFERENCES "public"."OnboardingSession"("id") ON DELETE SET NULL ON UPDATE CASCADE;
