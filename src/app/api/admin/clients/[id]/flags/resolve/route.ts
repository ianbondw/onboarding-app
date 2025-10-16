// src/app/api/admin/clients/[id]/flags/resolve/route.ts
export const runtime = "nodejs";

import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/prisma";
import { getAdvisorIdFromCookie } from "@/lib/session";

function json(data: any, status = 200) {
  return NextResponse.json(data, { status, headers: { "Cache-Control": "no-store" } });
}

export async function POST(req: NextRequest, context: any) {
  try {
    const advisorId = await getAdvisorIdFromCookie();
    if (!advisorId) return json({ error: "Unauthorized" }, 401);

    const clientId = context?.params?.id as string | undefined;
    if (!clientId) return json({ error: "Missing client id" }, 400);

    const { flagId } = await req.json().catch(() => ({}));
    if (!flagId) return json({ error: "Missing flagId" }, 400);

    // Ensure the flag belongs to this advisor + client
    const flag = await prisma.clientFieldFlag.findFirst({
      where: { id: flagId, advisorId, clientId },
      select: { id: true, status: true },
    });
    if (!flag) return json({ error: "Not found" }, 404);

    await prisma.clientFieldFlag.update({
      where: { id: flag.id },
      data: { status: "resolved" },
    });

    return json({ ok: true });
  } catch (e) {
    console.error("POST /api/admin/clients/[id]/flags/resolve error:", e);
    return json({ error: "Server error" }, 500);
  }
}

export async function GET() {
  return NextResponse.json({ ok: false, error: "Use POST" }, { status: 405 });
}