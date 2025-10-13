export default function PrivacyPage() {
    return (
      <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <section className="container mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-16 space-y-6">
          <h1 className="text-3xl font-bold tracking-tight">Privacy Policy</h1>
          <p className="text-gray-600">Last updated: {new Date().toLocaleDateString()}</p>
          <div className="prose prose-slate max-w-none">
            <p>We collect only the information necessary to deliver a compliant onboarding experience.</p>
            <h3>Data we collect</h3>
            <ul>
              <li>Client intake fields submitted via the onboarding flow</li>
              <li>Advisor-scoped analytics (counts, completion, goal/risk distribution)</li>
            </ul>
            <h3>Where data is stored</h3>
            <p>Neon Postgres (U.S.). Point-in-time restore enabled. Backed up regularly.</p>
            <h3>Security</h3>
            <ul>
              <li>Scoped JWT + HttpOnly cookies</li>
              <li>Transport encryption (HTTPS/TLS)</li>
              <li>Optional AES-256-GCM for sensitive fields (e.g., SSN)</li>
            </ul>
            <h3>Your rights</h3>
            <p>Contact us to access, correct, or delete your data: <a className="underline" href="mailto:privacy@advisoronboarding.app">privacy@advisoronboarding.app</a></p>
          </div>
        </section>
      </main>
    );
  }