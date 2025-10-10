"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function OnboardingStartPage() {
  const router = useRouter();
  const [token, setToken] = useState("");
  const [contact, setContact] = useState("");
  const [brandName, setBrandName] = useState("");
  const [brandLogo, setBrandLogo] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  function go() {
    if (!token) return setErr("Enter a valid token.");
    const qs = new URLSearchParams();
    if (contact) qs.set("contact", contact);
    if (brandName) qs.set("brandName", brandName);
    if (brandLogo) qs.set("brandLogo", brandLogo);
    router.push(`/onboarding/${token}${qs.toString() ? `?${qs.toString()}` : ""}`);
  }

  // Optional: quick demo token via your /api/advisors
  async function makeDemo() {
    try {
      setErr(null);
      setBusy(true);
      const res = await fetch("/api/advisors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: "Demo Advisor" }),
      });
      const data = await res.json();
      if (!res.ok || !data?.token) throw new Error(data?.error || "Could not create demo token");
      setToken(data.token);
    } catch (e: any) {
      setErr(e.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="mx-auto max-w-3xl rounded-2xl border bg-white p-6 shadow-sm">
      <h1 className="text-2xl font-semibold">Start Client Onboarding</h1>
      <p className="mt-1 text-sm text-slate-600">
        Paste an advisor token or generate a demo link. You can also add optional tracking/branding.
      </p>

      <div className="mt-6 space-y-4">
        <label className="block text-sm">
          <span className="mb-1 inline-block text-slate-700">Advisor token</span>
          <input className="input" value={token} onChange={(e)=>setToken(e.target.value)} placeholder="e.g. pk_live_xxx" />
        </label>

        <div className="grid gap-4 md:grid-cols-2">
          <label className="block text-sm">
            <span className="mb-1 inline-block text-slate-700">Contact tag (optional)</span>
            <input className="input" value={contact} onChange={(e)=>setContact(e.target.value)} placeholder="Joe" />
          </label>
          <label className="block text-sm">
            <span className="mb-1 inline-block text-slate-700">Brand name (optional)</span>
            <input className="input" value={brandName} onChange={(e)=>setBrandName(e.target.value)} placeholder="Bond Wealth" />
          </label>
        </div>

        <label className="block text-sm">
          <span className="mb-1 inline-block text-slate-700">Brand logo URL (optional)</span>
          <input className="input" value={brandLogo} onChange={(e)=>setBrandLogo(e.target.value)} placeholder="https://.../logo.png" />
        </label>

        {err && <p className="text-sm text-red-700">{err}</p>}

        <div className="mt-4 flex flex-wrap gap-3">
          <button onClick={go} className="btn-primary">Open form</button>
          <button onClick={makeDemo} disabled={busy} className="btn-secondary">
            {busy ? "Creating demo..." : "Generate demo token"}
          </button>
          <a href="/admin/new-advisor" className="btn-plain">Create advisor (admin)</a>
        </div>

        <div className="text-xs text-slate-500">
          Tip: share links like <code>?contact=NAME&amp;brandName=Firm</code> for attribution & white-label header.
        </div>
      </div>
    </main>
  );
}