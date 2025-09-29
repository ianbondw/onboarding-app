// src/app/api/onboarding/[token]/route.ts
import { NextResponse } from "next/server";
import type { RiskTolerance } from "@prisma/client";

import { onboardingSchema } from "@/lib/validations";
import { prisma } from "@/lib/db";
import { encryptSSN, ssnLast4 } from "@/lib/crypto";
import { rateLimit } from "@/lib/rateLimit";

// GET /api/onboarding/[token]
export async function GET(_req: Request, { params }: any) {
  const token = params?.token ?? "(missing)";
  return NextResponse.json({ ok: true, method: "GET", message: "API alive", token });
}

// POST /api/onboarding/[token]
export async function POST(req: Request, { params }: any) {
  try {
    const token = params?.token;
    if (!token) {
      return NextResponse.json({ error: "Missing token" }, { status: 400 });
    }

    // Use request headers (avoid next/headers Promise typing)
    const forwardedFor = req.headers.get("x-forwarded-for");
    const ip =
      forwardedFor?.split(",")[0]?.trim() ||
      req.headers.get("x-real-ip") ||
      "local";

    // In-memory limiter (matches our stub: returns { allowed, remaining, resetMs })
    try {
      const rl = rateLimit?.(`onboarding:${ip}`, { limit: 5, windowMs: 60_000 });
      if (rl && !rl.allowed) {
        return NextResponse.json({ error: "Too many requests" }, { status: 429 });
      }
    } catch {
      // ignore limiter errors
    }

    const body = await req.json();
    const data = onboardingSchema.parse(body);

    // 🔐 Encrypt SSN; only store ciphertext + last4
    const { ciphertextB64, ivB64, tagB64 } = encryptSSN(data.ssn);
    const last4 = ssnLast4(data.ssn);

    // Upsert session
    const session = await prisma.onboardingSession.upsert({
      where: { token },
      update: { status: "SUBMITTED", submittedAt: new Date() },
      create: { token, status: "SUBMITTED", submittedAt: new Date() }
    });

    // Upsert client
    const payload = {
      email: data.email,
      fullName: data.fullName,
      ssnLast4: last4,
      ssnCiphertext: ciphertextB64,
      ssnIv: ivB64,
      ssnTag: tagB64,
      dob: new Date(data.dob),
      netWorth: data.netWorth,
      income: data.income,
      investableAssets: data.investableAssets,
      riskTolerance: data.riskTolerance as RiskTolerance,
      termsAccepted: data.termsAccepted,
      kycCitizenship: data.kyc?.citizenship ?? null,
      kycEmploymentStatus: data.kyc?.employmentStatus ?? null,
      kycSourceOfFunds: data.kyc?.sourceOfFunds ?? null,
      onboardingSession: { connect: { id: session.id } }
    };

    const client = await prisma.client.upsert({
      where: { email: data.email },
      update: payload,
      create: payload
    });

    return NextResponse.json(
      { ok: true, sessionId: session.id, clientId: client.id },
      { status: 200 }
    );
  } catch (err: any) {
    const message = err?.issues?.[0]?.message ?? err?.message ?? "Unexpected error";
    const status = err?.name === "ZodError" ? 400 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}