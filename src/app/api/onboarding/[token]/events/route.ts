export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/prisma";
import { recordLifecycleEvent } from "@/lib/lifecycle";

function json(data: any, status = 200) {
  return NextResponse.json(data, {
    status,
    headers: { "Cache-Control": "no-store" },
  });
}

export async function POST(req: NextRequest, context: any) {
  try {
    const token = context?.params?.token as string | undefined;
    if (!token) return json({ error: "Missing token" }, 400);

    const intake = await prisma.intakeLink.findUnique({
      where: { token },
      select: { advisorId: true, isActive: true, expiresAt: true },
    });
    const expired = !!intake?.expiresAt && intake.expiresAt.getTime() <= Date.now();
    if (!intake?.advisorId || !intake.isActive || expired) {
      return json({ error: "Invalid or expired token." }, 404);
    }

    const body = await req.json().catch(() => ({} as any));
    const eventType = String(body?.eventType || "").trim();
    if (!eventType) return json({ error: "Missing eventType" }, 400);

    const email =
      typeof body?.email === "string" && body.email.trim()
        ? body.email.trim().toLowerCase()
        : null;

    let clientId: string | null = null;
    if (email) {
      const client = await prisma.client.findUnique({
        where: { advisorId_email: { advisorId: intake.advisorId, email } },
        select: { id: true },
      });
      clientId = client?.id ?? null;
    }

    await recordLifecycleEvent({
      eventType: `onboarding.${eventType}`,
      actorRole: "client",
      advisorId: intake.advisorId,
      clientId,
      metadata: {
        step: body?.step ?? null,
        email,
      },
    });

    return json({ ok: true });
  } catch (e) {
    console.error("POST /api/onboarding/[token]/events error:", e);
    return json({ error: "Server error" }, 500);
  }
}
