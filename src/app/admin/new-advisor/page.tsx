// src/app/admin/new-advisor/page.tsx
"use client";
import { useState } from "react";

export default function NewAdvisorPage() {
  const [name, setName] = useState("Demo Advisor");
  const [firm, setFirm] = useState("Demo Wealth");
  const [resp, setResp] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  async function createAdvisor(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setResp(null);
    try {
      const r = await fetch("/api/advisors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, firm }),
      });
      const j = await r.json();
      setResp(j);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="max-w-xl mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-semibold">Create Demo Advisor</h1>
      <form onSubmit={createAdvisor} className="space-y-3">
        <input className="input w-full" value={name} onChange={(e)=>setName(e.target.value)} placeholder="Advisor name" />
        <input className="input w-full" value={firm} onChange={(e)=>setFirm(e.target.value)} placeholder="Firm (optional)" />
        <button className="btn-primary" disabled={loading}>{loading ? "Creating..." : "Create"}</button>
      </form>
      {resp?.links && (
        <div className="rounded-xl border bg-white p-4">
          <div className="text-sm">Onboarding link:</div>
          <a className="text-blue-600 underline break-all" href={resp.links.onboardingUrl}>
            {resp.links.onboardingUrl}
          </a>
          <div className="mt-3 text-sm">Admin link:</div>
          <a className="text-blue-600 underline break-all" href={resp.links.adminUrl}>
            {resp.links.adminUrl}
          </a>
        </div>
      )}
    </main>
  );
}