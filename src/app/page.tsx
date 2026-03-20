import Link from "next/link";
import { faqItems, pricingPlans, revenueOutcomes, rolloutSteps } from "@/lib/marketing";

function buildContactHref() {
  const email = (process.env.CONTACT_TO || "").trim();
  if (!email) return "/contact";
  return `mailto:${email}?subject=${encodeURIComponent("Marengo rollout inquiry")}`;
}

export default function Home() {
  const contactHref = buildContactHref();

  return (
    <main className="space-y-20 pb-10">
      <section className="grid gap-8 pb-4 pt-4 lg:grid-cols-[1.15fr,0.85fr] lg:items-start">
        <div className="space-y-6">
          <div className="inline-flex items-center rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-amber-900">
            Launch white-labeled onboarding fast
          </div>

          <div className="space-y-4">
            <h1 className="max-w-4xl text-4xl font-semibold tracking-tight text-slate-950 md:text-6xl">
              Launch a cleaner client onboarding flow for your RIA in days, not quarters.
            </h1>
            <p className="max-w-2xl text-lg leading-8 text-slate-600">
              Marengo turns email chains, PDF packets, and manual review into a guided
              trial workspace with advisor logins, client intake, review states, and a
              clear path to paid rollout.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link href="/pilot?plan=guided-launch" className="btn-primary px-5 py-3">
              Start guided trial
            </Link>
            <Link href="/pricing" className="btn-secondary px-5 py-3">
              See pricing
            </Link>
            <a href={contactHref} className="btn-plain px-4 py-3">
              Talk to sales
            </a>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border bg-white/85 p-4 shadow-sm">
              <div className="text-xs font-medium uppercase tracking-[0.14em] text-slate-500">
                Trial-ready
              </div>
              <div className="mt-2 text-sm text-slate-700">
                Dedicated workspace, onboarding link, and advisor login instead of a fake demo.
              </div>
            </div>
            <div className="rounded-2xl border bg-white/85 p-4 shadow-sm">
              <div className="text-xs font-medium uppercase tracking-[0.14em] text-slate-500">
                Review workflow
              </div>
              <div className="mt-2 text-sm text-slate-700">
                Admin review, compliance states, and advisor-scoped access for live ops.
              </div>
            </div>
            <div className="rounded-2xl border bg-white/85 p-4 shadow-sm">
              <div className="text-xs font-medium uppercase tracking-[0.14em] text-slate-500">
                Revenue posture
              </div>
              <div className="mt-2 text-sm text-slate-700">
                Pricing, rollout packages, and a clear story you can sell to firms now.
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-[28px] border border-slate-200 bg-white/90 p-6 shadow-sm">
            <div className="text-xs font-medium uppercase tracking-[0.18em] text-slate-500">
              What buyers get in week one
            </div>
            <div className="mt-4 space-y-3">
              {[
                "A guided trial workspace with real onboarding and review flow",
                "Advisor login and dashboard access",
                "Lead capture and trial request visibility",
                "Email delivery for internal follow-up and buyer access",
                "A rollout path for branding, ops, and integration work",
              ].map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-slate-200/80 bg-slate-50 px-4 py-3 text-sm text-slate-700"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[28px] bg-slate-950 p-6 text-white shadow-sm">
            <div className="text-xs font-medium uppercase tracking-[0.18em] text-slate-300">
              Illustrative ops ROI
            </div>
            <div className="mt-3 text-3xl font-semibold">$12,960/year</div>
            <p className="mt-3 text-sm leading-7 text-slate-300">
              Example only: 12 new households per month, 2 hours of ops cleanup per
              household, and $45/hour internal cost. That excludes any lift from faster
              response and better advisor follow-up.
            </p>
          </div>
        </div>
      </section>

      <section className="rounded-[32px] border border-slate-200/80 bg-white/85 p-8 shadow-sm">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="text-xs font-medium uppercase tracking-[0.18em] text-slate-500">
              What firms buy
            </div>
            <h2 className="mt-2 text-3xl font-semibold text-slate-950">
              This is not just intake software. It is a faster path from interest to funded client.
            </h2>
          </div>
          <Link href="/pricing" className="btn-secondary w-fit">
            Compare rollout packages
          </Link>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {revenueOutcomes.map((item) => (
            <div key={item.title} className="rounded-3xl border bg-slate-50 p-6">
              <h3 className="text-lg font-medium text-slate-950">{item.title}</h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">{item.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="how" className="space-y-6">
        <div className="space-y-3">
          <div className="text-xs font-medium uppercase tracking-[0.18em] text-slate-500">
            How it works
          </div>
          <h2 className="text-3xl font-semibold text-slate-950">
            Start with a guided trial, then convert it into a paid rollout.
          </h2>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {rolloutSteps.map((step, index) => (
            <div key={step.title} className="rounded-3xl border bg-white/85 p-6 shadow-sm">
              <div className="text-sm font-semibold text-amber-700">0{index + 1}</div>
              <h3 className="mt-3 text-lg font-medium text-slate-950">{step.title}</h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">{step.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="pricing" className="space-y-6">
        <div className="space-y-3">
          <div className="text-xs font-medium uppercase tracking-[0.18em] text-slate-500">
            Pricing
          </div>
          <h2 className="text-3xl font-semibold text-slate-950">
            Price the rollout, not just the trial.
          </h2>
          <p className="max-w-3xl text-sm leading-7 text-slate-600">
            Guided trials are the fastest way to prove the flow. Paid plans begin when
            you want a branded workspace, implementation help, and an operational handoff
            your team can actually run.
          </p>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          {pricingPlans.map((plan) => (
            <div
              key={plan.slug}
              className={`rounded-[30px] border p-6 shadow-sm ${
                plan.featured
                  ? "border-slate-950 bg-slate-950 text-white"
                  : "border-slate-200 bg-white/90 text-slate-900"
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div
                    className={`text-xs font-medium uppercase tracking-[0.18em] ${
                      plan.featured ? "text-amber-300" : "text-slate-500"
                    }`}
                  >
                    {plan.name}
                  </div>
                  <div className="mt-3 text-2xl font-semibold">
                    {plan.setupFee}
                  </div>
                  <div
                    className={`mt-1 text-sm ${
                      plan.featured ? "text-slate-300" : "text-slate-500"
                    }`}
                  >
                    {plan.monthlyPrice}
                  </div>
                </div>
                {plan.featured ? (
                  <span className="rounded-full bg-amber-300 px-3 py-1 text-xs font-medium text-slate-950">
                    Best first sale
                  </span>
                ) : null}
              </div>

              <p
                className={`mt-4 text-sm leading-7 ${
                  plan.featured ? "text-slate-200" : "text-slate-600"
                }`}
              >
                {plan.bestFor}
              </p>
              <p
                className={`mt-3 text-sm leading-7 ${
                  plan.featured ? "text-slate-300" : "text-slate-500"
                }`}
              >
                {plan.summary}
              </p>

              <div className="mt-5 space-y-3">
                {plan.highlights.map((highlight) => (
                  <div
                    key={highlight}
                    className={`rounded-2xl border px-4 py-3 text-sm ${
                      plan.featured
                        ? "border-slate-800 bg-slate-900 text-slate-100"
                        : "border-slate-200 bg-slate-50 text-slate-700"
                    }`}
                  >
                    {highlight}
                  </div>
                ))}
              </div>

              <Link
                href={plan.ctaHref}
                className={`mt-6 inline-flex rounded-lg px-4 py-3 text-sm font-medium ${
                  plan.featured
                    ? "bg-white text-slate-950"
                    : "border border-slate-300 bg-white text-slate-900"
                }`}
              >
                {plan.ctaLabel}
              </Link>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-[32px] border border-slate-200/80 bg-white/90 p-8 shadow-sm">
        <div className="grid gap-8 lg:grid-cols-[0.9fr,1.1fr]">
          <div className="space-y-3">
            <div className="text-xs font-medium uppercase tracking-[0.18em] text-slate-500">
              Manual process vs Marengo
            </div>
            <h2 className="text-3xl font-semibold text-slate-950">
              Replace the parts that slow down revenue.
            </h2>
            <p className="text-sm leading-7 text-slate-600">
              The point is not prettier paperwork. It is fewer delays between first
              interest, completed intake, advisor review, and operational follow-up.
            </p>
          </div>

          <div className="grid gap-3">
            {[
              {
                left: "PDFs, email attachments, and missing fields",
                right: "Guided onboarding with flags and structured review",
              },
              {
                left: "Shared demos that do not convert into a real workspace",
                right: "Dedicated trial workspaces tied to a live advisor environment",
              },
              {
                left: "Manual follow-up with weak context",
                right: "Advisor dashboard, compliance states, and exportable data",
              },
              {
                left: "No clean transition into a paid implementation",
                right: "Pricing, rollout packages, and a clear operational handoff",
              },
            ].map((row) => (
              <div
                key={row.left}
                className="grid gap-3 rounded-3xl border bg-slate-50 p-4 md:grid-cols-[1fr,1fr]"
              >
                <div className="rounded-2xl bg-white px-4 py-3 text-sm text-slate-500">
                  {row.left}
                </div>
                <div className="rounded-2xl bg-emerald-50 px-4 py-3 text-sm text-emerald-950">
                  {row.right}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="faq" className="space-y-6">
        <div className="space-y-3">
          <div className="text-xs font-medium uppercase tracking-[0.18em] text-slate-500">
            FAQ
          </div>
          <h2 className="text-3xl font-semibold text-slate-950">
            Questions buyers usually ask before rollout
          </h2>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {faqItems.map((item) => (
            <div key={item.question} className="rounded-3xl border bg-white/90 p-6 shadow-sm">
              <h3 className="text-lg font-medium text-slate-950">{item.question}</h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">{item.answer}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-[34px] bg-slate-950 px-8 py-10 text-white shadow-sm">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <div className="text-xs font-medium uppercase tracking-[0.18em] text-amber-300">
              Next step
            </div>
            <h2 className="mt-3 text-3xl font-semibold">
              Create a guided trial, see the flow live, and price the rollout from something real.
            </h2>
            <p className="mt-3 text-sm leading-7 text-slate-300">
              If the trial works, move straight into Guided Launch or Growth Team. If you
              need a deeper white-label rollout, use the contact path and we will scope it.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link href="/pilot?plan=guided-launch" className="inline-flex rounded-lg bg-white px-5 py-3 text-sm font-medium text-slate-950">
              Create guided trial
            </Link>
            <Link href="/pricing" className="inline-flex rounded-lg border border-slate-700 px-5 py-3 text-sm font-medium text-white">
              Review pricing
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
