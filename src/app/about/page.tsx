import Link from "next/link";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <section className="container mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-16 space-y-8">
        <header>
          <h1 className="text-3xl font-bold tracking-tight">About Client Onboarding</h1>
          <p className="mt-2 text-gray-600">Why we built it, and who it’s for.</p>
        </header>

        <article className="prose prose-slate max-w-none">
          <p>
            Client Onboarding is designed for wealth management and financial advisory firms that
            want a modern, compliant, and mobile-friendly onboarding experience. We streamline the
            intake process for clients while giving advisors real-time visibility into their pipeline.
          </p>

          <h3>Founder</h3>
          <p>
            <strong>Ian Bond</strong> — a leader in financial services and technology consulting — 
            built this platform to help advisors eliminate inefficiencies, reduce NIGO rates, and
            accelerate client funding. With deep experience supporting large-scale platform conversions,
            data migrations, and advisor onboarding programs, Ian saw the opportunity to modernize how
            firms engage new clients.
          </p>

          <h3>What we value</h3>
          <ul>
            <li>Simplicity over bloat</li>
            <li>Security by default</li>
            <li>Advisor outcomes first</li>
          </ul>

          <p>
            Want to see it in action?{" "}
            <Link href="/onboarding" className="underline">
              Try the demo
            </Link>{" "}
            or{" "}
            <a href="mailto:demo@advisoronboarding.app" className="underline">
              request a pilot
            </a>
            .
          </p>
        </article>
      </section>
    </main>
  );
}