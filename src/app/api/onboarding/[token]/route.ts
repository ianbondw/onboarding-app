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

function normalizeText(value: unknown, max = 160) {
  if (typeof value !== "string") return null;
  const collapsed = value.replace(/\s+/g, " ").trim();
  if (!collapsed) return null;
  return collapsed.slice(0, max);
}

function normalizeEmail(value: unknown) {
  const cleaned = normalizeText(value, 254);
  return cleaned ? cleaned.toLowerCase() : null;
}

function normalizePhone(value: unknown) {
  const cleaned = normalizeText(value, 32);
  return cleaned ? cleaned.replace(/[^\d+().\-\s]/g, "").trim() || null : null;
}

function normalizeDateOnly(value: unknown) {
  if (typeof value !== "string") return null;
  const cleaned = value.trim();
  if (!/^\d{4}-\d{2}-\d{2}$/.test(cleaned)) return null;
  const parsed = new Date(`${cleaned}T12:00:00.000Z`);
  if (Number.isNaN(parsed.getTime())) return null;
  if (parsed.getTime() > Date.now()) return null;
  return cleaned;
}

function normalizeLastFour(value: unknown) {
  if (value === undefined || value === null || value === "") return null;
  const digits = String(value).replace(/\D/g, "");
  if (!digits) return null;
  return /^\d{4}$/.test(digits) ? digits : null;
}

function uniqueChoices(value: unknown, max = 48) {
  if (!Array.isArray(value)) return [];
  return Array.from(
    new Set(
      value
        .map((entry) => normalizeText(entry, max))
        .filter((entry): entry is string => !!entry)
    )
  );
}

type GoalDetailShape = {
  risk?: string;
  horizon?: string;
  liquidity?: string;
  amountBand?: string;
  priority?: boolean;
};

function sanitizeGoalsDetail(value: unknown): Record<string, GoalDetailShape> | undefined {
  if (!isPlainObject(value)) return undefined;

  const sanitized = Object.fromEntries(
    Object.entries(value)
      .map(([goalKey, raw]) => {
        const key = normalizeText(goalKey, 48);
        if (!key || !isPlainObject(raw)) return null;

        const detail: GoalDetailShape = {
          ...(normalizeText(raw.risk, 48) ? { risk: normalizeText(raw.risk, 48)! } : {}),
          ...(normalizeText(raw.horizon, 48)
            ? { horizon: normalizeText(raw.horizon, 48)! }
            : {}),
          ...(normalizeText(raw.liquidity, 48)
            ? { liquidity: normalizeText(raw.liquidity, 48)! }
            : {}),
          ...(normalizeText(raw.amountBand, 48)
            ? { amountBand: normalizeText(raw.amountBand, 48)! }
            : {}),
          ...(typeof raw.priority === "boolean" ? { priority: raw.priority } : {}),
        };

        return [key, detail] as const;
      })
      .filter((entry): entry is readonly [string, GoalDetailShape] => !!entry)
  );

  return Object.keys(sanitized).length > 0 ? sanitized : undefined;
}

function buildSubmissionSnapshot(input: {
  employmentStatus: string | null;
  annualIncomeBand: string | null;
  sourceOfFunds: string | null;
  liquidAssetsBand: string | null;
  illiquidAssetsBand: string | null;
  liabilitiesBand: string | null;
  netWorthBand: string | null;
  hasIRA: boolean;
  has401k: boolean;
  hasTaxable: boolean;
  hasCrypto: boolean;
  hasRealEstate: boolean;
  riskTolerance: string | null;
  timeHorizon: string | null;
  primaryGoals: string[];
  liquidityNeeds: string | null;
  constraints: string[];
  investmentExperience: string | null;
  goalsDetail?: Record<string, GoalDetailShape>;
  consentAccepted: boolean;
  hasPhone: boolean;
  hasAddress: boolean;
  hasDob: boolean;
  hasSsnLast4: boolean;
  idDocType: string | null;
  introNarrative: string | null;
  goalsNarrative: string | null;
  concernsNarrative: string | null;
}) {
  return {
    schemaVersion: 2,
    employmentStatus: input.employmentStatus,
    annualIncomeBand: input.annualIncomeBand,
    sourceOfFunds: input.sourceOfFunds,
    liquidAssetsBand: input.liquidAssetsBand,
    illiquidAssetsBand: input.illiquidAssetsBand,
    liabilitiesBand: input.liabilitiesBand,
    netWorthBand: input.netWorthBand,
    hasIRA: input.hasIRA,
    has401k: input.has401k,
    hasTaxable: input.hasTaxable,
    hasCrypto: input.hasCrypto,
    hasRealEstate: input.hasRealEstate,
    riskTolerance: input.riskTolerance,
    timeHorizon: input.timeHorizon,
    primaryGoals: input.primaryGoals,
    liquidityNeeds: input.liquidityNeeds,
    constraints: input.constraints,
    investmentExperience: input.investmentExperience,
    goalsDetail: input.goalsDetail || null,
    consentAccepted: input.consentAccepted,
    identitySignals: {
      hasPhone: input.hasPhone,
      hasAddress: input.hasAddress,
      hasDob: input.hasDob,
      hasSsnLast4: input.hasSsnLast4,
      idDocType: input.idDocType,
    },
    narrativeSignals: {
      introCaptured: !!input.introNarrative,
      goalsCaptured: !!input.goalsNarrative,
      concernsCaptured: !!input.concernsNarrative,
    },
  };
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

    const emailSafe = normalizeEmail(email);
    if (!emailSafe) {
      return json({ error: "Missing required field: email." }, 400);
    }
    const emailOk = /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(emailSafe);
    if (!emailOk) {
      return json({ error: "Please enter a valid email address." }, 400);
    }
    const firstNameSafe = normalizeText(firstName, 80) || "";
    const lastNameSafe = normalizeText(lastName, 80) || "";
    const nameFallback = normalizeText(fullName, 160) || "";
    const [nf, nl] =
      !firstNameSafe && !lastNameSafe && nameFallback ? splitFullName(nameFallback) : [firstNameSafe, lastNameSafe];
    const phoneSafe = normalizePhone(phone);
    const addressLine1Safe = normalizeText(addressLine1, 160);
    const addressLine2Safe = normalizeText(addressLine2, 160);
    const citySafe = normalizeText(city, 80);
    const stateSafe = normalizeText(state, 80);
    const postalCodeSafe = normalizeText(postalCode, 24);
    const countrySafe = normalizeText(country, 56);
    const citizenshipSafe = normalizeText(citizenship, 56);
    const employmentStatusSafe = normalizeText(employmentStatus, 48);
    const employerNameSafe = normalizeText(employerName, 160);
    const annualIncomeBandSafe = normalizeText(annualIncomeBand, 48);
    const sourceOfFundsSafe = normalizeText(sourceOfFunds, 160);
    const liquidAssetsBandSafe = normalizeText(liquidAssetsBand, 48);
    const illiquidAssetsBandSafe = normalizeText(illiquidAssetsBand, 48);
    const liabilitiesBandSafe = normalizeText(liabilitiesBand, 48);
    const netWorthBandSafe = normalizeText(netWorthBand, 48);
    const riskToleranceSafe = normalizeText(riskTolerance, 48);
    const timeHorizonSafe = normalizeText(timeHorizon, 48);
    const liquidityNeedsSafe = normalizeText(liquidityNeeds, 48);
    const investmentExperienceSafe = normalizeText(investmentExperience, 48);
    const primaryGoalsSafe = uniqueChoices(primaryGoals, 48);
    const constraintsSafe = uniqueChoices(constraints, 48);
    const idDocTypeSafe = normalizeText(idDocType, 48);
    const introNarrativeSafe = normalizeText(introNarrative, 1200);
    const goalsNarrativeSafe = normalizeText(goalsNarrative, 1200);
    const concernsNarrativeSafe = normalizeText(concernsNarrative, 2000);
    const dobValue = normalizeDateOnly(dateOfBirth);
    if (dateOfBirth && !dobValue) {
      return json({ error: "Please enter a valid date of birth." }, 400);
    }
    const ssnLast4 = normalizeLastFour(ssn);
    if (ssn && !ssnLast4) {
      return json({ error: "Only the last four digits of SSN may be submitted." }, 400);
    }
    const goalsDetailInput = sanitizeGoalsDetail(goalsDetail);
    const consentAcceptedBool = !!consentAccepted;
    const rawSubmission = buildSubmissionSnapshot({
      employmentStatus: employmentStatusSafe,
      annualIncomeBand: annualIncomeBandSafe,
      sourceOfFunds: sourceOfFundsSafe,
      liquidAssetsBand: liquidAssetsBandSafe,
      illiquidAssetsBand: illiquidAssetsBandSafe,
      liabilitiesBand: liabilitiesBandSafe,
      netWorthBand: netWorthBandSafe,
      hasIRA: !!hasIRA,
      has401k: !!has401k,
      hasTaxable: hasTaxable !== false,
      hasCrypto: !!hasCrypto,
      hasRealEstate: !!hasRealEstate,
      riskTolerance: riskToleranceSafe,
      timeHorizon: timeHorizonSafe,
      primaryGoals: primaryGoalsSafe,
      liquidityNeeds: liquidityNeedsSafe,
      constraints: constraintsSafe,
      investmentExperience: investmentExperienceSafe,
      goalsDetail: goalsDetailInput,
      consentAccepted: consentAcceptedBool,
      hasPhone: !!phoneSafe,
      hasAddress: !!(addressLine1Safe || citySafe || stateSafe || postalCodeSafe),
      hasDob: !!dobValue,
      hasSsnLast4: !!ssnLast4,
      idDocType: idDocTypeSafe,
      introNarrative: introNarrativeSafe,
      goalsNarrative: goalsNarrativeSafe,
      concernsNarrative: concernsNarrativeSafe,
    });

    const ssnEnc = ssnLast4 ? encryptPII(ssnLast4) : null;
    const dobEnc = dobValue ? encryptPII(dobValue) : null;
    const consentAcceptedAt = consentAcceptedBool ? new Date() : null;
    const complianceRequest =
      ssnLast4 || dobValue || idDocTypeSafe
        ? await createComplianceRequest({
            advisorId,
            advisorName: intake.advisor?.name ?? null,
            clientEmail: emailSafe,
            firstName: nf,
            lastName: nl,
            dateOfBirth: dobValue,
            ssnLast4,
            idDocType: idDocTypeSafe,
          })
        : null;
    const identityVerificationStatus = ssnLast4 || dobValue ? "in_review" : "pending";
    const documentVerificationStatus =
      complianceRequest?.providerRef || idDocTypeSafe ? "in_review" : "pending";
    const idDocProviderRef = complianceRequest?.providerRef ?? null;
    const secureReviewUrl = complianceRequest?.reviewUrl ?? null;

    // Compute completion snapshot from this payload
    const { pct: onboardingProgress, sections: sectionCompletion } = computeCompletion({
      firstName: nf,
      lastName: nl,
      email: emailSafe,
      employmentStatus: employmentStatusSafe || undefined,
      annualIncomeBand: annualIncomeBandSafe || undefined,
      liquidAssetsBand: liquidAssetsBandSafe || undefined,
      illiquidAssetsBand: illiquidAssetsBandSafe || undefined,
      liabilitiesBand: liabilitiesBandSafe || undefined,
      netWorthBand: netWorthBandSafe || undefined,
      hasIRA,
      has401k,
      hasTaxable,
      hasCrypto,
      hasRealEstate,
      primaryGoals: primaryGoalsSafe,
      goalsDetail: goalsDetailInput,
      consentAccepted: consentAcceptedBool,
    });

    // 🔗 UPSERT the client **scoped to this advisor**
    const client = await prisma.client.upsert({
      where: { advisorId_email: { advisorId, email: emailSafe } },
      create: {
        advisorId,
        email: emailSafe,

        // persist the specific link used for this submission
        intakeToken: token,

        firstName: nf,
        lastName: nl,
        phone: phoneSafe,
        dateOfBirth: null,
        addressLine1: addressLine1Safe,
        addressLine2: addressLine2Safe,
        city: citySafe,
        state: stateSafe,
        postalCode: postalCodeSafe,
        country: countrySafe,
        citizenship: citizenshipSafe,

        ssnCipher: null,
        ssnIv: null,
        ssnEnc,
        dobEnc,

        employmentStatus: employmentStatusSafe,
        employerName: employerNameSafe,
        annualIncomeBand: annualIncomeBandSafe,
        sourceOfFunds: sourceOfFundsSafe,
        liquidAssetsBand: liquidAssetsBandSafe,
        illiquidAssetsBand: illiquidAssetsBandSafe,
        liabilitiesBand: liabilitiesBandSafe,
        netWorthBand: netWorthBandSafe,
        hasIRA: !!hasIRA,
        has401k: !!has401k,
        hasTaxable: hasTaxable !== false,
        hasCrypto: !!hasCrypto,
        hasRealEstate: !!hasRealEstate,

        riskTolerance: riskToleranceSafe,
        timeHorizon: timeHorizonSafe,
        primaryGoals: primaryGoalsSafe,
        liquidityNeeds: liquidityNeedsSafe,
        constraints: constraintsSafe,
        investmentExperience: investmentExperienceSafe,

        // per-goal detail
        goalsDetail: goalsDetailInput,

        // narratives
        introNarrative: introNarrativeSafe,
        goalsNarrative: goalsNarrativeSafe,
        concernsNarrative: concernsNarrativeSafe,

        // server-computed progress
        onboardingProgress,
        sectionCompletion: sectionCompletion as any,

        identityVerificationStatus,
        documentVerificationStatus,
        idDocType: idDocTypeSafe,
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
        phone: phoneSafe,
        dateOfBirth: null,
        addressLine1: addressLine1Safe,
        addressLine2: addressLine2Safe,
        city: citySafe,
        state: stateSafe,
        postalCode: postalCodeSafe,
        country: countrySafe,
        citizenship: citizenshipSafe,

        employmentStatus: employmentStatusSafe,
        employerName: employerNameSafe,
        annualIncomeBand: annualIncomeBandSafe,
        sourceOfFunds: sourceOfFundsSafe,
        liquidAssetsBand: liquidAssetsBandSafe,
        illiquidAssetsBand: illiquidAssetsBandSafe,
        liabilitiesBand: liabilitiesBandSafe,
        netWorthBand: netWorthBandSafe,
        hasIRA: !!hasIRA,
        has401k: !!has401k,
        hasTaxable: hasTaxable !== false,
        hasCrypto: !!hasCrypto,
        hasRealEstate: !!hasRealEstate,

        riskTolerance: riskToleranceSafe,
        timeHorizon: timeHorizonSafe,
        primaryGoals: primaryGoalsSafe,
        liquidityNeeds: liquidityNeedsSafe,
        constraints: constraintsSafe,
        investmentExperience: investmentExperienceSafe,

        // per-goal detail
        goalsDetail: goalsDetailInput,

        // narratives
        introNarrative: introNarrativeSafe,
        goalsNarrative: goalsNarrativeSafe,
        concernsNarrative: concernsNarrativeSafe,

        // server-computed progress
        onboardingProgress,
        sectionCompletion: sectionCompletion as any,

        ssnCipher: null,
        ssnIv: null,
        ssnEnc,
        dobEnc,
        identityVerificationStatus,
        documentVerificationStatus,
        idDocType: idDocTypeSafe,
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
      riskTolerance: riskToleranceSafe || undefined,
      timeHorizon: timeHorizonSafe || undefined,
      primaryGoals: primaryGoalsSafe,
      annualIncomeBand: annualIncomeBandSafe || undefined,
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
        email: emailSafe,
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
          openQuestions: constraintsSafe.length,
        },
      }),
      recordAuditLog({
        actorRole: "client",
        actorLabel: emailSafe,
        advisorId,
        action: "client.onboarding.submitted",
        targetType: "client",
        targetId: client.id,
        metadata: {
          onboardingProgress,
          sourceOfFunds: sourceOfFundsSafe,
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
        email: emailSafe,
        phone: phoneSafe,
        company: intake.advisor?.firm ?? null,
      }),
      intake.advisor?.email
        ? sendNewSubmissionEmail({
            to: intake.advisor.email,
            advisorName: intake.advisor.name || undefined,
            client: { firstName: nf, lastName: nl, email: emailSafe },
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
