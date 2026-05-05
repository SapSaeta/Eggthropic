import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import ClaudeInterfacesExplainer from "@/components/ClaudeInterfacesExplainer";

export const metadata: Metadata = {
  title: "All Ways to Use Claude — Lab",
  description:
    "An interactive directory of every official way to access Claude — web, mobile, terminal, IDE extensions, browser, API, enterprise, and Anthropic Labs. Filter by category, copy setup commands, or find the right surface for your workflow.",
};

export default function InterfacesLabPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

      {/* Breadcrumb */}
      <div className="mb-8">
        <Link
          href="/lab"
          className="inline-flex items-center gap-1.5 text-xs font-mono text-slate-500 hover:text-slate-300 transition-colors"
        >
          <ArrowLeft className="w-3 h-3" />
          Back to Lab
        </Link>
      </div>

      {/* Page header */}
      <div className="mb-12">
        <div className="flex items-center gap-3 mb-2">
          <span className="font-mono text-[10px] tracking-widest text-egg-400 uppercase">
            Experiment · Claude Surfaces
          </span>
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-egg-400/10 border border-egg-400/20 text-egg-400 text-[10px] font-mono">
            interactive
          </span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">
          All Ways to Use Claude
        </h1>
        <p className="text-slate-400 max-w-2xl leading-relaxed">
          A complete interactive directory of every official Claude surface — from claude.ai and mobile apps to Claude Code CLI, IDE extensions, the Anthropic API, enterprise tiers, and Anthropic Labs products.
          Filter by category, copy setup commands directly, or use the "Find Your Fit" guide to find the right tool for your workflow.
        </p>
      </div>

      {/* Explainer */}
      <ClaudeInterfacesExplainer />

      {/* Footer nav */}
      <div className="mt-16 pt-8 border-t border-white/5">
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
