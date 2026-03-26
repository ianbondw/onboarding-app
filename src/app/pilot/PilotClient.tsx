"use client";

import { useState } from "react";
import { track } from "@vercel/analytics";
import TrackedLink from "@/components/TrackedLink";
import {
  getPricingPlan,
  pricingPlans,
  teamSizeOptions,
  timelineOptions,
} from "@/lib/marketing";
import { getBookingAction, getPlanAction } from "@/lib/public-sales";

type TrialLinks = {
  onboardingUrl: string;
  adminUrl: string;
  loginUrl?: string;
  demoUrl?: string;
  trustUrl?: string;
  pricingUrl?: string;
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
  const selectedPlanAction = getPlanAction(selectedPlan.slug);
  const bookingAction = getBookingAction("/contact");

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
      const payload = await res.json();
      if (!res.ok || !payload?.onboardingUrl || !payload?.adminUrl) {
        throw new Error(payload?.error || "Could not create trial links.");
      }
      setLinks({
        onboardingUrl: payload.onboardingUrl,
        adminUrl: payload.adminUrl,
        loginUrl: payload.loginUrl,
        demoUrl: payload.demoUrl,
        trustUrl: payload.trustUrl,
        pricingUrl: payload.pricingUrl,
        portalUser: payload.portalUser ?? null,
      });
      track("Create Trial Workspace", {
        source: "pilot_page",
        plan: selectedPlan.slug,
        teamSize,
        timeline,
      });
    } catch (error: any) {
      setErr(error?.message || "Could not create trial links.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="space-y-8 pb-12">
      <section className="grid gap-6 lg:grid-cols-[1.05fr,0.95fr]">
        <div className="space-y-5">
          <div className="eyebrow">Instant trial request</div>
          <h1 className="display-type text-5xl font-semibold text-slate-950 md:text-6xl">
            Create a polished live trial and start using it right away.
          </h1>
          <p className="max-w-2xl text-base leading-8 text-slate-600 md:text-lg">
            This is the handoff from marketing to product use. We provision a real advisor
            workspace with onboarding, dashboard access, and review flow so the trial already
            behaves like the product you would buy.
          </p>
          <div className="flex flex-wrap gap-2">
            <span className="metric-pill">No credit card</span>
            <span className="metric-pill">Dedicated workspace</span>
            <span className="metric-pill">Buyer context captured</span>
            <span className="metric-pill">No sales call required</span>
          </div>
        </div>

        <div className="spotlight-card p-6 text-white">
          <div className="relative z-10">
            <div className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-200">
              Selected package
            </div>
            <div className="mt-3 display-type text-3xl font-semibold">{selectedPlan.name}</div>
            <div className="mt-1 text-sm text-slate-200">
              {selectedPlan.setupFee} and {selectedPlan.monthlyPrice}
            </div>
            <p className="mt-4 text-sm leading-7 text-slate-200">{selectedPlan.bestFor}</p>
            {selectedPlanAction.kind === "checkout" ? (
              <div className="mt-4 rounded-[1.3rem] border border-emerald-300/30 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-50">
                This package is configured for direct checkout when you are ready to buy.
              </div>
            ) : null}
            <div className="mt-4 grid gap-3">
              {selectedPlan.highlights.map((highlight) => (
                <div
                  key={highlight}
                  className="rounded-[1.3rem] border border-white/10 bg-white/8 px-4 py-3 text-sm text-slate-50"
                >
                  {highlight}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.05fr,0.95fr] lg:items-start">
        <div className="section-shell p-6 md:p-7">
          <div className="relative z-10">
            <div className="space-y-2">
              <h2 className="display-type text-2xl font-semibold text-slate-950">
                Tell us who the rollout is for
              </h2>
              <p className="text-sm leading-7 text-slate-600">
                Better context means a better trial, better follow-up, and a cleaner rollout recommendation.
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
              <div className="mt-4 rounded-[1.35rem] border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                {err}
              </div>
            ) : null}

            <div className="mt-5 flex flex-wrap items-center gap-3">
              <button className="btn-primary px-5 py-3" onClick={generate} disabled={loading}>
                {loading ? "Creating trial..." : "Create trial workspace"}
              </button>
              <div className="text-xs text-slate-500">
                Use the live trial to validate the feel before you pay for rollout.
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="section-shell p-6">
            <div className="relative z-10">
              <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                What happens next
              </div>
              <div className="mt-4 grid gap-3">
                {[
                  "We create a dedicated advisor workspace for your request.",
                  "You receive onboarding, dashboard, and login links.",
                  "Your team can test the client journey and review flow immediately.",
                  "You use that proof to choose Guided Launch, Growth Team, or a deeper rollout.",
                ].map((item) => (
                  <div
                    key={item}
                    className="rounded-[1.3rem] border border-white/70 bg-white/70 px-4 py-3 text-sm text-slate-700"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="surface-card p-6">
            <div className="relative z-10">
              <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Best use of the trial
              </div>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                Run a real sample submission, review it in the dashboard, and use the walkthrough
                and trust center to sell the rollout internally without waiting on us.
              </p>
            </div>
          </div>
        </div>
      </section>

      {links ? (
        <section className="section-shell p-6 md:p-7">
          <div className="relative z-10">
            <div>
              <h2 className="display-type text-2xl font-semibold text-slate-950">
                Your trial workspace is ready
              </h2>
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
              {links.demoUrl ? (
                <a className="btn-secondary" href={links.demoUrl}>
                  Watch walkthrough
                </a>
              ) : null}
              {selectedPlanAction.kind === "checkout" ? (
                <TrackedLink
                  href={selectedPlanAction.href}
                  eventName="Open Checkout CTA"
                  eventProps={{ source: "pilot_page", placement: "success_cta", plan: selectedPlan.slug }}
                  className="btn-secondary"
                  external={selectedPlanAction.external}
                >
                  {selectedPlanAction.label}
                </TrackedLink>
              ) : null}
            </div>

            {links.portalUser ? (
              <div className="mt-5 rounded-[1.5rem] border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-950">
                <div className="font-medium">Advisor credentials</div>
                <div className="mt-1">Email: {links.portalUser.email}</div>
                <div>Temporary password: {links.portalUser.temporaryPassword}</div>
                <div className="mt-2 text-emerald-900/80">
                  When you sign in, the portal sends a one-time verification code to the same inbox.
                </div>
              </div>
            ) : null}

            <div className="mt-5 grid gap-3 md:grid-cols-2">
              {[
                "1. Open the onboarding link and submit one realistic household.",
                "2. Sign into the advisor portal and complete the email-code MFA step.",
                "3. Review the client in the dashboard and export if needed.",
                "4. Send the walkthrough and trust center to anyone else who needs to approve the rollout.",
              ].map((item) => (
                <div
                  key={item}
                  className="rounded-[1.35rem] border border-slate-200 bg-white/80 px-4 py-3 text-sm text-slate-700"
                >
                  {item}
                </div>
              ))}
            </div>

            <div className="mt-5 flex flex-wrap gap-3 text-xs text-slate-500">
              <span>The links are tied to a dedicated advisor workspace, not a shared demo token.</span>
              {links.trustUrl ? (
                <a className="underline" href={links.trustUrl}>
                  Trust center
                </a>
              ) : null}
              {links.pricingUrl ? (
                <a className="underline" href={links.pricingUrl}>
                  Pricing
                </a>
              ) : null}
              <TrackedLink
                href={bookingAction.href}
                eventName={bookingAction.kind === "booking" ? "Book Call CTA" : "Talk To Sales CTA"}
                eventProps={{ source: "pilot_page", placement: "success_footer" }}
                className="underline"
                external={bookingAction.external}
              >
                {bookingAction.label}
              </TrackedLink>
            </div>
          </div>
        </section>
      ) : null}
    </main>
  );
}
