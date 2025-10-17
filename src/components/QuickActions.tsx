// src/components/QuickActions.tsx
"use client";

import * as React from "react";

type Props = {
  inviteUrl: string;
  resendHref: string;
  flagsCount?: number;
};

export default function QuickActions({ inviteUrl, resendHref, flagsCount = 0 }: Props) {
  const [copied, setCopied] = React.useState(false);
  const [sending, setSending] = React.useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(inviteUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch {
      // Fallback prompt if clipboard is blocked
      prompt("Copy this link:", inviteUrl);
    }
  }

  async function resend() {
    if (sending) return;
    setSending(true);
    try {
      const res = await fetch(resendHref, { method: "POST", credentials: "same-origin" });
      if (!res.ok) throw new Error(`Send failed (${res.status})`);
      alert("Invite email sent.");
    } catch (e: any) {
      alert(e?.message || "Send failed");
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={resend}
        disabled={sending}
        className="text-xs rounded-md border px-2 py-1 disabled:opacity-50"
      >
        {sending ? "Sending…" : "Resend"}
      </button>
      <button
        type="button"
        onClick={copy}
        className="text-xs rounded-md border px-2 py-1"
      >
        {copied ? "Copied!" : "Copy link"}
      </button>
      {flagsCount > 0 && (
        <span className="inline-flex items-center rounded-full border px-2 py-0.5 text-xs">
          ⚑ {flagsCount}
        </span>
      )}
    </div>
  );
}