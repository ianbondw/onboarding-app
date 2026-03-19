export const runtime = "nodejs";

import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/prisma";
import { getAdminAccess, hasBackofficeAccess } from "@/lib/admin-auth";
import { recordAuditLog, recordLifecycleEvent } from "@/lib/lifecycle";

function json(data: any, status = 200) {
  return NextResponse.json(data, { status, headers: { "Cache-Control": "no-store" } });
}

export async function POST(req: NextRequest, context: any) {
  try {
    const access = await getAdminAccess();
    if (!access) return json({ error: "Unauthorized" }, 401);

    const clientId = context?.params?.id as string | undefined;
    if (!clientId) return json({ error: "Missing client id" }, 400);

    const { flagId } = await req.json().catch(() => ({}));
    if (!flagId) return json({ error: "Missing flagId" }, 400);

    const flag = await prisma.clientFieldFlag.findFirst({
      where:
        hasBackofficeAccess(access)
          ? { id: flagId, clientId }
          : { id: flagId, advisorId: access.advisorId || "", clientId },
      select: { id: true, advisorId: true, clientId: true },
    });
    if (!flag) return json({ error: "Not found" }, 404);

    await prisma.clientFieldFlag.update({
      where: { id: flag.id },
      data: { status: "resolved" },
    });

    await Promise.allSettled([
      recordLifecycleEvent({
        eventType: "client.flag.resolved",
        actorRole: access.role,
        advisorId: flag.advisorId,
        clientId: flag.clientId,
        metadata: { flagId: flag.id },
      }),
      recordAuditLog({
        actorRole: access.role,
        actorLabel: access.userEmail || access.advisorEmail || access.label,
        actorUserId: access.userId,
        advisorId: flag.advisorId,
        action: "client.flag.resolved",
        targetType: "client_field_flag",
        targetId: flag.id,
        metadata: { clientId: flag.clientId },
      }),
    ]);

    return json({ ok: true });
  } catch (e) {
    console.error("POST /api/admin/clients/[id]/flags/resolve error:", e);
    return json({ error: "Server error" }, 500);
  }
}

export async function GET() {
  return NextResponse.json({ ok: false, error: "Use POST" }, { status: 405 });
}
