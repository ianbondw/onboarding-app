export const runtime = "nodejs";

import crypto from "crypto";
import { NextResponse } from "next/server";
import { prisma } from "../../../prisma";
import { issueAdvisorToken } from "../../../lib/jwt";
import { sendMail } from "@/lib/mailer";
import {
  canManageAdvisors,
  getAdminAccess,
  provisionPortalUser,
} from "@/lib/admin-auth";
import { recordAuditLog, recordLifecycleEvent } from "@/lib/lifecycle";

function slugify(s: string) {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40);
}

export async function POST(req: Request) {
  try {
    const access = await getAdminAccess();
    if (!access || !canManageAdvisors(access)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!process.env.DATABASE_URL) {
      return NextResponse.json({ error: "Missing DATABASE_URL (Vercel env)" }, { status: 500 });
    }
    if (!process.env.DEMO_JWT_SECRET) {
      return NextResponse.json({ error: "Missing DEMO_JWT_SECRET (Vercel env)" }, { status: 500 });
    }

    const body = await req.json().catch(() => ({}));
    const name = (body?.name ?? "").toString().trim();
    const firm = (body?.firm ?? "").toString().trim() || undefined;
    const email = (body?.email ?? "").toString().trim().toLowerCase() || undefined;

    if (!name) {
      return NextResponse.json({ error: "Missing advisor name" }, { status: 400 });
    }
    if (email) {
      const existingPortalUser = await prisma.portalUser.findUnique({
        where: { email },
        select: { id: true },
      });
      if (existingPortalUser) {
        return NextResponse.json(
          { error: "That email is already in use by another portal user." },
          { status: 409 }
        );
      }
    }

    const baseSlug = slugify(`${name}-${firm ?? ""}`) || "advisor";
    let slug = baseSlug;
    let n = 1;
    while (await prisma.advisor.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${n++}`;
    }

    const result = await prisma.$transaction(async (tx) => {
      const advisor = await tx.advisor.create({
        data: { name, firm, email, slug },
        select: { id: true, slug: true, name: true, firm: true, email: true },
      });

      const token = crypto.randomUUID().replace(/-/g, "");
      const link = await tx.intakeLink.create({
        data: { token, advisorId: advisor.id },
        select: { token: true },
      });

      return { advisor, link };
    });

    const adminToken = issueAdvisorToken(result.advisor.id);

    const reqUrl = new URL(req.url);
    const ADMIN_ORIGIN = process.env.NEXT_PUBLIC_ADMIN_ORIGIN || reqUrl.origin;
    const APP_ORIGIN = process.env.NEXT_PUBLIC_APP_ORIGIN || reqUrl.origin;

    const onboardingUrl = `${APP_ORIGIN}/onboarding/${result.link.token}`;
    const adminUrl = `${ADMIN_ORIGIN}/admin/clients?admin_token=${adminToken}`;
    const loginUrl = `${ADMIN_ORIGIN}/admin/login`;

    const portalUser = email
      ? await provisionPortalUser({
          email,
          role: "advisor",
          advisorId: result.advisor.id,
        })
      : null;

    if (portalUser) {
      await sendMail({
        to: portalUser.user.email,
        subject: "Your Marengo advisor workspace is ready",
        text: `Your advisor workspace has been provisioned.

Advisor: ${result.advisor.name}
Firm: ${result.advisor.firm || "(none)"}

Login URL: ${loginUrl}
Temporary password: ${portalUser.temporaryPassword}
Direct dashboard link: ${adminUrl}
Onboarding link: ${onboardingUrl}`,
      });
    }

    await Promise.allSettled([
      recordLifecycleEvent({
        eventType: "advisor.created",
        actorRole: "owner",
        advisorId: result.advisor.id,
        metadata: {
          email: result.advisor.email,
          firm: result.advisor.firm,
          portalUserCreated: !!portalUser,
        },
      }),
      recordAuditLog({
        actorRole: "owner",
        actorLabel: access.userEmail || access.label,
        actorUserId: access.userId,
        advisorId: result.advisor.id,
        action: "advisor.created",
        targetType: "advisor",
        targetId: result.advisor.id,
        metadata: {
          email: result.advisor.email,
          firm: result.advisor.firm,
          portalUserCreated: !!portalUser,
        },
      }),
    ]);

    return NextResponse.json(
      {
        advisor: result.advisor,
        links: { onboardingUrl, adminUrl, loginUrl },
        portalUser: portalUser
          ? {
              email: portalUser.user.email,
              temporaryPassword: portalUser.temporaryPassword,
            }
          : null,
      },
      { status: 201 }
    );
  } catch (e: any) {
    console.error("POST /api/advisors error:", e);
    if (e?.code === "P2002") {
      return NextResponse.json({ error: "Advisor already exists (slug conflict)" }, { status: 409 });
    }
    return NextResponse.json({ error: e?.message || "Failed to create advisor" }, { status: 500 });
  }
}
