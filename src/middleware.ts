// src/middleware.ts
import { NextResponse, NextRequest } from "next/server";

// Support both the new and old cookie names
const ADMIN_COOKIE_NAMES = ["admin_token", "advisor_admin"];

export function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl;

  // Only guard /admin pages and /api/admin endpoints
  const isAdminPath = pathname.startsWith("/admin");
  const isAdminApi = pathname.startsWith("/api/admin");
  if (!isAdminPath && !isAdminApi) return NextResponse.next();

  // Always allow the login page and login/logout API
  const isAllowedPublic =
    pathname.startsWith("/admin/login") ||
    pathname.startsWith("/api/admin/login") ||
    pathname.startsWith("/api/admin/logout");

  if (isAllowedPublic) return NextResponse.next();

  // If we already have an admin cookie, proceed
  const hasToken = ADMIN_COOKIE_NAMES.some((n) => !!req.cookies.get(n)?.value);
  if (hasToken) return NextResponse.next();

  // No token: for API => 401 JSON; for pages => redirect to /admin/login?next=...
  if (isAdminApi) {
    return NextResponse.json(
      { error: "Unauthorized: missing or invalid admin token." },
      { status: 401 }
    );
  }

  const url = req.nextUrl.clone();
  url.pathname = "/admin/login";
  url.search = `?next=${encodeURIComponent(pathname + (search || ""))}`;
  return NextResponse.redirect(url);
}

// Limit the middleware to just these routes
export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};