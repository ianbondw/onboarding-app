import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Marengo Finance",
    short_name: "Marengo",
    description:
      "Instant trials, advisor workspaces, and rollout-ready onboarding for RIAs and wealth teams.",
    start_url: "/",
    display: "standalone",
    background_color: "#f4efe6",
    theme_color: "#111827",
    icons: [
      {
        src: "/brand/bee-shield-classic.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
    ],
  };
}
