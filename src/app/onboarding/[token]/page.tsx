// src/app/onboarding/[token]/page.tsx
import Wizard from "./wizard";

export default async function OnboardingTokenPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params; // Next.js 15: params is a Promise
  // Pass only the token prop; Wizard shouldn't receive a `params` object
  return <Wizard token={token} />;
}