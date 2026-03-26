import type { Metadata } from "next";
import TrackedLink from "@/components/TrackedLink";
import { faqItems, pricingPlans, revenueOutcomes, rolloutSteps } from "@/lib/marketing";
import { getBookingAction, getPlanAction } from "@/lib/public-sales";

const SITE_ORIGIN =
  process.env.NEXT_PUBLIC_SITE_ORIGIN?.trim() || "https://marengofinance.com";

export const metadata: Metadata = {
  title: "Modern Client Onboarding for RIAs",
  description:
    "Instant trials, advisor workspaces, and a rollout-ready onboarding flow for RIAs and wealth teams.",
  alternates: {
    canonical: "/",
  },
};

function buildContactHref() {
  const email = (process.env.CONTACT_TO || "").trim();
  if (!email) return "/contact";
  return `mailto:${email}?subject=${encodeURIComponent("Marengo rollout inquiry")}`;
}

function getActionEventName(kind: string) {
  if (kind === "checkout") return "Open Checkout CTA";
  if (kind === "booking") return "Book Call CTA";
  if (kind === "contact") return "Talk To Sales CTA";
  return "Start Trial CTA";
}

export default function Home() {
  const contactHref = buildContactHref();
  const guidedLaunchAction = getPlanAction("guided-launch");
  const bookingAction = getBookingAction(contactHref);

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
              Marengo turns email chains, PDF packets, and manual review into an instant
              trial workspace with advisor access, structured review, and a paid rollout
              path that looks credible on Google, social, and live demos.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <TrackedLink
              href={guidedLaunchAction.href}
              eventName={getActionEventName(guidedLaunchAction.kind)}
              eventProps={{ source: "home", placement: "hero" }}
              className="btn-primary px-5 py-3"
              external={guidedLaunchAction.external}
            >
              {guidedLaunchAction.label}
            </TrackedLink>
            <TrackedLink
              href="/demo"
              eventName="Watch Demo CTA"
              eventProps={{ source: "home", placement: "hero" }}
              className="btn-secondary px-5 py-3"
            >
              Watch 2-minute demo
            </TrackedLink>
            <TrackedLink
              href="/pricing"
              eventName="Open Pricing CTA"
              eventProps={{ source: "home", placement: "hero" }}
              className="btn-secondary px-5 py-3"
            >
              Review pricing
            </TrackedLink>
            <TrackedLink
              href={bookingAction.href}
              eventName={getActionEventName(bookingAction.kind)}
              eventProps={{ source: "home", placement: "hero" }}
              className="btn-plain px-4 py-3"
              external={bookingAction.external}
            >
              {bookingAction.label}
            </TrackedLink>
          </div>

          <div className="flex flex-wrap gap-2 pt-1">
            <span className="metric-pill">Instant trials</span>
            <span className="metric-pill">Advisor workspaces</span>
            <span className="metric-pill">Compliance review states</span>
            <span className="metric-pill">PII minimization</span>
            <span className="metric-pill">Google and social ready</span>
            {guidedLaunchAction.kind === "checkout" ? (
              <span className="metric-pill">Direct checkout ready</span>
            ) : null}
            <span className="metric-pill">No sales call required</span>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {[
              {
                label: "Paid rollout path",
                body: "From free instant trial to a branded launch package instead of a dead-end demo.",
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
                  "A captioned walkthrough you can share internally",
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
                Product walkthrough
              </div>
              <h2 className="display-type mt-2 text-3xl font-semibold text-slate-950 md:text-4xl">
                Show the flow in two minutes before you ask anyone to fill out a form.
              </h2>
            </div>
            <TrackedLink
              href="/demo"
              eventName="Watch Demo CTA"
              eventProps={{ source: "home", placement: "demo_section" }}
              className="btn-secondary w-fit"
            >
              Open walkthrough
            </TrackedLink>
          </div>

          <div className="mt-8 grid gap-4 lg:grid-cols-[1.08fr,0.92fr]">
            <div className="spotlight-card p-6 text-white">
              <div className="relative z-10">
                <div className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-200">
                  Captioned demo
                </div>
                <div className="mt-3 display-type text-3xl font-semibold">
                  Homepage to onboarding to advisor portal to privacy queue to trust center
                </div>
                <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-200">
                  The walkthrough is built to be forwarded to firm stakeholders. It explains what
                  the product does, how to use it, and why the trust story is stronger now.
                </p>
              </div>
            </div>

            <div className="grid gap-3">
              {[
                "Closed captions and downloadable transcript",
                "Strong enough for internal stakeholders, not just the buyer",
                "Ends in a self-serve instant-trial CTA",
              ].map((item) => (
                <div
                  key={item}
                  className="rounded-[1.5rem] border border-white/70 bg-white/70 px-4 py-4 text-sm text-slate-700 backdrop-blur"
                >
                  {item}
                </div>
              ))}
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
            <TrackedLink
              href="/pricing"
              eventName="Open Pricing CTA"
              eventProps={{ source: "home", placement: "why_convert_section" }}
              className="btn-secondary w-fit"
            >
              Compare rollout packages
            </TrackedLink>
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
            Start with an instant trial. Turn it into a rollout once the flow proves itself.
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
            Instant trials prove the product. Paid packages turn that proof into a branded,
            operational setup your team can adopt and prospects can take seriously.
          </p>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
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
                  <div className="mt-3 display-type text-3xl font-semibold">
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
                    eventProps={{ source: "home", placement: "pricing_card", plan: plan.slug }}
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
        </div>
      </section>

      <section className="section-shell p-8 md:p-10">
        <div className="relative z-10">
          <div className="space-y-3">
            <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              Customer fit and expectations
            </div>
            <h2 className="display-type text-3xl font-semibold text-slate-950 md:text-4xl">
              Set the right expectation early and fewer customers end up disappointed later.
            </h2>
          </div>

          <div className="mt-6 grid gap-4 lg:grid-cols-3">
            {[
              {
                title: "Best fit right now",
                body:
                  "Solo advisors, small RIAs, and growth teams that want a more modern intake flow fast and are willing to test with a real sample household.",
              },
              {
                title: "Not the best fit yet",
                body:
                  "Firms that require a fully custom CRM, custodian, or supervisory stack before they will run even a single live pilot.",
              },
              {
                title: "What buyers should expect",
                body:
                  "The trial proves the workflow and trust posture quickly. The paid rollout is where branding, deeper integration work, and higher-touch implementation get locked in.",
              },
            ].map((item) => (
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
              You can run Google, socials, and outreach against this now and let buyers start on their own.
            </h2>
            <p className="mt-3 text-sm leading-7 text-slate-200">
              Start with the walkthrough, use the instant trial to prove the workflow, and push
              prospects into a path that already leads into real operations without waiting on a live call.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <TrackedLink
              href={guidedLaunchAction.href}
              eventName={getActionEventName(guidedLaunchAction.kind)}
              eventProps={{ source: "home", placement: "footer_cta" }}
              className="inline-flex rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-950"
              external={guidedLaunchAction.external}
            >
              {guidedLaunchAction.label}
            </TrackedLink>
            <TrackedLink
              href="/demo"
              eventName="Watch Demo CTA"
              eventProps={{ source: "home", placement: "footer_cta" }}
              className="inline-flex rounded-full border border-white/18 bg-white/8 px-5 py-3 text-sm font-semibold text-white"
            >
              Watch walkthrough
            </TrackedLink>
            <TrackedLink
              href={bookingAction.href}
              eventName={getActionEventName(bookingAction.kind)}
              eventProps={{ source: "home", placement: "footer_cta" }}
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
