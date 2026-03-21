import { prisma } from "@/prisma";
import { hashToken, randomToken } from "@/lib/security";
import { sendMail } from "@/lib/mailer";
import {
  createPortalSessionForUser,
  type AuthenticatedPortalUser,
  type PortalRole,
} from "@/lib/admin-auth";
import { recordAuditLog, recordLifecycleEvent } from "@/lib/lifecycle";

const PORTAL_MFA_TTL_MINUTES = readPositiveInt("PORTAL_MFA_CODE_MINUTES", 10);
const PORTAL_MFA_MAX_ATTEMPTS = readPositiveInt("PORTAL_MFA_MAX_ATTEMPTS", 8);

function readPositiveInt(name: string, fallback: number) {
  const raw = (process.env[name] || "").trim();
  const parsed = Number(raw);
  if (!Number.isFinite(parsed) || parsed <= 0) return fallback;
  return Math.floor(parsed);
}

function maskEmail(email: string) {
  const [local, domain] = email.split("@");
  if (!local || !domain) return email;
  const head = local.slice(0, 2);
  const maskedLocal = `${head}${"*".repeat(Math.max(1, local.length - head.length))}`;
  return `${maskedLocal}@${domain}`;
}

function sixDigitCode() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

function hashChallengeCode(token: string, code: string) {
  return hashToken(`${token}:${code}`);
}

function normalizeCode(input: string | null | undefined) {
  return String(input || "").replace(/\D/g, "").slice(0, 6);
}

function portalMfaEnabled() {
  return (process.env.PORTAL_MFA_REQUIRED || "true").trim().toLowerCase() !== "false";
}

export function shouldRequirePortalMfa(user: AuthenticatedPortalUser) {
  return portalMfaEnabled() && user.mfaEnabled !== false;
}

export function requestIpFingerprint(req: Request) {
  const ip =
    (req.headers.get("x-forwarded-for") || "").split(",")[0].trim() ||
    req.headers.get("x-real-ip") ||
    "unknown";
  return hashToken(ip).slice(0, 16);
}

export async function issuePortalLoginChallenge(input: {
  user: AuthenticatedPortalUser;
  ipHash?: string | null;
  userAgent?: string | null;
}) {
  const token = randomToken(24);
  const code = sixDigitCode();
  const expiresAt = new Date(Date.now() + PORTAL_MFA_TTL_MINUTES * 60 * 1000);

  await prisma.portalLoginChallenge.deleteMany({
    where: {
      userId: input.user.id,
      purpose: "login",
    },
  });

  await prisma.portalLoginChallenge.create({
    data: {
      tokenHash: hashToken(token),
      codeHash: hashChallengeCode(token, code),
      purpose: "login",
      email: input.user.email,
      role: input.user.role,
      expiresAt,
      userId: input.user.id,
      advisorId: input.user.advisorId ?? null,
      ipHash: input.ipHash ?? null,
      userAgent: input.userAgent ?? null,
    },
    select: { id: true },
  });

  const result = await sendMail({
    to: input.user.email,
    subject: "Your Marengo verification code",
    text: [
      "Use this one-time code to finish signing in to Marengo Finance.",
      "",
      `Code: ${code}`,
      `Expires in: ${PORTAL_MFA_TTL_MINUTES} minutes`,
      "",
      "If you did not attempt to sign in, you can ignore this message.",
    ].join("\n"),
  });

  if (process.env.NODE_ENV === "production" && !result.ok) {
    await prisma.portalLoginChallenge
      .deleteMany({ where: { tokenHash: hashToken(token) } })
      .catch(() => null);
    throw new Error("Unable to deliver the verification code right now.");
  }

  await Promise.allSettled([
    recordLifecycleEvent({
      eventType: "portal.mfa.challenge_issued",
      actorRole: input.user.role,
      advisorId: input.user.advisorId,
      metadata: {
        userId: input.user.id,
        delivery: "email_otp",
      },
    }),
    recordAuditLog({
      actorRole: input.user.role,
      actorLabel: input.user.email,
      actorUserId: input.user.id,
      advisorId: input.user.advisorId,
      action: "portal.mfa.challenge_issued",
      targetType: "portal_login_challenge",
      metadata: {
        delivery: "email_otp",
        ipHash: input.ipHash ?? null,
      },
    }),
  ]);

  return {
    challengeToken: token,
    emailHint: maskEmail(input.user.email),
    expiresInSec: PORTAL_MFA_TTL_MINUTES * 60,
    debugCode: process.env.NODE_ENV === "production" ? null : code,
  };
}

export async function verifyPortalLoginChallenge(input: {
  challengeToken: string;
  code: string;
  ipHash?: string | null;
}) {
  const token = (input.challengeToken || "").trim();
  const code = normalizeCode(input.code);
  if (!token || !code) return { ok: false as const, error: "Enter the 6-digit code." };

  const challenge = await prisma.portalLoginChallenge.findUnique({
    where: { tokenHash: hashToken(token) },
    select: {
      id: true,
      tokenHash: true,
      codeHash: true,
      purpose: true,
      email: true,
      role: true,
      expiresAt: true,
      consumedAt: true,
      failedAttempts: true,
      advisorId: true,
      userId: true,
      user: {
        select: {
          id: true,
          email: true,
          role: true,
          advisorId: true,
          isActive: true,
          mfaEnabled: true,
          mfaMethod: true,
        },
      },
    },
  });

  if (!challenge || challenge.purpose !== "login") {
    return { ok: false as const, error: "The verification request is no longer valid." };
  }
  if (challenge.consumedAt || challenge.expiresAt.getTime() <= Date.now()) {
    await prisma.portalLoginChallenge.deleteMany({ where: { id: challenge.id } }).catch(() => null);
    return { ok: false as const, error: "The code expired. Request a new one." };
  }
  if (!challenge.user || !challenge.user.isActive) {
    await prisma.portalLoginChallenge.deleteMany({ where: { id: challenge.id } }).catch(() => null);
    return { ok: false as const, error: "This account is no longer active." };
  }
  if (challenge.failedAttempts >= PORTAL_MFA_MAX_ATTEMPTS) {
    await prisma.portalLoginChallenge
      .update({
        where: { id: challenge.id },
        data: { consumedAt: new Date() },
        select: { id: true },
      })
      .catch(() => null);
    return { ok: false as const, error: "Too many invalid codes. Start over." };
  }

  if (challenge.codeHash !== hashChallengeCode(token, code)) {
    await prisma.portalLoginChallenge.update({
      where: { id: challenge.id },
      data: {
        failedAttempts: { increment: 1 },
      },
      select: { id: true },
    });

    await Promise.allSettled([
      recordLifecycleEvent({
        eventType: "portal.mfa.challenge_failed",
        actorRole: challenge.role,
        advisorId: challenge.advisorId ?? null,
        metadata: {
          userId: challenge.user.id,
          ipHash: input.ipHash ?? null,
        },
      }),
      recordAuditLog({
        actorRole: challenge.role,
        actorLabel: challenge.email,
        actorUserId: challenge.user.id,
        advisorId: challenge.advisorId ?? null,
        action: "portal.mfa.challenge_failed",
        targetType: "portal_login_challenge",
        targetId: challenge.id,
        metadata: {
          ipHash: input.ipHash ?? null,
        },
      }),
    ]);

    return { ok: false as const, error: "Invalid verification code." };
  }

  await prisma.portalLoginChallenge.update({
    where: { id: challenge.id },
    data: { consumedAt: new Date() },
    select: { id: true },
  });

  const user: AuthenticatedPortalUser = {
    id: challenge.user.id,
    email: challenge.user.email,
    role: challenge.user.role as PortalRole,
    advisorId: challenge.user.advisorId ?? null,
    isActive: challenge.user.isActive,
    mfaEnabled: challenge.user.mfaEnabled !== false,
    mfaMethod: challenge.user.mfaMethod ?? null,
  };

  const session = await createPortalSessionForUser(user);

  await Promise.allSettled([
    recordLifecycleEvent({
      eventType: "portal.mfa.challenge_verified",
      actorRole: user.role,
      advisorId: user.advisorId,
      metadata: {
        userId: user.id,
        ipHash: input.ipHash ?? null,
      },
    }),
    recordAuditLog({
      actorRole: user.role,
      actorLabel: user.email,
      actorUserId: user.id,
      advisorId: user.advisorId,
      action: "portal.mfa.challenge_verified",
      targetType: "portal_login_challenge",
      targetId: challenge.id,
      metadata: {
        ipHash: input.ipHash ?? null,
      },
    }),
  ]);

  return {
    ok: true as const,
    session,
    user,
  };
}
