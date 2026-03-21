export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { sendMail } from "@/lib/mailer";
import {
  canManagePortalUsers,
  getAdminAccess,
  updatePortalUser,
} from "@/lib/admin-auth";
import { recordAuditLog, recordLifecycleEvent } from "@/lib/lifecycle";

type Params = Promise<{ id: string }>;

export async function PATCH(req: Request, context: { params: Params }) {
  const access = await getAdminAccess();
  if (!access || !canManagePortalUsers(access)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;

  try {
    const body = await req.json().catch(() => ({}));
    const email =
      body?.email === undefined ? undefined : (body?.email ?? "").toString().trim().toLowerCase();
    const role =
      body?.role === undefined ? undefined : (body?.role ?? "").toString().trim();
    const advisorId =
      body?.advisorId === undefined ? undefined : (body?.advisorId ?? "").toString().trim() || null;
    const password =
      body?.password === undefined ? undefined : (body?.password ?? "").toString();
    const notify = body?.notify === true;
    const isActive =
      body?.isActive === undefined ? undefined : Boolean(body.isActive);

    const updated = await updatePortalUser({
      id,
      email,
      role: role as any,
      advisorId,
      password,
      isActive,
    });

    if (!updated) {
      return NextResponse.json({ error: "Portal user not found." }, { status: 404 });
    }

    if (notify && password?.trim()) {
      const adminOrigin = (
        process.env.NEXT_PUBLIC_ADMIN_ORIGIN || new URL(req.url).origin
      ).replace(/\/$/, "");
      await sendMail({
        to: updated.email,
        subject: "Your Marengo portal password was reset",
        text: `Email: ${updated.email}
Role: ${updated.role}

Login URL: ${adminOrigin}/admin/login
Temporary password: ${password.trim()}
Multi-factor authentication: required by email code at sign-in.`,
      });
    }

    await Promise.allSettled([
      recordLifecycleEvent({
        eventType: "portal.user.updated",
        actorRole: access.role,
        advisorId: updated.advisorId,
        metadata: {
          userId: updated.id,
          role: updated.role,
          isActive: updated.isActive,
          passwordReset: !!password?.trim(),
        },
      }),
      recordAuditLog({
        actorRole: access.role,
        actorLabel: access.userEmail || access.label,
        actorUserId: access.userId,
        advisorId: updated.advisorId,
        action: "portal.user.updated",
        targetType: "portal_user",
        targetId: updated.id,
        metadata: {
          email: updated.email,
          role: updated.role,
          isActive: updated.isActive,
          passwordReset: !!password?.trim(),
        },
      }),
    ]);

    return NextResponse.json({ ok: true, user: updated });
  } catch (error: any) {
    if (error?.code === "P2002") {
      return NextResponse.json({ error: "A portal user with that email already exists." }, { status: 409 });
    }
    return NextResponse.json(
      { error: error?.message || "Failed to update portal user." },
      { status: 400 }
    );
  }
}
