// src/app/api/advisors/route.ts
import crypto from "crypto";
import { NextResponse } from "next/server";
import { prisma } from "../../../prisma";
import { issueAdvisorToken } from "../../../lib/jwt";

function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 40);
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const name: string = body?.name || "Demo Advisor";
    const firm: string | undefined = body?.firm;

    const baseSlug = slugify(`${name}-${firm ?? ""}`) || "advisor";
    let slug = baseSlug;
    let n = 1;
    while (await prisma.advisor.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${n++}`;
    }

    const advisor = await prisma.advisor.create({
      data: { name, firm, slug },
      select: { id: true, slug: true, name: true, firm: true },
    });

    // intake token for onboarding link
    const token = crypto.randomUUID().replace(/-/g, "");
    const link = await prisma.intakeLink.create({
      data: { token, advisorId: advisor.id },
      select: { token: true },
    });

    // admin token (JWT-style HMAC) for cookie
    const adminToken = issueAdvisorToken(advisor.id);

    const origin = new URL(req.url).origin;
    const onboardingUrl = `${origin}/onboarding/${link.token}`;
    const adminUrl = `${origin}/admin/clients?admin_token=${adminToken}`;

    return NextResponse.json({ advisor, links: { onboardingUrl, adminUrl } }, { status: 201 });
  } catch (e) {
    console.error("POST /api/advisors error:", e);
    return NextResponse.json({ error: "Failed to create advisor" }, { status: 500 });
  }
}