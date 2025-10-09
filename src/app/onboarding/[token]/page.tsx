// src/app/onboarding/[token]/page.tsx
import Wizard from "./wizard";

export default async function OnboardingTokenPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const p = await params; // Next.js 15 passes params as a Promise
  return <Wizard params={p} />;
}