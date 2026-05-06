import type { MetadataRoute } from "next";
import { experiments } from "@/lib/experiments";
import { notes } from "@/lib/notes";

const BASE_URL = "https://www.eggthropic.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: new Date("2026-05-05"), changeFrequency: "weekly", priority: 1 },
    { url: `${BASE_URL}/experiments`, lastModified: new Date("2026-05-05"), changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE_URL}/notes`, lastModified: new Date("2026-05-05"), changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE_URL}/lab`, lastModified: new Date("2026-05-05"), changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE_URL}/lab/mcp`, lastModified: new Date("2026-04-26"), changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE_URL}/lab/skills`, lastModified: new Date("2026-04-18"), changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE_URL}/lab/interfaces`, lastModified: new Date("2026-05-05"), changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE_URL}/about`, lastModified: new Date("2026-04-01"), changeFrequency: "monthly", priority: 0.7 },
  ];

  const experimentRoutes: MetadataRoute.Sitemap = experiments.map((exp) => ({
    url: `${BASE_URL}/experiments/${exp.slug}`,
    lastModified: new Date(exp.date),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  const noteRoutes: MetadataRoute.Sitemap = notes.map((note) => ({
    url: `${BASE_URL}/notes/${note.slug}`,
    lastModified: new Date(note.date),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  return [...staticRoutes, ...experimentRoutes, ...noteRoutes];
}
