// src/app/api/admin/clients/[id]/resend-invite/route.ts
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { prisma } from "@/prisma";                  // ✅ use src/prisma.ts
import { getAdvisorIdFromCookie } from "@/lib/session";
import { sendMail } from "@/lib/mailer";

export async function POST(_req: Request, context: any) {
  try {
    const advisorId = await getAdvisorIdFromCookie();
    if (!advisorId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const clientId = context?.params?.id as string | undefined;
    if (!clientId) return NextResponse.json({ error: "Missing client id" }, { status: 400 });

    const [client, link] = await Promise.all([
      prisma.client.findFirst({
        where: { id: clientId, advisorId },
        select: { email: true, firstName: true, lastName: true },
      }),
      prisma.intakeLink.findFirst({
        where: { advisorId },
        orderBy: { createdAt: "desc" },
        select: { token: true },
      }),
    ]);

    if (!client) return NextResponse.json({ error: "Not found" }, { status: 404 });
    if (!client.email) return NextResponse.json({ error: "Client has no email" }, { status: 400 });
    if (!link?.token) return NextResponse.json({ error: "No intake link for this advisor" }, { status: 400 });

    const appOrigin = process.env.NEXT_PUBLIC_APP_ORIGIN || "https://marengofinance-app.com";
    const url = `${appOrigin}/onboarding/${link.token}`;
    const name = [client.firstName, client.lastName].filter(Boolean).join(" ") || "there";

    const res = await sendMail({
      to: client.email,
      subject: "Your Marengo onboarding link",
      text: `Hi ${name},

Here is your secure onboarding link:
${url}

If you have any questions, reply to this email and your advisor will help you complete it.`,
    });

    return NextResponse.json({ ok: true, simulated: !res.ok ? true : undefined });
  } catch (e) {
    console.warn("resend-invite failed:", e);
    return NextResponse.json({ error: "Send failed" }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json(
    { ok: false, error: "Use POST /api/admin/clients/[id]/resend-invite" },
    { status: 405 }
  );
}
