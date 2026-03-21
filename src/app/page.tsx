import type { Metadata } from "next";
import Link from "next/link";
import { faqItems, pricingPlans, revenueOutcomes, rolloutSteps } from "@/lib/marketing";

const SITE_ORIGIN =
  process.env.NEXT_PUBLIC_SITE_ORIGIN?.trim() || "https://marengofinance.com";

export const metadata: Metadata = {
  title: "Modern Client Onboarding for RIAs",
  description:
    "Guided trials, advisor workspaces, and a cleaner onboarding flow for RIAs and wealth teams.",
  alternates: {
    canonical: "/",
  },
};

function buildContactHref() {
  const email = (process.env.CONTACT_TO || "").trim();
  if (!email) return "/contact";
  return `mailto:${email}?subject=${encodeURIComponent("Marengo rollout inquiry")}`;
}

export default function Home() {
  const contactHref = buildContactHref();

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Marengo Finance Client Onboarding",
    serviceType: "Client onboarding software for RIAs and wealth teams",
    provider: {
      "@type": "Organization",
      name: "Marengo Finance",
      url: SITE_ORIGIN,
    },
    areaServed: "US",
    audience: {
      "@type": "Audience",
      audienceType: "Registered investment advisors, wealth teams, and backoffice operations",
    },
  };

  return (
    <main className="space-y-20 pb-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <section className="grid gap-8 pb-4 pt-4 lg:grid-cols-[1.12fr,0.88fr] lg:items-start">
        <div className="space-y-7">
          <div className="eyebrow">RIA rollout-ready onboarding</div>

          <div className="space-y-5">
            <h1 className="display-type max-w-5xl text-5xl font-semibold text-slate-950 md:text-7xl">
              Client onboarding that feels modern enough to sell and strong enough to run.
            </h1>
            <p className="max-w-2xl text-lg leading-8 text-slate-600 md:text-xl">
              Marengo turns email chains, PDF packets, and manual review into a guided
              trial workspace with advisor access, structured review, and a paid rollout
              path that looks credible on Google, social, and live demos.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link href="/pilot?plan=guided-launch" className="btn-primary px-5 py-3">
              Start guided trial
            </Link>
            <Link href="/pricing" className="btn-secondary px-5 py-3">
              Review pricing
            </Link>
            <a href={contactHref} className="btn-plain px-4 py-3">
              Talk to sales
            </a>
          </div>

          <div className="flex flex-wrap gap-2 pt-1">
            <span className="metric-pill">Guided trials</span>
            <span className="metric-pill">Advisor workspaces</span>
            <span className="metric-pill">Compliance review states</span>
            <span className="metric-pill">PII minimization</span>
            <span className="metric-pill">Google and social ready</span>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {[
              {
                label: "Paid rollout path",
                body: "From free guided trial to a branded launch package instead of a dead-end demo.",
              },
              {
                label: "Buyer-grade polish",
                body: "Modern visuals, cleaner motion, and stronger positioning for outreach and ads.",
              },
              {
                label: "Operational backbone",
                body: "Advisor login, review workflow, exports, audit trails, and lead capture that already work together.",
              },
            ].map((item) => (
              <div key={item.label} className="surface-card p-5">
                <div className="relative z-10">
                  <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                    {item.label}
                  </div>
                  <div className="mt-3 text-sm leading-7 text-slate-700">{item.body}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div className="section-shell p-6">
            <div className="relative z-10">
              <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                What buyers get in week one
              </div>
              <div className="mt-4 grid gap-3">
                {[
                  "A dedicated advisor workspace instead of a recycled demo",
                  "Client onboarding, dashboard access, and review flow",
                  "Lead capture plus follow-up context for sales",
                  "A pricing story that turns interest into a rollout conversation",
                ].map((item) => (
                  <div
                    key={item}
                    className="rounded-[1.4rem] border border-white/70 bg-white/70 px-4 py-3 text-sm text-slate-700 backdrop-blur"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="spotlight-card p-6 text-white">
            <div className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-200">
              Illustrative ops ROI
            </div>
            <div className="mt-3 display-type text-4xl font-semibold">$12,960/year</div>
            <p className="mt-3 max-w-md text-sm leading-7 text-slate-200">
              Example only: 12 new households per month, 2 hours of ops cleanup per
              household, and $45/hour internal cost. That still excludes the upside from
              faster response and cleaner advisor follow-up.
            </p>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <div className="rounded-[1.35rem] border border-white/10 bg-white/8 px-4 py-3 text-sm">
                Launch a trial workspace immediately
              </div>
              <div className="rounded-[1.35rem] border border-white/10 bg-white/8 px-4 py-3 text-sm">
                Use the trial to scope the paid rollout
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-shell p-8 md:p-10">
        <div className="relative z-10">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Why this converts better
              </div>
              <h2 className="display-type mt-2 text-3xl font-semibold text-slate-950 md:text-4xl">
                The site should feel as premium as the onboarding product you want firms to buy.
              </h2>
            </div>
            <Link href="/pricing" className="btn-secondary w-fit">
              Compare rollout packages
            </Link>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {revenueOutcomes.map((item) => (
              <div key={item.title} className="surface-card p-6">
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

      <section id="how" className="space-y-6">
        <div className="space-y-3">
          <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            How it works
          </div>
          <h2 className="display-type text-3xl font-semibold text-slate-950 md:text-4xl">
            Start with a guided trial. Turn it into a rollout once the flow proves itself.
          </h2>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {rolloutSteps.map((step, index) => (
            <div key={step.title} className="surface-card p-6">
              <div className="relative z-10">
                <div className="text-sm font-semibold text-amber-700">0{index + 1}</div>
                <h3 className="display-type mt-3 text-xl font-semibold text-slate-950">
                  {step.title}
                </h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">{step.body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section id="pricing" className="space-y-6">
        <div className="space-y-3">
          <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            Pricing
          </div>
          <h2 className="display-type text-3xl font-semibold text-slate-950 md:text-4xl">
            Packages that make it easier to charge for the rollout, not just the software.
          </h2>
          <p className="max-w-3xl text-base leading-8 text-slate-600">
            Guided trials prove the product. Paid packages turn that proof into a branded,
            operational setup your team can adopt and prospects can take seriously.
          </p>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          {pricingPlans.map((plan) => (
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
                <div className="mt-3 display-type text-3xl font-semibold">
                  {plan.setupFee}
                </div>
                <div className={`mt-1 text-sm ${plan.featured ? "text-slate-200" : "text-slate-500"}`}>
                  {plan.monthlyPrice}
                </div>
                <p className={`mt-4 text-sm leading-7 ${plan.featured ? "text-slate-200" : "text-slate-600"}`}>
                  {plan.bestFor}
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

                <Link
                  href={plan.ctaHref}
                  className={`mt-6 inline-flex rounded-full px-5 py-3 text-sm font-semibold ${
                    plan.featured
                      ? "bg-white text-slate-950"
                      : "border border-slate-200 bg-white text-slate-900"
                  }`}
                >
                  {plan.ctaLabel}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="section-shell p-8 md:p-10">
        <div className="relative z-10 grid gap-8 lg:grid-cols-[0.9fr,1.1fr]">
          <div className="space-y-3">
            <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              Manual process vs Marengo
            </div>
            <h2 className="display-type text-3xl font-semibold text-slate-950 md:text-4xl">
              Replace the parts that make the business feel old.
            </h2>
            <p className="text-base leading-8 text-slate-600">
              A modern front end only matters if the handoff into operations is also cleaner.
              The product now looks better and carries the lead into a real admin and review workflow.
            </p>
          </div>

          <div className="grid gap-3">
            {[
              {
                left: "Flat PDFs, email attachments, and missing fields",
                right: "Guided onboarding with structured review and field flags",
              },
              {
                left: "A site that looks like a placeholder",
                right: "A polished marketing path you can actually promote",
              },
              {
                left: "Shared demos with no follow-up context",
                right: "Dedicated trial workspaces with captured buyer context",
              },
              {
                left: "No social or search presence worth sharing",
                right: "Metadata, OG images, sitemap, manifest, and better canonical setup",
              },
              {
                left: "Diligence questions with weak answers",
                right: "Security page, stronger legal copy, PII minimization, and cleaner audit posture",
              },
            ].map((row) => (
              <div
                key={row.left}
                className="grid gap-3 rounded-[1.7rem] border border-white/70 bg-white/62 p-4 backdrop-blur md:grid-cols-[1fr,1fr]"
              >
                <div className="rounded-[1.25rem] bg-white px-4 py-3 text-sm text-slate-500 shadow-sm">
                  {row.left}
                </div>
                <div className="rounded-[1.25rem] bg-emerald-50 px-4 py-3 text-sm text-emerald-950 shadow-sm">
                  {row.right}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="faq" className="space-y-6">
        <div className="space-y-3">
          <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            FAQ
          </div>
          <h2 className="display-type text-3xl font-semibold text-slate-950 md:text-4xl">
            Questions buyers ask before rollout and promotion
          </h2>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {faqItems.map((item) => (
            <div key={item.question} className="surface-card p-6">
              <div className="relative z-10">
                <h3 className="display-type text-xl font-semibold text-slate-950">
                  {item.question}
                </h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">{item.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="spotlight-card px-8 py-10 text-white">
        <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <div className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-200">
              Ready to promote
            </div>
            <h2 className="display-type mt-3 text-3xl font-semibold md:text-4xl">
              You can run Google, socials, and outreach against this now without it feeling dated.
            </h2>
            <p className="mt-3 text-sm leading-7 text-slate-200">
              Start with the guided trial, use pricing to qualify the conversation, and push
              prospects into a flow that already leads into real operations.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/pilot?plan=guided-launch"
              className="inline-flex rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-950"
            >
              Create guided trial
            </Link>
            <Link
              href="/pricing"
              className="inline-flex rounded-full border border-white/18 bg-white/8 px-5 py-3 text-sm font-semibold text-white"
            >
              Review packages
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
