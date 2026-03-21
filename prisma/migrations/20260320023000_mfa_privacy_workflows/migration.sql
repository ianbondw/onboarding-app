-- AlterTable
ALTER TABLE "Client"
ADD COLUMN "retentionStatus" TEXT NOT NULL DEFAULT 'active',
ADD COLUMN "deletedAt" TIMESTAMP(3);

ALTER TABLE "PortalUser"
ADD COLUMN "mfaEnabled" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN "mfaMethod" TEXT DEFAULT 'email_otp';

ALTER TABLE "TrialLead"
ADD COLUMN "retentionStatus" TEXT NOT NULL DEFAULT 'active',
ADD COLUMN "deletedAt" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "PortalLoginChallenge" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "codeHash" TEXT NOT NULL,
    "purpose" TEXT NOT NULL DEFAULT 'login',
    "email" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "consumedAt" TIMESTAMP(3),
    "failedAttempts" INTEGER NOT NULL DEFAULT 0,
    "ipHash" TEXT,
    "userAgent" TEXT,
    "userId" TEXT,
    "advisorId" TEXT,

    CONSTRAINT "PortalLoginChallenge_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "PrivacyRequest" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "requestType" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'received',
    "source" TEXT NOT NULL DEFAULT 'website',
    "subjectType" TEXT NOT NULL DEFAULT 'individual',
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "firm" TEXT,
    "relationship" TEXT,
    "advisorId" TEXT,
    "dueAt" TIMESTAMP(3),
    "reviewedAt" TIMESTAMP(3),
    "reviewedBy" TEXT,
    "completedAt" TIMESTAMP(3),
    "legalHold" BOOLEAN NOT NULL DEFAULT false,
    "identityVerifiedAt" TIMESTAMP(3),
    "details" TEXT,
    "resolutionSummary" TEXT,
    "metadata" JSONB,

    CONSTRAINT "PrivacyRequest_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Client_retentionStatus_deletedAt_idx" ON "Client"("retentionStatus", "deletedAt");
CREATE INDEX "TrialLead_retentionStatus_deletedAt_idx" ON "TrialLead"("retentionStatus", "deletedAt");

CREATE UNIQUE INDEX "PortalLoginChallenge_tokenHash_key" ON "PortalLoginChallenge"("tokenHash");
CREATE INDEX "PortalLoginChallenge_email_expiresAt_idx" ON "PortalLoginChallenge"("email", "expiresAt");
CREATE INDEX "PortalLoginChallenge_userId_expiresAt_idx" ON "PortalLoginChallenge"("userId", "expiresAt");
CREATE INDEX "PortalLoginChallenge_advisorId_expiresAt_idx" ON "PortalLoginChallenge"("advisorId", "expiresAt");

CREATE INDEX "PrivacyRequest_email_status_idx" ON "PrivacyRequest"("email", "status");
CREATE INDEX "PrivacyRequest_requestType_status_idx" ON "PrivacyRequest"("requestType", "status");
CREATE INDEX "PrivacyRequest_advisorId_createdAt_idx" ON "PrivacyRequest"("advisorId", "createdAt");

-- AddForeignKey
ALTER TABLE "PortalLoginChallenge"
ADD CONSTRAINT "PortalLoginChallenge_userId_fkey"
FOREIGN KEY ("userId") REFERENCES "PortalUser"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "PortalLoginChallenge"
ADD CONSTRAINT "PortalLoginChallenge_advisorId_fkey"
FOREIGN KEY ("advisorId") REFERENCES "Advisor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "PrivacyRequest"
ADD CONSTRAINT "PrivacyRequest_advisorId_fkey"
FOREIGN KEY ("advisorId") REFERENCES "Advisor"("id") ON DELETE SET NULL ON UPDATE CASCADE;
