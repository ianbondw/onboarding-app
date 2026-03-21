import { NextResponse } from "next/server";
import { SECURITY_EMAIL, SITE_ORIGIN } from "@/lib/site-config";

export const dynamic = "force-static";

export async function GET() {
  const expires = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString();
  const body = [
    `Contact: mailto:${SECURITY_EMAIL}`,
    `Policy: ${SITE_ORIGIN}/security`,
    `Canonical: ${SITE_ORIGIN}/.well-known/security.txt`,
    `Expires: ${expires}`,
    "Preferred-Languages: en",
  ].join("\n");

  return new NextResponse(body, {
    status: 200,
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "public, max-age=3600",
    },
  });
}
