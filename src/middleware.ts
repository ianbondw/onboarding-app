// src/middleware.ts
import { NextResponse, NextRequest } from "next/server";

const PORTAL_SESSION_COOKIE = "portal_session";

export function middleware(req: NextRequest) {
  const { nextUrl } = req;
  const { pathname, search } = nextUrl;

  const isAdminPage = pathname.startsWith("/admin");
  const isAdminApi  = pathname.startsWith("/api/admin");
  if (!isAdminPage && !isAdminApi) return NextResponse.next();

  // Route magic-link style advisor access through the accept endpoint, which
  // verifies the token before issuing a real portal session cookie.
  const adminToken = nextUrl.searchParams.get("admin_token");
  if (adminToken && isAdminPage && !pathname.startsWith("/admin/login")) {
    const cleaned = new URL(nextUrl.toString());
    cleaned.searchParams.delete("admin_token");
    const acceptUrl = new URL("/api/admin/accept", nextUrl.origin);
    acceptUrl.searchParams.set("admin_token", adminToken);
    acceptUrl.searchParams.set("next", cleaned.pathname + cleaned.search);
    return NextResponse.redirect(acceptUrl);
  }

  // Public admin endpoints (no auth required)
  if (
    pathname.startsWith("/admin/login") ||
    pathname.startsWith("/api/admin/login") ||
    pathname.startsWith("/api/admin/logout") ||
    pathname.startsWith("/api/admin/accept") // keep if you still call this
  ) {
    return NextResponse.next();
  }

  // Require a real portal session for all other admin pages/APIs. Detailed
  // session validation happens inside the page/API handlers themselves.
  const hasPortalSession = !!req.cookies.get(PORTAL_SESSION_COOKIE)?.value;
  if (hasPortalSession) return NextResponse.next();

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
