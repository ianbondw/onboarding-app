// src/app/api/admin/accept/route.ts
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { verifyAdvisorToken } from "@/lib/jwt";

const ADVISOR_COOKIE = "advisor_admin";
const OWNER_COOKIE = "admin_token";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const token = url.searchParams.get("admin_token") || "";
  const next = url.searchParams.get("next") || "/admin/clients";

  try {
    // verifyAdvisorToken returns { advisorId } or null
    const payload = verifyAdvisorToken(token);
    const advisorId = (payload as any)?.advisorId || (payload as any)?.sub || (payload as any)?.id;
    if (!advisorId) throw new Error("Invalid advisor token");

    const location = new URL(next, url.origin);

    const res = NextResponse.redirect(location, { status: 303 });
    res.headers.set("Cache-Control", "no-store");

    // Store advisor scope (ID is fine; your session helper handles raw ID or JWT)
    res.cookies.set({
      name: ADVISOR_COOKIE,
      value: advisorId,
      httpOnly: true,
      sameSite: "lax",
      secure: true,
      path: "/",
      maxAge: 60 * 60 * 24 * 180, // 180 days
    });

    // Clear owner cookie to prevent "All Advisors" mode
    res.cookies.set({
      name: OWNER_COOKIE,
      value: "",
      httpOnly: true,
      sameSite: "lax",
      secure: true,
      path: "/",
      maxAge: 0,
    });

    return res;
  } catch {
    return NextResponse.json({ error: "Invalid admin_token" }, { status: 400, headers: { "Cache-Control": "no-store" } });
  }
}