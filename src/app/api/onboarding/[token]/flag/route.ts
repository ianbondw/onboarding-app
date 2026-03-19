// src/app/api/onboarding/[token]/flag/route.ts
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
    if (!token || typeof token !== "string" || token.trim().length === 0) {
      return json({ error: "Missing or invalid token." }, 400);
    }

    const { email, fieldKey, note } = await req.json().catch(() => ({}));
    if (!email || typeof email !== "string") {
      return json({ error: "Missing email." }, 400);
    }
    if (!fieldKey || typeof fieldKey !== "string") {
      return json({ error: "Missing fieldKey." }, 400);
    }
    const emailOk = /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(String(email));
    if (!emailOk) return json({ error: "Invalid email." }, 400);

    // Find advisor via intake token
    const intake = await prisma.intakeLink.findUnique({
      where: { token },
      select: { advisorId: true },
    });
    if (!intake?.advisorId) return json({ error: "Invalid or expired token." }, 404);
    const advisorId = intake.advisorId;

    // Ensure there's a client row we can attach to.
    // (String fields can be empty; schema requires non-null.)
    const client = await prisma.client.upsert({
      where: { advisorId_email: { advisorId, email } },
      update: {}, // do not overwrite here
      create: {
        advisorId,
        email,
        firstName: "",
        lastName: "",
        onboardingStatus: "in_progress",
      },
      select: { id: true },
    });

    // Create/open a flag
    const flag = await prisma.clientFieldFlag.create({
      data: {
        clientId: client.id,
        advisorId,
        fieldKey,
        note: note ? String(note).slice(0, 2000) : null,
        status: "open",
      },
      select: { id: true, createdAt: true },
    });

    await recordLifecycleEvent({
      eventType: "client.field.flagged",
      actorRole: "client",
      advisorId,
      clientId: client.id,
      metadata: { fieldKey, flagId: flag.id },
    }).catch(() => null);

    return json({ ok: true, flagId: flag.id });
  } catch (e) {
    console.error("POST /api/onboarding/[token]/flag error:", e);
    return json({ error: "Server error" }, 500);
  }
}

export async function GET() {
  return NextResponse.json({ ok: false, error: "Use POST" }, { status: 405 });
}
