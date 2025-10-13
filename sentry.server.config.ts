import * as Sentry from "@sentry/nextjs";

const dsn = process.env.SENTRY_DSN;
if (dsn) {
  Sentry.init({
    dsn,
    tracesSampleRate: 0.3,
    profilesSampleRate: 0.3,
    environment: process.env.VERCEL_ENV || "production",
  });
}