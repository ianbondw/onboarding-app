// src/app/api/onboarding/[token]/route.ts
export const runtime = "nodejs"; // Prisma needs Node runtime on Vercel

import { NextResponse, NextRequest } from "next/server";
import { prisma } from "../../../../prisma"; // keep your existing helper
import { setSentryTagsServer } from "@/lib/sentry-tags";
import { encryptToPackedBytes } from "@/lib/crypto";
import { createComplianceRequest } from "@/lib/compliance";
import { syncClientToHubSpot } from "@/lib/crm";
import { issueAdvisorToken } from "@/lib/jwt";
import { sendNewSubmissionEmail } from "@/lib/email";
import { recordAuditLog, recordLifecycleEvent } from "@/lib/lifecycle";

/* ------------------------- Rate limiter (in-memory) ------------------------- */
const RATE_BUCKETS = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 8; // 8 requests
const RATE_WINDOW_MS = 60_000; // per 60s window

function keyFor(req: Request, token: string) {
  const ip =
    (req.headers.get("x-forwarded-for") || "").split(",")[0].trim() ||
    req.headers.get("x-real-ip") ||
    "unknown";
  return `${ip}::${token}`;
}

function rateLimitOrThrow(req: Request, token: string) {
  const k = keyFor(req, token);
  const now = Date.now();
  const b = RATE_BUCKETS.get(k);
  if (!b || now > b.resetAt) {
    RATE_BUCKETS.set(k, { count: 1, resetAt: now + RATE_WINDOW_MS });
    return;
  }
  if (b.count >= RATE_LIMIT) {
    const retryAfter = Math.max(0, Math.ceil((b.resetAt - now) / 1000));
    const err: any = new Error("Too many requests. Please wait a bit and try again.");
    err.status = 429;
    (err as any).headers = { "Retry-After": String(retryAfter) };
    throw err;
  }
  b.count += 1;
}
/* --------------------------------------------------------------------------- */

function encryptPII(value?: string) {
  if (!value) return null;
  return encryptToPackedBytes(value);
}

// Simple rules-based product matcher (per-goal aware)
function matchProducts(input: {
  riskTolerance?: string;
  timeHorizon?: string;
  primaryGoals?: string[];
  annualIncomeBand?: string;
  hasIRA?: boolean;
  has401k?: boolean;
  hasTaxable?: boolean;
  hasCrypto?: boolean;
  goalsDetail?: Record<
    string,
    { risk?: string; horizon?: string; liquidity?: string; amountBand?: string; priority?: boolean }
  >;
}) {
  const recs: { code: string; name: string; rationale: string; risk?: string }[] = [];
  const goals = new Set(input.primaryGoals ?? []);
  const baseRisk = input.riskTolerance ?? "moderate";
  const gd = input.goalsDetail || {};

  const amountTxt = (band?: string) => (band ? ` (target ${band})` : "");

  // retirement
  if (goals.has("retirement")) {
    const g = gd["retirement"] || {};
    const risk = g.risk || baseRisk;
    const hz = g.horizon || input.timeHorizon || "10+y";
    const liq = g.liquidity || "annual";
    if (hz === "10+y") {
      recs.push({
        code: "RET-TARGETDATE",
        name: "Target-Date Retirement Strategy",
        rationale: `Retirement${amountTxt(g.amountBand)} — long horizon (${hz}) allows glidepath; liquidity ${liq}.`,
        risk,
      });
    } else if (hz === "5-10y") {
      recs.push({
        code: "RET-BAL-ALLOCATION",
        name: "Balanced Retirement Allocation",
        rationale: `Retirement${amountTxt(g.amountBand)} — medium horizon (${hz}); diversified multi-asset. Liquidity ${liq}.`,
        risk,
      });
    } else {
      recs.push({
        code: "RET-LADDER-TREASURY",
        name: "Treasury/CD Ladder for Near-Term Needs",
        rationale: `Retirement${amountTxt(g.amountBand)} — short horizon (${hz}); preserve capital with laddered high-quality fixed income.`,
        risk: "conservative",
      });
    }
  }

  // income
  if (goals.has("income")) {
    const g = gd["income"] || {};
    const risk = g.risk || baseRisk;
    const liq = g.liquidity || "monthly";
    recs.push({
      code: "INC-MUNI",
      name: "Tax-Sensitive Municipal Income",
      rationale: `Income goal${amountTxt(g.amountBand)} — steady after-tax income; liquidity ${liq}.`,
      risk,
    });
    recs.push({
      code: "INC-LADDER",
      name: "Treasury/Agency Ladder",
      rationale: `Income goal — laddered duration to manage reinvestment risk; fits ${liq} liquidity.`,
      risk: "conservative",
    });
  }

  // education
  if (goals.has("education")) {
    const g = gd["education"] || {};
    const risk = g.risk || baseRisk;
    const hz = g.horizon || "5-10y";
    recs.push({
      code: "EDU-529",
      name: "529 Plan (Age-Based or Custom)",
      rationale: `Education${amountTxt(g.amountBand)} — ${hz} horizon; tax-advantaged growth with age-based glidepath.`,
      risk,
    });
  }

  // home / major purchase
  if (goals.has("home") || goals.has("major_purchase")) {
    const key = goals.has("home") ? "home" : "major_purchase";
    const g = gd[key] || {};
    const hz = g.horizon || "<3y";
    recs.push({
      code: "PUR-LIQ-RESERVE",
      name: "High-Liquidity Reserve",
      rationale: `Near-term ${key.replace("_", " ")}${amountTxt(g.amountBand)} — ${hz} horizon; emphasize capital preservation & liquidity.`,
      risk: "conservative",
    });
  }

  // growth
  if (goals.has("growth")) {
    const g = gd["growth"] || {};
    const risk = g.risk || baseRisk;
    if (risk === "aggressive" || risk === "very_aggressive" || risk === "growth") {
      recs.push({
        code: "GRW-CORE-INDEX",
        name: "Core Equity Index + Satellites",
        rationale: `Growth${amountTxt(g.amountBand)} — higher risk tolerance; pair broad beta with selective tilts.`,
        risk,
      });
    } else {
      recs.push({
        code: "GRW-BALANCED",
        name: "Balanced Growth Allocation",
        rationale: `Growth${amountTxt(g.amountBand)} — moderate risk; diversified multi-asset approach.`,
        risk,
      });
    }
  }

  // legacy / estate
  if (goals.has("estate") || goals.has("legacy") || goals.has("estate_legacy")) {
    recs.push({
      code: "LEG-TRUST-CHECK",
      name: "Trust & Beneficiary Review",
      rationale: "Legacy/Estate — coordinate titling, TOD/beneficiaries, trust/ILIT review with counsel.",
      risk: baseRisk,
    });
  }

  if (input.hasCrypto) {
    recs.push({
      code: "ALT-RISK-DISCLOSURE",
      name: "Alternative/Volatility Disclosure",
      rationale: "Crypto exposure indicated — confirm disclosures and sizing within total portfolio risk.",
      risk: baseRisk,
    });
  }

  return recs;
}

function json(data: any, status = 200, extraHeaders: Record<string, string> = {}) {
  return NextResponse.json(data, {
    status,
    headers: {
      "Cache-Control": "no-store",
      ...extraHeaders,
    },
  });
}

function isPlainObject(v: unknown): v is Record<string, any> {
  return !!v && Object.prototype.toString.call(v) === "[object Object]";
}

/* ------------------- Server-side completion computation -------------------- */
function computeCompletion(input: {
  firstName?: string;
  lastName?: string;
  email?: string;

  employmentStatus?: string;
  annualIncomeBand?: string;

  liquidAssetsBand?: string;
  illiquidAssetsBand?: string;
  liabilitiesBand?: string;
  netWorthBand?: string;

  hasIRA?: boolean;
  has401k?: boolean;
  hasTaxable?: boolean;
  hasCrypto?: boolean;
  hasRealEstate?: boolean;

  primaryGoals?: string[];
  goalsDetail?: Record<string, any> | undefined;

  consentAccepted?: boolean;
}) {
  const sections = {
    identity: !!((input.firstName || input.lastName) && input.email),
    work: !!(input.employmentStatus && input.annualIncomeBand),
    assets:
      !!(input.liquidAssetsBand ||
      input.illiquidAssetsBand ||
      input.liabilitiesBand ||
      input.netWorthBand),
    accounts:
      [input.hasIRA, input.has401k, input.hasTaxable, input.hasCrypto, input.hasRealEstate].some(
        (v) => typeof v === "boolean"
      ),
    goals: Array.isArray(input.primaryGoals) && input.primaryGoals.length > 0,
    per_goal: !!(input.goalsDetail && Object.keys(input.goalsDetail).length > 0),
    consent: !!input.consentAccepted,
  };
  const total = Object.keys(sections).length;
  const done = Object.values(sections).filter(Boolean).length;
  const pct = Math.max(0, Math.min(100, Math.round((done / total) * 100)));
  return { pct, sections };
}
/* --------------------------------------------------------------------------- */

// ⚠️ Keep 2nd arg loose so Next.js validator is happy.
export async function POST(req: NextRequest, context: any) {
  try {
    const { token } = context.params as { token: string };
    if (!token || typeof token !== "string" || token.trim().length === 0) {
      return json({ error: "Missing or invalid token." }, 400);
    }

    // Rate limit first
    rateLimitOrThrow(req, token);

    // ✅ Look up the advisor behind this intake token
    const intake = await prisma.intakeLink.findUnique({
      where: { token },
      select: {
        advisorId: true,
        isActive: true,
        expiresAt: true,
        advisor: {
          select: {
            id: true,
            name: true,
            firm: true,
            email: true,
          },
        },
      },
    });

    const expired =
      !!intake?.expiresAt && intake.expiresAt.getTime() <= Date.now();

    if (!intake?.advisorId || !intake.isActive || expired) {
      return json({ error: "Invalid or expired token." }, 404);
    }
    const advisorId = intake.advisorId;

    // Sentry tagging so you can trace issues by advisor/token
    try {
      setSentryTagsServer?.({ advisorId, firmCode: null, clientId: token });
    } catch {
      // optional
    }

    // Safely parse JSON
    let body: any = null;
    try {
      body = await req.json();
    } catch {
      return json({ error: "Invalid JSON body." }, 400);
    }

    const {
      // identifiers
      fullName,
      firstName,
      lastName,
      email,
      phone,
      dateOfBirth,
      addressLine1,
      addressLine2,
      city,
      state,
      postalCode,
      country,
      citizenship,

      // financial
      employmentStatus,
      employerName,
      annualIncomeBand,
      sourceOfFunds,
      liquidAssetsBand,
      illiquidAssetsBand,
      liabilitiesBand,
      netWorthBand,
      hasIRA,
      has401k,
      hasTaxable,
      hasCrypto,
      hasRealEstate,

      // risk/goals
      riskTolerance,
      timeHorizon,
      primaryGoals,
      liquidityNeeds,
      constraints,
      investmentExperience,

      // per-goal detail
      goalsDetail,

      // identity / docs
      ssn,
      idDocType,
      idDocUrl,
      proofOfAddressUrl,
      consentAccepted,

      // narratives (store next-topic in concernsNarrative)
      introNarrative,
      goalsNarrative,
      concernsNarrative,
    } = body ?? {};

    const rawSubmission =
      isPlainObject(body)
        ? {
            ...body,
            ...(ssn ? { ssn: "[redacted]" } : {}),
            ...(dateOfBirth ? { dateOfBirth: "[redacted]" } : {}),
            ...(idDocUrl ? { idDocUrl: "[redacted]" } : {}),
            ...(proofOfAddressUrl ? { proofOfAddressUrl: "[redacted]" } : {}),
          }
        : undefined;

    // Minimal but strict: require email (unique key) and some name signal
    if (!email || typeof email !== "string") {
      return json({ error: "Missing required field: email." }, 400);
    }
    const emailOk = /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(String(email));
    if (!emailOk) {
      return json({ error: "Please enter a valid email address." }, 400);
    }
    const firstNameSafe = typeof firstName === "string" ? firstName : "";
    const lastNameSafe = typeof lastName === "string" ? lastName : "";
    const nameFallback = typeof fullName === "string" ? fullName.trim() : "";
    const [nf, nl] =
      !firstNameSafe && !lastNameSafe && nameFallback ? splitFullName(nameFallback) : [firstNameSafe, lastNameSafe];

    const ssnEnc = ssn ? encryptPII(String(ssn)) : null;
    const dobEnc = dateOfBirth ? encryptPII(String(dateOfBirth)) : null;
    const consentAcceptedAt = consentAccepted ? new Date() : null;
    const complianceRequest =
      ssn || dateOfBirth || idDocType
        ? await createComplianceRequest({
            advisorId,
            advisorName: intake.advisor?.name ?? null,
            clientEmail: email,
            firstName: nf,
            lastName: nl,
            dateOfBirth: dateOfBirth ? String(dateOfBirth) : null,
            ssnLast4: ssn ? String(ssn) : null,
            idDocType: idDocType ? String(idDocType) : null,
          })
        : null;
    const identityVerificationStatus = ssn || dateOfBirth ? "in_review" : "pending";
    const documentVerificationStatus =
      complianceRequest?.providerRef || idDocType ? "in_review" : "pending";
    const idDocProviderRef = complianceRequest?.providerRef ?? null;
    const secureReviewUrl = complianceRequest?.reviewUrl ?? null;

    // Only include JSON when it's a plain object; otherwise omit the field.
    const goalsDetailInput = isPlainObject(goalsDetail) ? goalsDetail : undefined;

    // Compute completion snapshot from this payload
    const { pct: onboardingProgress, sections: sectionCompletion } = computeCompletion({
      firstName: nf,
      lastName: nl,
      email,
      employmentStatus,
      annualIncomeBand,
      liquidAssetsBand,
      illiquidAssetsBand,
      liabilitiesBand,
      netWorthBand,
      hasIRA,
      has401k,
      hasTaxable,
      hasCrypto,
      hasRealEstate,
      primaryGoals,
      goalsDetail: goalsDetailInput,
      consentAccepted,
    });

    // 🔗 UPSERT the client **scoped to this advisor**
    const client = await prisma.client.upsert({
      where: { advisorId_email: { advisorId, email } },
      create: {
        advisorId,
        email,

        // persist the specific link used for this submission
        intakeToken: token,

        firstName: nf,
        lastName: nl,
        phone,
        dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
        addressLine1,
        addressLine2,
        city,
        state,
        postalCode,
        country,
        citizenship,

        ssnCipher: null,
        ssnIv: null,
        ssnEnc,
        dobEnc,

        employmentStatus,
        employerName,
        annualIncomeBand,
        sourceOfFunds,
        liquidAssetsBand,
        illiquidAssetsBand,
        liabilitiesBand,
        netWorthBand,
        hasIRA: !!hasIRA,
        has401k: !!has401k,
        hasTaxable: hasTaxable !== false,
        hasCrypto: !!hasCrypto,
        hasRealEstate: !!hasRealEstate,

        riskTolerance,
        timeHorizon,
        primaryGoals: Array.isArray(primaryGoals) ? primaryGoals : [],
        liquidityNeeds,
        constraints: Array.isArray(constraints) ? constraints : [],
        investmentExperience,

        // per-goal detail
        goalsDetail: goalsDetailInput,

        // narratives
        introNarrative: introNarrative ?? null,
        goalsNarrative: goalsNarrative ?? null,
        concernsNarrative: concernsNarrative ?? null,

        // server-computed progress
        onboardingProgress,
        sectionCompletion: sectionCompletion as any,

        identityVerificationStatus,
        documentVerificationStatus,
        idDocType,
        idDocUrl: secureReviewUrl,
        idDocProviderRef,
        proofOfAddressUrl: null,
        reviewNotes: null,
        reviewedAt: null,
        reviewedBy: null,
        consentAcceptedAt,
        onboardingStatus: "in_progress",
        advisorName: intake.advisor?.name ?? null,
        advisorFirm: intake.advisor?.firm ?? null,
        rawSubmission,
      },
      update: {
        // keep/set the link used for latest submission
        intakeToken: token,

        firstName: nf,
        lastName: nl,
        phone,
        dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
        addressLine1,
        addressLine2,
        city,
        state,
        postalCode,
        country,
        citizenship,

        employmentStatus,
        employerName,
        annualIncomeBand,
        sourceOfFunds,
        liquidAssetsBand,
        illiquidAssetsBand,
        liabilitiesBand,
        netWorthBand,
        hasIRA: !!hasIRA,
        has401k: !!has401k,
        hasTaxable: hasTaxable !== false,
        hasCrypto: !!hasCrypto,
        hasRealEstate: !!hasRealEstate,

        riskTolerance,
        timeHorizon,
        primaryGoals: Array.isArray(primaryGoals) ? primaryGoals : [],
        liquidityNeeds,
        constraints: Array.isArray(constraints) ? constraints : [],
        investmentExperience,

        // per-goal detail
        goalsDetail: goalsDetailInput,

        // narratives
        introNarrative: introNarrative ?? null,
        goalsNarrative: goalsNarrative ?? null,
        concernsNarrative: concernsNarrative ?? null,

        // server-computed progress
        onboardingProgress,
        sectionCompletion: sectionCompletion as any,

        ssnCipher: null,
        ssnIv: null,
        ssnEnc,
        dobEnc,
        identityVerificationStatus,
        documentVerificationStatus,
        idDocType,
        idDocUrl: secureReviewUrl,
        idDocProviderRef,
        proofOfAddressUrl: null,
        reviewNotes: null,
        reviewedAt: null,
        reviewedBy: null,
        consentAcceptedAt,
        onboardingStatus: "in_progress",
        advisorName: intake.advisor?.name ?? null,
        advisorFirm: intake.advisor?.firm ?? null,
        rawSubmission,
        updatedAt: new Date(),
      },
      select: { id: true },
    });

    // Refresh product recs atomically
    const recs = matchProducts({
      riskTolerance,
      timeHorizon,
      primaryGoals,
      annualIncomeBand,
      hasIRA,
      has401k,
      hasTaxable,
      hasCrypto,
      goalsDetail: goalsDetailInput as any,
    });

    await prisma.$transaction([
      prisma.productMatch.deleteMany({ where: { clientId: client.id } }),
      ...(recs.length
        ? [
            prisma.productMatch.createMany({
              data: recs.map((r) => ({
                clientId: client.id,
                productCode: r.code,
                productName: r.name,
                rationale: r.rationale,
                riskBand: r.risk ?? null,
              })),
            }),
          ]
        : []),
    ]);

    await prisma.trialLead.updateMany({
      where: {
        advisorId,
        email,
        status: "new",
      },
      data: { status: "activated" },
    }).catch(() => null);

    const adminOrigin = process.env.NEXT_PUBLIC_ADMIN_ORIGIN || new URL(req.url).origin;
    const advisorAdminUrl = `${adminOrigin}/admin/clients?admin_token=${issueAdvisorToken(advisorId)}`;

    await Promise.allSettled([
      recordLifecycleEvent({
        eventType: "client.onboarding.submitted",
        actorRole: "client",
        advisorId,
        clientId: client.id,
        metadata: {
          onboardingProgress,
          openQuestions: Array.isArray(constraints) ? constraints.length : 0,
        },
      }),
      recordAuditLog({
        actorRole: "client",
        actorLabel: email,
        advisorId,
        action: "client.onboarding.submitted",
        targetType: "client",
        targetId: client.id,
        metadata: {
          onboardingProgress,
          sourceOfFunds,
        },
      }),
      complianceRequest?.providerRef
        ? recordLifecycleEvent({
            eventType: "client.compliance.requested",
            actorRole: "system",
            advisorId,
            clientId: client.id,
            metadata: {
              providerRef: complianceRequest.providerRef,
              reviewUrl: complianceRequest.reviewUrl,
            },
          })
        : Promise.resolve(),
      syncClientToHubSpot({
        firstName: nf,
        lastName: nl,
        email,
        phone: typeof phone === "string" ? phone : null,
        company: intake.advisor?.firm ?? null,
      }),
      intake.advisor?.email
        ? sendNewSubmissionEmail({
            to: intake.advisor.email,
            advisorName: intake.advisor.name || undefined,
            client: { firstName: nf, lastName: nl, email },
            submissionId: client.id,
            adminUrl: advisorAdminUrl,
          })
        : Promise.resolve(),
    ]);

    return json(
      {
        ok: true,
        clientId: client.id,
        nextUrl: `/onboarding/${encodeURIComponent(token)}/done`,
        recommendations: recs,
      },
      201
    );
  } catch (e: any) {
    const status = e?.status || 500;
    const extraHeaders = e?.headers || {};
    console.error("POST /api/onboarding/[token] error:", e);
    return new NextResponse(JSON.stringify({ error: e?.message || "Server error" }), {
      status,
      headers: { "Content-Type": "application/json", "Cache-Control": "no-store", ...extraHeaders },
    });
  }
}

export async function GET() {
  return json({ error: "Method not allowed." }, 405);
}

function splitFullName(name: string): [string, string] {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 0) return ["", ""];
  if (parts.length === 1) return [parts[0], ""];
  const last = parts.pop() as string;
  return [parts.join(" "), last];
}
