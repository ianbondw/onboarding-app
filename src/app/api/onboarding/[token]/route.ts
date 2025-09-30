// src/app/api/onboarding/[token]/route.ts
import { NextResponse } from "next/server";
import { PrismaClient, Prisma } from "@prisma/client";
import type { RiskTolerance } from "@prisma/client";
import { onboardingSchema } from "@/lib/validations";
import { encryptSSN, ssnLast4 } from "@/lib/crypto";

/** ---------- Prisma client (no external db helper needed) ---------- */
declare global {
  // eslint-disable-next-line no-var
  var _prisma: PrismaClient | undefined;
}
const prisma = global._prisma ?? new PrismaClient();
if (process.env.NODE_ENV !== "production") global._prisma = prisma;

/** Optional helper: if your Prisma model uses Decimal for money fields,
 *  this will create Prisma.Decimal; if not, it just returns the number. */
function decimalize(v: number) {
  try {
    const D = (Prisma as any).Decimal;
    return D ? new D(v) : v;
  } catch {
    return v;
  }
}

/** GET /api/onboarding/[token] */
export async function GET(_req: Request, { params }: any) {
  const token = params?.token ?? "(missing)";
  return NextResponse.json({ ok: true, method: "GET", message: "API alive", token });
}

/** POST /api/onboarding/[token] */
export async function POST(req: Request, { params }: any) {
  try {
    const token = params?.token as string | undefined;
    if (!token) {
      return NextResponse.json({ error: "Missing token" }, { status: 400 });
    }

    const body = await req.json();
    // Zod schema (we updated earlier) coerces numbers and Date for dob
    const data = onboardingSchema.parse(body);

    // 🔐 Encrypt SSN; only store ciphertext + last4
    const { ciphertextB64, ivB64, tagB64 } = encryptSSN(data.ssn);
    const last4 = ssnLast4(data.ssn);

    // Upsert the session
    const session = await prisma.onboardingSession.upsert({
      where: { token },
      update: { status: "SUBMITTED", submittedAt: new Date() },
      create: { token, status: "SUBMITTED", submittedAt: new Date() },
    });

    // Build payload; works whether your Prisma model uses Decimal or Float
    const payload = {
      email:       data.email,
      fullName:    data.fullName,
      ssnLast4:    last4,
      ssnCiphertext: ciphertextB64,
      ssnIv:       ivB64,
      ssnTag:      tagB64,
      dob:         data.dob, // z.coerce.date() → Date
      netWorth:    decimalize(data.netWorth),
      income:      decimalize(data.income),
      investableAssets: decimalize(data.investableAssets),
      riskTolerance:    data.riskTolerance as RiskTolerance,
      termsAccepted:    Boolean(data.termsAccepted),
      // optional KYC fields — send undefined when empty
      kycCitizenship:      data.kyc?.citizenship || undefined,
      kycEmploymentStatus: data.kyc?.employmentStatus || undefined,
      kycSourceOfFunds:    data.kyc?.sourceOfFunds || undefined,
      onboardingSession: { connect: { id: session.id } },
    } as const;

    const client = await prisma.client.upsert({
      where:  { email: data.email },
      update: payload as any, // tolerate Decimal vs number
      create: payload as any,
    });

    return NextResponse.json(
      { ok: true, sessionId: session.id, clientId: client.id },
      { status: 200 },
    );
  } catch (err: any) {
    const message =
      err?.issues?.[0]?.message ??
      err?.message ??
      "Unexpected error";
    const status = err?.name === "ZodError" ? 400 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}