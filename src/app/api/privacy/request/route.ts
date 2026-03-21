export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { sendMail } from "@/lib/mailer";
import { createPrivacyRequest } from "@/lib/privacy-workflow";
import { PRIVACY_EMAIL, toMailto } from "@/lib/site-config";

const REQUEST_BUCKETS = new Map<string, { count: number; resetAt: number }>();
const REQUEST_LIMIT = 4;
const REQUEST_WINDOW_MS = 60 * 60 * 1000;

function rateKey(req: Request) {
  return (
    (req.headers.get("x-forwarded-for") || "").split(",")[0].trim() ||
    req.headers.get("x-real-ip") ||
    "unknown"
  );
}

function enforceRateLimit(req: Request) {
  const key = rateKey(req);
  const now = Date.now();
  const existing = REQUEST_BUCKETS.get(key);
  if (!existing || now > existing.resetAt) {
    REQUEST_BUCKETS.set(key, { count: 1, resetAt: now + REQUEST_WINDOW_MS });
    return null;
  }
  if (existing.count >= REQUEST_LIMIT) {
    return Math.max(1, Math.ceil((existing.resetAt - now) / 1000));
  }
  existing.count += 1;
  return null;
}

export async function POST(req: Request) {
  const retryAfter = enforceRateLimit(req);
  if (retryAfter) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      { status: 429, headers: { "Retry-After": String(retryAfter) } }
    );
  }

  try {
    const body = await req.json().catch(() => ({}));
    const created = await createPrivacyRequest({
      requestType: body?.requestType,
      source: "website",
      subjectType: body?.subjectType || "individual",
      email: body?.email,
      name: body?.name,
      firm: body?.firm,
      relationship: body?.relationship,
      details: body?.details,
      metadata: {
        origin: "website",
        referer: req.headers.get("referer") || null,
      },
    });

    await sendMail({
      to: PRIVACY_EMAIL,
      subject: `New privacy request: ${created.requestType}`,
      text: [
        `Request ID: ${created.id}`,
        `Type: ${created.requestType}`,
        `Name: ${created.name}`,
        `Email: ${created.email}`,
        `Due: ${created.dueAt ? created.dueAt.toISOString() : "Not set"}`,
        "",
        `Open the portal queue after signing in to manage this request.`,
      ].join("\n"),
      replyTo: created.email,
    });

    return NextResponse.json({
      ok: true,
      requestId: created.id,
      nextSteps:
        "We logged your request and will review it through the privacy workflow. We may contact you to verify identity before completing it.",
      contact: toMailto(PRIVACY_EMAIL, "Privacy request follow-up"),
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Unable to submit request." },
      { status: 400 }
    );
  }
}
