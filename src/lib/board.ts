import type { Experiment } from "@/types";
import type { BoardExperiment, BoardCategory, BoardDifficulty, BoardStatus } from "@/components/LabStatusBoard";

// ─── Tablón: mapea Experiment -> BoardExperiment para el LabStatusBoard ──────

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

export function toBoardExperiments(experiments: Experiment[]): BoardExperiment[] {
  return experiments
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
}
