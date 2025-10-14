"use client";

import { useState } from "react";

export default function NewAdvisorPage() {
  const [name, setName] = useState("");
  const [firm, setFirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [links, setLinks] = useState<{ onboardingUrl: string; adminUrl: string } | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLinks(null);

    const cleanName = name.trim();
    const cleanFirm = firm.trim();

    if (!cleanName) {
      setError("Please enter an advisor name.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/advisors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
        body: JSON.stringify({ name: cleanName, firm: cleanFirm || undefined }),
      });

      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        // 405 if you try to open route in browser (GET), 409 on slug conflict, 500 on env/DB issues
        setError(json?.error || `Request failed (${res.status})`);
        return;
      }

      const onboardingUrl = json?.links?.onboardingUrl as string | undefined;
      const adminUrl = json?.links?.adminUrl as string | undefined;
      if (!onboardingUrl || !adminUrl) {
        setError("Server response missing links.");
        return;
      }

      setLinks({ onboardingUrl, adminUrl });
    } catch (err: any) {
      setError(err?.message || "Network error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto max-w-2xl p-6">
      <h1 className="text-2xl font-semibold mb-4">Create Demo Advisor</h1>

      {error ? (
        <div className="mb-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      <form onSubmit={onSubmit} className="space-y-3">
        <input
          className="w-full rounded-md border px-3 py-2 outline-none focus:ring-2 focus:ring-black/10"
          placeholder="Advisor name (e.g., Jacky Johnson)"
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={loading}
        />
        <input
          className="w-full rounded-md border px-3 py-2 outline-none focus:ring-2 focus:ring-black/10"
          placeholder="Firm (optional)"
          value={firm}
          onChange={(e) => setFirm(e.target.value)}
          disabled={loading}
        />

        <button
          type="submit"
          disabled={loading}
          className={`w-full rounded-md px-3 py-2 text-white transition ${
            loading ? "bg-black/60 cursor-not-allowed" : "bg-black hover:bg-black/90"
          }`}
        >
          {loading ? "Creating…" : "Create"}
        </button>
      </form>

      {links && (
        <div className="mt-6 rounded-2xl border bg-white p-4 shadow-sm space-y-3">
          <div>
            <div className="text-sm font-medium text-slate-900">Onboarding link:</div>
            <a
              href={links.onboardingUrl}
              className="text-sm text-blue-600 break-all underline"
              target="_blank"
              rel="noreferrer"
            >
              {links.onboardingUrl}
            </a>
          </div>

          <div>
            <div className="text-sm font-medium text-slate-900">Advisor dashboard link:</div>
            <a
              href={links.adminUrl}
              className="text-sm text-blue-600 break-all underline"
              target="_blank"
              rel="noreferrer"
            >
              {links.adminUrl}
            </a>
          </div>
        </div>
      )}
    </main>
  );
}