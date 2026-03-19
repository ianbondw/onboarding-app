export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { issueAdvisorToken } from "@/lib/jwt";
import { sendMail } from "@/lib/mailer";
import {
  canManagePortalUsers,
  getAdminAccess,
  provisionPortalUser,
} from "@/lib/admin-auth";
import { prisma } from "@/prisma";
import { recordAuditLog, recordLifecycleEvent } from "@/lib/lifecycle";

export async function GET() {
  const access = await getAdminAccess();
  if (!access || !canManagePortalUsers(access)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const users = await prisma.portalUser.findMany({
    orderBy: [{ role: "asc" }, { email: "asc" }],
    select: {
      id: true,
      email: true,
      role: true,
      isActive: true,
      advisorId: true,
      lastLoginAt: true,
      advisor: {
        select: {
          id: true,
          name: true,
          firm: true,
        },
      },
    },
  });

  return NextResponse.json({
    users: users.map((user) => ({
      ...user,
      lastLoginAt: user.lastLoginAt?.toISOString() ?? null,
    })),
  });
}

export async function POST(req: Request) {
  const access = await getAdminAccess();
  if (!access || !canManagePortalUsers(access)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json().catch(() => ({}));
    const email = (body?.email ?? "").toString().trim().toLowerCase();
    const role = (body?.role ?? "").toString().trim();
    const advisorId = (body?.advisorId ?? "").toString().trim() || null;
    const password = (body?.password ?? "").toString() || null;
    const notify = body?.notify !== false;

    const provisioned = await provisionPortalUser({
      email,
      role: role as any,
      advisorId,
      password,
      isActive: true,
    });

    const advisor =
      provisioned.user.advisorId
        ? await prisma.advisor.findUnique({
            where: { id: provisioned.user.advisorId },
            select: { id: true, name: true, firm: true },
          })
        : null;

    const adminOrigin = (process.env.NEXT_PUBLIC_ADMIN_ORIGIN || new URL(req.url).origin).replace(
      /\/$/,
      ""
    );
    const loginUrl = `${adminOrigin}/admin/login`;
    const advisorMagicUrl =
      provisioned.user.role === "advisor" && provisioned.user.advisorId
        ? `${adminOrigin}/admin/clients?admin_token=${issueAdvisorToken(provisioned.user.advisorId)}`
        : null;

    if (notify) {
      await sendMail({
        to: provisioned.user.email,
        subject: "Your Marengo portal access is ready",
        text: [
          `Email: ${provisioned.user.email}`,
          `Role: ${provisioned.user.role}`,
          advisor ? `Advisor workspace: ${advisor.name}${advisor.firm ? ` (${advisor.firm})` : ""}` : "",
          "",
          `Login URL: ${loginUrl}`,
          `Temporary password: ${provisioned.temporaryPassword}`,
          advisorMagicUrl ? "" : "",
          advisorMagicUrl ? `Direct advisor dashboard link: ${advisorMagicUrl}` : "",
        ]
          .filter(Boolean)
          .join("\n"),
      });
    }

    await Promise.allSettled([
      recordLifecycleEvent({
        eventType: "portal.user.provisioned",
        actorRole: access.role,
        advisorId: provisioned.user.advisorId,
        metadata: {
          userId: provisioned.user.id,
          role: provisioned.user.role,
          created: provisioned.created,
          notified: notify,
        },
      }),
      recordAuditLog({
        actorRole: access.role,
        actorLabel: access.userEmail || access.label,
        actorUserId: access.userId,
        advisorId: provisioned.user.advisorId,
        action: "portal.user.provisioned",
        targetType: "portal_user",
        targetId: provisioned.user.id,
        metadata: {
          email: provisioned.user.email,
          role: provisioned.user.role,
          created: provisioned.created,
          notified: notify,
        },
      }),
    ]);

    return NextResponse.json(
      {
        ok: true,
        user: provisioned.user,
        temporaryPassword: provisioned.temporaryPassword,
        loginUrl,
        advisorMagicUrl,
        created: provisioned.created,
      },
      { status: provisioned.created ? 201 : 200 }
    );
  } catch (error: any) {
    if (error?.code === "P2002") {
      return NextResponse.json({ error: "A portal user with that email already exists." }, { status: 409 });
    }
    return NextResponse.json(
      { error: error?.message || "Failed to provision portal user." },
      { status: 400 }
    );
  }
}
