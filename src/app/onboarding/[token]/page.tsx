// src/app/onboarding/[token]/page.tsx
import Wizard from "./wizard";

export default function TokenOnboardingPage() {
  return (
    <main className="space-y-6">
      <Wizard />
    </main>
  );
}