import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { prisma } from "@/prisma";
import { hashPassword, hashToken, randomToken, verifyPassword } from "@/lib/security";

export const PORTAL_SESSION_COOKIE = "portal_session";

const OWNER_TTL_SEC = 60 * 60 * 12;
const OPS_TTL_SEC = 60 * 60 * 12;
const ADVISOR_TTL_SEC = 60 * 60 * 24 * 30;

export type PortalRole = "owner" | "advisor" | "ops";

export type AdminAccess = {
  sessionId: string;
  role: PortalRole;
  advisorId: string | null;
  advisorName: string | null;
  advisorEmail: string | null;
  userId: string | null;
  userEmail: string | null;
  label: string | null;
};

function normalizePortalRole(role: string | null | undefined): PortalRole | null {
  if (role === "owner" || role === "advisor" || role === "ops") return role;
  return null;
}

function sessionTtlForRole(role: PortalRole) {
  if (role === "advisor") return ADVISOR_TTL_SEC;
  if (role === "ops") return OPS_TTL_SEC;
  return OWNER_TTL_SEC;
}

function normalizeEmail(value: string | null | undefined) {
  return (value || "").trim().toLowerCase();
}

export function hasBackofficeAccess(access: AdminAccess | null | undefined) {
  return access?.role === "owner" || access?.role === "ops";
}

export function canManagePortalUsers(access: AdminAccess | null | undefined) {
  return access?.role === "owner";
}

export function canManageAdvisors(access: AdminAccess | null | undefined) {
  return access?.role === "owner";
}

export function canAccessAdvisorScope(
  access: AdminAccess | null | undefined,
  advisorId: string | null | undefined
) {
  if (!access) return false;
  if (hasBackofficeAccess(access)) return true;
  return !!advisorId && access.role === "advisor" && access.advisorId === advisorId;
}

function cookieConfig(maxAge: number) {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge,
  };
}

export function setPortalSessionCookie(res: NextResponse, token: string, maxAge: number) {
  res.cookies.set(PORTAL_SESSION_COOKIE, token, cookieConfig(maxAge));
}

export function clearPortalSessionCookie(res: NextResponse) {
  res.cookies.set(PORTAL_SESSION_COOKIE, "", { ...cookieConfig(0), maxAge: 0 });
}

export function sanitizeNextPath(input: string | null | undefined, fallback = "/admin/clients") {
  if (!input) return fallback;
  if (!input.startsWith("/")) return fallback;
  if (input.startsWith("//")) return fallback;
  return input;
}

export async function ensureOwnerUser() {
  const email = normalizeEmail(process.env.ADMIN_EMAIL || "owner@local");
  const password = (process.env.ADMIN_PASS || process.env.ADMIN_PASSWORD || "").trim();
  if (!password) return null;

  const passwordHash = hashPassword(password);

  return prisma.portalUser.upsert({
    where: { email },
    update: {
      passwordHash,
      role: "owner",
      isActive: true,
    },
    create: {
      email,
      passwordHash,
      role: "owner",
      isActive: true,
    },
    select: {
      id: true,
      email: true,
      role: true,
      isActive: true,
      passwordHash: true,
    },
  });
}

export async function createPortalSession(input: {
  role: PortalRole;
  userId?: string | null;
  advisorId?: string | null;
  label?: string | null;
  ttlSec?: number;
}) {
  const ttlSec = input.ttlSec ?? sessionTtlForRole(input.role);
  const token = randomToken(32);

  const session = await prisma.portalSession.create({
    data: {
      tokenHash: hashToken(token),
      role: input.role,
      userId: input.userId ?? null,
      advisorId: input.advisorId ?? null,
      label: input.label ?? null,
      expiresAt: new Date(Date.now() + ttlSec * 1000),
    },
    select: {
      id: true,
      role: true,
      expiresAt: true,
    },
  });

  return { token, ttlSec, session };
}

export async function getPortalSessionByToken(rawToken: string | null | undefined) {
  if (!rawToken) return null;

  const session = await prisma.portalSession.findUnique({
    where: { tokenHash: hashToken(rawToken) },
    select: {
      id: true,
      role: true,
      label: true,
      advisorId: true,
      expiresAt: true,
      userId: true,
      user: {
        select: {
          id: true,
          email: true,
          isActive: true,
          role: true,
        },
      },
      advisor: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });

  if (!session) return null;
  if (session.expiresAt.getTime() <= Date.now()) {
    await prisma.portalSession.delete({ where: { id: session.id } }).catch(() => null);
    return null;
  }
  if (session.user && !session.user.isActive) {
    await prisma.portalSession.delete({ where: { id: session.id } }).catch(() => null);
    return null;
  }
  const role = normalizePortalRole(session.user?.role ?? session.role);
  if (!role) {
    await prisma.portalSession.delete({ where: { id: session.id } }).catch(() => null);
    return null;
  }
  if (role === "advisor" && !session.advisorId) {
    await prisma.portalSession.delete({ where: { id: session.id } }).catch(() => null);
    return null;
  }

  return session;
}

export async function getAdminAccess(): Promise<AdminAccess | null> {
  const jar = await cookies();
  const rawToken = jar.get(PORTAL_SESSION_COOKIE)?.value || null;
  const session = await getPortalSessionByToken(rawToken);
  if (!session) return null;
  const role = normalizePortalRole(session.user?.role ?? session.role);
  if (!role) return null;

  return {
    sessionId: session.id,
    role,
    advisorId: session.advisor?.id ?? session.advisorId ?? null,
    advisorName: session.advisor?.name ?? null,
    advisorEmail: session.advisor?.email ?? null,
    userId: session.user?.id ?? session.userId ?? null,
    userEmail: session.user?.email ?? null,
    label: session.label ?? null,
  };
}

export async function loginPortalUser(emailInput: string | null | undefined, password: string) {
  await ensureOwnerUser();

  const email = normalizeEmail(emailInput || process.env.ADMIN_EMAIL || "owner@local");

  const user = await prisma.portalUser.findUnique({
    where: { email },
    select: {
      id: true,
      email: true,
      passwordHash: true,
      role: true,
      isActive: true,
      advisorId: true,
    },
  });

  const role = normalizePortalRole(user?.role);
  if (!user || !role || !user.isActive) return null;
  if (role === "advisor" && !user.advisorId) return null;
  if (!verifyPassword(password, user.passwordHash)) return null;

  await prisma.portalUser.update({
    where: { id: user.id },
    data: { lastLoginAt: new Date() },
  });

  const created = await createPortalSession({
    role,
    userId: user.id,
    advisorId: user.advisorId ?? null,
    label: user.email,
    ttlSec: sessionTtlForRole(role),
  });

  return {
    user,
    role,
    token: created.token,
    ttlSec: created.ttlSec,
  };
}

export async function provisionPortalUser(input: {
  email: string;
  role: PortalRole;
  advisorId?: string | null;
  password?: string | null;
  isActive?: boolean;
}) {
  const email = normalizeEmail(input.email);
  if (!email) throw new Error("Portal user email is required.");

  const role = normalizePortalRole(input.role);
  if (!role) throw new Error("Unsupported portal user role.");

  const advisorId = role === "advisor" ? input.advisorId?.trim() || null : null;
  if (role === "advisor" && !advisorId) {
    throw new Error("Advisor users must be assigned to an advisor.");
  }

  const temporaryPassword = (input.password || "").trim() || randomToken(12);
  const existing = await prisma.portalUser.findUnique({
    where: { email },
    select: {
      id: true,
      email: true,
      role: true,
      advisorId: true,
    },
  });

  if (existing && existing.role !== role) {
    throw new Error("A portal user with that email already exists under a different role.");
  }
  if (
    existing &&
    role === "advisor" &&
    existing.advisorId &&
    existing.advisorId !== advisorId
  ) {
    throw new Error("That advisor login is already assigned to a different advisor.");
  }

  const data = {
    email,
    passwordHash: hashPassword(temporaryPassword),
    role,
    advisorId,
    isActive: input.isActive ?? true,
  };

  const user = existing
    ? await prisma.portalUser.update({
        where: { id: existing.id },
        data,
        select: {
          id: true,
          email: true,
          role: true,
          advisorId: true,
          isActive: true,
        },
      })
    : await prisma.portalUser.create({
        data,
        select: {
          id: true,
          email: true,
          role: true,
          advisorId: true,
          isActive: true,
        },
      });

  return {
    user: {
      ...user,
      role: user.role as PortalRole,
    },
    created: !existing,
    temporaryPassword,
  };
}

export async function updatePortalUser(input: {
  id: string;
  email?: string | null;
  role?: PortalRole | null;
  advisorId?: string | null;
  password?: string | null;
  isActive?: boolean;
}) {
  const existing = await prisma.portalUser.findUnique({
    where: { id: input.id },
    select: {
      id: true,
      email: true,
      role: true,
      advisorId: true,
      isActive: true,
    },
  });
  if (!existing) return null;

  const role = normalizePortalRole(input.role ?? existing.role);
  if (!role) throw new Error("Unsupported portal user role.");

  const email =
    input.email === undefined ? existing.email : normalizeEmail(input.email);
  if (!email) throw new Error("Portal user email is required.");

  const advisorId =
    role === "advisor"
      ? input.advisorId === undefined
        ? existing.advisorId
        : input.advisorId?.trim() || null
      : null;
  if (role === "advisor" && !advisorId) {
    throw new Error("Advisor users must be assigned to an advisor.");
  }

  const user = await prisma.portalUser.update({
    where: { id: existing.id },
    data: {
      email,
      role,
      advisorId,
      isActive: input.isActive ?? existing.isActive,
      ...(input.password?.trim()
        ? { passwordHash: hashPassword(input.password.trim()) }
        : {}),
    },
    select: {
      id: true,
      email: true,
      role: true,
      advisorId: true,
      isActive: true,
      lastLoginAt: true,
    },
  });

  return {
    ...user,
    role: user.role as PortalRole,
  };
}

export async function revokePortalSession(rawToken: string | null | undefined) {
  if (!rawToken) return;
  await prisma.portalSession
    .deleteMany({ where: { tokenHash: hashToken(rawToken) } })
    .catch(() => null);
}
