import { Prisma } from "@prisma/client";
import { prisma } from "@/prisma";
import { recordAuditLog, recordLifecycleEvent } from "@/lib/lifecycle";

export const PRIVACY_REQUEST_TYPES = [
  "access",
  "deletion",
  "correction",
  "retention_review",
  "legal_hold",
] as const;

export const PRIVACY_REQUEST_STATUSES = [
  "received",
  "awaiting_identity",
  "in_review",
  "approved",
  "completed",
  "rejected",
  "on_hold",
] as const;

export type PrivacyRequestType = (typeof PRIVACY_REQUEST_TYPES)[number];
export type PrivacyRequestStatus = (typeof PRIVACY_REQUEST_STATUSES)[number];

function normalizeText(value: unknown, max = 500) {
  if (typeof value !== "string") return null;
  const cleaned = value.replace(/\s+/g, " ").trim();
  if (!cleaned) return null;
  return cleaned.slice(0, max);
}

function normalizeEmail(value: unknown) {
  const email = normalizeText(value, 254);
  return email ? email.toLowerCase() : null;
}

function normalizeRequestType(value: unknown): PrivacyRequestType {
  const candidate = normalizeText(value, 48);
  return PRIVACY_REQUEST_TYPES.includes(candidate as PrivacyRequestType)
    ? (candidate as PrivacyRequestType)
    : "access";
}

function normalizeStatus(value: unknown): PrivacyRequestStatus {
  const candidate = normalizeText(value, 48);
  return PRIVACY_REQUEST_STATUSES.includes(candidate as PrivacyRequestStatus)
    ? (candidate as PrivacyRequestStatus)
    : "received";
}

function toPrismaJson(value: Record<string, unknown> | null | undefined) {
  if (value === undefined) return undefined;
  if (value === null) return Prisma.JsonNull;
  return value as Prisma.InputJsonValue;
}

function defaultDueAt(type: PrivacyRequestType) {
  const now = Date.now();
  if (type === "retention_review" || type === "legal_hold") {
    return new Date(now + 7 * 24 * 60 * 60 * 1000);
  }
  return new Date(now + 30 * 24 * 60 * 60 * 1000);
}

export async function createPrivacyRequest(input: {
  requestType: unknown;
  status?: unknown;
  source?: unknown;
  subjectType?: unknown;
  email: unknown;
  name: unknown;
  firm?: unknown;
  relationship?: unknown;
  advisorId?: unknown;
  details?: unknown;
  dueAt?: unknown;
  legalHold?: unknown;
  metadata?: Record<string, unknown> | null;
}) {
  const email = normalizeEmail(input.email);
  const name = normalizeText(input.name, 160);
  if (!email || !name) {
    throw new Error("Name and email are required.");
  }

  const requestType = normalizeRequestType(input.requestType);
  const status = normalizeStatus(input.status);
  const source = normalizeText(input.source, 48) || "website";
  const subjectType = normalizeText(input.subjectType, 48) || "individual";
  const dueAt =
    input.dueAt instanceof Date
      ? input.dueAt
      : normalizeText(input.dueAt, 40)
      ? new Date(String(input.dueAt))
      : defaultDueAt(requestType);

  return prisma.privacyRequest.create({
    data: {
      requestType,
      status,
      source,
      subjectType,
      email,
      name,
      firm: normalizeText(input.firm, 160),
      relationship: normalizeText(input.relationship, 120),
      advisorId: normalizeText(input.advisorId, 80),
      details: normalizeText(input.details, 2000),
      dueAt: Number.isNaN(dueAt.getTime()) ? defaultDueAt(requestType) : dueAt,
      legalHold: input.legalHold === true,
      metadata: toPrismaJson(input.metadata),
    },
    select: {
      id: true,
      requestType: true,
      status: true,
      email: true,
      name: true,
      dueAt: true,
      advisorId: true,
    },
  });
}

export async function updatePrivacyRequest(input: {
  id: string;
  status?: unknown;
  requestType?: unknown;
  reviewedBy?: string | null;
  identityVerified?: boolean;
  details?: unknown;
  resolutionSummary?: unknown;
  legalHold?: unknown;
  dueAt?: unknown;
  metadata?: Record<string, unknown> | null;
}) {
  const existing = await prisma.privacyRequest.findUnique({
    where: { id: input.id },
    select: {
      id: true,
      requestType: true,
      status: true,
      metadata: true,
    },
  });
  if (!existing) return null;

  const nextStatus = input.status === undefined ? existing.status : normalizeStatus(input.status);
  const nextType =
    input.requestType === undefined
      ? (existing.requestType as PrivacyRequestType)
      : normalizeRequestType(input.requestType);
  const mergedMetadata =
    input.metadata === undefined
      ? (existing.metadata as Record<string, unknown> | null | undefined)
      : {
          ...((existing.metadata as Record<string, unknown> | null) || {}),
          ...(input.metadata || {}),
        };
  const now = new Date();

  const updated = await prisma.privacyRequest.update({
    where: { id: input.id },
    data: {
      requestType: nextType,
      status: nextStatus,
      reviewedBy:
        input.reviewedBy === undefined ? undefined : normalizeText(input.reviewedBy, 160),
      reviewedAt:
        input.reviewedBy === undefined && nextStatus === existing.status ? undefined : now,
      completedAt: nextStatus === "completed" ? now : undefined,
      identityVerifiedAt:
        input.identityVerified === undefined ? undefined : input.identityVerified ? now : null,
      legalHold: input.legalHold === undefined ? undefined : input.legalHold === true,
      dueAt:
        input.dueAt === undefined
          ? undefined
          : normalizeText(input.dueAt, 40)
          ? new Date(String(input.dueAt))
          : null,
      details: input.details === undefined ? undefined : normalizeText(input.details, 2000),
      resolutionSummary:
        input.resolutionSummary === undefined
          ? undefined
          : normalizeText(input.resolutionSummary, 2000),
      metadata: toPrismaJson(mergedMetadata || null),
    },
    select: {
      id: true,
      requestType: true,
      status: true,
      email: true,
      name: true,
      legalHold: true,
      dueAt: true,
      reviewedBy: true,
      reviewedAt: true,
      completedAt: true,
      resolutionSummary: true,
      metadata: true,
    },
  });

  if (updated.legalHold || updated.requestType === "legal_hold") {
    await applyRetentionStatusToSubject(updated.email, "legal_hold");
  } else if (updated.requestType === "deletion" && updated.status === "approved") {
    await applyRetentionStatusToSubject(updated.email, "deletion_pending");
  }

  return updated;
}

async function applyRetentionStatusToSubject(
  email: string,
  retentionStatus: "legal_hold" | "deletion_pending"
) {
  const clientWhere =
    retentionStatus === "deletion_pending"
      ? {
          email,
          retentionStatus: { in: ["active", "deletion_pending"] },
        }
      : {
          email,
          retentionStatus: { not: "redacted" },
        };

  const leadWhere =
    retentionStatus === "deletion_pending"
      ? {
          email,
          retentionStatus: { in: ["active", "deletion_pending"] },
        }
      : {
          email,
          retentionStatus: { not: "redacted" },
        };

  await prisma.$transaction([
    prisma.client.updateMany({
      where: clientWhere,
      data: {
        retentionStatus,
        deletedAt: null,
      },
    }),
    prisma.trialLead.updateMany({
      where: leadWhere,
      data: {
        retentionStatus,
        deletedAt: null,
      },
    }),
  ]);
}

async function redactClientsForEmail(email: string, requestId: string) {
  const targets = await prisma.client.findMany({
    where: {
      email,
      retentionStatus: { not: "redacted" },
    },
    select: {
      id: true,
    },
  });
  if (targets.length === 0) return { count: 0 };

  const now = new Date();
  await prisma.$transaction([
    ...targets.map((client) =>
      prisma.client.update({
        where: { id: client.id },
        data: {
          firstName: "Deleted",
          lastName: "Record",
          email: `deleted+client-${client.id}@privacy.invalid`,
          phone: null,
          dateOfBirth: null,
          addressLine1: null,
          addressLine2: null,
          city: null,
          state: null,
          postalCode: null,
          country: null,
          citizenship: null,
          ssnCipher: null,
          ssnIv: null,
          ssnEnc: null,
          dobEnc: null,
          employmentStatus: null,
          employerName: null,
          annualIncomeBand: null,
          sourceOfFunds: null,
          liquidAssetsBand: null,
          illiquidAssetsBand: null,
          liabilitiesBand: null,
          netWorthBand: null,
          riskTolerance: null,
          timeHorizon: null,
          primaryGoals: [],
          liquidityNeeds: null,
          constraints: [],
          investmentExperience: null,
          goalsDetail: Prisma.JsonNull,
          introNarrative: null,
          goalsNarrative: null,
          concernsNarrative: null,
          onboardingProgress: 0,
          sectionCompletion: Prisma.JsonNull,
          hasIRA: false,
          has401k: false,
          hasTaxable: false,
          hasCrypto: false,
          hasRealEstate: false,
          identityVerificationStatus: "pending",
          documentVerificationStatus: "pending",
          idDocType: null,
          idDocUrl: null,
          idDocProviderRef: null,
          proofOfAddressUrl: null,
          reviewNotes: `Redacted via privacy workflow (${requestId})`,
          reviewedAt: now,
          reviewedBy: "privacy_workflow",
          consentAcceptedAt: null,
          intakeToken: null,
          rawSubmission: Prisma.JsonNull,
          retentionStatus: "redacted",
          deletedAt: now,
        },
      })
    ),
    prisma.productMatch.deleteMany({
      where: { clientId: { in: targets.map((target) => target.id) } },
    }),
    prisma.clientFieldFlag.deleteMany({
      where: { clientId: { in: targets.map((target) => target.id) } },
    }),
  ]);

  return { count: targets.length };
}

async function redactLeadsForEmail(email: string) {
  const targets = await prisma.trialLead.findMany({
    where: {
      email,
      retentionStatus: { not: "redacted" },
    },
    select: { id: true },
  });
  if (targets.length === 0) return { count: 0 };

  const now = new Date();
  await prisma.$transaction(
    targets.map((lead) =>
      prisma.trialLead.update({
        where: { id: lead.id },
        data: {
          name: "Deleted record",
          email: `deleted+lead-${lead.id}@privacy.invalid`,
          firm: null,
          status: "archived",
          onboardingUrl: null,
          adminUrl: null,
          metadata: Prisma.JsonNull,
          retentionStatus: "redacted",
          deletedAt: now,
        },
      })
    )
  );

  return { count: targets.length };
}

export async function executePrivacyDeletion(input: {
  id: string;
  actorRole: string;
  actorLabel?: string | null;
  actorUserId?: string | null;
}) {
  const request = await prisma.privacyRequest.findUnique({
    where: { id: input.id },
    select: {
      id: true,
      requestType: true,
      email: true,
      advisorId: true,
      status: true,
      legalHold: true,
      reviewedBy: true,
    },
  });
  if (!request) throw new Error("Privacy request not found.");
  if (request.requestType !== "deletion") {
    throw new Error("Only deletion requests can run redaction.");
  }
  if (request.legalHold) {
    throw new Error("This request is on legal hold and cannot be completed.");
  }

  const [clients, leads] = await Promise.all([
    redactClientsForEmail(request.email, request.id),
    redactLeadsForEmail(request.email),
  ]);

  const metadata = {
    appliedDeletion: true,
    redactedClients: clients.count,
    redactedLeads: leads.count,
  };

  const updated = await prisma.privacyRequest.update({
    where: { id: request.id },
    data: {
      status: "completed",
      completedAt: new Date(),
      reviewedAt: new Date(),
      reviewedBy: request.reviewedBy || input.actorLabel || input.actorRole,
      resolutionSummary: `Redacted ${clients.count} client record(s) and ${leads.count} lead record(s).`,
      metadata: toPrismaJson(metadata),
    },
    select: {
      id: true,
      requestType: true,
      status: true,
      email: true,
      name: true,
      legalHold: true,
      dueAt: true,
      reviewedBy: true,
      reviewedAt: true,
      completedAt: true,
      resolutionSummary: true,
      metadata: true,
    },
  });

  await Promise.allSettled([
    recordLifecycleEvent({
      eventType: "privacy.request.completed",
      actorRole: input.actorRole,
      advisorId: request.advisorId ?? null,
      metadata: {
        requestId: request.id,
        requestType: request.requestType,
        ...metadata,
      },
    }),
    recordAuditLog({
      actorRole: input.actorRole,
      actorLabel: input.actorLabel ?? null,
      actorUserId: input.actorUserId ?? null,
      advisorId: request.advisorId ?? null,
      action: "privacy.request.completed",
      targetType: "privacy_request",
      targetId: request.id,
      metadata: {
        requestType: request.requestType,
        ...metadata,
      },
    }),
  ]);

  return updated;
}
