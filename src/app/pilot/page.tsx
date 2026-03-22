import type { Metadata } from "next";
import PilotClient from "./PilotClient";
import { getPricingPlan, pricingPlans } from "@/lib/marketing";

export const metadata: Metadata = {
  title: "Instant Trial",
  description: "Create an instant Marengo trial workspace and start using the product immediately.",
  alternates: {
    canonical: "/pilot",
  },
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
