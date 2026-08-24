import type { Metadata } from "next";
import { SectionHeader } from "@/components/SectionHeader";
import { ExperimentsClient } from "@/components/ExperimentsClient";
import { experiments } from "@/lib/experiments";
import { notes } from "@/lib/notes";
import { toBoardExperiments } from "@/lib/board";
import type { ExperimentCategory } from "@/types";

export const metadata: Metadata = {
  title: "Experimentos",
  description:
    "Todos los experimentos de Eggthropic — Claude Code, Agent Skills, MCP y UX/UI. Cada uno documenta el objetivo, el prompt, lo que funcionó y lo que falló.",
  alternates: { canonical: "https://www.eggthropic.com/experiments" },
  openGraph: {
    title: "Experimentos — Eggthropic",
    description:
      "Todos los experimentos de Eggthropic — Claude Code, Agent Skills, MCP y UX/UI. Cada uno documenta el objetivo, el prompt, lo que funcionó y lo que falló.",
    url: "https://www.eggthropic.com/experiments",
    siteName: "Eggthropic",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Experimentos — Eggthropic",
    description:
      "Todos los experimentos de Eggthropic — Claude Code, Agent Skills, MCP y UX/UI. Cada uno documenta el objetivo, el prompt, lo que funcionó y lo que falló.",
  },
};

interface Props {
  searchParams: Promise<{ category?: string; q?: string; view?: string }>;
}

export default async function ExperimentsPage({ searchParams }: Props) {
  const { category, view } = await searchParams;
  const validCategories: Array<"all" | ExperimentCategory> = [
    "all", "claude-code", "skills", "mcp", "api", "ux-ui", "automation", "enterprise-ai", "sap",
  ];
  const initialCategory = validCategories.includes(category as ExperimentCategory)
    ? (category as "all" | ExperimentCategory)
    : "all";
  const initialView = view === "board" || view === "notes" ? view : "cards";
  const boardExperiments = toBoardExperiments(experiments);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <SectionHeader
        as="h1"
        label="Experimentos"
        title="Qué hemos construido y documentado"
        description="Cada experimento incluye objetivo, contexto, herramientas, prompts, notas de implementación, resultados y un análisis honesto de los fallos."
      />
      <ExperimentsClient
        experiments={experiments}
        notes={notes}
        boardExperiments={boardExperiments}
        initialCategory={initialCategory}
        initialView={initialView}
      />
    </div>
  );
}
