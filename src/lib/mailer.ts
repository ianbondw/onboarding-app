// src/lib/mailer.ts
export type SendOpts = {
    to: string | string[];
    subject: string;
    text?: string;
    html?: string;
    replyTo?: string;
  };
  
  export type SendResult =
    | { ok: true; id?: string }
    | { ok: false; simulated?: true; error?: string };
  
  function normalizeTo(to: string | string[]): string | string[] | null {
    if (Array.isArray(to)) {
      const arr = to.map(s => (s ?? "").toString().trim()).filter(Boolean);
      return arr.length ? arr : null;
    }
    const s = (to ?? "").toString().trim();
    return s || null;
  }
  
  export async function sendMail(opts: SendOpts): Promise<SendResult> {
    const key = process.env.RESEND_API_KEY;
    const from = process.env.CONTACT_FROM || "Marengo <no-reply@marengofinance.com>";
    const to = normalizeTo(opts.to);
  
    // Safe fallback so dev/preview don't crash (or if "to" is empty)
    if (!key || !to) {
      console.warn("[mailer] Simulating email", {
        reason: !key ? "missing_key" : "missing_to",
        from,
        to: opts.to,
        subject: opts.subject,
      });
      return { ok: false, simulated: true };
    }
  
    try {
      const { Resend } = await import("resend");
      const resend = new Resend(key);
  
      const payload: any = {
        from,
        to,
        subject: opts.subject,
        text: opts.text,
        html: opts.html,
      };
  
      // Resend expects `reply_to`
      if (opts.replyTo) payload.reply_to = opts.replyTo;
  
      const r = await resend.emails.send(payload);
      return { ok: true, id: (r as any)?.id };
    } catch (err: any) {
      console.warn("[mailer] send failed:", err?.message || err);
      return { ok: false, error: err?.message || "unknown error" };
    }
  }