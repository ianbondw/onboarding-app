// src/app/api/demo-token/route.ts
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { prisma } from "@/prisma";

function rand(len = 24) {
  const bytes = crypto.getRandomValues(new Uint8Array(len));
  return Array.from(bytes, b => b.toString(16).padStart(2, "0")).join("").slice(0, len);
}

export async function POST() {
  try {
    const slug  = process.env.DEMO_ADVISOR_SLUG || "demo";
    const name  = process.env.DEMO_ADVISOR_NAME || "Advisor Baby";
    const firm  = process.env.DEMO_ADVISOR_FIRM || "LinkedIn Capital";

    const advisor = await prisma.advisor.upsert({
      where: { slug },
      update: { name, firm },
      create: { slug, name, firm },
      select: { id: true },
    });

    const token = rand(24);
    await prisma.intakeLink.create({
      data: {
        token,
        advisorId: advisor.id,
        isActive: true,
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 12), // 12h demo links
      },
    });

    const appOrigin = (process.env.NEXT_PUBLIC_APP_ORIGIN || "https://marengofinance-app.com").replace(/\/$/, "");
    const url = `${appOrigin}/onboarding/${token}`;
    return NextResponse.json({ ok: true, token, url }, { headers: { "Cache-Control": "no-store" } });
  } catch (e: any) {
    console.error("POST /api/demo-token error:", e);
    return NextResponse.json({ ok: false, error: e?.message || "Server error" }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ error: "Method not allowed." }, { status: 405 });
}