export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { getAdminAccess, hasBackofficeAccess } from "@/lib/admin-auth";
import { prisma } from "@/prisma";
import { recordAuditLog, recordLifecycleEvent } from "@/lib/lifecycle";

type Params = Promise<{ id: string }>;

const COMPLIANCE_STATUSES = new Set(["pending", "in_review", "verified", "failed"]);

export async function PATCH(req: Request, context: { params: Params }) {
  const access = await getAdminAccess();
  if (!access) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;
  const body = await req.json().catch(() => ({}));

  const identityVerificationStatus = (body?.identityVerificationStatus ?? "")
    .toString()
    .trim()
    .toLowerCase();
  const documentVerificationStatus = (body?.documentVerificationStatus ?? "")
    .toString()
    .trim()
    .toLowerCase();
  const reviewNotes =
    body?.reviewNotes === undefined ? undefined : (body?.reviewNotes ?? "").toString().trim();
  const idDocProviderRef =
    body?.idDocProviderRef === undefined
      ? undefined
      : (body?.idDocProviderRef ?? "").toString().trim() || null;

  if (!COMPLIANCE_STATUSES.has(identityVerificationStatus)) {
    return NextResponse.json({ error: "Invalid identity verification status." }, { status: 400 });
  }
  if (!COMPLIANCE_STATUSES.has(documentVerificationStatus)) {
    return NextResponse.json({ error: "Invalid document verification status." }, { status: 400 });
  }

  const client = await prisma.client.findFirst({
    where: hasBackofficeAccess(access)
      ? { id }
      : { id, advisorId: access.advisorId || "" },
    select: {
      id: true,
      advisorId: true,
    },
  });

  if (!client) {
    return NextResponse.json({ error: "Client not found." }, { status: 404 });
  }

  const reviewedBy = access.userEmail || access.advisorEmail || access.label || access.role;

  const updated = await prisma.client.update({
    where: { id: client.id },
    data: {
      identityVerificationStatus,
      documentVerificationStatus,
      reviewNotes: reviewNotes ?? undefined,
      idDocProviderRef,
      reviewedAt: new Date(),
      reviewedBy,
    },
    select: {
      id: true,
      identityVerificationStatus: true,
      documentVerificationStatus: true,
      reviewNotes: true,
      idDocProviderRef: true,
      reviewedAt: true,
      reviewedBy: true,
    },
  });

  await Promise.allSettled([
    recordLifecycleEvent({
      eventType: "client.compliance.reviewed",
      actorRole: access.role,
      advisorId: client.advisorId,
      clientId: client.id,
      metadata: {
        identityVerificationStatus,
        documentVerificationStatus,
      },
    }),
    recordAuditLog({
      actorRole: access.role,
      actorLabel: reviewedBy,
      actorUserId: access.userId,
      advisorId: client.advisorId,
      action: "client.compliance.reviewed",
      targetType: "client",
      targetId: client.id,
      metadata: {
        identityVerificationStatus,
        documentVerificationStatus,
      },
    }),
  ]);

  return NextResponse.json({
    ok: true,
    client: {
      ...updated,
      reviewedAt: updated.reviewedAt?.toISOString() ?? null,
    },
  });
}
