-- CreateTable
CREATE TABLE "public"."ClientFieldFlag" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "clientId" TEXT NOT NULL,
    "advisorId" TEXT NOT NULL,
    "fieldKey" TEXT NOT NULL,
    "note" TEXT,
    "status" TEXT NOT NULL DEFAULT 'open',

    CONSTRAINT "ClientFieldFlag_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ClientFieldFlag_advisorId_clientId_fieldKey_status_idx" ON "public"."ClientFieldFlag"("advisorId", "clientId", "fieldKey", "status");

-- AddForeignKey
ALTER TABLE "public"."ClientFieldFlag" ADD CONSTRAINT "ClientFieldFlag_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "public"."Client"("id") ON DELETE CASCADE ON UPDATE CASCADE;
