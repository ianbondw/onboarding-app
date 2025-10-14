// src/middleware.ts
import { NextResponse, NextRequest } from "next/server";

// We accept either the owner's session cookie or an advisor-scoped cookie.
const OWNER_COOKIE = "admin_token";      // set by /api/admin/login
const ADVISOR_COOKIE = "advisor_admin";  // set from ?admin_token=<advisorId>

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const isAdminPath = pathname.startsWith("/admin");
  const isAdminApi = pathname.startsWith("/api/admin");
  if (!isAdminPath && !isAdminApi) return NextResponse.next();

  // --- Allow public admin routes: login page + login/logout API ---
  if (
    pathname.startsWith("/admin/login") ||
    pathname.startsWith("/api/admin/login") ||
    pathname.startsWith("/api/admin/logout")
  ) {
    return NextResponse.next();
  }

  // --- If an advisor came in with ?admin_token=..., set their cookie and clean the URL ---
  const urlToken = req.nextUrl.searchParams.get("admin_token");
  if (urlToken) {
    const cleanUrl = req.nextUrl.clone();
    cleanUrl.searchParams.delete("admin_token");

    const res = NextResponse.redirect(cleanUrl);
    res.cookies.set({
      name: ADVISOR_COOKIE,
      value: urlToken, // advisorId (or your advisor token)
      httpOnly: true,
      sameSite: "lax",
      secure: true,
      path: "/",
      maxAge: 60 * 60 * 24 * 180, // 180 days
    });
    return res;
  }

  // --- If owner or advisor already has a cookie, proceed ---
  const hasOwner = !!req.cookies.get(OWNER_COOKIE)?.value;
  const hasAdvisor = !!req.cookies.get(ADVISOR_COOKIE)?.value;
  if (hasOwner || hasAdvisor) return NextResponse.next();

  // --- Otherwise block page requests with redirect to owner login; API gets 401 ---
  if (isAdminApi) {
    return NextResponse.json(
      { error: "Unauthorized: missing or invalid admin token." },
      { status: 401 }
    );
  }

  const url = req.nextUrl.clone();
  url.pathname = "/admin/login";
  url.search = `?next=${encodeURIComponent(pathname + (req.nextUrl.search || ""))}`;
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};