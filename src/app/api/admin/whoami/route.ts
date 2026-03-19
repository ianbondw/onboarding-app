export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { getAdminAccess } from "@/lib/admin-auth";

export async function GET(_req: NextRequest) {
  const access = await getAdminAccess();

  return NextResponse.json(
    {
      authenticated: !!access,
      role: access?.role ?? null,
      advisorId: access?.advisorId ?? null,
      advisorName: access?.advisorName ?? null,
      advisorEmail: access?.advisorEmail ?? null,
      userId: access?.userId ?? null,
      userEmail: access?.userEmail ?? null,
    },
    { headers: { "Cache-Control": "no-store" } }
  );
}
