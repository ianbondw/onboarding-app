import { NextResponse } from "next/server";
import { PrismaClient, RiskTolerance } from "@prisma/client";
import { onboardingSchema } from "@/lib/validations";

const prisma = new PrismaClient();

export async function GET(
  _req: Request,
  { params }: { params: { token: string } }
) {
  const token = params?.token ?? "(missing)";
  console.log("[API GET] /api/onboarding/%s", token);
  return NextResponse.json({ ok: true, method: "GET", message: "API alive", token });
}

export async function POST(
  req: Request,
  { params }: { params: { token: string } }
) {
  try {
    const token = params?.token;
    if (!token) {
      return NextResponse.json({ error: "Missing token" }, { status: 400 });
    }

    const body = await req.json();
    const data = onboardingSchema.parse(body);

    console.log("[API POST] /api/onboarding/%s payload:", token, data.email);

    const session = await prisma.onboardingSession.upsert({
      where: { token },
      update: { status: "SUBMITTED", submittedAt: new Date() },
      create: { token, status: "SUBMITTED", submittedAt: new Date() },
    });

    const client = await prisma.client.upsert({
      where: { email: data.email },
      update: {
        fullName: data.fullName,
        ssn: data.ssn,
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
      },
      create: {
        email: data.email,
        fullName: data.fullName,
        ssn: data.ssn,
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
      },
    });

    return NextResponse.json(
      { ok: true, method: "POST", sessionId: session.id, clientId: client.id },
      { status: 200 }
    );
  } catch (err: any) {
    const message =
      err?.issues?.[0]?.message || err?.message || "Unexpected error";
    const status = err?.name === "ZodError" ? 400 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}