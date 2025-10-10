export default function Terms() {
    return (
      <main className="mx-auto max-w-3xl rounded-2xl border bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-semibold">Terms of Service</h1>
        <div className="prose prose-slate mt-6">
          <h3>Use of Service</h3>
          <p>You may use Client Onboarding to collect client intake information and review analytics.</p>
          <h3>Responsibilities</h3>
          <ul>
            <li>You are responsible for your advisors’ and clients’ use of the product.</li>
            <li>Do not submit prohibited or highly sensitive data without a signed agreement.</li>
          </ul>
          <h3>Availability & changes</h3>
          <p>We may update features and pricing. We’ll communicate material changes to admins.</p>
          <h3>Liability</h3>
          <p>Service is provided “as is” without warranties. Our liability is limited to amounts paid in the prior 3 months.</p>
          <p className="text-xs text-slate-500 mt-6">Last updated: {new Date().toLocaleDateString()}</p>
        </div>
      </main>
    );
  }