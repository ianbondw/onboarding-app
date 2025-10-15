// src/app/api/admin/whoami/route.ts
export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyAdvisorToken } from "@/lib/jwt";

export async function GET(_req: NextRequest) {
  const jar = await cookies();
  const advisorCookie = jar.get("advisor_admin")?.value || null;

  let decoded: any = null;
  if (advisorCookie) {
    try {
      decoded = verifyAdvisorToken(advisorCookie);
    } catch {}
  }

  return NextResponse.json(
    {
      advisor_cookie_present: !!advisorCookie,
      advisor_cookie_prefix: advisorCookie ? advisorCookie.slice(0, 12) + "…" : null,
      jwt_decoded: decoded, // { advisorId } or null
    },
    { headers: { "Cache-Control": "no-store" } }
  );
}