import Link from "next/link";

export const metadata = {
  title: "About - Marengo Finance",
  description:
    "Marengo helps RIAs replace manual onboarding with a cleaner client and advisor workflow.",
};

export default function AboutPage() {
  return (
    <main className="space-y-8 pb-10">
      <section className="rounded-[30px] border bg-white/90 p-8 shadow-sm">
        <div className="space-y-3">
          <div className="text-xs font-medium uppercase tracking-[0.18em] text-slate-500">
            About Marengo
          </div>
          <h1 className="text-4xl font-semibold tracking-tight text-slate-950">
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
              "The product is structured around guided trials, advisor workspaces, review states, and a path to paid implementation.",
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
          <div key={item.title} className="rounded-[28px] border bg-white/90 p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-950">{item.title}</h2>
            <p className="mt-3 text-sm leading-7 text-slate-600">{item.body}</p>
          </div>
        ))}
      </section>

      <section className="rounded-[30px] border bg-white/90 p-8 shadow-sm">
        <div className="space-y-3">
          <div className="text-xs font-medium uppercase tracking-[0.18em] text-slate-500">
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
              <li key={item} className="rounded-2xl border bg-slate-50 px-4 py-3 text-sm text-slate-700">
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="rounded-[34px] bg-slate-950 px-8 py-10 text-white shadow-sm">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <div className="text-xs font-medium uppercase tracking-[0.18em] text-amber-300">
              Next step
            </div>
            <h2 className="mt-3 text-3xl font-semibold">
              If the offer makes sense, create a trial and use it to scope rollout.
            </h2>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/pilot?plan=guided-launch" className="inline-flex rounded-lg bg-white px-5 py-3 text-sm font-medium text-slate-950">
              Start guided trial
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
