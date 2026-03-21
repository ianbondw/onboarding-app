export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { getAdminAccess, hasBackofficeAccess } from "@/lib/admin-auth";
import { prisma } from "@/prisma";
import { createPrivacyRequest } from "@/lib/privacy-workflow";
import { recordAuditLog, recordLifecycleEvent } from "@/lib/lifecycle";

export async function GET() {
  const access = await getAdminAccess();
  if (!access || !hasBackofficeAccess(access)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const requests = await prisma.privacyRequest.findMany({
    orderBy: [{ status: "asc" }, { createdAt: "desc" }],
    select: {
      id: true,
      createdAt: true,
      updatedAt: true,
      requestType: true,
      status: true,
      source: true,
      subjectType: true,
      email: true,
      name: true,
      firm: true,
      relationship: true,
      advisorId: true,
      advisor: {
        select: {
          id: true,
          name: true,
          firm: true,
        },
      },
      dueAt: true,
      reviewedAt: true,
      reviewedBy: true,
      completedAt: true,
      legalHold: true,
      identityVerifiedAt: true,
      details: true,
      resolutionSummary: true,
      metadata: true,
    },
  });

  return NextResponse.json({
    requests: requests.map((request) => ({
      ...request,
      createdAt: request.createdAt.toISOString(),
      updatedAt: request.updatedAt.toISOString(),
      dueAt: request.dueAt?.toISOString() ?? null,
      reviewedAt: request.reviewedAt?.toISOString() ?? null,
      completedAt: request.completedAt?.toISOString() ?? null,
      identityVerifiedAt: request.identityVerifiedAt?.toISOString() ?? null,
    })),
  });
}

export async function POST(req: Request) {
  const access = await getAdminAccess();
  if (!access || !hasBackofficeAccess(access)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json().catch(() => ({}));
    const created = await createPrivacyRequest({
      requestType: body?.requestType,
      status: body?.status || "received",
      source: "internal",
      subjectType: body?.subjectType || "individual",
      email: body?.email,
      name: body?.name,
      firm: body?.firm,
      relationship: body?.relationship,
      advisorId: body?.advisorId,
      details: body?.details,
      dueAt: body?.dueAt,
      legalHold: body?.legalHold === true,
      metadata: {
        createdBy: access.userEmail || access.label || access.role,
      },
    });

    await Promise.allSettled([
      recordLifecycleEvent({
        eventType: "privacy.request.created",
        actorRole: access.role,
        advisorId: created.advisorId ?? null,
        metadata: {
          requestId: created.id,
          requestType: created.requestType,
          source: "internal",
        },
      }),
      recordAuditLog({
        actorRole: access.role,
        actorLabel: access.userEmail || access.label,
        actorUserId: access.userId,
        advisorId: created.advisorId ?? null,
        action: "privacy.request.created",
        targetType: "privacy_request",
        targetId: created.id,
        metadata: {
          requestType: created.requestType,
          source: "internal",
          email: created.email,
        },
      }),
    ]);

    return NextResponse.json({ ok: true, request: created }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Unable to create privacy request." },
      { status: 400 }
    );
  }
}
