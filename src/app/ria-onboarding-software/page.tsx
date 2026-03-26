import type { Metadata } from "next";
import TrackedLink from "@/components/TrackedLink";
import { getBookingAction, getPlanAction } from "@/lib/public-sales";

const SITE_ORIGIN =
  process.env.NEXT_PUBLIC_SITE_ORIGIN?.trim() || "https://marengofinance.com";

export const metadata: Metadata = {
  title: "RIA Onboarding Software",
  description:
    "RIA onboarding software with instant trials, advisor workspaces, trust documentation, and rollout-ready operations.",
  alternates: {
    canonical: "/ria-onboarding-software",
  },
  keywords: [
    "RIA onboarding software",
    "wealth management onboarding software",
    "advisor client onboarding",
    "client onboarding for RIAs",
  ],
};

function buildContactHref() {
  const email = (process.env.CONTACT_TO || "").trim();
  if (!email) return "/contact";
  return `mailto:${email}?subject=${encodeURIComponent("RIA onboarding software inquiry")}`;
}

function getActionEventName(kind: string) {
  if (kind === "checkout") return "Open Checkout CTA";
  if (kind === "booking") return "Book Call CTA";
  if (kind === "contact") return "Talk To Sales CTA";
  return "Start Trial CTA";
}

export default function RiaOnboardingSoftwarePage() {
  const guidedLaunchAction = getPlanAction("guided-launch");
  const bookingAction = getBookingAction(buildContactHref());

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Marengo RIA onboarding software",
    serviceType: "Client onboarding software for RIAs",
    provider: {
      "@type": "Organization",
      name: "Marengo Finance",
      url: SITE_ORIGIN,
    },
    url: `${SITE_ORIGIN}/ria-onboarding-software`,
    areaServed: "US",
    audience: {
      "@type": "Audience",
      audienceType: "Registered investment advisors and wealth operations teams",
    },
  };

  return (
    <main className="space-y-12 pb-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />

      <section className="grid gap-8 pt-4 lg:grid-cols-[1.05fr,0.95fr] lg:items-start">
        <div className="space-y-6">
          <div className="eyebrow">RIA onboarding software</div>
          <div className="space-y-4">
            <h1 className="display-type max-w-5xl text-5xl font-semibold text-slate-950 md:text-7xl">
              RIA onboarding software that looks modern to prospects and works for ops.
            </h1>
            <p className="max-w-3xl text-lg leading-8 text-slate-600 md:text-xl">
              Marengo gives RIAs a cleaner client onboarding flow, scoped advisor workspaces,
              review controls, and a trust story you can actually use in sales and diligence.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <TrackedLink
              href="/demo"
              eventName="Watch Demo CTA"
              eventProps={{ source: "ria_landing", placement: "hero" }}
              className="btn-secondary px-5 py-3"
            >
              Watch 2-minute demo
            </TrackedLink>
            <TrackedLink
              href={guidedLaunchAction.href}
              eventName={getActionEventName(guidedLaunchAction.kind)}
              eventProps={{ source: "ria_landing", placement: "hero" }}
              className="btn-primary px-5 py-3"
              external={guidedLaunchAction.external}
            >
              {guidedLaunchAction.label}
            </TrackedLink>
            <TrackedLink
              href={bookingAction.href}
              eventName={getActionEventName(bookingAction.kind)}
              eventProps={{ source: "ria_landing", placement: "hero" }}
              className="btn-plain px-4 py-3"
              external={bookingAction.external}
            >
              {bookingAction.label}
            </TrackedLink>
          </div>

          <div className="flex flex-wrap gap-2">
            {[
              "Instant trial",
              "Advisor workspaces",
              "Compliance review states",
              "Trust center",
              "PII minimization",
              "Export-ready data",
            ].map((item) => (
              <span key={item} className="metric-pill">
                {item}
              </span>
            ))}
          </div>
        </div>

        <div className="spotlight-card p-6 text-white">
          <div className="relative z-10">
            <div className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-200">
              What this replaces
            </div>
            <div className="mt-4 grid gap-3">
              {[
                "PDF packets and follow-up email chains",
                "Manual re-entry by ops staff",
                "Generic demos that never turn into a real pilot",
                "Security answers trapped in scattered email replies",
              ].map((item) => (
                <div
                  key={item}
                  className="rounded-[1.35rem] border border-white/10 bg-white/8 px-4 py-3 text-sm text-slate-100"
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
          <div className="space-y-3">
            <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              Why it wins
            </div>
            <h2 className="display-type text-3xl font-semibold text-slate-950 md:text-4xl">
              Better fit for firms that need a premium first impression and a cleaner operational handoff.
            </h2>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {[
              {
                title: "Client experience",
                body:
                  "The onboarding flow feels current on desktop and mobile, which matters when the first impression affects conversion.",
              },
              {
                title: "Advisor and ops workflow",
                body:
                  "Submissions land in a scoped portal with review states, flags, exports, and audit context instead of a dead-end form.",
              },
              {
                title: "Trust and diligence",
                body:
                  "Security, privacy, incident response, vendor, and SOC-readiness materials are already available for internal review.",
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

      <section className="grid gap-4 lg:grid-cols-3">
        {[
          {
            title: "Best fit",
            body:
              "RIAs and wealth teams that want to improve client intake now, prove the workflow fast, and scope deeper rollout work later.",
          },
          {
            title: "Not the best fit yet",
            body:
              "Firms that need a fully custom CRM, custodian, or supervisory integration before they can run even a single realistic pilot.",
          },
          {
            title: "Next step",
            body:
              "Start with the demo or instant trial, then decide whether Guided Launch, Growth Team, or a higher-touch rollout is the right commercial path.",
          },
        ].map((item) => (
          <div key={item.title} className="surface-card p-6">
            <div className="relative z-10">
              <h2 className="display-type text-xl font-semibold text-slate-950">{item.title}</h2>
              <p className="mt-3 text-sm leading-7 text-slate-600">{item.body}</p>
            </div>
          </div>
        ))}
      </section>

      <section className="spotlight-card px-8 py-10 text-white">
        <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <div className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-200">
              Ready to test it
            </div>
            <h2 className="display-type mt-3 text-3xl font-semibold md:text-4xl">
              Send high-intent traffic here, route colder traffic through the walkthrough, and use the trial for qualification.
            </h2>
            <p className="mt-3 text-sm leading-7 text-slate-200">
              This page is designed for search intent around RIA onboarding software and should convert better than a generic homepage.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <TrackedLink
              href="/demo"
              eventName="Watch Demo CTA"
              eventProps={{ source: "ria_landing", placement: "footer_cta" }}
              className="inline-flex rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-950"
            >
              Watch walkthrough
            </TrackedLink>
            <TrackedLink
              href={guidedLaunchAction.href}
              eventName={getActionEventName(guidedLaunchAction.kind)}
              eventProps={{ source: "ria_landing", placement: "footer_cta" }}
              className="inline-flex rounded-full border border-white/18 bg-white/8 px-5 py-3 text-sm font-semibold text-white"
              external={guidedLaunchAction.external}
            >
              {guidedLaunchAction.label}
            </TrackedLink>
          </div>
        </div>
      </section>
    </main>
  );
}
