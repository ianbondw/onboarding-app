// src/app/pilot/page.tsx
"use client";

import { useState } from "react";

export default function PilotPage() {
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  async function generate() {
    setErr("");
    setLoading(true);
    try {
      const res = await fetch("/api/demo-token", { method: "POST", cache: "no-store" });
      const j = await res.json();
      if (!res.ok || !j?.url) throw new Error(j?.error || "Could not create demo token.");
      window.location.href = j.url;
    } catch (e: any) {
      setErr(e?.message || "Could not create demo token.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto max-w-3xl space-y-4 p-6">
      <h1 className="text-2xl font-semibold">Try the Onboarding Demo</h1>
      <p className="text-sm text-slate-600">
        This generates a temporary client link scoped to a demo advisor. No emails sent; just click and try.
      </p>

      {err && (
        <div className="rounded-md border border-red-200 bg-red-50 p-2 text-sm text-red-700">
          {err}
        </div>
      )}

      <button className="btn-primary" onClick={generate} disabled={loading}>
        {loading ? "Generating…" : "Generate demo link"}
      </button>
    </main>
  );
}