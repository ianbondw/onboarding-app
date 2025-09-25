// src/app/onboarding/[token]/page.tsx
import Wizard from "./wizard";

// Keep this page as a lightweight Server Component that renders the client Wizard.
// Wizard itself reads the [token] via useParams().
export const dynamic = "force-dynamic";

export default function OnboardingPage() {
  return <Wizard />;
}
