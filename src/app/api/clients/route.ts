// src/app/api/clients/route.ts
import { NextResponse } from "next/server";
import { prisma } from "../../../prisma";
import { encryptToPackedBytes } from "../../../lib/crypto";
import { Resend } from "resend";
import { setSentryTagsServer } from "@/lib/sentry-tags";

export async function POST(req: Request) {
  try {
    if (!process.env.DATABASE_URL) {
      return NextResponse.json({ error: "Missing DATABASE_URL" }, { status: 500 });
    }
    if (!process.env.PII_ENC_KEY) {
      return NextResponse.json({ error: "Missing PII_ENC_KEY" }, { status: 500 });
    }

    // ---- Parse body once ----
    const parsed = await req.json();

    // ---- Sentry tagging (safe/no-op if Sentry not configured) ----
    const firmCode = parsed?.firmCode ?? parsed?.firm ?? null;
    const advisorIdFromBody = parsed?.advisorId ?? null;
    const clientIdFromBody = parsed?.clientId ?? null;
    setSentryTagsServer({ firmCode, advisorId: advisorIdFromBody, clientId: clientIdFromBody });

    // ---- Resolve advisorId (prefer intakeToken mapping) ----
    let resolvedAdvisorId: string | null = null;

    if (parsed.intakeToken) {
      const link = await prisma.intakeLink.findUnique({
        where: { token: parsed.intakeToken },
        select: { advisorId: true, isActive: true, expiresAt: true },
      });
      const now = new Date();
      const valid =
        link &&
        link.isActive &&
        (!link.expiresAt || link.expiresAt.getTime() > now.getTime());
      if (valid) resolvedAdvisorId = link.advisorId;
    }
    if (!resolvedAdvisorId && parsed.advisorId) {
      resolvedAdvisorId = parsed.advisorId;
    }

    // ---- Optional PII pack (last-4 etc.) ----
    const ssnEnc =
      parsed.ssn && String(parsed.ssn).trim().length > 0
        ? encryptToPackedBytes(String(parsed.ssn).trim())
        : null;
    const dobEnc =
      parsed.dob && String(parsed.dob).trim().length > 0
        ? encryptToPackedBytes(String(parsed.dob).trim())
        : null;

    // ---- Create client (minimal fields; extend as needed) ----
    const created = await prisma.client.create({
      data: {
        firstName: parsed.firstName,
        lastName: parsed.lastName,
        email: parsed.email,
        phone: parsed.phone ?? null,

        advisorId: resolvedAdvisorId,
        advisorName: parsed.advisorName ?? null,
        advisorFirm: parsed.advisorFirm ?? null,

        ssnEnc,
        dobEnc,

        // If you want to map a single goal string: primaryGoals: parsed.primaryGoal ? [parsed.primaryGoal] : undefined,
        rawSubmission: parsed.rawSubmission ?? undefined,
      },
      select: {
        id: true,
        createdAt: true,
        firstName: true,
        lastName: true,
        email: true,
        advisorId: true,
      },
    });

    // ---- Optional: email alert via Resend ----
    try {
      const resendKey = process.env.RESEND_API_KEY;
      const to = process.env.DEMO_ALERT_TO;
      if (resendKey && to) {
        const resend = new Resend(resendKey);
        await resend.emails.send({
          from: process.env.DEMO_ALERT_FROM || "onboarding@demo.local",
          to,
          subject: `New onboarding: ${created.firstName} ${created.lastName}`,
          text:
            `A new client completed onboarding.\n\n` +
            `Name: ${created.firstName} ${created.lastName}\n` +
            `Email: ${created.email}\n` +
            `AdvisorId: ${created.advisorId ?? "(none)"}\n` +
            `Created: ${created.createdAt.toISOString()}\n`,
        });
      }
    } catch (e) {
      console.error("Resend email failed:", e);
      // continue without failing the request
    }

    return NextResponse.json({ ok: true, client: created }, { status: 201 });
  } catch (err: any) {
    console.error("POST /api/clients error:", err);
    const status =
      err?.name === "ZodError" ? 400 :
      err?.code === "P2002"      ? 409 :
      500;
    const message =
      err?.name === "ZodError" ? err.issues :
      err?.code === "P2002"     ? "Duplicate unique field value" :
      "Internal error";
    return NextResponse.json({ error: message }, { status });
  }
}