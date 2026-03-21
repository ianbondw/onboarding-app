import { NextResponse } from "next/server";
import {
  authenticatePortalUser,
  clearPortalSessionCookie,
  createPortalSessionForUser,
  setPortalSessionCookie,
} from "@/lib/admin-auth";
import { hashToken } from "@/lib/security";
import {
  issuePortalLoginChallenge,
  requestIpFingerprint,
  shouldRequirePortalMfa,
} from "@/lib/portal-mfa";
import { recordAuditLog, recordLifecycleEvent } from "@/lib/lifecycle";

export const dynamic = "force-dynamic";

const LOGIN_BUCKETS = new Map<string, { count: number; resetAt: number }>();
const LOGIN_MAX_ATTEMPTS = 5;
const LOGIN_WINDOW_MS = 10 * 60 * 1000;

function clientIp(req: Request) {
  return (
    (req.headers.get("x-forwarded-for") || "").split(",")[0].trim() ||
    req.headers.get("x-real-ip") ||
    "unknown"
  );
}

function fingerprint(value: string) {
  return hashToken(value).slice(0, 16);
}

function rateLimitKey(req: Request, email: string) {
  return `${clientIp(req)}::${email.trim().toLowerCase()}`;
}

function takeLoginAttempt(req: Request, email: string) {
  const key = rateLimitKey(req, email);
  const now = Date.now();
  const existing = LOGIN_BUCKETS.get(key);

  if (!existing || now > existing.resetAt) {
    LOGIN_BUCKETS.set(key, { count: 1, resetAt: now + LOGIN_WINDOW_MS });
    return { allowed: true as const, retryAfterSec: 0 };
  }

  if (existing.count >= LOGIN_MAX_ATTEMPTS) {
    return {
      allowed: false as const,
      retryAfterSec: Math.max(1, Math.ceil((existing.resetAt - now) / 1000)),
    };
  }

  existing.count += 1;
  return { allowed: true as const, retryAfterSec: 0 };
}

function clearLoginAttempts(req: Request, email: string) {
  LOGIN_BUCKETS.delete(rateLimitKey(req, email));
}

export async function POST(req: Request) {
  const { email, password } = await req.json().catch(() => ({
    email: "",
    password: "",
  }));
  const normalizedEmail = String(email || "").trim().toLowerCase();
  const ipHash = requestIpFingerprint(req);

  if (!password) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const gate = takeLoginAttempt(req, normalizedEmail);
  if (!gate.allowed) {
    return NextResponse.json(
      { error: "Too many login attempts. Please wait and try again." },
      { status: 429, headers: { "Retry-After": String(gate.retryAfterSec) } }
    );
  }

  const user = await authenticatePortalUser(normalizedEmail, password);
  if (!user) {
    await Promise.allSettled([
      recordLifecycleEvent({
        eventType: "portal.login.failed",
        actorRole: "anonymous",
        metadata: {
          email: normalizedEmail || null,
          ipHash,
        },
      }),
      recordAuditLog({
        actorRole: "anonymous",
        actorLabel: normalizedEmail || "unknown",
        action: "portal.login.failed",
        targetType: "session",
        metadata: {
          email: normalizedEmail || null,
          ipHash,
        },
      }),
    ]);
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  clearLoginAttempts(req, normalizedEmail);

  if (shouldRequirePortalMfa(user)) {
    const challenge = await issuePortalLoginChallenge({
      user,
      ipHash,
      userAgent: req.headers.get("user-agent"),
    });

    return NextResponse.json({
      ok: true,
      mfaRequired: true,
      challengeToken: challenge.challengeToken,
      emailHint: challenge.emailHint,
      expiresInSec: challenge.expiresInSec,
      ...(challenge.debugCode ? { debugCode: challenge.debugCode } : {}),
    });
  }

  const login = await createPortalSessionForUser(user);

  const res = NextResponse.json({ ok: true, role: login.role });
  clearPortalSessionCookie(res);
  setPortalSessionCookie(res, login.token, login.ttlSec);
  res.cookies.set("admin_token", "", { path: "/", maxAge: 0 });
  res.cookies.set("advisor_admin", "", { path: "/", maxAge: 0 });

  await Promise.allSettled([
    recordLifecycleEvent({
      eventType: `${login.role}.login`,
      actorRole: login.role,
      advisorId: login.user.advisorId ?? null,
      metadata: { email: login.user.email },
    }),
    recordAuditLog({
      actorRole: login.role,
      actorLabel: login.user.email,
      actorUserId: login.user.id,
      advisorId: login.user.advisorId ?? null,
      action: `${login.role}.login`,
      targetType: "session",
      metadata: { email: login.user.email },
    }),
  ]);

  return res;
}
