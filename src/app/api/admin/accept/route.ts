// src/app/api/admin/accept/route.ts
import { NextResponse } from "next/server";
import { verifyAdvisorToken } from "@/lib/jwt";

const ADVISOR_COOKIE = "advisor_admin";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const token = url.searchParams.get("admin_token") || "";
  const next = url.searchParams.get("next") || "/admin/clients";

  try {
    const payload: any = verifyAdvisorToken(token); // throws if invalid
    const advisorId =
      payload?.advisorId || payload?.sub || payload?.id;
    if (!advisorId) throw new Error("Invalid advisor token");

    const res = NextResponse.redirect(new URL(next, url.origin));
    res.cookies.set({
      name: ADVISOR_COOKIE,
      value: advisorId,         // cookie your app already expects
      httpOnly: true,
      sameSite: "lax",
      secure: true,
      path: "/",
      maxAge: 60 * 60 * 24 * 180, // 180 days
    });
    return res;
  } catch {
    return NextResponse.json({ error: "Invalid admin_token" }, { status: 400 });
  }
}