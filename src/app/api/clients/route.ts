// src/app/api/clients/route.ts
import { NextResponse } from "next/server";
import { prisma } from "../../../prisma";
import { clientSubmissionSchema } from "../../../lib/validation";
import { encryptToPackedBytes } from "../../../lib/crypto";
import { Resend } from "resend";

export async function POST(req: Request) {
  try {
    if (!process.env.DATABASE_URL) {
      return NextResponse.json({ error: "Missing DATABASE_URL" }, { status: 500 });
    }
    if (!process.env.PII_ENC_KEY) {
      return NextResponse.json({ error: "Missing PII_ENC_KEY" }, { status: 500 });
    }

    const json = await req.json();
    const parsed = clientSubmissionSchema.parse(json);

    // Resolve advisor via intake token (preferred)
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

      if (valid) {
        resolvedAdvisorId = link.advisorId;
      }
    }

    // Fallback: accept explicit advisorId if provided (dev/testing)
    if (!resolvedAdvisorId && parsed.advisorId) {
      resolvedAdvisorId = parsed.advisorId;
    }

    // Encrypt PII
    const ssnEnc =
      parsed.ssn && parsed.ssn.trim().length > 0 ? encryptToPackedBytes(parsed.ssn.trim()) : null;
    const dobEnc =
      parsed.dob && parsed.dob.trim().length > 0 ? encryptToPackedBytes(parsed.dob.trim()) : null;

    // Persist
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

        // NOTE: Your Prisma schema has primaryGoals (String[]), not primaryGoal (String).
        // If you later want to map a single primaryGoal string to the array, do it here.
        // primaryGoals: parsed.primaryGoal ? [parsed.primaryGoal] : undefined,

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

    // Optional email notification (Resend)
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
      // Do not fail the request if email fails
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