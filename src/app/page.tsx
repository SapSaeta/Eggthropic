import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Code2, Cpu, Network, Palette } from "lucide-react";
import { Hero } from "@/components/Hero";
import { SectionHeader } from "@/components/SectionHeader";
import { ExperimentCard } from "@/components/ExperimentCard";
import { NoteCard } from "@/components/NoteCard";
import { LabPreview } from "@/components/LabPreview";
import { experiments } from "@/lib/experiments";
import { notes } from "@/lib/notes";

export const metadata: Metadata = {
  title: "Eggthropic — Claude Lab",
  description:
    "A practical lab for learning Claude by building real experiments with Claude Code, Agent Skills, MCP, and the Anthropic API.",
};

const labSections = [
  {
    icon: Code2,
    title: "Claude Code Lab",
    description:
      "Experiments using Claude Code — the agentic CLI that reads your codebase, runs commands, and ships committed code across files.",
    href: "/experiments?category=claude-code",
    color: "text-violet-400",
    bg: "bg-violet-500/10",
    border: "border-violet-500/20",
    tag: "claude-code",
  },
  {
    icon: Cpu,
    title: "Agent Skills Lab",
    description:
      "Building portable, reusable Agent Skills: SKILL.md directories that give Claude persistent capabilities across projects and platforms.",
    href: "/experiments?category=skills",
    color: "text-fuchsia-400",
    bg: "bg-fuchsia-500/10",
    border: "border-fuchsia-500/20",
    tag: "skills",
  },
  {
    icon: Network,
    title: "MCP Lab",
    description:
      "Exploring the Model Context Protocol — building servers, clients, and interactive tools around the open JSON-RPC standard.",
    href: "/experiments?category=mcp",
    color: "text-cyan-400",
    bg: "bg-cyan-500/10",
    border: "border-cyan-500/20",
    tag: "mcp",
  },
  {
    icon: Palette,
    title: "UX/UI Experiments",
    description:
      "Prototyping AI-native interface patterns: streaming displays, tool-call visualizations, and interaction models beyond the chat bubble.",
    href: "/experiments?category=ux-ui",
    color: "text-amber-400",
    bg: "bg-amber-500/10",
    border: "border-amber-500/20",
    tag: "ux-ui",
  },
];

export default function HomePage() {
  const latestExperiments = experiments.slice(0, 4);
  const latestNotes = notes.slice(0, 3);

  return (
    <div>
      <Hero experimentCount={experiments.length} noteCount={notes.length} />

      {/* Lab sections */}
      <section className="py-20 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            label="What we explore"
            title="Four labs, one mission"
            description="Each lab focuses on a different layer of the Claude developer ecosystem — from CLI workflows to protocol-level integrations."
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {labSections.map((section) => {
              const Icon = section.icon;
              return (
                <Link
                  key={section.tag}
                  href={section.href}
                  className="glass glass-hover rounded-xl p-5 flex flex-col gap-4 group"
                >
                  <div
                    className={`w-10 h-10 rounded-lg ${section.bg} border ${section.border} flex items-center justify-center`}
                  >
                    <Icon className={`w-5 h-5 ${section.color}`} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white mb-1.5 group-hover:text-egg-300 transition-colors text-sm">
                      {section.title}
                    </h3>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      {section.description}
                    </p>
                  </div>
                  <div
                    className={`mt-auto flex items-center gap-1 text-xs ${section.color} font-mono`}
                  >
                    Explore
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Latest experiments */}
      <section className="py-20 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-10">
            <SectionHeader
              label="Latest experiments"
              title="From the lab"
              description="Each experiment documents the goal, the prompt, what worked, and what failed."
              className="mb-0"
            />
            <Link
              href="/experiments"
              className="hidden sm:flex items-center gap-1.5 text-sm text-egg-400 hover:text-egg-300 transition-colors font-mono"
            >
              All experiments
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {latestExperiments.map((exp, i) => (
              <ExperimentCard key={exp.slug} experiment={exp} index={i} />
            ))}
          </div>

          <div className="mt-6 sm:hidden">
            <Link
              href="/experiments"
              className="inline-flex items-center gap-1.5 text-sm text-egg-400"
            >
              All experiments <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Latest notes */}
      <section className="py-20 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-10">
            <SectionHeader
              label="Latest notes"
              title="Anthropic updates, decoded"
              description="Short articles on Claude and Anthropic developments: what changed, why it matters, what can be built."
              className="mb-0"
            />
            <Link
              href="/notes"
              className="hidden sm:flex items-center gap-1.5 text-sm text-egg-400 hover:text-egg-300 transition-colors font-mono"
            >
              All notes
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {latestNotes.map((note, i) => (
              <NoteCard key={note.slug} note={note} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* Lab preview */}
      <section className="py-20 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <LabPreview />
        </div>
      </section>
    </div>
  );
}
