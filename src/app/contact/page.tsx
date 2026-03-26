import type { Metadata } from "next";
import ContactForm from "./ContactForm";
import TrackedLink from "@/components/TrackedLink";
import { getBookingAction } from "@/lib/public-sales";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contact Marengo about rollout, pricing, or white-label onboarding.",
  alternates: {
    canonical: "/contact",
  },
};

export default function ContactPage() {
  const bookingAction = getBookingAction("/contact");

  return (
    <main className="grid gap-6 pb-10 lg:grid-cols-[0.9fr,1.1fr]">
      <section className="section-shell p-8 md:p-10">
        <div className="relative z-10 space-y-4">
          <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            Contact
          </div>
          <h1 className="display-type text-4xl font-semibold text-slate-950 md:text-5xl">
            Talk to us about rollout, pricing, or white-label fit.
          </h1>
          <p className="text-base leading-8 text-slate-600">
            Use this form if you want a higher-touch rollout, need help choosing the right
            package, or want to discuss deeper ops and integration work.
          </p>

          <div className="flex flex-wrap gap-3 pt-2">
            <TrackedLink
              href="/demo"
              eventName="Watch Demo CTA"
              eventProps={{ source: "contact", placement: "hero" }}
              className="btn-secondary px-5 py-3"
            >
              Watch walkthrough
            </TrackedLink>
            <TrackedLink
              href={bookingAction.href}
              eventName={bookingAction.kind === "booking" ? "Book Call CTA" : "Talk To Sales CTA"}
              eventProps={{ source: "contact", placement: "hero" }}
              className="btn-primary px-5 py-3"
              external={bookingAction.external}
            >
              {bookingAction.label}
            </TrackedLink>
          </div>

          <div className="space-y-3">
            {[
              "Guided Launch and Growth Team questions",
              "White-label or custom domain rollout",
              "CRM, webhook, or compliance workflow discussions",
              "Implementation scope, support boundaries, and rollout expectations",
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
      </section>

      <section className="surface-card p-8">
        <ContactForm />
      </section>
    </main>
  );
}
