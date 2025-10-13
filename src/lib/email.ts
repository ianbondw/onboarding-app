// src/lib/email.ts
import { Resend } from "resend";

const RESEND_API_KEY = process.env.RESEND_API_KEY || "";
const RESEND_FROM =
  process.env.RESEND_FROM || "Client Onboarding <no-reply@yourdomain.com>";

const resend = RESEND_API_KEY ? new Resend(RESEND_API_KEY) : null;

type NewSubmissionEmailInput = {
  to: string | string[];           // advisor email(s) or a team inbox
  advisorName?: string;
  client?: { firstName?: string; lastName?: string; email?: string };
  submissionId?: string | number;
  adminUrl?: string;               // e.g. https://yourdomain.com/admin/clients
};

export async function sendNewSubmissionEmail(input: NewSubmissionEmailInput) {
  if (!resend) return; // silently no-op if not configured in demo
  const to = Array.isArray(input.to) ? input.to : [input.to];

  const subject = `New client intake${
    input.client?.firstName ? `: ${input.client.firstName} ${input.client?.lastName ?? ""}` : ""
  }`;

  const adminCta =
    input.adminUrl ? `<p style="margin:16px 0"><a href="${input.adminUrl}" style="padding:10px 14px; background:#111827; color:#fff; border-radius:10px; text-decoration:none">Open Admin</a></p>` : "";

  const safe = (v?: string) => (v ? v : "—");

  const html = `
    <div style="font-family:Inter,Segoe UI,Arial,sans-serif;max-width:640px;margin:auto;padding:20px">
      <h2 style="margin:0 0 8px 0">New client submission</h2>
      <p style="margin:0 0 16px 0">Advisor: <strong>${safe(input.advisorName)}</strong></p>
      <table style="border-collapse:collapse;width:100%">
        <tr><td style="padding:6px 0;color:#475569">Client</td><td style="padding:6px 0">${safe(input.client?.firstName)} ${safe(input.client?.lastName)}</td></tr>
        <tr><td style="padding:6px 0;color:#475569">Email</td><td style="padding:6px 0">${safe(input.client?.email)}</td></tr>
        <tr><td style="padding:6px 0;color:#475569">Submission ID</td><td style="padding:6px 0">${safe(String(input.submissionId || ""))}</td></tr>
      </table>
      ${adminCta}
      <p style="margin-top:24px;color:#64748b;font-size:12px">Sent by Client Onboarding</p>
    </div>
  `;

  await resend.emails.send({
    from: RESEND_FROM,
    to,
    subject,
    html,
  });
}