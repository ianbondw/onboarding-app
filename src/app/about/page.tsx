import type { Metadata } from "next";
import TrackedLink from "@/components/TrackedLink";
import { getPlanAction } from "@/lib/public-sales";

export const metadata: Metadata = {
  title: "About",
  description:
    "Marengo helps RIAs replace manual onboarding with a cleaner client and advisor workflow.",
  alternates: {
    canonical: "/about",
  },
};

export default function AboutPage() {
  const guidedLaunchAction = getPlanAction("guided-launch");

  return (
    <main className="space-y-8 pb-10">
      <section className="section-shell p-8 md:p-10">
        <div className="relative z-10 space-y-3">
          <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            About Marengo
          </div>
          <h1 className="display-type text-4xl font-semibold text-slate-950 md:text-5xl">
            Marengo exists to make client onboarding sellable, usable, and operationally cleaner.
          </h1>
          <p className="max-w-3xl text-base leading-8 text-slate-600">
            Most firms do not need another bloated intake system. They need a faster way to
            collect client information, hand it to advisors and ops, and move from first
            interest to funded household with fewer delays and less manual cleanup.
          </p>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {[
          {
            title: "Built for real rollout",
            body:
              "The product is structured around instant trials, advisor workspaces, review states, and a path to paid implementation.",
          },
          {
            title: "Scoped for RIAs",
            body:
              "Marengo is aimed at advisory firms that want something operationally credible without starting with a heavy enterprise project.",
          },
          {
            title: "Ready for sales use",
            body:
              "Pricing, trial provisioning, and admin flows are designed to help you move from demo interest to a real buyer conversation.",
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

      <section className="section-shell p-8 md:p-10">
        <div className="relative z-10 space-y-3">
          <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            What is already in the product
          </div>
          <ul className="grid gap-3 md:grid-cols-2">
            {[
              "Branded client onboarding flow",
              "Advisor-scoped dashboard access",
              "Compliance review states and field flags",
              "Trial lead capture and lifecycle events",
              "CSV export and downstream webhook hooks",
              "Portal user management for owner, ops, and advisor roles",
            ].map((item) => (
              <li
                key={item}
                className="rounded-[1.3rem] border border-white/70 bg-white/70 px-4 py-3 text-sm text-slate-700"
              >
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="spotlight-card px-8 py-10 text-white">
        <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <div className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-200">
              Next step
            </div>
            <h2 className="display-type mt-3 text-3xl font-semibold md:text-4xl">
              If the offer makes sense, create a trial and use it to scope rollout.
            </h2>
          </div>
          <div className="flex flex-wrap gap-3">
            <TrackedLink
              href={guidedLaunchAction.href}
              eventName={guidedLaunchAction.kind === "checkout" ? "Open Checkout CTA" : "Start Trial CTA"}
              eventProps={{ source: "about", placement: "footer_cta" }}
              className="inline-flex rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-950"
              external={guidedLaunchAction.external}
            >
              {guidedLaunchAction.label}
            </TrackedLink>
            <TrackedLink
              href="/pricing"
              eventName="Open Pricing CTA"
              eventProps={{ source: "about", placement: "footer_cta" }}
              className="inline-flex rounded-full border border-white/18 bg-white/8 px-5 py-3 text-sm font-semibold text-white"
            >
              Review pricing
            </TrackedLink>
          </div>
        </div>
      </section>
    </main>
  );
}
