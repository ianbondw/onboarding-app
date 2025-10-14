// src/app/api/admin/accept/route.ts
import { NextResponse } from "next/server";
import { verifyAdvisorToken } from "@/lib/jwt";

const ADVISOR_COOKIE = "advisor_admin";
const OWNER_COOKIE = "admin_token";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const token = url.searchParams.get("admin_token") || "";
  const next = url.searchParams.get("next") || "/admin/clients";

  try {
    const payload: any = verifyAdvisorToken(token); // throws if invalid
    const advisorId = payload?.advisorId || payload?.sub || payload?.id;
    if (!advisorId) throw new Error("Invalid advisor token");

    const res = NextResponse.redirect(new URL(next, url.origin));

    // set advisor scope cookie (stores advisorId directly)
    res.cookies.set({
      name: ADVISOR_COOKIE,
      value: advisorId,
      httpOnly: true,
      sameSite: "lax",
      secure: true,
      path: "/",
      maxAge: 60 * 60 * 24 * 180,
    });

    // clear owner cookie so we don’t show all advisors by accident
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
    return NextResponse.json({ error: "Invalid admin_token" }, { status: 400 });
  }
}