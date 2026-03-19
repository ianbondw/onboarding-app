export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { prisma } from "@/prisma";
import { getAdminAccess, hasBackofficeAccess } from "@/lib/admin-auth";
import { sendMail } from "@/lib/mailer";
import { recordAuditLog, recordLifecycleEvent } from "@/lib/lifecycle";

export async function POST(_req: Request, context: any) {
  try {
    const access = await getAdminAccess();
    if (!access) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const clientId = context?.params?.id as string | undefined;
    if (!clientId) return NextResponse.json({ error: "Missing client id" }, { status: 400 });

    const client = await prisma.client.findFirst({
      where:
        hasBackofficeAccess(access)
          ? { id: clientId }
          : { id: clientId, advisorId: access.advisorId || "" },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        advisorId: true,
      },
    });

    if (!client) return NextResponse.json({ error: "Not found" }, { status: 404 });
    if (!client.email) {
      return NextResponse.json({ error: "Client has no email" }, { status: 400 });
    }

    const link = await prisma.intakeLink.findFirst({
      where: { advisorId: client.advisorId || "" },
      orderBy: { createdAt: "desc" },
      select: { token: true },
    });
    if (!link?.token) {
      return NextResponse.json({ error: "No intake link for this advisor" }, { status: 400 });
    }

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

    await Promise.allSettled([
      recordLifecycleEvent({
        eventType: "client.invite.resent",
        actorRole: access.role,
        advisorId: client.advisorId,
        clientId: client.id,
        metadata: { simulated: !res.ok },
      }),
      recordAuditLog({
        actorRole: access.role,
        actorLabel: access.userEmail || access.advisorEmail || access.label,
        actorUserId: access.userId,
        advisorId: client.advisorId,
        action: "client.invite.resent",
        targetType: "client",
        targetId: client.id,
        metadata: { simulated: !res.ok },
      }),
    ]);

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
