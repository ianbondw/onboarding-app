// src/app/api/contact/route.ts
import { NextResponse } from "next/server";
import { sendMail } from "@/lib/mailer"; // if your alias isn't set, use: ../../../../lib/mailer

function isValidEmail(s: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({} as any));
  const { name, email, message, hp } = body || {};

  // Honeypot
  if (hp) return NextResponse.json({ ok: true });

  if (!name || !email || !message) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }
  if (!isValidEmail(email)) {
    return NextResponse.json({ error: "Invalid email" }, { status: 400 });
  }

  const res = await sendMail({
    to: process.env.CONTACT_TO || "",
    subject: "New contact form submission",
    replyTo: email,
    text: `From: ${name} <${email}>\n\n${message}`,
  });

  // We don't fail the request if email is simulated/missing keys in dev.
  return NextResponse.json({ ok: true, simulated: !res.ok ? true : undefined });
}

// Optional: nicer GET for browser checks
export async function GET() {
  return NextResponse.json({ ok: false, error: "Use POST /api/contact" }, { status: 405 });
}