import PilotClient from "./PilotClient";
import { getPricingPlan, pricingPlans } from "@/lib/marketing";

export const metadata = {
  title: "Guided Trial - Marengo Finance",
  description: "Create a guided Marengo trial workspace and scope your rollout.",
};

export default async function PilotPage({
  searchParams,
}: {
  searchParams: Promise<{ plan?: string }>;
}) {
  const params = await searchParams;
  const initialPlanSlug =
    getPricingPlan(params?.plan)?.slug || pricingPlans[0].slug;

  return <PilotClient initialPlanSlug={initialPlanSlug} />;
}
