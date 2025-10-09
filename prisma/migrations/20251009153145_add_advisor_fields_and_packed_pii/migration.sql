/*
  Migration notes:
  - Add firstName/lastName as NULLable → backfill from fullName → enforce NOT NULL
  - Keep fullName long enough to backfill, then drop it.
  - Proceed with existing drops/adds (riskTolerance, ssnEnc/dobEnc, advisor fields, etc.)
*/

-- DropForeignKey
ALTER TABLE "public"."Client" DROP CONSTRAINT IF EXISTS "Client_onboardingSessionId_fkey";

-- DropIndex (if it existed)
DROP INDEX IF EXISTS "public"."Client_onboardingSessionId_key";

--------------------------------------------------------------------------------
-- 1) Add firstName/lastName as NULLable first (so existing rows are valid)
--------------------------------------------------------------------------------
ALTER TABLE "public"."Client"
  ADD COLUMN IF NOT EXISTS "firstName" TEXT,
  ADD COLUMN IF NOT EXISTS "lastName"  TEXT;

--------------------------------------------------------------------------------
-- 2) Backfill names from legacy "fullName" before we drop it
--    - firstName: first token of fullName
--    - lastName:  second token of fullName (fallback to 'Unknown' if missing)
--------------------------------------------------------------------------------
UPDATE "public"."Client"
SET "firstName" = COALESCE(
      NULLIF(split_part(trim(COALESCE("fullName", '')), ' ', 1), ''),
      'Unknown'
    )
WHERE "firstName" IS NULL;

UPDATE "public"."Client"
SET "lastName" = COALESCE(
      NULLIF(split_part(trim(COALESCE("fullName", '')), ' ', 2), ''),
      'Unknown'
    )
WHERE "lastName" IS NULL;

--------------------------------------------------------------------------------
-- 3) Enforce NOT NULL after backfill
--------------------------------------------------------------------------------
ALTER TABLE "public"."Client"
  ALTER COLUMN "firstName" SET NOT NULL,
  ALTER COLUMN "lastName"  SET NOT NULL;

--------------------------------------------------------------------------------
-- 4) Perform the rest of your alterations
--    (we do NOT add firstName/lastName again here)
--------------------------------------------------------------------------------
ALTER TABLE "public"."Client"
-- Drops that are safe now that we’ve backfilled names
DROP COLUMN IF EXISTS "dob",
DROP COLUMN IF EXISTS "fullName",
DROP COLUMN IF EXISTS "income",
DROP COLUMN IF EXISTS "investableAssets",
DROP COLUMN IF EXISTS "kycCitizenship",
DROP COLUMN IF EXISTS "kycEmploymentStatus",
DROP COLUMN IF EXISTS "kycSourceOfFunds",
DROP COLUMN IF EXISTS "netWorth",
DROP COLUMN IF EXISTS "onboardingSessionId",
DROP COLUMN IF EXISTS "ssnCiphertext",
DROP COLUMN IF EXISTS "ssnLast4",
DROP COLUMN IF EXISTS "ssnTag",
DROP COLUMN IF EXISTS "termsAccepted",

-- Adds (new columns)
ADD COLUMN IF NOT EXISTS "addressLine1" TEXT,
ADD COLUMN IF NOT EXISTS "addressLine2" TEXT,
ADD COLUMN IF NOT EXISTS "advisorFirm" TEXT,
ADD COLUMN IF NOT EXISTS "advisorId" TEXT,
ADD COLUMN IF NOT EXISTS "advisorName" TEXT,
ADD COLUMN IF NOT EXISTS "annualIncomeBand" TEXT,
ADD COLUMN IF NOT EXISTS "citizenship" TEXT DEFAULT 'US',
ADD COLUMN IF NOT EXISTS "city" TEXT,
ADD COLUMN IF NOT EXISTS "consentAcceptedAt" TIMESTAMP(3),
ADD COLUMN IF NOT EXISTS "constraints" TEXT[],
ADD COLUMN IF NOT EXISTS "country" TEXT DEFAULT 'US',
ADD COLUMN IF NOT EXISTS "dateOfBirth" TIMESTAMP(3),
ADD COLUMN IF NOT EXISTS "dobEnc" BYTEA,
ADD COLUMN IF NOT EXISTS "employerName" TEXT,
ADD COLUMN IF NOT EXISTS "employmentStatus" TEXT,
-- firstName / lastName already added + set NOT NULL above
ADD COLUMN IF NOT EXISTS "has401k" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN IF NOT EXISTS "hasCrypto" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN IF NOT EXISTS "hasIRA" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN IF NOT EXISTS "hasRealEstate" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN IF NOT EXISTS "hasTaxable" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN IF NOT EXISTS "idDocType" TEXT,
ADD COLUMN IF NOT EXISTS "idDocUrl" TEXT,
ADD COLUMN IF NOT EXISTS "illiquidAssetsBand" TEXT,
ADD COLUMN IF NOT EXISTS "intakeToken" TEXT,
ADD COLUMN IF NOT EXISTS "investmentExperience" TEXT,
ADD COLUMN IF NOT EXISTS "liabilitiesBand" TEXT,
ADD COLUMN IF NOT EXISTS "liquidAssetsBand" TEXT,
ADD COLUMN IF NOT EXISTS "liquidityNeeds" TEXT,
ADD COLUMN IF NOT EXISTS "netWorthBand" TEXT,
ADD COLUMN IF NOT EXISTS "onboardingStatus" TEXT NOT NULL DEFAULT 'in_progress',
ADD COLUMN IF NOT EXISTS "phone" TEXT,
ADD COLUMN IF NOT EXISTS "postalCode" TEXT,
ADD COLUMN IF NOT EXISTS "primaryGoals" TEXT[],
ADD COLUMN IF NOT EXISTS "proofOfAddressUrl" TEXT,
ADD COLUMN IF NOT EXISTS "rawSubmission" JSONB,
ADD COLUMN IF NOT EXISTS "sourceOfFunds" TEXT,
-- keep legacy cipher column for now (unused going forward; safe to drop later)
ADD COLUMN IF NOT EXISTS "ssnCipher" BYTEA,
-- new packed AES-GCM for SSN
ADD COLUMN IF NOT EXISTS "ssnEnc" BYTEA,
ADD COLUMN IF NOT EXISTS "state" TEXT,
ADD COLUMN IF NOT EXISTS "timeHorizon" TEXT,
-- Recreate text riskTolerance
DROP COLUMN IF EXISTS "riskTolerance",
ADD COLUMN "riskTolerance" TEXT,
-- Recreate binary iv for legacy compatibility (unused going forward)
DROP COLUMN IF EXISTS "ssnIv",
ADD COLUMN "ssnIv" BYTEA;

-- DropTable (legacy)
DROP TABLE IF EXISTS "public"."OnboardingSession";

-- DropEnum (legacy)
DO $$ BEGIN
  DROP TYPE "public"."OnboardingStatus";
EXCEPTION WHEN undefined_object THEN NULL;
END $$;

DO $$ BEGIN
  DROP TYPE "public"."RiskTolerance";
EXCEPTION WHEN undefined_object THEN NULL;
END $$;

-- CreateTable ProductMatch (new)
CREATE TABLE IF NOT EXISTS "public"."ProductMatch" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "clientId" TEXT NOT NULL,
    "productCode" TEXT NOT NULL,
    "productName" TEXT NOT NULL,
    "rationale" TEXT NOT NULL,
    "riskBand" TEXT,
    CONSTRAINT "ProductMatch_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "Client_intakeToken_key" ON "public"."Client"("intakeToken");
CREATE INDEX IF NOT EXISTS "Client_createdAt_idx" ON "public"."Client"("createdAt");
CREATE INDEX IF NOT EXISTS "Client_advisorId_idx" ON "public"."Client"("advisorId");

-- AddForeignKey
ALTER TABLE "public"."ProductMatch"
  ADD CONSTRAINT "ProductMatch_clientId_fkey"
  FOREIGN KEY ("clientId") REFERENCES "public"."Client"("id")
  ON DELETE RESTRICT ON UPDATE CASCADE;