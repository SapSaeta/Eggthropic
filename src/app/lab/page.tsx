import type { Metadata } from "next";
import Link from "next/link";
import { FlaskConical, GitPullRequest, Shield, Cpu, ArrowRight } from "lucide-react";
import { GithubIcon } from "@/components/GithubIcon";
import LabStatusBoard from "@/components/LabStatusBoard";
import MCPExplainer from "@/components/MCPExplainer";
import SkillsExplainer from "@/components/SkillsExplainer";
import ClaudeInterfacesExplainer from "@/components/ClaudeInterfacesExplainer";
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

      {/* Page header */}
      <div className="mb-12">
        <span className="inline-flex items-center gap-2 text-xs font-mono tracking-widest text-egg-400 uppercase mb-3">
          <span className="w-6 h-px bg-egg-400/50" />
          Lab
          <span className="w-6 h-px bg-egg-400/50" />
        </span>
        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">What's being built here</h1>
        <p className="text-slate-400 max-w-2xl leading-relaxed">
          The lab is where Eggthropic experiments with tools before writing about them.
          Each section below corresponds to a different experiment or area under active development.
        </p>
      </div>

      {/* ── Section 1: Claude Design prototype ─────────────────────────────── */}
      <section className="mb-20">
        <div className="flex items-start justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="font-mono text-[10px] tracking-widest text-rose-400 uppercase">
                Experiment · Claude Design
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-rose-400/10 border border-rose-400/20 text-rose-400 text-[10px] font-mono">
                research preview
              </span>
            </div>
            <h2 className="text-xl font-semibold text-white mb-1">Lab Status Board</h2>
            <p className="text-sm text-slate-400 max-w-xl leading-relaxed">
              This dashboard was prototyped using{" "}
              <a
                href="https://www.anthropic.com/news/claude-design-anthropic-labs"
                target="_blank"
                rel="noopener noreferrer"
                className="text-rose-400 hover:text-rose-300 transition-colors"
              >
                Claude Design
              </a>{" "}
              (Anthropic Labs) and implemented in React + Tailwind. It maps all
              Eggthropic experiments to a mission-control style board — category
              color-coded, filterable, and linked to each experiment's full page.
            </p>
          </div>
          <Link
            href="/experiments/claude-design-prototype-to-code"
            className="hidden sm:inline-flex items-center gap-1.5 text-xs font-mono text-rose-400 hover:text-rose-300 transition-colors whitespace-nowrap"
          >
            Read the experiment
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        <LabStatusBoard experiments={boardExperiments} />

        <div className="mt-3 sm:hidden">
          <Link
            href="/experiments/claude-design-prototype-to-code"
            className="inline-flex items-center gap-1.5 text-xs font-mono text-rose-400"
          >
            Read the experiment <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </section>

      {/* ── Section 2: MCP Visual Explainer ────────────────────────────────── */}
      <section className="border-t border-white/5 pt-16 mb-20">
        <div className="flex items-start justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="font-mono text-[10px] tracking-widest text-cyan-400 uppercase">
                Experiment · MCP
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-cyan-400/10 border border-cyan-400/20 text-cyan-400 text-[10px] font-mono">
                interactive
              </span>
            </div>
            <h2 className="text-xl font-semibold text-white mb-1">MCP Visual Explainer</h2>
            <p className="text-sm text-slate-400 max-w-xl leading-relaxed">
              An interactive diagram that maps how an MCP server, client, and host communicate.
              Explore the architecture, the three core primitives, and a JSON-RPC 2.0 message
              trace — all without leaving the browser.
            </p>
          </div>
          <Link
            href="/lab/mcp"
            className="hidden sm:inline-flex items-center gap-1.5 text-xs font-mono text-cyan-400 hover:text-cyan-300 transition-colors whitespace-nowrap"
          >
            Open full page
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        <MCPExplainer />

        <div className="mt-3 flex items-center gap-4">
          <Link
            href="/lab/mcp"
            className="sm:hidden inline-flex items-center gap-1.5 text-xs font-mono text-cyan-400"
          >
            Open full page <ArrowRight className="w-3 h-3" />
          </Link>
          <Link
            href="/experiments/mcp-visual-explainer"
            className="inline-flex items-center gap-1.5 text-xs font-mono text-slate-500 hover:text-slate-300 transition-colors"
          >
            Read the experiment write-up <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </section>

      {/* ── Section 3: Agent Skills Explainer ──────────────────────────────── */}
      <section className="border-t border-white/5 pt-16 mb-20">
        <div className="flex items-start justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="font-mono text-[10px] tracking-widest text-egg-400 uppercase">
                Experiment · Agent Skills
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-egg-400/10 border border-egg-400/20 text-egg-400 text-[10px] font-mono">
                interactive
              </span>
            </div>
            <h2 className="text-xl font-semibold text-white mb-1">Agent Skills Explainer</h2>
            <p className="text-sm text-slate-400 max-w-xl leading-relaxed">
              Skills are directories with a SKILL.md file that give Claude persistent, portable
              capabilities — auto-registered as slash commands. Explore their file structure,
              frontmatter anatomy, and a live invocation trace from{" "}
              <code className="px-1 py-0.5 rounded bg-white/5 text-slate-300 font-mono text-xs">/pr-describe</code>
              {" "}to a structured PR description.
            </p>
          </div>
          <Link
            href="/lab/skills"
            className="hidden sm:inline-flex items-center gap-1.5 text-xs font-mono text-egg-400 hover:text-egg-300 transition-colors whitespace-nowrap"
          >
            Open full page
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        <SkillsExplainer />

        <div className="mt-3 flex items-center gap-4">
          <Link
            href="/lab/skills"
            className="sm:hidden inline-flex items-center gap-1.5 text-xs font-mono text-egg-400"
          >
            Open full page <ArrowRight className="w-3 h-3" />
          </Link>
          <Link
            href="/experiments/first-custom-agent-skill"
            className="inline-flex items-center gap-1.5 text-xs font-mono text-slate-500 hover:text-slate-300 transition-colors"
          >
            Read the experiment write-up <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </section>

      {/* ── Section 4: Claude Surfaces ─────────────────────────────────────── */}
      <section className="border-t border-white/5 pt-16 mb-20">
        <div className="flex items-start justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="font-mono text-[10px] tracking-widest text-egg-400 uppercase">
                Experiment · Claude Surfaces
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-egg-400/10 border border-egg-400/20 text-egg-400 text-[10px] font-mono">
                interactive
              </span>
            </div>
            <h2 className="text-xl font-semibold text-white mb-1">All Ways to Use Claude</h2>
            <p className="text-sm text-slate-400 max-w-xl leading-relaxed">
              A complete directory of every official Claude surface — web, mobile, terminal,
              IDE extensions, API, enterprise, and Labs. Filter by category, copy setup
              commands, or find the right tool for your workflow.
            </p>
          </div>
          <Link
            href="/lab/interfaces"
            className="hidden sm:inline-flex items-center gap-1.5 text-xs font-mono text-egg-400 hover:text-egg-300 transition-colors whitespace-nowrap"
          >
            Open full page
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        <ClaudeInterfacesExplainer />

        <div className="mt-3">
          <Link
            href="/lab/interfaces"
            className="sm:hidden inline-flex items-center gap-1.5 text-xs font-mono text-egg-400"
          >
            Open full page <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </section>

      {/* ── Section 5: Community Lab ────────────────────────────────────────── */}
      <section className="border-t border-white/5 pt-16">
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-2">
            <span className="font-mono text-[10px] tracking-widest text-slate-500 uppercase">
              Next up
            </span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-500/10 border border-slate-500/20 text-slate-400 text-[10px] font-mono">
              coming soon
            </span>
          </div>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-xl bg-lab-500/30 border border-lab-300/20 flex items-center justify-center">
              <FlaskConical className="w-4 h-4 text-lab-100" />
            </div>
            <h2 className="text-xl font-semibold text-white">Community Lab</h2>
          </div>
          <p className="text-slate-400 leading-relaxed max-w-xl">
            A controlled public lab where contributors can propose Claude-powered
            experiments through GitHub pull requests — sandboxed, documented, and published.
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

        <div className="mt-8">
          <Link
            href="/experiments"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg glass border border-white/10 text-white text-sm font-medium hover:border-white/20 transition-colors"
          >
            View all experiments
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
