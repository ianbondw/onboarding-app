import { NextResponse, NextRequest } from "next/server";
import { verifyAdvisorToken, advisorCookie } from "./lib/jwt";

export function middleware(req: NextRequest) {
  const { pathname, searchParams } = req.nextUrl;

  // Only apply to /admin routes
  if (!pathname.startsWith("/admin")) {
    return NextResponse.next();
  }

  // Check if valid cookie already set
  const cookie = req.cookies.get(advisorCookie.name)?.value;
  if (cookie && verifyAdvisorToken(cookie)) {
    return NextResponse.next();
  }

  // Allow ?admin_token=<token> to set cookie and redirect cleanly
  const urlToken = searchParams.get("admin_token");
  if (urlToken) {
    const verified = verifyAdvisorToken(urlToken);
    if (verified) {
      const cleanUrl = new URL(req.url);
      cleanUrl.searchParams.delete("admin_token");

      const res = NextResponse.redirect(cleanUrl);
      const secure = req.nextUrl.protocol === "https:" || process.env.NODE_ENV === "production";
      res.headers.append("Set-Cookie", advisorCookie.toSetCookie(urlToken, secure));
      return res;
    }
  }

  // Not authorized
  return new NextResponse("Unauthorized: missing or invalid admin token.", { status: 401 });
}

export const config = {
  matcher: ["/admin/:path*"],
};