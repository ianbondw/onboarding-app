"use client";

import { useState } from "react";

type TrialLinks = {
  onboardingUrl: string;
  adminUrl: string;
  loginUrl?: string;
  portalUser?: {
    email: string;
    temporaryPassword: string;
  } | null;
};

export default function PilotPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [firm, setFirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [links, setLinks] = useState<TrialLinks | null>(null);

  async function generate() {
    setErr("");
    setLinks(null);

    if (!name.trim() || !email.trim()) {
      setErr("Name and work email are required to create a trial workspace.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/demo-token", {
        method: "POST",
        cache: "no-store",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          firm,
          source: "pilot_page",
        }),
      });
      const j = await res.json();
      if (!res.ok || !j?.onboardingUrl || !j?.adminUrl) {
        throw new Error(j?.error || "Could not create trial links.");
      }
      setLinks({
        onboardingUrl: j.onboardingUrl,
        adminUrl: j.adminUrl,
        loginUrl: j.loginUrl,
        portalUser: j.portalUser ?? null,
      });
    } catch (e: any) {
      setErr(e?.message || "Could not create trial links.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto max-w-3xl space-y-6 p-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold">Request a Guided Trial</h1>
        <p className="text-sm text-slate-600">
          We will spin up a dedicated trial workspace with both the client onboarding link and the advisor dashboard link.
        </p>
      </div>

      <div className="rounded-2xl border bg-white p-5 shadow-sm space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <label className="text-sm">
            <div className="mb-1 text-slate-700">Your name</div>
            <input
              className="w-full rounded-md border px-3 py-2"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Jane Smith"
            />
          </label>
          <label className="text-sm">
            <div className="mb-1 text-slate-700">Work email</div>
            <input
              className="w-full rounded-md border px-3 py-2"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="jane@firm.com"
              type="email"
            />
          </label>
        </div>

        <label className="text-sm block">
          <div className="mb-1 text-slate-700">Firm</div>
          <input
            className="w-full rounded-md border px-3 py-2"
            value={firm}
            onChange={(e) => setFirm(e.target.value)}
            placeholder="Example Wealth"
          />
        </label>

        {err ? (
          <div className="rounded-md border border-red-200 bg-red-50 p-2 text-sm text-red-700">
            {err}
          </div>
        ) : null}

        <button className="btn-primary" onClick={generate} disabled={loading}>
          {loading ? "Creating trial..." : "Create trial workspace"}
        </button>
      </div>

      {links ? (
        <div className="rounded-2xl border bg-white p-5 shadow-sm space-y-4">
          <div>
            <h2 className="text-lg font-medium">Your trial is ready</h2>
            <p className="text-sm text-slate-600">
              Open the onboarding flow as a client, then review the result in the advisor dashboard.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <a className="btn-primary" href={links.onboardingUrl}>
              Start client onboarding
            </a>
            <a className="btn-secondary" href={links.adminUrl}>
              Open advisor dashboard
            </a>
            {links.loginUrl ? (
              <a className="btn-secondary" href={links.loginUrl}>
                Open login
              </a>
            ) : null}
          </div>

          {links.portalUser ? (
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-950">
              <div className="font-medium">Advisor credentials</div>
              <div>Email: {links.portalUser.email}</div>
              <div>Temporary password: {links.portalUser.temporaryPassword}</div>
            </div>
          ) : null}

          <div className="text-xs text-slate-500">
            The links are tied to a dedicated advisor workspace, not a shared demo token.
          </div>
        </div>
      ) : null}
    </main>
  );
}
