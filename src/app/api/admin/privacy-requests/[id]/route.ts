export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { getAdminAccess, hasBackofficeAccess } from "@/lib/admin-auth";
import {
  executePrivacyDeletion,
  updatePrivacyRequest,
} from "@/lib/privacy-workflow";
import { recordAuditLog, recordLifecycleEvent } from "@/lib/lifecycle";

type Params = Promise<{ id: string }>;

export async function PATCH(req: Request, context: { params: Params }) {
  const access = await getAdminAccess();
  if (!access || !hasBackofficeAccess(access)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;

  try {
    const body = await req.json().catch(() => ({}));
    const identityVerifiedProvided =
      !!body && typeof body === "object" && "identityVerified" in body;

    if (body?.applyAction === "execute_deletion") {
      const completed = await executePrivacyDeletion({
        id,
        actorRole: access.role,
        actorLabel: access.userEmail || access.label,
        actorUserId: access.userId,
      });
      return NextResponse.json({ ok: true, request: completed });
    }

    const updated = await updatePrivacyRequest({
      id,
      status: body?.status,
      requestType: body?.requestType,
      reviewedBy: access.userEmail || access.label,
      identityVerified: identityVerifiedProvided ? body?.identityVerified === true : undefined,
      details: body?.details,
      resolutionSummary: body?.resolutionSummary,
      legalHold: body?.legalHold,
      dueAt: body?.dueAt,
      metadata:
        body?.identityVerified === true
          ? {
              identityVerifiedBy: access.userEmail || access.label,
              identityVerifiedAt: new Date().toISOString(),
            }
          : undefined,
    });

    if (!updated) {
      return NextResponse.json({ error: "Privacy request not found." }, { status: 404 });
    }

    await Promise.allSettled([
      recordLifecycleEvent({
        eventType: "privacy.request.updated",
        actorRole: access.role,
        metadata: {
          requestId: updated.id,
          requestType: updated.requestType,
          status: updated.status,
          legalHold: updated.legalHold,
        },
      }),
      recordAuditLog({
        actorRole: access.role,
        actorLabel: access.userEmail || access.label,
        actorUserId: access.userId,
        action: "privacy.request.updated",
        targetType: "privacy_request",
        targetId: updated.id,
        metadata: {
          requestType: updated.requestType,
          status: updated.status,
          legalHold: updated.legalHold,
        },
      }),
    ]);

    return NextResponse.json({ ok: true, request: updated });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Unable to update privacy request." },
      { status: 400 }
    );
  }
}
