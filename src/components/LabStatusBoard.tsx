"use client";

import { useState } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

export type BoardCategory = "Claude Code" | "Skills" | "MCP" | "UX-UI";
export type BoardStatus = "complete" | "in-progress" | "experimental";
export type BoardDifficulty = "NOVICE" | "INTERMEDIATE" | "ADVANCED";

export interface BoardExperiment {
  id: string;
  title: string;
  category: BoardCategory;
  status: BoardStatus;
  difficulty: BoardDifficulty;
  progress: number;
  lastRun: string;
  runId: string;
  slug: string;
}

export interface LabStatusBoardProps {
  experiments: BoardExperiment[];
  buildVersion?: string;
  node?: string;
}

// ─── Static config ────────────────────────────────────────────────────────────

const CATEGORIES: BoardCategory[] = ["Claude Code", "Skills", "MCP", "UX-UI"];

const CATEGORY_META: Record<
  BoardCategory,
  { color: string; border: string; text: string; bg: string; icon: string }
> = {
  "Claude Code": {
    color: "#00d4ff",
    border: "border-cyan-400/40",
    text: "text-cyan-400",
    bg: "bg-cyan-400/10",
    icon: "⬡",
  },
  Skills: {
    color: "#a855f7",
    border: "border-purple-500/40",
    text: "text-purple-400",
    bg: "bg-purple-500/10",
    icon: "◈",
  },
  MCP: {
    color: "#f59e0b",
    border: "border-amber-400/40",
    text: "text-amber-400",
    bg: "bg-amber-400/10",
    icon: "⬢",
  },
  "UX-UI": {
    color: "#ec4899",
    border: "border-pink-500/40",
    text: "text-pink-400",
    bg: "bg-pink-500/10",
    icon: "◉",
  },
};

const STATUS_META: Record<
  BoardStatus,
  { label: string; dot: string; text: string; glow: string }
> = {
  complete: {
    label: "COMPLETE",
    dot: "bg-emerald-400",
    text: "text-emerald-400",
    glow: "shadow-[0_0_8px_#34d399]",
  },
  "in-progress": {
    label: "IN-PROGRESS",
    dot: "bg-blue-400",
    text: "text-blue-400",
    glow: "shadow-[0_0_8px_#60a5fa]",
  },
  experimental: {
    label: "EXPERIMENTAL",
    dot: "bg-amber-400",
    text: "text-amber-400",
    glow: "shadow-[0_0_8px_#fbbf24]",
  },
};

// ─── Sub-components ───────────────────────────────────────────────────────────

function PulseDot({ status }: { status: BoardStatus }) {
  const meta = STATUS_META[status];
  return (
    <span className="relative inline-flex h-2 w-2">
      <span
        className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-75 ${meta.dot}`}
      />
      <span
        className={`relative inline-flex h-2 w-2 rounded-full ${meta.dot} ${meta.glow}`}
      />
    </span>
  );
}

function CategoryPill({ category }: { category: BoardCategory }) {
  const meta = CATEGORY_META[category];
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 font-mono text-[10px] font-medium tracking-wider ${meta.border} ${meta.text} ${meta.bg}`}
    >
      <span>{meta.icon}</span>
      {category.toUpperCase()}
    </span>
  );
}

function DifficultyBadge({ difficulty }: { difficulty: BoardDifficulty }) {
  const colors: Record<BoardDifficulty, string> = {
    NOVICE: "border-slate-500/40 text-slate-400 bg-slate-500/10",
    INTERMEDIATE: "border-sky-500/30 text-sky-300 bg-sky-500/10",
    ADVANCED: "border-rose-500/30 text-rose-300 bg-rose-500/10",
  };
  return (
    <span
      className={`inline-flex items-center rounded border px-2 py-0.5 font-mono text-[10px] font-medium tracking-widest ${colors[difficulty]}`}
    >
      {difficulty}
    </span>
  );
}

function ProgressBar({
  progress,
  category,
}: {
  progress: number;
  category: BoardCategory;
}) {
  const meta = CATEGORY_META[category];
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <span className="font-mono text-[10px] tracking-widest text-slate-500">
          PROGRESS
        </span>
        <span className={`font-mono text-xs font-semibold ${meta.text}`}>
          {progress}%
        </span>
      </div>
      <div className="h-1 w-full overflow-hidden rounded-full bg-white/5">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{
            width: `${progress}%`,
            backgroundColor: meta.color,
            boxShadow: `0 0 6px ${meta.color}80`,
          }}
        />
      </div>
    </div>
  );
}

function ExperimentCard({ exp }: { exp: BoardExperiment }) {
  const catMeta = CATEGORY_META[exp.category];
  const statusMeta = STATUS_META[exp.status];

  return (
    <a
      href={`/experiments/${exp.slug}`}
      className="group relative flex flex-col gap-3 overflow-hidden rounded-xl border border-white/[0.08] bg-white/[0.03] p-4 backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] hover:border-white/20 cursor-pointer"
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLAnchorElement).style.boxShadow =
          `0 0 20px ${catMeta.color}30, inset 0 0 20px ${catMeta.color}08`;
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLAnchorElement).style.boxShadow = "";
      }}
    >
      {/* Category accent top bar */}
      <div
        className="absolute inset-x-0 top-0 h-[2px] rounded-t-xl"
        style={{
          backgroundColor: catMeta.color,
          boxShadow: `0 0 8px ${catMeta.color}`,
        }}
      />

      {/* Header row */}
      <div className="flex items-start justify-between gap-2 pt-1">
        <span className="font-mono text-[10px] tracking-widest text-slate-600">
          {exp.id}
        </span>
        <div className={`flex items-center gap-1.5 ${statusMeta.text}`}>
          <PulseDot status={exp.status} />
          <span className="font-mono text-[10px] font-semibold tracking-widest">
            {statusMeta.label}
          </span>
        </div>
      </div>

      {/* Title */}
      <h3 className="text-sm font-bold leading-snug text-white group-hover:text-[#ffd21a] transition-colors">
        {exp.title}
      </h3>

      {/* Badges row */}
      <div className="flex flex-wrap items-center gap-2">
        <CategoryPill category={exp.category} />
        <DifficultyBadge difficulty={exp.difficulty} />
      </div>

      {/* Progress bar */}
      <ProgressBar progress={exp.progress} category={exp.category} />

      {/* Footer */}
      <div className="flex items-center justify-between border-t border-white/5 pt-2">
        <span className="font-mono text-[10px] text-slate-600">
          RUN · {exp.runId}
        </span>
        <span className="flex items-center gap-1 font-mono text-[10px] text-slate-500">
          <svg className="h-2.5 w-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
          LAST RUN · {exp.lastRun}
        </span>
      </div>
    </a>
  );
}

// ─── Sidebar ──────────────────────────────────────────────────────────────────

function Sidebar({ experiments }: { experiments: BoardExperiment[] }) {
  const counts = CATEGORIES.reduce(
    (acc, cat) => ({ ...acc, [cat]: experiments.filter((e) => e.category === cat).length }),
    {} as Record<BoardCategory, number>
  );

  const statusCounts = {
    complete: experiments.filter((e) => e.status === "complete").length,
    "in-progress": experiments.filter((e) => e.status === "in-progress").length,
    experimental: experiments.filter((e) => e.status === "experimental").length,
  };

  const avgCompletion =
    experiments.length > 0
      ? Math.round(experiments.reduce((s, e) => s + e.progress, 0) / experiments.length)
      : 0;

  return (
    <aside className="flex w-44 shrink-0 flex-col gap-4">
      <div className="rounded-xl border border-white/[0.08] bg-white/[0.03] p-4">
        <p className="mb-3 font-mono text-[9px] tracking-[0.2em] text-slate-600">// CATEGORIES</p>
        <ul className="space-y-2.5">
          {CATEGORIES.map((cat) => {
            const meta = CATEGORY_META[cat];
            return (
              <li key={cat} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className={`text-sm ${meta.text}`} style={{ textShadow: `0 0 8px ${meta.color}` }}>
                    {meta.icon}
                  </span>
                  <span className={`font-mono text-[11px] font-medium ${meta.text}`}>{cat}</span>
                </div>
                <span className="flex h-4 w-4 items-center justify-center rounded-full bg-white/5 font-mono text-[9px] text-slate-400">
                  {counts[cat]}
                </span>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="rounded-xl border border-white/[0.08] bg-white/[0.03] p-4">
        <p className="mb-3 font-mono text-[9px] tracking-[0.2em] text-slate-600">STATUS ROLL-UP</p>
        <ul className="space-y-1.5">
          {(["complete", "in-progress", "experimental"] as BoardStatus[]).map((s) => (
            <li key={s} className="flex items-center justify-between">
              <span className={`font-mono text-[10px] tracking-wider ${STATUS_META[s].text}`}>
                {STATUS_META[s].label}
              </span>
              <span className="font-mono text-xs font-semibold text-white">{statusCounts[s]}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="rounded-xl border border-white/[0.08] bg-white/[0.03] p-4">
        <p className="mb-3 font-mono text-[9px] tracking-[0.2em] text-slate-600">LAB HEALTH</p>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] tracking-wider text-slate-500">AVG · COMPLETION</span>
            <span className="font-mono text-xs font-bold text-[#ffd21a]">{avgCompletion}%</span>
          </div>
          <div className="h-1 w-full overflow-hidden rounded-full bg-white/5">
            <div
              className="h-full rounded-full bg-[#ffd21a] transition-all duration-700"
              style={{ width: `${avgCompletion}%` }}
            />
          </div>
        </div>
      </div>
    </aside>
  );
}

// ─── Top bar ──────────────────────────────────────────────────────────────────

function TopBar({
  experiments,
  activeFilter,
  onFilterChange,
}: {
  experiments: BoardExperiment[];
  activeFilter: BoardCategory | "ALL";
  onFilterChange: (f: BoardCategory | "ALL") => void;
}) {
  const filters: (BoardCategory | "ALL")[] = ["ALL", ...CATEGORIES];

  return (
    <header className="flex items-center justify-between gap-4 border-b border-white/[0.06] px-6 py-3">
      <div className="flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#ffd21a]/30 bg-[#ffd21a]/10">
          <span className="text-lg">🥚</span>
        </div>
        <div className="font-mono">
          <span className="text-sm font-bold tracking-widest text-white">EGGTHROPIC</span>
          <span className="mx-2 text-sm text-slate-600">//</span>
          <span className="text-sm font-semibold tracking-widest text-[#ffd21a]">LAB STATUS</span>
        </div>
      </div>

      <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-1.5">
        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
        <span className="font-mono text-xs tracking-widest text-slate-400">EXPERIMENTS</span>
        <span className="font-mono text-sm font-bold text-white">
          {String(experiments.length).padStart(2, "0")}
        </span>
        <span className="font-mono text-xs tracking-widest text-slate-600">ACTIVE</span>
      </div>

      <nav className="flex items-center gap-1">
        {filters.map((f) => {
          const isActive = activeFilter === f;
          const catMeta = f !== "ALL" ? CATEGORY_META[f] : null;
          return (
            <button
              key={f}
              onClick={() => onFilterChange(f)}
              className={[
                "relative rounded-md px-3 py-1.5 font-mono text-[11px] font-semibold tracking-widest transition-all duration-200",
                isActive ? "text-[#ffd21a]" : "text-slate-500 hover:text-slate-300",
              ].join(" ")}
            >
              {f === "ALL" ? "ALL" : f.toUpperCase().replace("-", "‑")}
              {isActive && (
                <span className="absolute inset-x-1 bottom-0 h-[2px] rounded-full bg-[#ffd21a]" />
              )}
              {isActive && catMeta && (
                <span
                  className="absolute inset-0 rounded-md opacity-10"
                  style={{ backgroundColor: catMeta.color }}
                />
              )}
            </button>
          );
        })}
      </nav>
    </header>
  );
}

// ─── Grid background ──────────────────────────────────────────────────────────

function GridBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      <svg className="absolute inset-0 h-full w-full opacity-[0.04]" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="lab-grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#lab-grid)" />
      </svg>
    </div>
  );
}

// ─── Bottom status bar ────────────────────────────────────────────────────────

function StatusBar({
  showing,
  total,
  buildVersion,
  node,
}: {
  showing: number;
  total: number;
  buildVersion: string;
  node: string;
}) {
  return (
    <footer className="flex items-center justify-between border-t border-white/[0.06] px-6 py-2">
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
          <span className="font-mono text-[10px] tracking-widest text-slate-500">TELEMETRY ONLINE</span>
        </div>
        <span className="font-mono text-[10px] tracking-widest text-slate-600">
          SHOWING <span className="text-[#ffd21a]">{showing}/{total}</span>
        </span>
      </div>
      <div className="flex items-center gap-6">
        <span className="font-mono text-[10px] tracking-widest text-slate-600">
          BUILD <span className="text-slate-400">{buildVersion}</span>
        </span>
        <span className="font-mono text-[10px] tracking-widest text-slate-600">
          NODE <span className="text-slate-400">{node}</span>
        </span>
        <span className="font-mono text-[10px] tracking-widest text-slate-600">
          EGGTHROPIC LABS · CLEARANCE LV-3
        </span>
      </div>
    </footer>
  );
}

// ─── Root component ───────────────────────────────────────────────────────────

export default function LabStatusBoard({
  experiments,
  buildVersion = "v0.1.0-canary",
  node = "lab-east-1",
}: LabStatusBoardProps) {
  const [activeFilter, setActiveFilter] = useState<BoardCategory | "ALL">("ALL");

  const filtered =
    activeFilter === "ALL"
      ? experiments
      : experiments.filter((e) => e.category === activeFilter);

  return (
    <div
      className="relative flex flex-col overflow-hidden font-mono rounded-2xl border border-white/[0.06]"
      style={{ backgroundColor: "#080c14", minHeight: "600px" }}
    >
      <GridBackground />

      <TopBar
        experiments={experiments}
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
      />

      <div className="relative flex min-h-0 flex-1 gap-4 overflow-hidden p-4">
        <Sidebar experiments={experiments} />

        <main className="flex flex-1 flex-col gap-3 overflow-y-auto">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-3">
              <span className="font-mono text-[10px] tracking-widest text-slate-600">[ ACTIVE ]</span>
              <h2 className="text-sm font-bold tracking-wide text-white">Experiment Roster</h2>
            </div>
            <span className="font-mono text-[10px] tracking-widest text-slate-600">
              SHOWING <span className="text-slate-400">{filtered.length} / {experiments.length}</span>
              {" · "}FILTER: <span className="text-[#ffd21a]">{activeFilter}</span>
            </span>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {filtered.map((exp) => (
              <ExperimentCard key={exp.id} exp={exp} />
            ))}
            {filtered.length === 0 && (
              <div className="col-span-3 flex h-40 items-center justify-center rounded-xl border border-white/[0.06]">
                <p className="font-mono text-sm text-slate-600">NO EXPERIMENTS MATCH FILTER</p>
              </div>
            )}
          </div>
        </main>
      </div>

      <StatusBar
        showing={filtered.length}
        total={experiments.length}
        buildVersion={buildVersion}
        node={node}
      />
    </div>
  );
}
