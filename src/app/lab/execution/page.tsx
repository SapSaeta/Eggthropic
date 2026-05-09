import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { BreadcrumbListJsonLd, FaqJsonLd } from "@/components/JsonLd";
import ExecutionShell from "@/components/ExecutionLab/ExecutionShell";

export const metadata: Metadata = {
  title: "Claude Execution Lab — Visual Agent Workflow Simulator | Eggthropic",
  description:
    "Interactive visualization of Claude Code, MCP, and Agent Skills workflows using simulated execution traces. Learn how agentic AI systems decompose tasks — without real API calls.",
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

const FAQ_ITEMS = [
  {
    q: "Is this connected to the real Claude API?",
    a: "No. The Claude Execution Lab uses simulated execution traces only. No API calls are made, no keys are required, and no real model inference runs in the browser.",
  },
  {
    q: "Does this show Claude's private reasoning?",
    a: "No. It visualizes external workflow patterns that are common in agentic systems — not private chain-of-thought, internal model state, or any form of actual Claude reasoning.",
  },
  {
    q: "Can Claude Code actually edit files and run commands?",
    a: "Claude Code can work with codebases and perform actions such as reading files, making edits, and running shell commands — depending on your environment configuration, permissions granted, and explicit user approval at each step. Real behavior depends on your setup.",
  },
  {
    q: "Is MCP only for Anthropic?",
    a: "No. MCP (Model Context Protocol) is an open protocol for connecting AI systems to external tools and data sources. It is not Anthropic-exclusive — it has broad adoption across the AI ecosystem and official SDKs for all major languages.",
  },
  {
    q: "Are Agent Skills the same as prompts?",
    a: "No. Agent Skills package task-specific instructions, supporting scripts, and resources into reusable directory-based capabilities invocable as slash commands. They are more structured than a prompt and can include helper scripts. Availability and behavior can vary by Claude surface and setup.",
  },
];

const CALLOUTS = [
  {
    title: "Agentic ≠ autonomous without review",
    body: "Agentic systems make decisions and take actions — but human review before committing, merging, or shipping remains essential.",
    href: "/lab/execution#safety",
    linkLabel: "See Trust & Safety →",
  },
  {
    title: "MCP servers are integrations, not magic",
    body: "MCP is an open protocol. Every MCP server is external code that your agent trusts. Audit sources, limit permissions, validate responses.",
    href: "/lab/mcp",
    linkLabel: "MCP Visual Explainer →",
  },
  {
    title: "Skills are reusable task instructions",
    body: "A skill packages a workflow into a directory with a SKILL.md. It's not a plugin marketplace — it's structured instructions the agent loads on demand.",
    href: "/lab/skills",
    linkLabel: "Agent Skills Explainer →",
  },
  {
    title: "Green checks ≠ code review",
    body: "Lint and build passing means the code compiles. It does not mean it is correct, secure, or matches your intent. Always read generated diffs.",
    href: "/experiments/claude-code-landing-page-builder",
    linkLabel: "Claude Code experiment →",
  },
];

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
      <FaqJsonLd items={FAQ_ITEMS} />

      {/* Header */}
      <div className="mb-8">
        <Link
          href="/lab"
          className="inline-flex items-center gap-1.5 text-xs font-mono text-zinc-500 hover:text-zinc-700 transition-colors mb-8"
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

        <h1 className="text-3xl sm:text-4xl font-bold text-zinc-900 mb-3">Claude Execution Lab</h1>
        <p className="text-zinc-600 max-w-2xl leading-relaxed">
          A visual simulator for three common agentic workflow patterns — Claude Code, MCP tool calls, and Agent Skills invocations.
          Select a mode, run the simulation, step through each phase, and inspect what each step does and why it matters.{" "}
          <span className="text-zinc-500">
            Educational visualization by Eggthropic. Does not reveal Claude&apos;s private reasoning or internal architecture.
          </span>
        </p>
      </div>

      {/* Interactive lab */}
      <ExecutionShell />

      {/* Educational callouts */}
      <div id="safety" className="mt-16 grid grid-cols-1 sm:grid-cols-2 gap-4">
        {CALLOUTS.map((c) => (
          <div key={c.title} className="glass rounded-xl p-5 flex flex-col gap-2">
            <span className="font-mono text-xs font-semibold text-zinc-900">{c.title}</span>
            <p className="text-[12px] text-zinc-600 leading-relaxed flex-1">{c.body}</p>
            <Link
              href={c.href}
              className="text-[11px] font-mono text-egg-400/80 hover:text-egg-400 transition-colors mt-1"
            >
              {c.linkLabel}
            </Link>
          </div>
        ))}
      </div>

      {/* SEO content */}
      <div className="mt-20 max-w-3xl space-y-12">
        <section>
          <h2 className="text-xl font-bold text-zinc-900 mb-3">What is the Claude Execution Lab?</h2>
          <p className="text-zinc-600 leading-relaxed text-sm">
            The Claude Execution Lab is an interactive educational visualization built by Eggthropic.
            It demonstrates how agentic AI workflows are commonly structured — covering three distinct patterns:
            Claude Code for code editing tasks, MCP (Model Context Protocol) for external tool calls, and Agent Skills for invoking reusable task workflows.
            All simulations run locally in your browser using predetermined trace data. No real Claude API calls are made.
          </p>
          <p className="text-zinc-500 leading-relaxed text-sm mt-3">
            The goal is to make agentic workflows legible — to show the phases, the decisions, the risks, and the review points that matter — before you build with these systems yourself.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-zinc-900 mb-3">Claude Code workflow simulation</h2>
          <p className="text-zinc-600 leading-relaxed text-sm">
            The Claude Code simulation shows a typical agentic coding task: refactoring a landing page component.
            The simulated workflow reads relevant files, plans the decomposition, loads edit tools, writes the changes, runs lint and build checks, and produces a diff summary.
          </p>
          <h3 className="text-sm font-semibold text-zinc-700 mt-4 mb-2">Key phases</h3>
          <ul className="text-zinc-500 text-sm space-y-1 list-disc list-inside">
            <li>Read files — build context before making any changes</li>
            <li>Plan refactor — separate reasoning from execution</li>
            <li>Edit code — create new components and update imports</li>
            <li>Lint &amp; build — automated checks for obvious regressions</li>
            <li>Summarize — diff report for human review</li>
          </ul>
          <p className="text-zinc-500 text-sm mt-3">
            Claude Code requires explicit permission grants before reading or modifying files. Defaults are conservative. Always review generated diffs before committing.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-zinc-900 mb-3">MCP workflow simulation</h2>
          <p className="text-zinc-600 leading-relaxed text-sm">
            The MCP simulation shows how a Claude-based agent might use the Model Context Protocol to fetch live product data from an external tool server.
            The workflow parses a natural language request, connects to an MCP server over Streamable HTTP, fetches the tool schema, calls the tool, and validates the response.
          </p>
          <h3 className="text-sm font-semibold text-zinc-700 mt-4 mb-2">About MCP</h3>
          <p className="text-zinc-500 text-sm">
            MCP is an open protocol — not Anthropic-exclusive — based on JSON-RPC 2.0. It defines three primitives: Tools (functions the model can call), Resources (structured data), and Prompts (reusable templates).
            The official MCP Registry at registry.modelcontextprotocol.io launched in September 2025. The current remote transport is Streamable HTTP; SSE transport was deprecated in the 2025-03-26 spec revision.
          </p>
          <p className="text-zinc-500 text-sm mt-3">
            Security note: treat every MCP server as untrusted unless you control or have audited the source. Malicious servers can return prompt-injection payloads or exfiltrate sensitive context.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-zinc-900 mb-3">Agent Skills workflow simulation</h2>
          <p className="text-zinc-600 leading-relaxed text-sm">
            The Agent Skills simulation shows how Claude Code might invoke the <code className="text-zinc-700 font-mono text-xs px-1 py-0.5 rounded bg-zinc-50">/pr-describe</code> skill — scanning the skills directory, loading the SKILL.md instructions, running an allowed helper script against the git diff, and generating a structured PR description.
          </p>
          <h3 className="text-sm font-semibold text-zinc-700 mt-4 mb-2">About Agent Skills</h3>
          <p className="text-zinc-500 text-sm">
            An Agent Skill is a directory containing a <code className="text-zinc-700 font-mono text-xs px-1 py-0.5 rounded bg-zinc-50">SKILL.md</code> file with YAML frontmatter specifying the skill name, description, and allowed tools.
            Skills are invocable as slash commands in Claude Code and are supported in the Claude Agent SDK. They are loaded from <code className="text-zinc-700 font-mono text-xs px-1 py-0.5 rounded bg-zinc-50">.claude/skills/</code> in the project workspace or installed from the official <code className="text-zinc-700 font-mono text-xs px-1 py-0.5 rounded bg-zinc-50">anthropics/skills</code> repository.
            Behavior may vary by Claude surface and configuration.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-zinc-900 mb-3">Why human review still matters</h2>
          <p className="text-zinc-600 leading-relaxed text-sm">
            Agentic workflows compress time and reduce mechanical work — but they do not eliminate the need for human judgment.
            Lint passing does not mean code is correct. Validated MCP responses can still contain wrong data. Structurally complete skill outputs can still miss context only you have.
          </p>
          <p className="text-zinc-500 leading-relaxed text-sm mt-3">
            The Trust &amp; Safety panel in this lab surfaces the review points for each workflow mode. Use them as a checklist, not as reassurance that the work is done.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-zinc-900 mb-3">Related Eggthropic labs</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
            {[
              { label: "MCP Visual Explainer", desc: "Interactive MCP file structure, transport, and invocation trace", href: "/lab/mcp" },
              { label: "Agent Skills Explainer", desc: "SKILL.md anatomy and a full /pr-describe invocation trace", href: "/lab/skills" },
              { label: "All Claude Interfaces", desc: "Directory of official Claude surfaces — web, mobile, CLI, API", href: "/lab/interfaces" },
              { label: "Claude Code Experiment", desc: "How we built a landing page generator with Claude Code", href: "/experiments/claude-code-landing-page-builder" },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="glass rounded-xl p-4 hover:border-zinc-300 border border-zinc-200 transition-all group"
              >
                <span className="text-sm font-semibold text-zinc-700 group-hover:text-zinc-900 transition-colors block mb-1">
                  {link.label}
                </span>
                <span className="text-[11px] text-zinc-500">{link.desc}</span>
              </Link>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section>
          <h2 className="text-xl font-bold text-zinc-900 mb-6">Frequently asked questions</h2>
          <div className="space-y-5">
            {FAQ_ITEMS.map(({ q, a }) => (
              <div key={q} className="border-l-2 border-zinc-200 pl-4">
                <h3 className="text-sm font-semibold text-zinc-700 mb-1.5">{q}</h3>
                <p className="text-[13px] text-zinc-500 leading-relaxed">{a}</p>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Footer nav */}
      <div className="mt-16 pt-8 border-t border-zinc-200 flex flex-wrap gap-3">
        <Link
          href="/lab"
          className="inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          All lab experiments
        </Link>
        <div className="flex flex-wrap gap-2 ml-auto">
          {[
            { label: "MCP Lab", href: "/lab/mcp" },
            { label: "Skills Lab", href: "/lab/skills" },
            { label: "Interfaces", href: "/lab/interfaces" },
          ].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg glass border border-zinc-200 text-xs font-mono text-zinc-600 hover:text-zinc-900 hover:border-zinc-300 transition-all"
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
