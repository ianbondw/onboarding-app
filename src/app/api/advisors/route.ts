// src/app/api/advisors/route.ts
export const runtime = "nodejs"; // Prisma needs Node on Vercel

import crypto from "crypto";
import { NextResponse } from "next/server";
import { prisma } from "../../../prisma";          // keep this import path as used elsewhere
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
    // --- sanity checks so we return helpful 500s instead of generic ---
    if (!process.env.DATABASE_URL) {
      return NextResponse.json({ error: "Missing DATABASE_URL (Vercel env)" }, { status: 500 });
    }
    if (!process.env.DEMO_JWT_SECRET) {
      return NextResponse.json({ error: "Missing DEMO_JWT_SECRET (Vercel env)" }, { status: 500 });
    }

    // --- parse input ---
    const body = await req.json().catch(() => ({}));
    const name = (body?.name ?? "").toString().trim();
    const firm = (body?.firm ?? "").toString().trim() || undefined;
    if (!name) {
      return NextResponse.json({ error: "Missing advisor name" }, { status: 400 });
    }

    // --- unique slug ---
    const baseSlug = slugify(`${name}-${firm ?? ""}`) || "advisor";
    let slug = baseSlug;
    let n = 1;
    // ensure uniqueness
    while (await prisma.advisor.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${n++}`;
    }

    // --- create advisor + intake link in a single txn ---
    const result = await prisma.$transaction(async (tx) => {
      const advisor = await tx.advisor.create({
        data: { name, firm, slug },
        select: { id: true, slug: true, name: true, firm: true },
      });

      const token = crypto.randomUUID().replace(/-/g, "");
      const link = await tx.intakeLink.create({
        data: { token, advisorId: advisor.id },
        select: { token: true },
      });

      return { advisor, link };
    });

    // --- admin/auth token for the advisor dashboard ---
    const adminToken = issueAdvisorToken(result.advisor.id);

    // --- build URLs (allow explicit domains via env) ---
    const reqUrl = new URL(req.url);
    const ADMIN_ORIGIN = process.env.NEXT_PUBLIC_ADMIN_ORIGIN || reqUrl.origin;
    const APP_ORIGIN   = process.env.NEXT_PUBLIC_APP_ORIGIN   || reqUrl.origin;

    const onboardingUrl = `${APP_ORIGIN}/onboarding/${result.link.token}`;
    const adminUrl      = `${ADMIN_ORIGIN}/admin/clients?admin_token=${adminToken}`;

    return NextResponse.json(
      { advisor: result.advisor, links: { onboardingUrl, adminUrl } },
      { status: 201 }
    );
  } catch (e: any) {
    console.error("POST /api/advisors error:", e);
    // Prisma duplicate key
    if (e?.code === "P2002") {
      return NextResponse.json({ error: "Advisor already exists (slug conflict)" }, { status: 409 });
    }
    // DB connectivity / schema issues get surfaced as 500s with message
    return NextResponse.json({ error: e?.message || "Failed to create advisor" }, { status: 500 });
  }
}