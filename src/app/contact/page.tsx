import ContactForm from "./ContactForm";

export const metadata = {
  title: "Contact - Marengo Finance",
  description: "Contact Marengo about rollout, pricing, or white-label onboarding.",
};

export default function ContactPage() {
  return (
    <main className="grid gap-6 pb-10 lg:grid-cols-[0.9fr,1.1fr]">
      <section className="space-y-4 rounded-[30px] border bg-white/90 p-8 shadow-sm">
        <div className="text-xs font-medium uppercase tracking-[0.18em] text-slate-500">
          Contact
        </div>
        <h1 className="text-4xl font-semibold tracking-tight text-slate-950">
          Talk to us about rollout, pricing, or white-label fit.
        </h1>
        <p className="text-base leading-8 text-slate-600">
          Use this form if you want a higher-touch rollout, need help choosing the right
          package, or want to discuss deeper ops and integration work.
        </p>

        <div className="space-y-3">
          {[
            "Guided Launch and Growth Team questions",
            "White-label or custom domain rollout",
            "CRM, webhook, or compliance workflow discussions",
            "Founder-led sales or implementation conversations",
          ].map((item) => (
            <div key={item} className="rounded-2xl border bg-slate-50 px-4 py-3 text-sm text-slate-700">
              {item}
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-[30px] border bg-white/90 p-8 shadow-sm">
        <ContactForm />
      </section>
    </main>
  );
}
