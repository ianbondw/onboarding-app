import crypto from "crypto";
import { Prisma } from "@prisma/client";
import { prisma } from "@/prisma";

type JsonObject = Record<string, unknown>;

function toPrismaJson(value: JsonObject | null | undefined) {
  if (value === undefined) return undefined;
  if (value === null) return Prisma.JsonNull;
  return value as Prisma.InputJsonValue;
}

function getWebhookUrls() {
  const raw = process.env.DOWNSTREAM_WEBHOOK_URLS || process.env.DOWNSTREAM_WEBHOOK_URL || "";
  return raw
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);
}

function signBody(body: string) {
  const secret = process.env.DOWNSTREAM_WEBHOOK_SECRET || "";
  if (!secret) return null;
  return crypto.createHmac("sha256", secret).update(body, "utf8").digest("hex");
}

export async function recordLifecycleEvent(input: {
  eventType: string;
  actorRole?: string | null;
  advisorId?: string | null;
  clientId?: string | null;
  leadId?: string | null;
  metadata?: JsonObject | null;
}) {
  const event = await prisma.lifecycleEvent.create({
    data: {
      eventType: input.eventType,
      actorRole: input.actorRole ?? null,
      advisorId: input.advisorId ?? null,
      clientId: input.clientId ?? null,
      leadId: input.leadId ?? null,
      metadata: toPrismaJson(input.metadata),
    },
    select: {
      id: true,
      createdAt: true,
      eventType: true,
      advisorId: true,
      clientId: true,
      leadId: true,
    },
  });

  void dispatchWebhook({
    id: event.id,
    createdAt: event.createdAt.toISOString(),
    eventType: event.eventType,
    advisorId: event.advisorId,
    clientId: event.clientId,
    leadId: event.leadId,
    metadata: input.metadata ?? null,
  });

  return event;
}

export async function recordAuditLog(input: {
  actorRole: string;
  actorLabel?: string | null;
  actorUserId?: string | null;
  advisorId?: string | null;
  action: string;
  targetType: string;
  targetId?: string | null;
  metadata?: JsonObject | null;
}) {
  return prisma.auditLog.create({
    data: {
      actorRole: input.actorRole,
      actorLabel: input.actorLabel ?? null,
      actorUserId: input.actorUserId ?? null,
      advisorId: input.advisorId ?? null,
      action: input.action,
      targetType: input.targetType,
      targetId: input.targetId ?? null,
      metadata: toPrismaJson(input.metadata),
    },
    select: { id: true },
  });
}

async function dispatchWebhook(payload: JsonObject) {
  const urls = getWebhookUrls();
  if (urls.length === 0) return;

  const body = JSON.stringify(payload);
  const signature = signBody(body);

  await Promise.allSettled(
    urls.map((url) =>
      fetch(url, {
        method: "POST",
        headers: {
          "content-type": "application/json",
          ...(signature ? { "x-marengo-signature": signature } : {}),
        },
        body,
        cache: "no-store",
      })
    )
  );
}
