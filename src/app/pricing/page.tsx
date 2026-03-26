import type { Metadata } from "next";
import TrackedLink from "@/components/TrackedLink";
import { pricingPlans, rolloutSteps } from "@/lib/marketing";
import { getBookingAction, getPlanAction } from "@/lib/public-sales";

const SITE_ORIGIN =
  process.env.NEXT_PUBLIC_SITE_ORIGIN?.trim() || "https://marengofinance.com";

const sharedInclusions = [
  "Branded client onboarding flow",
  "Advisor dashboard and backoffice access",
  "Export-ready client data",
  "Instant trial workspace before paid rollout",
];

const addOns = [
  {
    title: "Custom domain and deeper branding",
    body: "Use this when the public-facing experience needs to feel like your firm, not a generic app.",
  },
  {
    title: "CRM, webhook, and ops integration",
    body: "Wire Marengo into your downstream follow-up, alerts, and internal operational tooling.",
  },
  {
    title: "Higher-touch implementation",
    body: "Best for multi-advisor teams that need help structuring access, review flow, and internal adoption.",
  },
];

export const metadata: Metadata = {
  title: "Pricing",
  description: "Instant-trial and rollout pricing for Marengo client onboarding.",
  alternates: {
    canonical: "/pricing",
  },
};

function buildContactHref() {
  const email = (process.env.CONTACT_TO || "").trim();
  if (!email) return "/contact";
  return `mailto:${email}?subject=${encodeURIComponent("Marengo pricing inquiry")}`;
}

function getActionEventName(kind: string) {
  if (kind === "checkout") return "Open Checkout CTA";
  if (kind === "booking") return "Book Call CTA";
  if (kind === "contact") return "Talk To Sales CTA";
  return "Start Trial CTA";
}

export default function PricingPage() {
  const contactHref = buildContactHref();
  const guidedLaunchAction = getPlanAction("guided-launch");
  const bookingAction = getBookingAction(contactHref);

  const pricingSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Marengo rollout pricing",
    provider: {
      "@type": "Organization",
      name: "Marengo Finance",
      url: SITE_ORIGIN,
    },
    url: `${SITE_ORIGIN}/pricing`,
    description:
      "Instant-trial and rollout pricing for RIAs and wealth teams using Marengo client onboarding.",
  };

  return (
    <main className="space-y-16 pb-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(pricingSchema) }}
      />

      <section className="section-shell p-8 md:p-10">
        <div className="relative z-10 space-y-5">
          <div className="eyebrow">Rollout pricing</div>
          <h1 className="display-type max-w-4xl text-5xl font-semibold text-slate-950 md:text-6xl">
            Pricing that frames Marengo as a rollout partner, not just another monthly tool.
          </h1>
          <p className="max-w-3xl text-lg leading-8 text-slate-600">
            Start with an instant trial, prove the experience, and then move into the package
            that matches your team size, polish expectations, and operational depth.
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <TrackedLink
              href="/demo"
              eventName="Watch Demo CTA"
              eventProps={{ source: "pricing", placement: "hero" }}
              className="btn-secondary px-5 py-3"
            >
              Watch 2-minute demo
            </TrackedLink>
            <TrackedLink
              href={guidedLaunchAction.href}
              eventName={getActionEventName(guidedLaunchAction.kind)}
              eventProps={{ source: "pricing", placement: "hero" }}
              className="btn-primary px-5 py-3"
              external={guidedLaunchAction.external}
            >
              {guidedLaunchAction.label}
            </TrackedLink>
          </div>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        {pricingPlans.map((plan) => {
          const action = getPlanAction(plan.slug);
          return (
            <div
              key={plan.slug}
              className={plan.featured ? "spotlight-card p-6 text-white" : "surface-card p-6"}
            >
              <div className="relative z-10">
                <div
                  className={`text-xs font-semibold uppercase tracking-[0.18em] ${
                    plan.featured ? "text-amber-200" : "text-slate-500"
                  }`}
                >
                  {plan.name}
                </div>
                <div className="mt-4 display-type text-4xl font-semibold">
                  {plan.setupFee}
                </div>
                <div
                  className={`mt-1 text-sm ${plan.featured ? "text-slate-200" : "text-slate-500"}`}
                >
                  {plan.monthlyPrice}
                </div>
                <p
                  className={`mt-4 text-sm leading-7 ${plan.featured ? "text-slate-200" : "text-slate-600"}`}
                >
                  {plan.bestFor}
                </p>
                <p
                  className={`mt-3 text-sm leading-7 ${plan.featured ? "text-slate-200" : "text-slate-500"}`}
                >
                  {plan.summary}
                </p>

                <div className="mt-5 grid gap-3">
                  {plan.highlights.map((highlight) => (
                    <div
                      key={highlight}
                      className={`rounded-[1.3rem] border px-4 py-3 text-sm ${
                        plan.featured
                          ? "border-white/10 bg-white/8 text-slate-50"
                          : "border-white/70 bg-white/70 text-slate-700"
                      }`}
                    >
                      {highlight}
                    </div>
                  ))}
                </div>

                <TrackedLink
                  href={action.href}
                  eventName={getActionEventName(action.kind)}
                  eventProps={{ source: "pricing", placement: "plan_card", plan: plan.slug }}
                  className={`mt-6 inline-flex rounded-full px-5 py-3 text-sm font-semibold ${
                    plan.featured
                      ? "bg-white text-slate-950"
                      : "border border-slate-200 bg-white text-slate-900"
                  }`}
                  external={action.external}
                >
                  {action.label}
                </TrackedLink>
              </div>
            </div>
          );
        })}
      </section>

      <section className="grid gap-6 lg:grid-cols-[0.82fr,1.18fr]">
        <div className="section-shell p-6">
          <div className="relative z-10">
            <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              Every paid rollout includes
            </div>
            <div className="mt-4 grid gap-3">
              {sharedInclusions.map((item) => (
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

        <div className="section-shell p-6">
          <div className="relative z-10">
            <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              Rollout path
            </div>
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              {rolloutSteps.map((step, index) => (
                <div key={step.title} className="surface-card p-5">
                  <div className="relative z-10">
                    <div className="text-sm font-semibold text-amber-700">0{index + 1}</div>
                    <h2 className="display-type mt-3 text-xl font-semibold text-slate-950">
                      {step.title}
                    </h2>
                    <p className="mt-3 text-sm leading-7 text-slate-600">{step.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section-shell p-6 md:p-8">
        <div className="relative z-10">
          <div className="space-y-3">
            <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              Buy with clearer expectations
            </div>
            <h2 className="display-type text-3xl font-semibold text-slate-950 md:text-4xl">
              The fastest way to avoid buyer regret is to be explicit about fit, timing, and scope.
            </h2>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {[
              {
                title: "Best fit",
                body:
                  "Firms that want a premium onboarding experience quickly and can start with the core branded flow before asking for custom systems work.",
              },
              {
                title: "What the paid rollout covers",
                body:
                  "Workspace setup, branding, seats, trust collateral, and the implementation support tied to the package you choose.",
              },
              {
                title: "When to choose white-label ops",
                body:
                  "Use the custom path when you need custom domains, downstream integrations, or a more embedded implementation plan across multiple stakeholders.",
              },
            ].map((item) => (
              <div key={item.title} className="surface-card p-5">
                <div className="relative z-10">
                  <h3 className="display-type text-xl font-semibold text-slate-950">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-slate-600">{item.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-shell p-8 md:p-10">
        <div className="relative z-10">
          <div className="space-y-3">
            <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              Common add-ons
            </div>
            <h2 className="display-type text-3xl font-semibold text-slate-950 md:text-4xl">
              Add the polish and integration work that makes the rollout feel enterprise-ready.
            </h2>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {addOns.map((item) => (
              <div key={item.title} className="surface-card p-5">
                <div className="relative z-10">
                  <h3 className="display-type text-xl font-semibold text-slate-950">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-slate-600">{item.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="spotlight-card px-8 py-10 text-white">
        <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <div className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-200">
              Ready to scope it
            </div>
            <h2 className="display-type mt-3 text-3xl font-semibold md:text-4xl">
              Start with Guided Launch, watch the walkthrough, or open a deeper rollout conversation.
            </h2>
            <p className="mt-3 text-sm leading-7 text-slate-200">
              The trial is the proof step. Paid rollout is where the product becomes your
              branded, repeatable system.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <TrackedLink
              href={guidedLaunchAction.href}
              eventName={getActionEventName(guidedLaunchAction.kind)}
              eventProps={{ source: "pricing", placement: "footer_cta" }}
              className="inline-flex rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-950"
              external={guidedLaunchAction.external}
            >
              {guidedLaunchAction.label}
            </TrackedLink>
            <TrackedLink
              href="/demo"
              eventName="Watch Demo CTA"
              eventProps={{ source: "pricing", placement: "footer_cta" }}
              className="inline-flex rounded-full border border-white/18 bg-white/8 px-5 py-3 text-sm font-semibold text-white"
            >
              Watch walkthrough
            </TrackedLink>
            <TrackedLink
              href={bookingAction.href}
              eventName={getActionEventName(bookingAction.kind)}
              eventProps={{ source: "pricing", placement: "footer_cta" }}
              className="inline-flex rounded-full border border-white/18 bg-white/8 px-5 py-3 text-sm font-semibold text-white"
              external={bookingAction.external}
            >
              {bookingAction.label}
            </TrackedLink>
          </div>
        </div>
      </section>
    </main>
  );
}
