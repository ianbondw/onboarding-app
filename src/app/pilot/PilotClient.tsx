"use client";

import { useState } from "react";
import {
  getPricingPlan,
  pricingPlans,
  teamSizeOptions,
  timelineOptions,
} from "@/lib/marketing";

type TrialLinks = {
  onboardingUrl: string;
  adminUrl: string;
  loginUrl?: string;
  portalUser?: {
    email: string;
    temporaryPassword: string;
  } | null;
};

export default function PilotClient({ initialPlanSlug }: { initialPlanSlug: string }) {
  const [planSlug, setPlanSlug] = useState(initialPlanSlug);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [firm, setFirm] = useState("");
  const [website, setWebsite] = useState("");
  const [teamSize, setTeamSize] = useState(teamSizeOptions[0].value);
  const [timeline, setTimeline] = useState(timelineOptions[1].value);
  const [currentProcess, setCurrentProcess] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [links, setLinks] = useState<TrialLinks | null>(null);

  const selectedPlan = getPricingPlan(planSlug) || pricingPlans[0];

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
          website,
          teamSize,
          timeline,
          currentProcess,
          plan: selectedPlan.slug,
          planName: selectedPlan.name,
          source: `pilot:${selectedPlan.slug}`,
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
    } catch (error: any) {
      setErr(error?.message || "Could not create trial links.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="space-y-8 pb-10">
      <section className="grid gap-6 lg:grid-cols-[1.1fr,0.9fr]">
        <div className="space-y-4">
          <div className="inline-flex items-center rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-amber-900">
            Guided trial request
          </div>
          <h1 className="text-4xl font-semibold tracking-tight text-slate-950">
            Create a live trial workspace and use it to scope the rollout.
          </h1>
          <p className="max-w-2xl text-base leading-8 text-slate-600">
            We provision a real advisor workspace with onboarding, dashboard access, and
            review flow. Use it to validate the experience, then move into the rollout
            package that matches your team.
          </p>
        </div>

        <div className="rounded-[28px] border border-slate-200 bg-white/90 p-6 shadow-sm">
          <div className="text-xs font-medium uppercase tracking-[0.18em] text-slate-500">
            Selected package
          </div>
          <div className="mt-3 text-2xl font-semibold text-slate-950">
            {selectedPlan.name}
          </div>
          <div className="mt-1 text-sm text-slate-500">
            {selectedPlan.setupFee} and {selectedPlan.monthlyPrice}
          </div>
          <p className="mt-4 text-sm leading-7 text-slate-600">{selectedPlan.bestFor}</p>
          <div className="mt-4 space-y-3">
            {selectedPlan.highlights.map((highlight) => (
              <div
                key={highlight}
                className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700"
              >
                {highlight}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.1fr,0.9fr] lg:items-start">
        <div className="rounded-[30px] border bg-white/90 p-6 shadow-sm">
          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-slate-950">Tell us who the rollout is for</h2>
            <p className="text-sm text-slate-600">
              The more context you give, the more useful the trial workspace and follow-up will be.
            </p>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <label className="text-sm">
              <div className="mb-1 text-slate-700">Your name</div>
              <input
                className="input"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Jane Smith"
              />
            </label>

            <label className="text-sm">
              <div className="mb-1 text-slate-700">Work email</div>
              <input
                className="input"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="jane@firm.com"
                type="email"
              />
            </label>

            <label className="text-sm">
              <div className="mb-1 text-slate-700">Firm</div>
              <input
                className="input"
                value={firm}
                onChange={(event) => setFirm(event.target.value)}
                placeholder="Example Wealth"
              />
            </label>

            <label className="text-sm">
              <div className="mb-1 text-slate-700">Website</div>
              <input
                className="input"
                value={website}
                onChange={(event) => setWebsite(event.target.value)}
                placeholder="https://yourfirm.com"
              />
            </label>

            <label className="text-sm">
              <div className="mb-1 text-slate-700">Package</div>
              <select
                className="select"
                value={planSlug}
                onChange={(event) => setPlanSlug(event.target.value)}
              >
                {pricingPlans.map((plan) => (
                  <option key={plan.slug} value={plan.slug}>
                    {plan.name}
                  </option>
                ))}
              </select>
            </label>

            <label className="text-sm">
              <div className="mb-1 text-slate-700">Advisor team size</div>
              <select
                className="select"
                value={teamSize}
                onChange={(event) => setTeamSize(event.target.value)}
              >
                {teamSizeOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="text-sm md:col-span-2">
              <div className="mb-1 text-slate-700">Desired timeline</div>
              <select
                className="select"
                value={timeline}
                onChange={(event) => setTimeline(event.target.value)}
              >
                {timelineOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="text-sm md:col-span-2">
              <div className="mb-1 text-slate-700">Current onboarding process</div>
              <textarea
                className="input min-h-28"
                value={currentProcess}
                onChange={(event) => setCurrentProcess(event.target.value)}
                placeholder="Example: advisors email PDFs, ops re-enters data, compliance reviews in a shared inbox."
              />
            </label>
          </div>

          {err ? (
            <div className="mt-4 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              {err}
            </div>
          ) : null}

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <button className="btn-primary px-5 py-3" onClick={generate} disabled={loading}>
              {loading ? "Creating trial..." : "Create trial workspace"}
            </button>
            <div className="text-xs text-slate-500">
              No credit card. Use the live trial to scope your paid rollout.
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-[28px] border border-slate-200 bg-white/90 p-6 shadow-sm">
            <div className="text-xs font-medium uppercase tracking-[0.18em] text-slate-500">
              What happens next
            </div>
            <div className="mt-4 space-y-3">
              {[
                "We create a dedicated advisor workspace for your request.",
                "You receive onboarding, dashboard, and login links.",
                "Your team can test the client journey and review flow immediately.",
                "Use the trial to decide whether Guided Launch, Growth Team, or White-Label Ops is the right rollout.",
              ].map((item) => (
                <div key={item} className="rounded-2xl border bg-slate-50 px-4 py-3 text-sm text-slate-700">
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[28px] bg-slate-950 p-6 text-white shadow-sm">
            <div className="text-xs font-medium uppercase tracking-[0.18em] text-amber-300">
              Best use of the trial
            </div>
            <p className="mt-3 text-sm leading-7 text-slate-300">
              Run a real sample submission, review it in the dashboard, and decide what has
              to be branded, exported, or integrated before you charge ahead with rollout.
            </p>
          </div>
        </div>
      </section>

      {links ? (
        <section className="rounded-[30px] border bg-white/90 p-6 shadow-sm">
          <div>
            <h2 className="text-xl font-semibold text-slate-950">Your trial workspace is ready</h2>
            <p className="mt-2 text-sm text-slate-600">
              Open the onboarding flow as a client, then review the result in the advisor dashboard.
            </p>
          </div>

          <div className="mt-5 flex flex-wrap gap-3">
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
            <div className="mt-5 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-950">
              <div className="font-medium">Advisor credentials</div>
              <div className="mt-1">Email: {links.portalUser.email}</div>
              <div>Temporary password: {links.portalUser.temporaryPassword}</div>
            </div>
          ) : null}

          <div className="mt-4 text-xs text-slate-500">
            The links are tied to a dedicated advisor workspace, not a shared demo token.
          </div>
        </section>
      ) : null}
    </main>
  );
}
