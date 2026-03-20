import Link from "next/link";
import { pricingPlans, rolloutSteps } from "@/lib/marketing";

function buildContactHref() {
  const email = (process.env.CONTACT_TO || "").trim();
  if (!email) return "/contact";
  return `mailto:${email}?subject=${encodeURIComponent("Marengo pricing inquiry")}`;
}

const sharedInclusions = [
  "Branded client onboarding flow",
  "Advisor dashboard and backoffice access",
  "Export-ready client data",
  "Guided trial workspace before paid rollout",
];

const addOns = [
  {
    title: "Custom domain and deeper branding",
    body: "For firms that want a more embedded client experience instead of a standard app-domain rollout.",
  },
  {
    title: "CRM, webhook, and ops integration",
    body: "Use the rollout to wire Marengo into your downstream follow-up, alerts, or CRM pipeline.",
  },
  {
    title: "Higher-touch implementation",
    body: "Best for multi-advisor teams that want help structuring access, workflow, and internal rollout.",
  },
];

export const metadata = {
  title: "Pricing - Marengo Finance",
  description: "Guided rollout pricing for Marengo client onboarding.",
};

export default function PricingPage() {
  const contactHref = buildContactHref();

  return (
    <main className="space-y-16 pb-10">
      <section className="space-y-5 pt-4">
        <div className="inline-flex items-center rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-amber-900">
          Rollout pricing
        </div>
        <h1 className="max-w-4xl text-4xl font-semibold tracking-tight text-slate-950 md:text-5xl">
          Price the implementation around a real guided trial, not a generic software demo.
        </h1>
        <p className="max-w-3xl text-lg leading-8 text-slate-600">
          Start with a dedicated workspace, prove the onboarding flow, then move into the
          rollout package that matches your team size and operational needs.
        </p>
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        {pricingPlans.map((plan) => (
          <div
            key={plan.slug}
            className={`rounded-[30px] border p-6 shadow-sm ${
              plan.featured
                ? "border-slate-950 bg-slate-950 text-white"
                : "border-slate-200 bg-white/90 text-slate-900"
            }`}
          >
            <div className="text-xs font-medium uppercase tracking-[0.18em] text-amber-300">
              {plan.name}
            </div>
            <div className="mt-4 text-3xl font-semibold">{plan.setupFee}</div>
            <div className={`mt-1 text-sm ${plan.featured ? "text-slate-300" : "text-slate-500"}`}>
              {plan.monthlyPrice}
            </div>
            <p className={`mt-4 text-sm leading-7 ${plan.featured ? "text-slate-200" : "text-slate-600"}`}>
              {plan.bestFor}
            </p>
            <p className={`mt-3 text-sm leading-7 ${plan.featured ? "text-slate-300" : "text-slate-500"}`}>
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
      </section>

      <section className="grid gap-6 lg:grid-cols-[0.8fr,1.2fr]">
        <div className="rounded-[30px] border bg-white/90 p-6 shadow-sm">
          <div className="text-xs font-medium uppercase tracking-[0.18em] text-slate-500">
            Every paid rollout includes
          </div>
          <div className="mt-4 space-y-3">
            {sharedInclusions.map((item) => (
              <div key={item} className="rounded-2xl border bg-slate-50 px-4 py-3 text-sm text-slate-700">
                {item}
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[30px] border bg-white/90 p-6 shadow-sm">
          <div className="text-xs font-medium uppercase tracking-[0.18em] text-slate-500">
            Rollout path
          </div>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            {rolloutSteps.map((step, index) => (
              <div key={step.title} className="rounded-3xl border bg-slate-50 p-5">
                <div className="text-sm font-semibold text-amber-700">0{index + 1}</div>
                <h2 className="mt-3 text-lg font-medium text-slate-950">{step.title}</h2>
                <p className="mt-3 text-sm leading-7 text-slate-600">{step.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="rounded-[30px] border bg-white/90 p-6 shadow-sm">
        <div className="space-y-3">
          <div className="text-xs font-medium uppercase tracking-[0.18em] text-slate-500">
            Common add-ons
          </div>
          <h2 className="text-3xl font-semibold text-slate-950">
            Use add-ons to turn a clean launch into a deeper operational system.
          </h2>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {addOns.map((item) => (
            <div key={item.title} className="rounded-3xl border bg-slate-50 p-5">
              <h3 className="text-lg font-medium text-slate-950">{item.title}</h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">{item.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-[34px] bg-slate-950 px-8 py-10 text-white shadow-sm">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <div className="text-xs font-medium uppercase tracking-[0.18em] text-amber-300">
              Ready to scope it
            </div>
            <h2 className="mt-3 text-3xl font-semibold">
              Start with Guided Launch or request a higher-touch rollout.
            </h2>
            <p className="mt-3 text-sm leading-7 text-slate-300">
              The trial is the proof step. Paid rollout is where we turn the working flow
              into the version you can actually sell and operate.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link href="/pilot?plan=guided-launch" className="inline-flex rounded-lg bg-white px-5 py-3 text-sm font-medium text-slate-950">
              Start guided trial
            </Link>
            <a href={contactHref} className="inline-flex rounded-lg border border-slate-700 px-5 py-3 text-sm font-medium text-white">
              Talk to us
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
