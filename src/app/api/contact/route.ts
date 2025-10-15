// src/app/api/contact/route.ts
export const runtime = "nodejs";
import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY || "");
const TO = process.env.CONTACT_TO || "";      // e.g. "hello@marengofinance.com"
const FROM = process.env.CONTACT_FROM || "";  // e.g. "Marengo <hello@marengofinance.com>"

export async function POST(req: NextRequest) {
  try {
    const { name, email, message, hp } = await req.json().catch(() => ({}));
    if (hp) return NextResponse.json({ ok: true }, { headers: { "Cache-Control": "no-store" } }); // honeypot
    if (!name || !email || !message) return NextResponse.json({ error: "Missing fields" }, { status: 400 });

    await resend.emails.send({
      to: TO,
      from: FROM,
      subject: "New contact form submission",
      replyTo: email,
      text: `From: ${name} <${email}>\n\n${message}`,
    });

    return NextResponse.json({ ok: true }, { headers: { "Cache-Control": "no-store" } });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Server error" }, { status: 500 });
  }
}