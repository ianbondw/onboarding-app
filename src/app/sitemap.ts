// src/app/sitemap.ts
import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const site = "https://marengofinance.com";
  const now = new Date();
  return [
    { url: `${site}/`,        lastModified: now, changeFrequency: "weekly",  priority: 1.0 },
    { url: `${site}/pilot`,   lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${site}/about`,   lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${site}/contact`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
  ];
}