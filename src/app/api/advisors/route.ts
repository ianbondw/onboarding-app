// src/app/api/advisors/route.ts
export const runtime = "nodejs"; // Prisma needs Node runtime on Vercel

import crypto from "crypto";
import { NextResponse } from "next/server";
import { prisma } from "../../../prisma";
import { issueAdvisorToken } from "../../../lib/jwt";

function slugify(s: string) {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40);
}

export async function POST(req: Request) {
  try {
    // --- Parse & validate ---
    const body = await req.json().catch(() => ({}));
    const name: string = (body?.name || "").toString().trim();
    const firm: string | undefined = body?.firm?.toString().trim() || undefined;
    if (!name) {
      return NextResponse.json({ error: "Missing advisor name" }, { status: 400 });
    }

    // --- Unique slug ---
    const baseSlug = slugify(`${name}-${firm ?? ""}`) || "advisor";
    let slug = baseSlug;
    let n = 1;
    while (await prisma.advisor.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${n++}`;
    }

    // --- Create advisor ---
    const advisor = await prisma.advisor.create({
      data: { name, firm, slug },
      select: { id: true, slug: true, name: true, firm: true },
    });

    // --- Create intake token (for client onboarding link) ---
    const token = crypto.randomUUID().replace(/-/g, "");
    const link = await prisma.intakeLink.create({
      data: { token, advisorId: advisor.id },
      select: { token: true },
    });

    // --- Generate admin cookie token (for advisor dashboard) ---
    const adminToken = issueAdvisorToken(advisor.id);

    // --- Build URLs (allow overriding app/admin origins) ---
    const reqUrl = new URL(req.url);
    const ADMIN_ORIGIN = process.env.NEXT_PUBLIC_ADMIN_ORIGIN || reqUrl.origin;
    const APP_ORIGIN = process.env.NEXT_PUBLIC_APP_ORIGIN || reqUrl.origin;

    const onboardingUrl = `${APP_ORIGIN}/onboarding/${link.token}`;
    const adminUrl = `${ADMIN_ORIGIN}/admin/clients?admin_token=${adminToken}`;

    return NextResponse.json(
      { advisor, links: { onboardingUrl, adminUrl } },
      { status: 201 }
    );
  } catch (e: any) {
    console.error("POST /api/advisors error:", e);
    // Handle common Prisma unique errors etc.
    const code = e?.code;
    if (code === "P2002") {
      return NextResponse.json({ error: "Advisor already exists" }, { status: 409 });
    }
    return NextResponse.json({ error: "Failed to create advisor" }, { status: 500 });
  }
}