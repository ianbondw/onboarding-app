// src/app/api/admin/clients/[id]/status/route.ts
export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { getAdvisorIdFromCookie } from "@/lib/session";

/** Lazy Prisma import to avoid path issues on Vercel */
async function getPrisma() {
  const { PrismaClient } = await import("@prisma/client");
  return new PrismaClient();
}

const ALLOWED = new Set([
  "new",
  "in_progress",
  "waiting",
  "ready",
  "complete",
]);

export async function POST(req: NextRequest, ctx: { params: { id: string } }) {
  try {
    const id = ctx.params?.id;
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

    const { status } = await req.json().catch(() => ({} as any));
    const s = String(status || "").toLowerCase();
    if (!ALLOWED.has(s)) {
      return NextResponse.json(
        { error: `Invalid status. Allowed: ${[...ALLOWED].join(", ")}` },
        { status: 400 }
      );
    }

    const prisma = await getPrisma();
    const advisorId = await getAdvisorIdFromCookie();

    // If advisor cookie present, enforce row ownership
    const where: any = advisorId ? { id, advisorId } : { id };

    const updated = await prisma.client.update({
      where,
      data: { onboardingStatus: s, updatedAt: new Date() },
      select: { id: true, onboardingStatus: true },
    });

    return NextResponse.json({ ok: true, client: updated });
  } catch (e: any) {
    console.error("status update error", e);
    return NextResponse.json(
      { error: e?.message || "Server error" },
      { status: 500 }
    );
  }
}