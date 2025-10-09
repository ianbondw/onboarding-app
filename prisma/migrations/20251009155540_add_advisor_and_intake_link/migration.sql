-- CreateTable
CREATE TABLE "public"."Advisor" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "firm" TEXT,

    CONSTRAINT "Advisor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."IntakeLink" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "token" TEXT NOT NULL,
    "advisorId" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3),
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "IntakeLink_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Advisor_slug_key" ON "public"."Advisor"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "IntakeLink_token_key" ON "public"."IntakeLink"("token");

-- AddForeignKey
ALTER TABLE "public"."Client" ADD CONSTRAINT "Client_advisorId_fkey" FOREIGN KEY ("advisorId") REFERENCES "public"."Advisor"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."IntakeLink" ADD CONSTRAINT "IntakeLink_advisorId_fkey" FOREIGN KEY ("advisorId") REFERENCES "public"."Advisor"("id") ON DELETE CASCADE ON UPDATE CASCADE;
