// src/app/admin/new-advisor/page.tsx
"use client";

import { useState } from "react";

const APP = process.env.NEXT_PUBLIC_APP_ORIGIN || "https://marengofinance-app.com";
const ADMIN = process.env.NEXT_PUBLIC_ADMIN_ORIGIN || "https://marengofinance-admin.com";

export default function NewAdvisorPage() {
  const [name, setName] = useState("");
  const [firmCode, setFirmCode] = useState("");
  const [advisorId, setAdvisorId] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [err, setErr] = useState("");

  async function onCreate(e: React.FormEvent) {
    e.preventDefault();
    setErr("");
    setAdvisorId(null);
    setToken(null);

    try {
      const res = await fetch("/api/advisors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, firmCode }),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j?.error || `HTTP ${res.status}`);
      }
      const j = await res.json();
      // EXPECTED RESPONSE SHAPE:
      // { advisorId: "adv_123", token: "onb_abc123" }
      setAdvisorId(j.advisorId);
      setToken(j.token);
    } catch (e: any) {
      setErr(e?.message || "Failed to create advisor");
    }
  }

  const onboardingUrl = token ? `${APP}/onboarding/${encodeURIComponent(token)}` : "";
  const adminUrl =
    advisorId ? `${ADMIN}/admin/clients?admin_token=${encodeURIComponent(advisorId)}` : "";

  return (
    <main className="mx-auto max-w-2xl p-6 space-y-4">
      <h1 className="text-2xl font-semibold">Create Demo Advisor</h1>

      {err && (
        <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {err}
        </div>
      )}

      <form onSubmit={onCreate} className="grid gap-3">
        <input
          className="border rounded px-3 py-2"
          placeholder="Advisor name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          className="border rounded px-3 py-2"
          placeholder="Firm code (e.g. UBS)"
          value={firmCode}
          onChange={(e) => setFirmCode(e.target.value)}
        />
        <button className="rounded bg-black text-white px-4 py-2">Create</button>
      </form>

      {(advisorId || token) && (
        <div className="rounded-2xl border bg-white p-4 shadow-sm space-y-3">
          <div>
            <div className="text-sm font-medium">Onboarding link (share with clients)</div>
            {token ? (
              <a href={onboardingUrl} className="text-blue-600 underline break-all">
                {onboardingUrl}
              </a>
            ) : (
              <p className="text-sm text-gray-500">No token returned.</p>
            )}
          </div>

          <div>
            <div className="text-sm font-medium">Admin link (send to this advisor once)</div>
            {advisorId ? (
              <a href={adminUrl} className="text-blue-600 underline break-all">
                {adminUrl}
              </a>
            ) : (
              <p className="text-sm text-gray-500">No advisorId returned.</p>
            )}
          </div>
        </div>
      )}
    </main>
  );
}