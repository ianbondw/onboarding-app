// src/app/onboarding/[token]/page.tsx
import Wizard from "./wizard";

export default function OnboardingTokenPage(props: { params: { token: string } }) {
  return <Wizard params={props.params} />;
}