export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { verifyAdvisorToken } from "@/lib/jwt";
import {
  clearPortalSessionCookie,
  createPortalSession,
  sanitizeNextPath,
  setPortalSessionCookie,
} from "@/lib/admin-auth";
import { prisma } from "@/prisma";
import { recordAuditLog, recordLifecycleEvent } from "@/lib/lifecycle";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const token = url.searchParams.get("admin_token") || "";
  const nextPath = sanitizeNextPath(url.searchParams.get("next"), "/admin/clients");

  try {
    const payload = verifyAdvisorToken(token);
    const advisorId =
      (payload as any)?.advisorId || (payload as any)?.sub || (payload as any)?.id;
    if (!advisorId) throw new Error("Invalid advisor token");

    const advisor = await prisma.advisor.findUnique({
      where: { id: advisorId },
      select: { id: true, name: true, email: true },
    });
    if (!advisor) throw new Error("Advisor not found");

    const advisorUser = advisor.email
      ? await prisma.portalUser.findUnique({
          where: { email: advisor.email.toLowerCase() },
          select: {
            id: true,
            role: true,
            advisorId: true,
            isActive: true,
          },
        })
      : null;

    const created = await createPortalSession({
      role: "advisor",
      userId:
        advisorUser?.role === "advisor" &&
        advisorUser.isActive &&
        advisorUser.advisorId === advisor.id
          ? advisorUser.id
          : null,
      advisorId: advisor.id,
      label: advisor.email || advisor.name,
    });

    const res = NextResponse.redirect(new URL(nextPath, url.origin), { status: 303 });
    res.headers.set("Cache-Control", "no-store");
    clearPortalSessionCookie(res);
    setPortalSessionCookie(res, created.token, created.ttlSec);
    res.cookies.set("admin_token", "", { path: "/", maxAge: 0 });
    res.cookies.set("advisor_admin", "", { path: "/", maxAge: 0 });

    await Promise.allSettled([
      recordLifecycleEvent({
        eventType: "advisor.login_link.accepted",
        actorRole: "advisor",
        advisorId: advisor.id,
        metadata: { nextPath },
      }),
      recordAuditLog({
        actorRole: "advisor",
        actorLabel: advisor.email || advisor.name,
        advisorId: advisor.id,
        action: "advisor.session.created",
        targetType: "session",
        metadata: { nextPath },
      }),
    ]);

    return res;
  } catch {
    return NextResponse.json(
      { error: "Invalid admin_token" },
      { status: 400, headers: { "Cache-Control": "no-store" } }
    );
  }
}
