// src/app/api/onboarding/[token]/route.ts
import { NextResponse } from "next/server";
import { Prisma, type RiskTolerance, prisma } from "@/lib/db"; // <-- adjust import if your prisma client export is different
import { onboardingSchema } from "@/lib/validations";
import { encryptSSN, ssnLast4 } from "@/lib/crypto";

// Helpers: convert numeric -> Prisma.Decimal if needed; otherwise return number
function decimalize(v: number) {
  try {
    // If Prisma.Decimal exists (Decimal fields), use it
    // This will still typecheck even if your schema uses number fields
    return new (Prisma as any).Decimal ? new (Prisma as any).Decimal(v) : v;
  } catch {
    return v;
  }
}

// Empty string -> undefined for optional text fields (better than null for Prisma)
const undef = (s?: string | null) => (s ? s : undefined);

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

    // Build payload in a way that satisfies either Decimal or number fields
    const payload = {
      email: data.email,
      fullName: data.fullName,
      ssnLast4: last4,
      ssnCiphertext: ciphertextB64,
      ssnIv: ivB64,
      ssnTag: tagB64,
      dob: data.dob, // zod coerces to Date already
      netWorth: decimalize(data.netWorth),
      income: decimalize(data.income),
      investableAssets: decimalize(data.investableAssets),
      riskTolerance: data.riskTolerance as RiskTolerance,
      termsAccepted: Boolean(data.termsAccepted),
      kycCitizenship: undef(data.kyc?.citizenship),
      kycEmploymentStatus: undef(data.kyc?.employmentStatus),
      kycSourceOfFunds: undef(data.kyc?.sourceOfFunds),
      onboardingSession: { connect: { id: session.id } }
    } as const;

    const client = await prisma.client.upsert({
      where: { email: data.email },
      update: payload as any, // allow Decimal/number dual-compat
      create: payload as any
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