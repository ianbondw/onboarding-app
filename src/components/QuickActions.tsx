"use client";

import * as React from "react";

export default function QuickActions({
  inviteUrl,
  resendHref,
  flagsCount,
}: {
  inviteUrl: string;
  resendHref: string;
  flagsCount: number;
}) {
  const [copied, setCopied] = React.useState(false);
  async function copy() {
    try {
      await navigator.clipboard.writeText(inviteUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch {}
  }
  return (
    <div className="flex items-center gap-2">
      <a href={resendHref} className="text-sm underline">Resend</a>
      <button onClick={copy} className="text-sm underline">
        {copied ? "Copied!" : "Copy link"}
      </button>
      <a href="#flags" className="text-sm underline">
        Open flags ({flagsCount})
      </a>
    </div>
  );
}