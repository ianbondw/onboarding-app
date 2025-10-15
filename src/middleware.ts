// src/middleware.ts
import { NextResponse, NextRequest } from "next/server";

const OWNER_COOKIE = "admin_token";      // set by /api/admin/login (owner mode)
const ADVISOR_COOKIE = "advisor_admin";  // advisor JWT cookie used by dashboard

export function middleware(req: NextRequest) {
  const { nextUrl } = req;
  const { pathname, search } = nextUrl;

  const isAdminPage = pathname.startsWith("/admin");
  const isAdminApi  = pathname.startsWith("/api/admin");
  if (!isAdminPage && !isAdminApi) return NextResponse.next();

  // --- NEW: accept ?admin_token=... on any admin route ---
  // If present, set advisor cookie and:
  //  - for pages: redirect to same URL without the query param
  //  - for APIs: continue (no redirect)
  const adminToken = nextUrl.searchParams.get("admin_token");
  if (adminToken) {
    const cleaned = new URL(nextUrl.toString());
    cleaned.searchParams.delete("admin_token");

    const res = isAdminApi ? NextResponse.next() : NextResponse.redirect(cleaned);
    res.cookies.set(ADVISOR_COOKIE, adminToken, {
      httpOnly: true,
      sameSite: "lax",
      secure: true,
      path: "/",                // all admin pages
      maxAge: 60 * 60 * 24 * 30 // 30 days
    });
    return res;
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

  // Require an owner or advisor cookie for all other admin pages/APIs
  const hasOwner   = !!req.cookies.get(OWNER_COOKIE)?.value;
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