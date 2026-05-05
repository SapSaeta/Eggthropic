import type { Metadata } from "next";
import Link from "next/link";
import { FlaskConical, GitPullRequest, Shield, Cpu, ArrowRight } from "lucide-react";
import { GithubIcon } from "@/components/GithubIcon";
import LabStatusBoard from "@/components/LabStatusBoard";
import { experiments } from "@/lib/experiments";
import type { BoardExperiment, BoardCategory, BoardDifficulty, BoardStatus } from "@/components/LabStatusBoard";

export const metadata: Metadata = {
  title: "Lab",
  description:
    "Eggthropic Lab — live experiment status board and upcoming community lab for Claude-powered experiments.",
};

// ─── Map our data model → board model ────────────────────────────────────────

const categoryMap: Record<string, BoardCategory> = {
  "claude-code": "Claude Code",
  skills: "Skills",
  mcp: "MCP",
  "ux-ui": "UX-UI",
};

const difficultyMap: Record<string, BoardDifficulty> = {
  beginner: "NOVICE",
  intermediate: "INTERMEDIATE",
  advanced: "ADVANCED",
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
  if (days === 0) return "today";
  if (days === 1) return "1d ago";
  return `${days}d ago`;
}

const boardExperiments: BoardExperiment[] = experiments
  .filter((e) => categoryMap[e.category])
  .map((e, i) => ({
    id: `EXP-${String(i + 1).padStart(3, "0")}`,
    title: e.title,
    category: categoryMap[e.category],
    status: statusMap[e.status] ?? "experimental",
    difficulty: difficultyMap[e.difficulty] ?? "INTERMEDIATE",
    progress: progressMap[e.status] ?? 50,
    lastRun: timeAgo(e.date),
    runId: e.date.replace(/-/g, "").slice(2),
    slug: e.slug,
  }));

// ─── Planned features ─────────────────────────────────────────────────────────

const planned = [
  {
    icon: GitPullRequest,
    title: "PR-based submissions",
    description:
      "Propose an experiment by opening a pull request. If accepted, it runs in the controlled lab environment and results are published.",
    color: "text-violet-400",
    bg: "bg-violet-500/10",
    border: "border-violet-500/20",
  },
  {
    icon: Shield,
    title: "Sandboxed execution",
    description:
      "Experiments run in isolated containers — no access to production systems, no persistent state between runs.",
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
  },
  {
    icon: Cpu,
    title: "Claude-powered",
    description:
      "All lab experiments use the Anthropic API with a shared API key — contributors don't need their own key to submit an experiment.",
    color: "text-cyan-400",
    bg: "bg-cyan-500/10",
    border: "border-cyan-500/20",
  },
  {
    icon: FlaskConical,
    title: "Documented results",
    description:
      "Every accepted experiment is fully documented using the same format as our own experiments — goal, prompt, result, and honest failure analysis.",
    color: "text-egg-400",
    bg: "bg-egg-400/10",
    border: "border-egg-400/20",
  },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function LabPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

      {/* Status board */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-xs font-mono tracking-widest text-egg-400 uppercase flex items-center gap-2">
            <span className="w-4 h-px bg-egg-400/50" />
            Lab Status Board
          </span>
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-egg-400/10 border border-egg-400/20 text-egg-400 text-[10px] font-mono">
            <span className="w-1 h-1 rounded-full bg-egg-400 animate-pulse" />
            live
          </span>
        </div>
        <p className="text-sm text-slate-500 mb-6 max-w-xl">
          Real-time view of all Eggthropic experiments — status, category, progress, and last run.
          Click any card to read the full experiment.
        </p>
        <LabStatusBoard experiments={boardExperiments} />
      </div>

      {/* Community lab section */}
      <div className="mt-20 border-t border-white/5 pt-16">
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="w-14 h-14 rounded-2xl bg-lab-500/30 border border-lab-300/20 flex items-center justify-center">
              <FlaskConical className="w-7 h-7 text-lab-100" />
            </div>
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-egg-400/10 border border-egg-400/20 text-egg-400 text-xs font-mono mb-4">
            Coming soon
          </div>
          <h2 className="text-3xl font-bold text-white mb-3">Community Lab</h2>
          <p className="text-slate-400 leading-relaxed max-w-xl mx-auto">
            Soon: a controlled public lab where contributors can propose
            Claude-powered experiments through GitHub pull requests.
          </p>
        </div>

        <div className="glass rounded-2xl p-6 mb-8 border border-egg-400/10 max-w-2xl mx-auto">
          <h3 className="text-sm font-semibold text-white mb-2">Current status</h3>
          <p className="text-sm text-slate-400 leading-relaxed">
            The Community Lab is in early design. If you're interested in
            contributing to the lab infrastructure itself, open an issue on GitHub.
          </p>
          <div className="mt-4">
            <a
              href="https://github.com/sapsaeta/eggthropic/issues"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm text-egg-400 hover:text-egg-300 transition-colors"
            >
              <GithubIcon className="w-4 h-4" />
              Discuss on GitHub
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto">
          {planned.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.title} className="glass rounded-xl p-5">
                <div className={`w-9 h-9 rounded-lg ${item.bg} border ${item.border} flex items-center justify-center mb-3`}>
                  <Icon className={`w-4 h-4 ${item.color}`} />
                </div>
                <h3 className="font-semibold text-white mb-1.5 text-sm">{item.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{item.description}</p>
              </div>
            );
          })}
        </div>

        <div className="text-center mt-10">
          <Link
            href="/experiments"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg glass border border-white/10 text-white text-sm font-medium hover:border-white/20 transition-colors"
          >
            View all experiments
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
