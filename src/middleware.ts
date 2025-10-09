// src/middleware.ts
import { NextResponse, NextRequest } from "next/server";

// Use a plain constant so middleware doesn't import any Node-only modules.
const ADMIN_COOKIE = "advisor_admin";

export function middleware(req: NextRequest) {
  const { pathname, searchParams } = req.nextUrl;

  // Only apply to /admin
  if (!pathname.startsWith("/admin")) {
    return NextResponse.next();
  }

  // If cookie already present, proceed
  const cookie = req.cookies.get(ADMIN_COOKIE)?.value;
  if (cookie) return NextResponse.next();

  // If ?admin_token=... present, set cookie and redirect to clean URL
  const urlToken = searchParams.get("admin_token");
  if (urlToken) {
    const cleanUrl = new URL(req.url);
    cleanUrl.searchParams.delete("admin_token");

    const res = NextResponse.redirect(cleanUrl);
    res.cookies.set({
      name: ADMIN_COOKIE,
      value: urlToken,
      httpOnly: true,
      sameSite: "lax",
      secure: true,
      path: "/",
      maxAge: 60 * 60 * 24 * 180, // 180 days
    });
    return res;
  }

  // Otherwise block
  return new NextResponse("Unauthorized: missing or invalid admin token.", { status: 401 });
}

export const config = {
  matcher: ["/admin/:path*"],
};