// src/app/api/onboarding/[token]/route.ts
export const runtime = "nodejs"; // Prisma needs Node runtime on Vercel

import { NextResponse, NextRequest } from "next/server";
import { prisma } from "../../../../prisma";          // keep your existing helper
import { setSentryTagsServer } from "@/lib/sentry-tags";

/* ------------------------- Rate limiter (in-memory) ------------------------- */
const RATE_BUCKETS = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 8;          // 8 requests
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

// Optional AES-256-GCM encryption for SSN (skips if PII_ENC_KEY is not set or invalid)
const keyB64 = process.env.PII_ENC_KEY;
async function encryptPII(value?: string) {
  if (!value || !keyB64) return { cipher: null as Buffer | null, iv: null as Buffer | null };
  try {
    const raw = Buffer.from(keyB64, "base64");
    if (raw.length !== 32) {
      console.warn("PII_ENC_KEY must be 32 bytes (base64). Skipping encryption.");
      return { cipher: null, iv: null };
    }
    const key = await crypto.subtle.importKey("raw", raw, { name: "AES-GCM" }, false, ["encrypt"]);
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const encoded = new TextEncoder().encode(value);
    const ct = await crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, encoded);
    return { cipher: Buffer.from(ct), iv: Buffer.from(iv) };
  } catch (e) {
    console.warn("encryptPII failed; storing nulls:", e);
    return { cipher: null, iv: null };
  }
}

// Simple rules-based product matcher (expand as needed)
function matchProducts(input: {
  riskTolerance?: string;
  timeHorizon?: string;
  primaryGoals?: string[];
  annualIncomeBand?: string;
  hasIRA?: boolean;
  has401k?: boolean;
  hasTaxable?: boolean;
  hasCrypto?: boolean;
}) {
  const recs: { code: string; name: string; rationale: string; risk?: string }[] = [];
  const goals = new Set(input.primaryGoals ?? []);
  const risk = input.riskTolerance ?? "moderate";

  if (goals.has("retirement")) {
    if (input.hasIRA || input.has401k) {
      recs.push({
        code: "RET-TARGETDATE",
        name: "Target-Date Retirement Strategy",
        rationale: "Retirement goal; a glidepath auto-adjusts risk over time.",
        risk,
      });
    } else {
      recs.push({
        code: "RET-IRA-ROLLOVER",
        name: "IRA Rollover (Traditional/Roth)",
        rationale: "No IRA/401k linked; consider a tax-advantaged IRA setup.",
        risk,
      });
    }
  }

  if (goals.has("income")) {
    recs.push({
      code: "INC-MUNI",
      name: "Tax-Sensitive Municipal Income",
      rationale: "Income objective with potential tax efficiency.",
      risk,
    });
  }

  if (goals.has("growth")) {
    if (risk === "aggressive" || risk === "growth") {
      recs.push({
        code: "GRW-CORE-INDEX",
        name: "Core Equity Index + Satellites",
        rationale: "Higher risk tolerance; pair broad beta with selective tilts.",
        risk,
      });
    } else {
      recs.push({
        code: "GRW-BALANCED",
        name: "Balanced Allocation",
        rationale: "Growth goal with moderate risk; diversified multi-asset exposure.",
        risk,
      });
    }
  }

  if (input.hasCrypto) {
    recs.push({
      code: "ALT-RISK-DISCLOSURE",
      name: "Alternative/Volatility Disclosure",
      rationale: "Crypto exposure indicated — confirm disclosures and diversification.",
      risk,
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
      select: { advisorId: true },
    });

    if (!intake?.advisorId) {
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
      firstName, lastName, email, phone,
      dateOfBirth, addressLine1, addressLine2, city, state, postalCode, country, citizenship,

      // financial
      employmentStatus, employerName, annualIncomeBand, sourceOfFunds,
      liquidAssetsBand, illiquidAssetsBand, liabilitiesBand, netWorthBand,
      hasIRA, has401k, hasTaxable, hasCrypto, hasRealEstate,

      // risk/goals
      riskTolerance, timeHorizon, primaryGoals, liquidityNeeds, constraints, investmentExperience,

      // per-goal detail
      goalsDetail,

      // identity / docs
      ssn, idDocType, idDocUrl, proofOfAddressUrl,
      consentAccepted,

      // narratives (store next-topic in concernsNarrative)
      introNarrative, goalsNarrative, concernsNarrative,
    } = body ?? {};

    // Minimal but strict: require email (unique key) and some name signal
    if (!email || typeof email !== "string") {
      return json({ error: "Missing required field: email." }, 400);
    }
    const emailOk = /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(String(email));
    if (!emailOk) {
      return json({ error: "Please enter a valid email address." }, 400);
    }
    const firstNameSafe = typeof firstName === "string" ? firstName : "";
    const lastNameSafe  = typeof lastName  === "string" ? lastName  : "";
    const nameFallback  = typeof fullName  === "string" ? fullName.trim() : "";
    const [nf, nl]      = (!firstNameSafe && !lastNameSafe && nameFallback)
      ? splitFullName(nameFallback)
      : [firstNameSafe, lastNameSafe];

    const enc = await encryptPII(ssn);
    const consentAcceptedAt = consentAccepted ? new Date() : null;

    // sanitize goalsDetail to a plain object (or null)
    const goalsDetailJson = isPlainObject(goalsDetail) ? goalsDetail : null;

    // 🔗 UPSERT the client **scoped to this advisor**
    const client = await prisma.client.upsert({
      where: { advisorId_email: { advisorId, email } },
      create: {
        advisorId,
        email,

        firstName: nf, lastName: nl, phone,
        dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
        addressLine1, addressLine2, city, state, postalCode, country, citizenship,

        ssnCipher: enc.cipher,
        ssnIv: enc.iv,

        employmentStatus, employerName, annualIncomeBand, sourceOfFunds,
        liquidAssetsBand, illiquidAssetsBand, liabilitiesBand, netWorthBand,
        hasIRA: !!hasIRA, has401k: !!has401k, hasTaxable: hasTaxable !== false, hasCrypto: !!hasCrypto, hasRealEstate: !!hasRealEstate,

        riskTolerance, timeHorizon,
        primaryGoals: Array.isArray(primaryGoals) ? primaryGoals : [],
        liquidityNeeds,
        constraints: Array.isArray(constraints) ? constraints : [],
        investmentExperience,

        // per-goal detail
        goalsDetail: goalsDetailJson,

        // narratives
        introNarrative: introNarrative ?? null,
        goalsNarrative: goalsNarrative ?? null,
        concernsNarrative: concernsNarrative ?? null,

        idDocType, idDocUrl, proofOfAddressUrl,
        consentAcceptedAt,
        onboardingStatus: "in_progress",
      },
      update: {
        firstName: nf, lastName: nl, phone,
        dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
        addressLine1, addressLine2, city, state, postalCode, country, citizenship,

        employmentStatus, employerName, annualIncomeBand, sourceOfFunds,
        liquidAssetsBand, illiquidAssetsBand, liabilitiesBand, netWorthBand,
        hasIRA: !!hasIRA, has401k: !!has401k, hasTaxable: hasTaxable !== false, hasCrypto: !!hasCrypto, hasRealEstate: !!hasRealEstate,

        riskTolerance, timeHorizon,
        primaryGoals: Array.isArray(primaryGoals) ? primaryGoals : [],
        liquidityNeeds,
        constraints: Array.isArray(constraints) ? constraints : [],
        investmentExperience,

        // per-goal detail
        goalsDetail: goalsDetailJson,

        // narratives
        introNarrative: introNarrative ?? null,
        goalsNarrative: goalsNarrative ?? null,
        concernsNarrative: concernsNarrative ?? null,

        idDocType, idDocUrl, proofOfAddressUrl,
        consentAcceptedAt,
        onboardingStatus: "in_progress",
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
    });

    await prisma.$transaction([
      prisma.productMatch.deleteMany({ where: { clientId: client.id } }),
      ...(recs.length
        ? [prisma.productMatch.createMany({
            data: recs.map(r => ({
              clientId: client.id,
              productCode: r.code,
              productName: r.name,
              rationale: r.rationale,
              riskBand: r.risk ?? null,
            })),
          })]
        : []),
    ]);

    return json({ ok: true, token, advisorId, clientId: client.id, recommendations: recs }, 201);
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