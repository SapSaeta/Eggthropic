import type { MetadataRoute } from "next";
import { experiments } from "@/lib/experiments";
import { notes } from "@/lib/notes";

const BASE_URL = "https://www.eggthropic.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: `${BASE_URL}/experiments`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE_URL}/notes`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE_URL}/lab`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE_URL}/about`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
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
