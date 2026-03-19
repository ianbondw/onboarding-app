import { NextResponse } from "next/server";
import {
  clearPortalSessionCookie,
  loginPortalUser,
  setPortalSessionCookie,
} from "@/lib/admin-auth";
import { recordAuditLog, recordLifecycleEvent } from "@/lib/lifecycle";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const { email, password } = await req.json().catch(() => ({
    email: "",
    password: "",
  }));

  if (!password) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const login = await loginPortalUser(email, password);
  if (!login) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true, role: login.role });
  clearPortalSessionCookie(res);
  setPortalSessionCookie(res, login.token, login.ttlSec);
  res.cookies.set("admin_token", "", { path: "/", maxAge: 0 });
  res.cookies.set("advisor_admin", "", { path: "/", maxAge: 0 });

  await Promise.allSettled([
    recordLifecycleEvent({
      eventType: `${login.role}.login`,
      actorRole: login.role,
      advisorId: login.user.advisorId ?? null,
      metadata: { email: login.user.email },
    }),
    recordAuditLog({
      actorRole: login.role,
      actorLabel: login.user.email,
      actorUserId: login.user.id,
      advisorId: login.user.advisorId ?? null,
      action: `${login.role}.login`,
      targetType: "session",
      metadata: { email: login.user.email },
    }),
  ]);

  return res;
}
