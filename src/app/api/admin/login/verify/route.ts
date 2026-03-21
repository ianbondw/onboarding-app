export const runtime = "nodejs";

import { NextResponse } from "next/server";
import {
  clearPortalSessionCookie,
  setPortalSessionCookie,
} from "@/lib/admin-auth";
import { requestIpFingerprint, verifyPortalLoginChallenge } from "@/lib/portal-mfa";
import { recordAuditLog, recordLifecycleEvent } from "@/lib/lifecycle";

export async function POST(req: Request) {
  const { challengeToken, code } = await req.json().catch(() => ({
    challengeToken: "",
    code: "",
  }));

  const result = await verifyPortalLoginChallenge({
    challengeToken,
    code,
    ipHash: requestIpFingerprint(req),
  });

  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true, role: result.session.role });
  clearPortalSessionCookie(res);
  setPortalSessionCookie(res, result.session.token, result.session.ttlSec);
  res.cookies.set("admin_token", "", { path: "/", maxAge: 0 });
  res.cookies.set("advisor_admin", "", { path: "/", maxAge: 0 });

  await Promise.allSettled([
    recordLifecycleEvent({
      eventType: `${result.user.role}.login`,
      actorRole: result.user.role,
      advisorId: result.user.advisorId ?? null,
      metadata: { email: result.user.email, mfa: "email_otp" },
    }),
    recordAuditLog({
      actorRole: result.user.role,
      actorLabel: result.user.email,
      actorUserId: result.user.id,
      advisorId: result.user.advisorId ?? null,
      action: `${result.user.role}.login`,
      targetType: "session",
      metadata: { email: result.user.email, mfa: "email_otp" },
    }),
  ]);

  return res;
}
