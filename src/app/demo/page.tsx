import type { Metadata } from "next";
import DemoExperience from "./DemoExperience";
import { demoScenes } from "@/lib/demo-content";

export const metadata: Metadata = {
  title: "Product Demo",
  description:
    "Captioned walkthrough of Marengo Finance showing the client onboarding flow, advisor dashboard, privacy queue, and trust center.",
  alternates: {
    canonical: "/demo",
  },
};

export default function DemoPage() {
  const howToSchema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: "How to start using Marengo Finance",
    description:
      "Create a trial workspace, run a sample submission, sign into the advisor portal, and review the trust packet.",
    step: demoScenes.map((scene, index) => ({
      "@type": "HowToStep",
      position: index + 1,
      name: scene.title,
      text: scene.caption,
    })),
  };

  return (
    <main className="space-y-12 pb-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }}
      />
      <DemoExperience />
    </main>
  );
}
