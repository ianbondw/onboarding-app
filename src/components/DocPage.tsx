import type { ReactNode } from "react";

type DocSection = {
  title: string;
  body: readonly string[];
};

export default function DocPage({
  eyebrow,
  title,
  lede,
  sections,
  aside,
}: {
  eyebrow: string;
  title: string;
  lede: string;
  sections: readonly DocSection[];
  aside?: ReactNode;
}) {
  return (
    <main className="min-h-screen">
      <section className="mx-auto max-w-5xl space-y-8 px-4 py-16 sm:px-6 lg:px-8">
        <div className="section-shell p-8 md:p-10">
          <div className="relative z-10">
            <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              {eyebrow}
            </div>
            <h1 className="display-type mt-3 text-4xl font-semibold text-slate-950 md:text-5xl">
              {title}
            </h1>
            <p className="mt-4 max-w-3xl text-base leading-8 text-slate-600">{lede}</p>
          </div>
        </div>

        <div className="grid gap-4">
          {sections.map((section) => (
            <section key={section.title} className="surface-card p-6">
              <div className="relative z-10">
                <h2 className="display-type text-2xl font-semibold text-slate-950">
                  {section.title}
                </h2>
                <div className="mt-4 space-y-3 text-sm leading-7 text-slate-600">
                  {section.body.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>
              </div>
            </section>
          ))}
        </div>

        {aside ? <section className="section-shell p-8">{aside}</section> : null}
      </section>
    </main>
  );
}
