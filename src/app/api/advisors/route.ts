// src/app/api/advisors/route.ts
import crypto from "crypto";
import { NextResponse } from "next/server";
import { prisma } from "../../../prisma";
import { issueAdvisorToken } from "../../../lib/jwt";
import { setSentryTagsServer } from "@/lib/sentry-tags";

function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 40);
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({} as any));
    const name: string = body?.name || "Demo Advisor";
    const firmCode: string | undefined = body?.firmCode ?? body?.firm ?? undefined;

    // Sentry tags (safe if Sentry is off)
    setSentryTagsServer({ firmCode, advisorId: null });

    // --- Create advisor with unique slug ---
    const baseSlug = slugify(`${name}-${firmCode ?? ""}`) || "advisor";
    let slug = baseSlug;
    let n = 1;
    // ensure slug uniqueness
    // eslint-disable-next-line no-await-in-loop
    while (await prisma.advisor.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${n++}`;
    }

    const advisor = await prisma.advisor.create({
      data: { name, firm: firmCode, slug },
      select: { id: true, slug: true, name: true, firm: true },
    });

    // --- Onboarding token (per-advisor intake link) ---
    const token = crypto.randomUUID().replace(/-/g, "");
    const link = await prisma.intakeLink.create({
      data: { token, advisorId: advisor.id },
      select: { token: true },
    });

    // --- Admin token for advisor's dashboard cookie ---
    const adminToken = issueAdvisorToken(advisor.id);

    // --- Build correct, production-safe URLs using your domains ---
    const APP_ORIGIN = process.env.NEXT_PUBLIC_APP_ORIGIN || "https://marengofinance-app.com";
    const ADMIN_ORIGIN = process.env.NEXT_PUBLIC_ADMIN_ORIGIN || "https://marengofinance-admin.com";

    const onboardingUrl = `${APP_ORIGIN}/onboarding/${encodeURIComponent(link.token)}`;
    const adminUrl = `${ADMIN_ORIGIN}/api/admin/accept?admin_token=${encodeURIComponent(adminToken)}&next=%2Fadmin%2Fclients`;

    // Also tag Sentry now that we know the advisorId
    setSentryTagsServer({ firmCode, advisorId: advisor.id });

    // Return both simple IDs and ready-to-share links
    return NextResponse.json(
      {
        advisorId: advisor.id,
        token: link.token,
        links: { onboardingUrl, adminUrl },
        advisor,
      },
      { status: 201 }
    );
  } catch (e) {
    console.error("POST /api/advisors error:", e);
    return NextResponse.json({ error: "Failed to create advisor" }, { status: 500 });
  }
}