-- AlterTable
ALTER TABLE "Advisor"
ADD COLUMN "email" TEXT;

ALTER TABLE "Client"
ADD COLUMN "identityVerificationStatus" TEXT NOT NULL DEFAULT 'pending',
ADD COLUMN "documentVerificationStatus" TEXT NOT NULL DEFAULT 'pending',
ADD COLUMN "idDocProviderRef" TEXT,
ADD COLUMN "reviewNotes" TEXT,
ADD COLUMN "reviewedAt" TIMESTAMP(3),
ADD COLUMN "reviewedBy" TEXT;

-- CreateTable
CREATE TABLE "PortalUser" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT,
    "role" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "lastLoginAt" TIMESTAMP(3),
    "advisorId" TEXT,

    CONSTRAINT "PortalUser_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "PortalSession" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "label" TEXT,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "lastSeenAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT,
    "advisorId" TEXT,

    CONSTRAINT "PortalSession_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "TrialLead" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "firm" TEXT,
    "source" TEXT NOT NULL DEFAULT 'website',
    "status" TEXT NOT NULL DEFAULT 'new',
    "onboardingUrl" TEXT,
    "adminUrl" TEXT,
    "metadata" JSONB,
    "advisorId" TEXT,

    CONSTRAINT "TrialLead_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "LifecycleEvent" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "eventType" TEXT NOT NULL,
    "actorRole" TEXT,
    "metadata" JSONB,
    "advisorId" TEXT,
    "clientId" TEXT,
    "leadId" TEXT,

    CONSTRAINT "LifecycleEvent_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "AuditLog" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actorRole" TEXT NOT NULL,
    "actorLabel" TEXT,
    "action" TEXT NOT NULL,
    "targetType" TEXT NOT NULL,
    "targetId" TEXT,
    "metadata" JSONB,
    "actorUserId" TEXT,
    "advisorId" TEXT,

    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PortalUser_email_key" ON "PortalUser"("email");
CREATE INDEX "PortalUser_advisorId_role_idx" ON "PortalUser"("advisorId", "role");

CREATE UNIQUE INDEX "PortalSession_tokenHash_key" ON "PortalSession"("tokenHash");
CREATE INDEX "PortalSession_advisorId_role_idx" ON "PortalSession"("advisorId", "role");
CREATE INDEX "PortalSession_userId_expiresAt_idx" ON "PortalSession"("userId", "expiresAt");

CREATE INDEX "TrialLead_email_createdAt_idx" ON "TrialLead"("email", "createdAt");
CREATE INDEX "TrialLead_advisorId_status_idx" ON "TrialLead"("advisorId", "status");

CREATE INDEX "LifecycleEvent_eventType_createdAt_idx" ON "LifecycleEvent"("eventType", "createdAt");
CREATE INDEX "LifecycleEvent_advisorId_createdAt_idx" ON "LifecycleEvent"("advisorId", "createdAt");
CREATE INDEX "LifecycleEvent_clientId_createdAt_idx" ON "LifecycleEvent"("clientId", "createdAt");
CREATE INDEX "LifecycleEvent_leadId_createdAt_idx" ON "LifecycleEvent"("leadId", "createdAt");

CREATE INDEX "AuditLog_advisorId_createdAt_idx" ON "AuditLog"("advisorId", "createdAt");
CREATE INDEX "AuditLog_targetType_targetId_idx" ON "AuditLog"("targetType", "targetId");

-- AddForeignKey
ALTER TABLE "PortalUser"
ADD CONSTRAINT "PortalUser_advisorId_fkey"
FOREIGN KEY ("advisorId") REFERENCES "Advisor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "PortalSession"
ADD CONSTRAINT "PortalSession_userId_fkey"
FOREIGN KEY ("userId") REFERENCES "PortalUser"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "PortalSession"
ADD CONSTRAINT "PortalSession_advisorId_fkey"
FOREIGN KEY ("advisorId") REFERENCES "Advisor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "TrialLead"
ADD CONSTRAINT "TrialLead_advisorId_fkey"
FOREIGN KEY ("advisorId") REFERENCES "Advisor"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "LifecycleEvent"
ADD CONSTRAINT "LifecycleEvent_advisorId_fkey"
FOREIGN KEY ("advisorId") REFERENCES "Advisor"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "LifecycleEvent"
ADD CONSTRAINT "LifecycleEvent_clientId_fkey"
FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "LifecycleEvent"
ADD CONSTRAINT "LifecycleEvent_leadId_fkey"
FOREIGN KEY ("leadId") REFERENCES "TrialLead"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "AuditLog"
ADD CONSTRAINT "AuditLog_actorUserId_fkey"
FOREIGN KEY ("actorUserId") REFERENCES "PortalUser"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "AuditLog"
ADD CONSTRAINT "AuditLog_advisorId_fkey"
FOREIGN KEY ("advisorId") REFERENCES "Advisor"("id") ON DELETE SET NULL ON UPDATE CASCADE;
