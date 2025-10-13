// src/instrumentation.ts
import * as Sentry from "@sentry/nextjs";

export async function register() {
  const dsn = process.env.SENTRY_DSN;
  if (!dsn) return; // no-op if not configured
  Sentry.init({
    dsn,
    tracesSampleRate: 0.15,      // light tracing
    replaysSessionSampleRate: 0, // no session replay by default
    debug: false,
  });
}