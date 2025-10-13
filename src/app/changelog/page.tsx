export default function TermsPage() {
    return (
      <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <section className="container mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-16 space-y-6">
          <h1 className="text-3xl font-bold tracking-tight">Terms of Service</h1>
          <div className="prose prose-slate max-w-none">
            <h3>Use of Service</h3>
            <p>Client Onboarding provides a guided intake and admin analytics for wealth management firms.</p>
            <h3>Data Ownership</h3>
            <p>You own your data. We process it solely to provide the service.</p>
            <h3>Acceptable Use</h3>
            <p>No unlawful content or misuse. We may suspend access for violations.</p>
            <h3>Disclaimer</h3>
            <p>Provided “as is” without warranties. Not investment advice.</p>
            <h3>Contact</h3>
            <p>legal@advisoronboarding.app</p>
          </div>
        </section>
      </main>
    );
  }