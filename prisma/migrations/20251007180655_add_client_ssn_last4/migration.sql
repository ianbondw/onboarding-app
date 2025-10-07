/*
  Warnings:

  - You are about to drop the column `ssn` on the `Client` table. All the data in the column will be lost.
  - Added the required column `ssnCiphertext` to the `Client` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ssnIv` to the `Client` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ssnTag` to the `Client` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Client" DROP COLUMN "ssn",
ADD COLUMN     "ssnCiphertext" TEXT NOT NULL,
ADD COLUMN     "ssnIv" TEXT NOT NULL,
ADD COLUMN     "ssnLast4" TEXT,
ADD COLUMN     "ssnTag" TEXT NOT NULL;
