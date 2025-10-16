import { NextResponse } from "next/server";
// ✅ Use your existing helper at src/app/prisma.ts
import { prisma } from "../../../../../prisma";
import { getAdvisorIdFromCookie } from "@/lib/session";
import { sendMail } from "@/lib/mailer";

export const runtime = "nodejs";

export async function POST(_: Request, { params }: { params: { id: string } }) {
  const advisorId = await getAdvisorIdFromCookie();
  if (!advisorId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const clientId = params.id;
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

  try {
    const res = await sendMail({
      to: client.email,
      subject: "Your Marengo onboarding link",
      text: `Hi ${name},

Here is your secure onboarding link:
${url}

If you have any questions, reply to this email and your advisor will help you complete it.`,
    });
    return NextResponse.json({ ok: true, simulated: !res.ok });
  } catch (e) {
    console.warn("resend-invite failed:", e);
    return NextResponse.json({ error: "Send failed" }, { status: 500 });
  }
}