// src/lib/sentry-tags.ts
import * as Sentry from "@sentry/nextjs";

/** Server-side: call near the top of an API route */
export function setSentryTagsServer(opts: {
  firmCode?: string | null;
  advisorId?: string | null;
  clientId?: string | null;
}) {
  const { firmCode, advisorId, clientId } = opts || {};
  if (firmCode) Sentry.setTag("firm", firmCode);
  if (advisorId) Sentry.setTag("advisorId", advisorId);
  if (clientId) Sentry.setTag("clientId", clientId);
  if (advisorId) Sentry.setUser({ id: advisorId });
}

/** Client-side: call once after you know context (e.g., admin pages) */
export function setSentryTagsClient(opts: {
  firmCode?: string;
  advisorId?: string;
  clientId?: string;
}) {
  const { firmCode, advisorId, clientId } = opts || {};
  if (firmCode) Sentry.setTag("firm", firmCode);
  if (advisorId) Sentry.setTag("advisorId", advisorId);
  if (clientId) Sentry.setTag("clientId", clientId);
  if (advisorId) Sentry.setUser({ id: advisorId });
}