import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { BreadcrumbListJsonLd } from "@/components/JsonLd";
import ExecutionShell from "@/components/ExecutionLab/ExecutionShell";

export const metadata: Metadata = {
  title: "Claude Execution Lab — Visual Agent Workflow Simulator | Eggthropic",
  description:
    "Interactive visualization of Claude Code, MCP, and Agent Skills workflows using simulated execution traces. An educational experiment by Eggthropic.",
  alternates: { canonical: "https://www.eggthropic.com/lab/execution" },
  openGraph: {
    title: "Claude Execution Lab — Visual Agent Workflow Simulator | Eggthropic",
    description:
      "Interactive visualization of Claude Code, MCP, and Agent Skills workflows using simulated execution traces.",
    url: "https://www.eggthropic.com/lab/execution",
    siteName: "Eggthropic",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Claude Execution Lab — Visual Agent Workflow Simulator | Eggthropic",
    description:
      "Interactive visualization of Claude Code, MCP, and Agent Skills workflows using simulated execution traces.",
  },
};

export default function ExecutionLabPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <BreadcrumbListJsonLd
        items={[
          { name: "Home", url: "https://www.eggthropic.com" },
          { name: "Lab", url: "https://www.eggthropic.com/lab" },
          { name: "Claude Execution Lab", url: "https://www.eggthropic.com/lab/execution" },
        ]}
      />

      <div className="mb-8">
        <Link
          href="/lab"
          className="inline-flex items-center gap-1.5 text-xs font-mono text-slate-500 hover:text-slate-300 transition-colors mb-8"
        >
          <ArrowLeft className="w-3 h-3" />
          Back to Lab
        </Link>

        <div className="flex items-center gap-3 mb-2 mt-6">
          <span className="font-mono text-[10px] tracking-widest text-egg-400 uppercase">
            Experiment · Execution Visualization
          </span>
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-rose-400/10 border border-rose-400/20 text-rose-400 text-[10px] font-mono">
            educational · not official
          </span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">Claude Execution Lab</h1>
        <p className="text-slate-400 max-w-2xl leading-relaxed">
          A visual simulator for three common agentic workflow patterns — Claude Code, MCP tool calls, and Agent Skills invocations.
          Select a mode, run the simulation, and trace each execution phase.{" "}
          <span className="text-slate-500">
            This is an educational visualization by Eggthropic. It does not reveal Claude&apos;s private reasoning or internal architecture.
          </span>
        </p>
      </div>

      <ExecutionShell />

      {/* Internal links */}
      <div className="mt-16 pt-8 border-t border-white/5">
        <p className="font-mono text-[10px] tracking-widest text-slate-600 uppercase mb-4">
          Explore the underlying topics
        </p>
        <div className="flex flex-wrap gap-3">
          {[
            { label: "MCP Visual Explainer", href: "/lab/mcp" },
            { label: "Agent Skills Explainer", href: "/lab/skills" },
            { label: "All Claude Interfaces", href: "/lab/interfaces" },
            { label: "Claude Code Experiment", href: "/experiments/claude-code-landing-page-builder" },
            { label: "Build Your First Skill", href: "/experiments/first-custom-agent-skill" },
          ].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg glass border border-white/8 text-xs font-mono text-slate-400 hover:text-slate-200 hover:border-white/16 transition-all"
            >
              {link.label}
              <ArrowRight className="w-3 h-3" />
            </Link>
          ))}
        </div>
      </div>

      {/* Footer nav */}
      <div className="mt-8 flex items-center">
        <Link
          href="/lab"
          className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-300 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          All lab experiments
        </Link>
      </div>
    </div>
  );
}
