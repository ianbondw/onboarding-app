import type { Prisma, PrismaClient } from "@prisma/client";

type DemoDb = Prisma.TransactionClient | PrismaClient;

type DemoHousehold = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  employmentStatus: string;
  employerName?: string | null;
  annualIncomeBand: string;
  sourceOfFunds: string;
  liquidAssetsBand: string;
  illiquidAssetsBand: string;
  liabilitiesBand: string;
  netWorthBand: string;
  riskTolerance: string;
  timeHorizon: string;
  primaryGoals: string[];
  liquidityNeeds: string;
  constraints: string[];
  investmentExperience: string;
  hasIRA: boolean;
  has401k: boolean;
  hasTaxable: boolean;
  hasCrypto: boolean;
  hasRealEstate: boolean;
  onboardingProgress: number;
  onboardingStatus: string;
  identityVerificationStatus: string;
  documentVerificationStatus: string;
  idDocType?: string | null;
  reviewNotes?: string | null;
  reviewedBy?: string | null;
  reviewedAt?: Date | null;
  concernsNarrative: string;
  introNarrative?: string | null;
  goalsNarrative?: string | null;
  goalsDetail: Record<string, any>;
  productMatches: Array<{
    productCode: string;
    productName: string;
    rationale: string;
    riskBand?: string | null;
  }>;
  flags: Array<{
    fieldKey: string;
    note?: string | null;
  }>;
  createdAt: Date;
};

const SAMPLE_HOUSEHOLDS: DemoHousehold[] = [
  {
    firstName: "Patricia",
    lastName: "Gomez",
    email: "patricia.gomez+demo@marengofinance.com",
    phone: "(312) 555-0184",
    employmentStatus: "retired",
    employerName: null,
    annualIncomeBand: "100-250k",
    sourceOfFunds: "asset_sale",
    liquidAssetsBand: "500k-1M",
    illiquidAssetsBand: "1-3M",
    liabilitiesBand: "<50k",
    netWorthBand: "1-3M",
    riskTolerance: "moderate",
    timeHorizon: "10+y",
    primaryGoals: ["retirement", "income", "tax"],
    liquidityNeeds: "some",
    constraints: ["no_leverage"],
    investmentExperience: "intermediate",
    hasIRA: true,
    has401k: false,
    hasTaxable: true,
    hasCrypto: false,
    hasRealEstate: true,
    onboardingProgress: 100,
    onboardingStatus: "verified",
    identityVerificationStatus: "verified",
    documentVerificationStatus: "verified",
    idDocType: "driver_license",
    reviewNotes: "Verified household. Wants reliable cash flow and tax-aware withdrawals.",
    reviewedBy: "Marengo Demo Ops",
    reviewedAt: new Date("2026-03-15T15:00:00.000Z"),
    concernsNarrative:
      "Primary concern is replacing uneven dividend income with a steadier tax-aware withdrawal plan.",
    introNarrative:
      "Recently retired household evaluating how to transition concentrated stock proceeds into a more stable drawdown plan.",
    goalsNarrative:
      "Looking for retirement income, municipal bond exposure, and a more deliberate tax plan over the next decade.",
    goalsDetail: {
      retirement: { risk: "moderate", horizon: "10+y", liquidity: "some", amountBand: "500k-1M", priority: true },
      income: { risk: "conservative", horizon: "5-10y", liquidity: "some", amountBand: "250-500k" },
      tax: { risk: "moderate", horizon: "5-10y", liquidity: "some", amountBand: "100-250k" },
    },
    productMatches: [
      {
        productCode: "MUNI-LADDER",
        productName: "Municipal Bond Ladder",
        rationale: "Fits the tax-aware income objective with moderate risk and ongoing liquidity needs.",
        riskBand: "moderate",
      },
      {
        productCode: "TAX-MANAGED-INCOME",
        productName: "Tax-Managed Income Sleeve",
        rationale: "Supports a retirement drawdown plan without forcing concentrated stock sales all at once.",
        riskBand: "moderate",
      },
    ],
    flags: [],
    createdAt: new Date("2026-03-14T18:00:00.000Z"),
  },
  {
    firstName: "Daniel",
    lastName: "Lee",
    email: "daniel.lee+demo@marengofinance.com",
    phone: "(847) 555-0119",
    employmentStatus: "employed",
    employerName: "North Ridge Systems",
    annualIncomeBand: "250-500k",
    sourceOfFunds: "salary",
    liquidAssetsBand: "250-500k",
    illiquidAssetsBand: "500k-1M",
    liabilitiesBand: "100-250k",
    netWorthBand: "500k-1M",
    riskTolerance: "growth",
    timeHorizon: "10+y",
    primaryGoals: ["education", "growth"],
    liquidityNeeds: "some",
    constraints: ["esg_only"],
    investmentExperience: "advanced",
    hasIRA: true,
    has401k: true,
    hasTaxable: true,
    hasCrypto: true,
    hasRealEstate: false,
    onboardingProgress: 78,
    onboardingStatus: "in_progress",
    identityVerificationStatus: "in_review",
    documentVerificationStatus: "in_review",
    idDocType: "passport",
    reviewNotes: null,
    reviewedBy: null,
    reviewedAt: null,
    concernsNarrative:
      "Wants to compare a 529-focused plan with a broader taxable growth sleeve while staying aligned to ESG restrictions.",
    introNarrative:
      "Dual-income family balancing college funding with long-horizon accumulation.",
    goalsNarrative:
      "Primary emphasis is education planning, with a secondary goal of long-term taxable growth.",
    goalsDetail: {
      education: { risk: "moderate", horizon: "5-10y", liquidity: "high", amountBand: "100-250k", priority: true },
      growth: { risk: "growth", horizon: "10+y", liquidity: "some", amountBand: "250-500k" },
    },
    productMatches: [
      {
        productCode: "529-MULTI",
        productName: "529 Allocation Model",
        rationale: "Matches the defined college-funding timeline and gives a clear path for annual follow-up.",
        riskBand: "moderate",
      },
      {
        productCode: "ESG-GROWTH",
        productName: "ESG Growth Sleeve",
        rationale: "Supports long-horizon appreciation while respecting the stated ESG constraint.",
        riskBand: "growth",
      },
    ],
    flags: [
      {
        fieldKey: "annualIncomeBand",
        note: "Client asked whether bonus compensation should move the household into the next income band.",
      },
      {
        fieldKey: "goalsDetail.education.amountBand",
        note: "Education target amount needs confirmation before final recommendation.",
      },
    ],
    createdAt: new Date("2026-03-18T16:20:00.000Z"),
  },
  {
    firstName: "Karen",
    lastName: "Patel",
    email: "karen.patel+demo@marengofinance.com",
    phone: "(630) 555-0107",
    employmentStatus: "self_employed",
    employerName: "Patel Advisory Services",
    annualIncomeBand: "500k+",
    sourceOfFunds: "business",
    liquidAssetsBand: "1-3M",
    illiquidAssetsBand: "1-3M",
    liabilitiesBand: "<50k",
    netWorthBand: "3M+",
    riskTolerance: "conservative",
    timeHorizon: "5-10y",
    primaryGoals: ["legacy", "income"],
    liquidityNeeds: "none",
    constraints: ["no_leverage"],
    investmentExperience: "advanced",
    hasIRA: false,
    has401k: false,
    hasTaxable: true,
    hasCrypto: false,
    hasRealEstate: true,
    onboardingProgress: 96,
    onboardingStatus: "verified",
    identityVerificationStatus: "verified",
    documentVerificationStatus: "verified",
    idDocType: "driver_license",
    reviewNotes: "Household is ready for legacy-income proposal review.",
    reviewedBy: "Marengo Demo Ops",
    reviewedAt: new Date("2026-03-21T20:10:00.000Z"),
    concernsNarrative:
      "Prefers simple reporting, low turnover, and explicit legacy planning over performance-chasing.",
    introNarrative:
      "Business-owner household preparing for succession and eventual wealth transfer.",
    goalsNarrative:
      "Wants a cleaner bridge between near-term income needs and estate-transfer planning.",
    goalsDetail: {
      legacy: { risk: "conservative", horizon: "10+y", liquidity: "none", amountBand: "1-3M", priority: true },
      income: { risk: "conservative", horizon: "5-10y", liquidity: "some", amountBand: "500k-1M" },
    },
    productMatches: [
      {
        productCode: "LEGACY-CORE",
        productName: "Legacy Core Allocation",
        rationale: "Supports wealth transfer planning with lower turnover and a more conservative core.",
        riskBand: "conservative",
      },
      {
        productCode: "INCOME-RESERVE",
        productName: "Income Reserve Sleeve",
        rationale: "Creates a near-term liquidity reserve without compromising the larger legacy plan.",
        riskBand: "conservative",
      },
    ],
    flags: [],
    createdAt: new Date("2026-03-22T13:15:00.000Z"),
  },
  {
    firstName: "Marcus",
    lastName: "Reed",
    email: "marcus.reed+demo@marengofinance.com",
    phone: "(214) 555-0158",
    employmentStatus: "employed",
    employerName: "Pinnacle Medical Group",
    annualIncomeBand: "100-250k",
    sourceOfFunds: "salary",
    liquidAssetsBand: "100-250k",
    illiquidAssetsBand: "250-500k",
    liabilitiesBand: "250-500k",
    netWorthBand: "250-500k",
    riskTolerance: "moderate",
    timeHorizon: "3-5y",
    primaryGoals: ["growth", "liquidity"],
    liquidityNeeds: "high",
    constraints: [],
    investmentExperience: "basic",
    hasIRA: true,
    has401k: true,
    hasTaxable: true,
    hasCrypto: false,
    hasRealEstate: false,
    onboardingProgress: 54,
    onboardingStatus: "in_progress",
    identityVerificationStatus: "pending",
    documentVerificationStatus: "pending",
    idDocType: null,
    reviewNotes: null,
    reviewedBy: null,
    reviewedAt: null,
    concernsNarrative:
      "Likely to ask for a simple explanation of liquidity tradeoffs because a home purchase may happen within five years.",
    introNarrative:
      "Early-career physician with student debt, new taxable savings, and shorter-term cash flexibility concerns.",
    goalsNarrative:
      "Needs growth, but not at the cost of locking up funds needed for a possible down payment.",
    goalsDetail: {
      growth: { risk: "moderate", horizon: "5-10y", liquidity: "some", amountBand: "100-250k", priority: true },
      liquidity: { risk: "conservative", horizon: "3-5y", liquidity: "high", amountBand: "<100k" },
    },
    productMatches: [
      {
        productCode: "CORE-BALANCED",
        productName: "Core Balanced Allocation",
        rationale: "Balances accumulation goals with the need to keep a defined liquidity reserve available.",
        riskBand: "moderate",
      },
    ],
    flags: [
      {
        fieldKey: "liquidityNeeds",
        note: "Advisor should confirm timing for the possible home purchase and cash reserve target.",
      },
      {
        fieldKey: "identityVerificationStatus",
        note: "Identity documents have not been uploaded yet.",
      },
    ],
    createdAt: new Date("2026-03-27T14:45:00.000Z"),
  },
];

export async function seedDemoWorkspace(
  db: DemoDb,
  input: {
    advisorId: string;
    advisorName: string;
    advisorFirm?: string | null;
  }
) {
  const existingCount = await db.client.count({
    where: { advisorId: input.advisorId, retentionStatus: { not: "redacted" } },
  });

  if (existingCount > 0) {
    return { createdClients: 0 };
  }

  for (const household of SAMPLE_HOUSEHOLDS) {
    const client = await db.client.create({
      data: {
        advisorId: input.advisorId,
        advisorName: input.advisorName,
        advisorFirm: input.advisorFirm ?? null,
        firstName: household.firstName,
        lastName: household.lastName,
        email: household.email,
        phone: household.phone,
        employmentStatus: household.employmentStatus,
        employerName: household.employerName ?? null,
        annualIncomeBand: household.annualIncomeBand,
        sourceOfFunds: household.sourceOfFunds,
        liquidAssetsBand: household.liquidAssetsBand,
        illiquidAssetsBand: household.illiquidAssetsBand,
        liabilitiesBand: household.liabilitiesBand,
        netWorthBand: household.netWorthBand,
        riskTolerance: household.riskTolerance,
        timeHorizon: household.timeHorizon,
        primaryGoals: household.primaryGoals,
        liquidityNeeds: household.liquidityNeeds,
        constraints: household.constraints,
        investmentExperience: household.investmentExperience,
        hasIRA: household.hasIRA,
        has401k: household.has401k,
        hasTaxable: household.hasTaxable,
        hasCrypto: household.hasCrypto,
        hasRealEstate: household.hasRealEstate,
        onboardingProgress: household.onboardingProgress,
        onboardingStatus: household.onboardingStatus,
        identityVerificationStatus: household.identityVerificationStatus,
        documentVerificationStatus: household.documentVerificationStatus,
        idDocType: household.idDocType ?? null,
        reviewNotes: household.reviewNotes ?? null,
        reviewedBy: household.reviewedBy ?? null,
        reviewedAt: household.reviewedAt ?? null,
        concernsNarrative: household.concernsNarrative,
        introNarrative: household.introNarrative ?? null,
        goalsNarrative: household.goalsNarrative ?? null,
        goalsDetail: household.goalsDetail,
        consentAcceptedAt: household.createdAt,
        createdAt: household.createdAt,
        updatedAt: household.createdAt,
        rawSubmission: {
          demoSeed: true,
          scenario: `${household.firstName} ${household.lastName}`,
        },
      },
      select: { id: true },
    });

    if (household.productMatches.length > 0) {
      await db.productMatch.createMany({
        data: household.productMatches.map((match) => ({
          clientId: client.id,
          productCode: match.productCode,
          productName: match.productName,
          rationale: match.rationale,
          riskBand: match.riskBand ?? null,
        })),
      });
    }

    if (household.flags.length > 0) {
      await db.clientFieldFlag.createMany({
        data: household.flags.map((flag) => ({
          clientId: client.id,
          advisorId: input.advisorId,
          fieldKey: flag.fieldKey,
          note: flag.note ?? null,
          status: "open",
        })),
      });
    }
  }

  return { createdClients: SAMPLE_HOUSEHOLDS.length };
}
