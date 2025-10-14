// src/middleware.ts
import { NextResponse, NextRequest } from "next/server";

const OWNER_COOKIE = "admin_token";     // set by /api/admin/login
const ADVISOR_COOKIE = "advisor_admin"; // set by /api/admin/accept

export function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl;

  const isAdminPage = pathname.startsWith("/admin");
  const isAdminApi  = pathname.startsWith("/api/admin");
  if (!isAdminPage && !isAdminApi) return NextResponse.next();

  // Public admin endpoints
  if (
    pathname.startsWith("/admin/login") ||
    pathname.startsWith("/api/admin/login") ||
    pathname.startsWith("/api/admin/logout") ||
    pathname.startsWith("/api/admin/accept") // new verifier route
  ) {
    return NextResponse.next();
  }

  // Require a valid cookie (owner or advisor) for all other admin pages/APIs
  const hasOwner = !!req.cookies.get(OWNER_COOKIE)?.value;
  const hasAdvisor = !!req.cookies.get(ADVISOR_COOKIE)?.value;
  if (hasOwner || hasAdvisor) return NextResponse.next();

  // If it's an API under /api/admin, return JSON 401
  if (isAdminApi) {
    return NextResponse.json(
      { error: "Unauthorized: missing or invalid admin token." },
      { status: 401 }
    );
  }

  // Otherwise redirect to login with next=...
  const to = req.nextUrl.clone();
  to.pathname = "/admin/login";
  to.search = `?next=${encodeURIComponent(pathname + (search || ""))}`;
  return NextResponse.redirect(to);
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};