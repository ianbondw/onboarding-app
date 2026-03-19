export const runtime = "nodejs";

import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";
export function GET(req: Request) {
  const { origin } = new URL(req.url);
  return NextResponse.redirect(`${origin}/pilot`);
}
