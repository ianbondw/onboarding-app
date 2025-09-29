export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// src/app/api/onboarding/[token]/route.ts
import { NextResponse } from "next/server";
import type { RiskTolerance } from "@prisma/client";
import { onboardingSchema } from "@/lib/validations";
import { prisma } from "@/lib/db";
import { headers } from "next/headers";
import { encryptSSN, ssnLast4 } from "@/lib/crypto";
import { rateLimit } from "@/lib/rateLimit"; // if you added it earlier; otherwise remove RL lines

export const runtime = "nodejs";

export async function GET(_req: Request, { params }: { params: { token: string } }) {
  const token = params?.token ?? "(missing)";
  return NextResponse.json({ ok: true, method: "GET", message: "API alive", token });
}

export async function POST(req: Request, { params }: { params: { token: string } }) {
  try {
    const token = params?.token;
    if (!token) return NextResponse.json({ error: "Missing token" }, { status: 400 });

    // (Optional) Tiny limiter
    try {
      const ip =
        headers().get("x-forwarded-for")?.split(",")[0]?.trim() ||
        headers().get("x-real-ip") ||
        "local";
      const rl = rateLimit?.(`onboarding:${ip}`);
      if (rl && !rl.ok) return NextResponse.json({ error: "Too many requests" }, { status: 429 });
    } catch {}

    const body = await req.json();
    const data = onboardingSchema.parse(body);

    // 🔐 Encrypt SSN
    const { ciphertextB64, ivB64, tagB64 } = encryptSSN(data.ssn);
    const last4 = ssnLast4(data.ssn);

    // Session upsert
    const session = await prisma.onboardingSession.upsert({
      where: { token },
      update: { status: "SUBMITTED", submittedAt: new Date() },
      create: { token, status: "SUBMITTED", submittedAt: new Date() },
    });

    // Client upsert (store only encrypted SSN + last4; never echo PII)
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
      onboardingSession: { connect: { id: session.id } },
    };

    const client = await prisma.client.upsert({
      where: { email: data.email },
      update: payload,
      create: payload,
    });

    return NextResponse.json(
      { ok: true, sessionId: session.id, clientId: client.id },
      { status: 200 }
    );
  } catch (err: any) {
    const message = err?.issues?.[0]?.message || err?.message || "Unexpected error";
    const status = err?.name === "ZodError" ? 400 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}