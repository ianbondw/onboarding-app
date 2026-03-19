import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  PORTAL_SESSION_COOKIE,
  clearPortalSessionCookie,
  revokePortalSession,
} from "@/lib/admin-auth";
export async function POST() {
  const jar = await cookies();
  const rawToken = jar.get(PORTAL_SESSION_COOKIE)?.value || null;
  await revokePortalSession(rawToken);

  const res = NextResponse.json({ ok: true });
  clearPortalSessionCookie(res);
  res.cookies.set("admin_token", "", { path: "/", maxAge: 0 });
  res.cookies.set("advisor_admin", "", { path: "/", maxAge: 0 });
  return res;
}
