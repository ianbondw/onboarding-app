// src/app/onboarding/[token]/page.tsx
export const dynamic = "force-dynamic";

import Wizard from "./wizard"; // adjust if your import path is different

export default function OnboardingPage({ params }: any) {
  // Next.js provides the dynamic segment here
  const token = params?.token as string;

  return <Wizard token={token} />;
}
