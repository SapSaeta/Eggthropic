import type { MetadataRoute } from "next";
import { experiments } from "@/lib/experiments";
import { notes } from "@/lib/notes";
import { artefactos } from "@/lib/artifacts";

const BASE_URL = "https://www.eggthropic.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: new Date("2026-05-08"), changeFrequency: "weekly", priority: 1 },
    { url: `${BASE_URL}/experiments`, lastModified: new Date("2026-05-08"), changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE_URL}/notes`, lastModified: new Date("2026-05-08"), changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE_URL}/lab`, lastModified: new Date("2026-05-07"), changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE_URL}/sap`, lastModified: new Date("2026-07-07"), changeFrequency: "weekly", priority: 0.85 },
    { url: `${BASE_URL}/artefactos`, lastModified: new Date("2026-08-24"), changeFrequency: "weekly", priority: 0.85 },
    { url: `${BASE_URL}/about`, lastModified: new Date("2026-04-01"), changeFrequency: "monthly", priority: 0.7 },
  ];

  const experimentRoutes: MetadataRoute.Sitemap = experiments.map((exp) => ({
    url: `${BASE_URL}/experiments/${exp.slug}`,
    lastModified: new Date(exp.date),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  const artefactoRoutes: MetadataRoute.Sitemap = artefactos.map((a) => ({
    url: `${BASE_URL}/artefactos/${a.slug}`,
    lastModified: new Date(a.fecha),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  const noteRoutes: MetadataRoute.Sitemap = notes.map((note) => ({
    url: `${BASE_URL}/notes/${note.slug}`,
    lastModified: new Date(note.date),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  return [...staticRoutes, ...experimentRoutes, ...artefactoRoutes, ...noteRoutes];
}
