export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/prisma";
import { getAdminAccess, hasBackofficeAccess } from "@/lib/admin-auth";
import { recordAuditLog, recordLifecycleEvent } from "@/lib/lifecycle";

const ALLOWED = new Set(["in_progress", "verified", "declined"]);

export async function POST(req: NextRequest, context: any) {
  try {
    const access = await getAdminAccess();
    if (!access) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const id = context?.params?.id as string | undefined;
    if (!id) {
      return NextResponse.json({ error: "Missing id" }, { status: 400 });
    }

    const { status } = await req.json().catch(() => ({} as any));
    const nextStatus = String(status || "").toLowerCase();
    if (!ALLOWED.has(nextStatus)) {
      return NextResponse.json(
        { error: `Invalid status. Allowed: ${[...ALLOWED].join(", ")}` },
        { status: 400 }
      );
    }

    const client = await prisma.client.findFirst({
      where:
        hasBackofficeAccess(access)
          ? { id }
          : { id, advisorId: access.advisorId || "" },
      select: { id: true, advisorId: true },
    });
    if (!client) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const updated = await prisma.client.update({
      where: { id: client.id },
      data: {
        onboardingStatus: nextStatus,
        reviewedAt: nextStatus === "verified" ? new Date() : null,
        reviewedBy: access.userEmail || access.advisorEmail || access.label,
        updatedAt: new Date(),
      },
      select: { id: true, onboardingStatus: true, advisorId: true },
    });

    await Promise.allSettled([
      recordLifecycleEvent({
        eventType: "client.status.changed",
        actorRole: access.role,
        advisorId: updated.advisorId,
        clientId: updated.id,
        metadata: { status: nextStatus },
      }),
      recordAuditLog({
        actorRole: access.role,
        actorLabel: access.userEmail || access.advisorEmail || access.label,
        actorUserId: access.userId,
        advisorId: updated.advisorId,
        action: "client.status.changed",
        targetType: "client",
        targetId: updated.id,
        metadata: { status: nextStatus },
      }),
    ]);

    return NextResponse.json({ ok: true, client: updated });
  } catch (e: any) {
    console.error("status update error", e);
    return NextResponse.json(
      { error: e?.message || "Server error" },
      { status: 500 }
    );
  }
}
