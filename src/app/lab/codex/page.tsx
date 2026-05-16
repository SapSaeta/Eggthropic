import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { BreadcrumbListJsonLd } from "@/components/JsonLd";
import CodexExplainer from "@/components/CodexExplainer";

export const metadata: Metadata = {
  title: "Codex MCP Plugin — Lab | Eggthropic",
  description:
    "A real MCP server that bridges Claude Code to the OpenAI Codex CLI — three tools to check, run, and ask Codex from within any Claude Code session.",
  alternates: { canonical: "https://www.eggthropic.com/lab/codex" },
  openGraph: {
    title: "Codex MCP Plugin — Eggthropic Lab",
    description:
      "A real MCP server that bridges Claude Code to the OpenAI Codex CLI. Three tools: codex_check, codex_run, codex_ask.",
    url: "https://www.eggthropic.com/lab/codex",
    siteName: "Eggthropic",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Codex MCP Plugin — Eggthropic Lab",
    description:
      "A real MCP server that bridges Claude Code to the OpenAI Codex CLI.",
  },
};

export default function CodexLabPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <BreadcrumbListJsonLd
        items={[
          { name: "Home", url: "https://www.eggthropic.com" },
          { name: "Lab", url: "https://www.eggthropic.com/lab" },
          { name: "Codex MCP Plugin", url: "https://www.eggthropic.com/lab/codex" },
        ]}
      />

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

      {/* Header */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-3">
          <span className="font-mono text-[10px] tracking-widest text-egg-400 uppercase">
            Experiment · Claude Code
          </span>
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-violet-400/10 border border-violet-400/20 text-violet-400 text-[10px] font-mono">
            in-progress · MCP plugin
          </span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">
          Codex MCP Plugin for Claude Code
        </h1>
        <p className="text-slate-400 max-w-2xl leading-relaxed">
          A real MCP server written in TypeScript that bridges Claude Code to the{" "}
          <span className="text-slate-300">OpenAI Codex CLI</span>. Install it once and Claude gains
          three new tools — <code className="px-1 py-0.5 rounded bg-white/5 text-slate-300 text-xs font-mono">codex_check</code>,{" "}
          <code className="px-1 py-0.5 rounded bg-white/5 text-slate-300 text-xs font-mono">codex_run</code>, and{" "}
          <code className="px-1 py-0.5 rounded bg-white/5 text-slate-300 text-xs font-mono">codex_ask</code> — that let it delegate
          coding tasks to Codex or compare both models&apos; approaches side by side.
        </p>

        <div className="flex flex-wrap gap-2 mt-4">
          {["Claude Code", "MCP", "OpenAI Codex CLI", "TypeScript", "JSON-RPC 2.0"].map((tag) => (
            <span
              key={tag}
              className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-[11px] font-mono text-slate-400"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Interactive explainer */}
      <CodexExplainer />

      {/* What this is / is not */}
      <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="glass rounded-xl p-5 border border-emerald-400/10">
          <p className="text-xs font-mono text-emerald-400 uppercase tracking-widest mb-3">
            What this is
          </p>
          <ul className="space-y-2 text-sm text-slate-400">
            {[
              "A real, installable MCP server (TypeScript / Node.js)",
              "Wraps the OpenAI Codex CLI via a subprocess",
              "Three tools: codex_check, codex_run, codex_ask",
              "Communicates via stdio JSON-RPC 2.0 — no open ports",
              "Educational experiment — source in mcp/codex-server/",
            ].map((item) => (
              <li key={item} className="flex items-start gap-2">
                <span className="text-emerald-400 mt-0.5">·</span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="glass rounded-xl p-5 border border-rose-400/10">
          <p className="text-xs font-mono text-rose-400 uppercase tracking-widest mb-3">
            What this is not
          </p>
          <ul className="space-y-2 text-sm text-slate-400">
            {[
              "Not an official Anthropic or OpenAI product",
              "Not a direct API integration (uses the CLI, not the API)",
              "Not a visual studio plugin or IDE extension",
              "Codex CLI requires a paid OpenAI API key",
              "Full-auto mode modifies files — review before running on production",
            ].map((item) => (
              <li key={item} className="flex items-start gap-2">
                <span className="text-rose-400 mt-0.5">·</span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Design decisions */}
      <div className="mt-8 glass rounded-xl p-5 border border-white/8">
        <p className="text-xs font-mono text-slate-500 uppercase tracking-widest mb-3">
          Design decisions
        </p>
        <div className="space-y-3 text-sm text-slate-400 leading-relaxed">
          <p>
            <span className="text-slate-300 font-semibold">Why stdio, not SSE?</span>{" "}
            MCP&apos;s Streamable HTTP (formerly SSE) transport requires a persistent network server and is designed
            for remote, multi-client scenarios. For a local CLI wrapper that Claude Code runs on demand,
            stdio is simpler, requires no port management, and Claude Code handles process lifecycle automatically.
          </p>
          <p>
            <span className="text-slate-300 font-semibold">Why CODEX_QUIET_MODE=1?</span>{" "}
            The Codex CLI renders an interactive TUI by default. In an MCP subprocess, there is no TTY,
            so the TUI never renders correctly. Setting <code className="font-mono text-xs text-slate-300">CODEX_QUIET_MODE=1</code>{" "}
            switches Codex to plain stdout output — the only format that the MCP server can parse and return as structured text.
          </p>
          <p>
            <span className="text-slate-300 font-semibold">Why expose suggest mode separately?</span>{" "}
            Full-auto mode writes files. Suggest mode does not. Giving Claude Code two distinct tools lets it
            choose the right one based on context — analysis tasks use <code className="font-mono text-xs text-slate-300">codex_ask</code>,
            implementation tasks use <code className="font-mono text-xs text-slate-300">codex_run</code>.
          </p>
        </div>
      </div>

      {/* Footer nav */}
      <div className="mt-14 pt-8 border-t border-white/5 flex flex-wrap gap-3">
        <Link
          href="/lab"
          className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-300 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          All lab experiments
        </Link>
        <div className="flex flex-wrap gap-2 ml-auto">
          {[
            { label: "MCP Lab", href: "/lab/mcp" },
            { label: "Skills Lab", href: "/lab/skills" },
            { label: "Execution Lab", href: "/lab/execution" },
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
    </div>
  );
}
