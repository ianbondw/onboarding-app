// src/app/onboarding/[token]/page.tsx
type Params = { token: string };

export default function OnboardingTokenPage({ params }: { params: Params }) {
  return (
    <section>
      <h1>Client Onboarding Wizard</h1>
      <p><strong>Token:</strong> {params.token}</p>
      <p>This is a minimal baseline page. Your form engine will mount here.</p>
    </section>
  );
}
