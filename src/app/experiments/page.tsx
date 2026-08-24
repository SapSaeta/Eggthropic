import type { Metadata } from "next";
import { SectionHeader } from "@/components/SectionHeader";
import { ExperimentsClient } from "@/components/ExperimentsClient";
import { experiments } from "@/lib/experiments";
import { notes } from "@/lib/notes";
import type { ExperimentCategory } from "@/types";
import type { BoardExperiment, BoardCategory, BoardDifficulty, BoardStatus } from "@/components/LabStatusBoard";

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

// ─── Tablón: mismo mapeo que usaba /lab ─────────────────────────────────────

const categoryMap: Record<string, BoardCategory> = {
  "claude-code": "Claude Code",
  skills: "Skills",
  mcp: "MCP",
  "ux-ui": "UX-UI",
  sap: "SAP",
  "enterprise-ai": "SAP",
};

const difficultyMap: Record<string, BoardDifficulty> = {
  beginner: "INICIAL",
  intermediate: "INTERMEDIO",
  advanced: "AVANZADO",
};

const statusMap: Record<string, BoardStatus> = {
  complete: "complete",
  "in-progress": "in-progress",
  experimental: "experimental",
  archived: "complete",
};

const progressMap: Record<string, number> = {
  complete: 100,
  "in-progress": 65,
  experimental: 30,
  archived: 100,
};

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return "hoy";
  if (days === 1) return "hace 1 d";
  return `hace ${days} d`;
}

const boardExperiments: BoardExperiment[] = experiments
  .filter((e) => categoryMap[e.category])
  .map((e, i) => ({
    id: `EXP-${String(i + 1).padStart(3, "0")}`,
    title: e.title,
    category: categoryMap[e.category],
    status: statusMap[e.status] ?? "experimental",
    difficulty: difficultyMap[e.difficulty] ?? "INTERMEDIO",
    progress: progressMap[e.status] ?? 50,
    lastRun: timeAgo(e.date),
    runId: e.date.replace(/-/g, "").slice(2),
    slug: e.slug,
  }));

export default async function ExperimentsPage({ searchParams }: Props) {
  const { category, view } = await searchParams;
  const validCategories: Array<"all" | ExperimentCategory> = [
    "all", "claude-code", "skills", "mcp", "api", "ux-ui", "automation", "enterprise-ai", "sap",
  ];
  const initialCategory = validCategories.includes(category as ExperimentCategory)
    ? (category as "all" | ExperimentCategory)
    : "all";
  const initialView = view === "board" || view === "notes" ? view : "cards";

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
