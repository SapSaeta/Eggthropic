"use client";

import { useState } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

type Tab = "architecture" | "tools" | "terminal" | "install";

interface Tool {
  name: string;
  mode: string;
  description: string;
  input: Record<string, string>;
  example: string;
  color: string;
  border: string;
  bg: string;
  text: string;
  glow: string;
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const TOOLS: Tool[] = [
  {
    name: "codex_check",
    mode: "read-only",
    description:
      "Verifies the Codex CLI is installed and returns its version. Call this first to confirm prerequisites before any task.",
    input: {},
    example: '{ "installed": true, "version": "0.1.x", "message": "Codex CLI 0.1.x is available." }',
    color: "#34d399",
    border: "border-emerald-400/30",
    bg: "bg-emerald-400/5",
    text: "text-emerald-400",
    glow: "shadow-[0_0_12px_#34d39930]",
  },
  {
    name: "codex_run",
    mode: "full-auto",
    description:
      "Executes a coding task via Codex in full-auto mode. Codex reads the directory, plans changes, and applies them. No human approval required.",
    input: {
      prompt: "string — the coding task in plain English",
      directory: "string? — absolute path (defaults to cwd)",
      model: "o4-mini | o3 | o3-mini | gpt-4.1",
      timeout_seconds: "number? — max wait time (default 120)",
    },
    example:
      '{ "success": true, "exitCode": 0, "stdout": "Added missing null check in parseUser()...", "model": "o4-mini" }',
    color: "#60a5fa",
    border: "border-blue-400/30",
    bg: "bg-blue-400/5",
    text: "text-blue-400",
    glow: "shadow-[0_0_12px_#60a5fa30]",
  },
  {
    name: "codex_ask",
    mode: "suggest",
    description:
      "Asks Codex for suggestions or analysis without applying any changes. Files are read-only. Safe for exploration and review tasks.",
    input: {
      question: "string — the analysis request",
      directory: "string? — absolute path (defaults to cwd)",
      model: "o4-mini | o3 | o3-mini | gpt-4.1",
      timeout_seconds: "number? — max wait time (default 60)",
    },
    example:
      '{ "success": true, "suggestions": "I would extract the validation logic into a separate...\\n\\n```diff\\n- const valid = ...\\n", "note": "No files were modified." }',
    color: "#a78bfa",
    border: "border-violet-400/30",
    bg: "bg-violet-400/5",
    text: "text-violet-400",
    glow: "shadow-[0_0_12px_#a78bfa30]",
  },
];

const TERMINAL_LINES = [
  { prefix: "claude", content: "Use codex_check to see if Codex is ready.", color: "text-egg-400" },
  { prefix: "tool", content: "codex_check({})", color: "text-cyan-400" },
  { prefix: "result", content: '{ "installed": true, "version": "0.1.52" }', color: "text-emerald-400" },
  { prefix: "claude", content: "Codex is ready. Running the task now.", color: "text-egg-400" },
  { prefix: "tool", content: 'codex_run({ prompt: "add a unit test for the parseUser function", model: "o4-mini" })', color: "text-cyan-400" },
  { prefix: "codex", content: "Reading codebase...", color: "text-slate-400" },
  { prefix: "codex", content: "Planning: create src/__tests__/parseUser.test.ts", color: "text-slate-400" },
  { prefix: "codex", content: "Writing test file — 43 lines.", color: "text-slate-400" },
  { prefix: "result", content: '{ "success": true, "exitCode": 0, "stdout": "✓ parseUser.test.ts created" }', color: "text-emerald-400" },
  { prefix: "claude", content: "Done. Test file written by Codex, verified by Claude.", color: "text-egg-400" },
];

const INSTALL_SNIPPET = `# 1. Install the Codex CLI globally
npm install -g @openai/codex

# 2. Build the MCP server
cd mcp/codex-server
npm install && npm run build

# 3. Add to ~/.claude/claude_code_config.json
{
  "mcpServers": {
    "codex": {
      "command": "node",
      "args": ["/absolute/path/to/mcp/codex-server/dist/index.js"],
      "env": {
        "OPENAI_API_KEY": "<your-openai-key>"
      }
    }
  }
}

# 4. Restart Claude Code — the tools appear automatically
# Claude Code will show codex_check, codex_run, codex_ask in /mcp`;

// ─── Architecture diagram ─────────────────────────────────────────────────────

function ArchitectureDiagram() {
  const nodes = [
    {
      id: "claude",
      label: "Claude Code",
      sublabel: "Claude Sonnet 4.x",
      icon: "⬡",
      color: "#ffd21a",
      border: "border-egg-400/40",
      bg: "bg-egg-400/10",
      text: "text-egg-400",
    },
    {
      id: "mcp",
      label: "MCP Server",
      sublabel: "codex-mcp-server",
      icon: "⬢",
      color: "#60a5fa",
      border: "border-blue-400/40",
      bg: "bg-blue-400/10",
      text: "text-blue-400",
    },
    {
      id: "codex",
      label: "Codex CLI",
      sublabel: "@openai/codex",
      icon: "◈",
      color: "#a78bfa",
      border: "border-violet-400/40",
      bg: "bg-violet-400/10",
      text: "text-violet-400",
    },
    {
      id: "openai",
      label: "OpenAI API",
      sublabel: "o4-mini / o3",
      icon: "◉",
      color: "#34d399",
      border: "border-emerald-400/40",
      bg: "bg-emerald-400/10",
      text: "text-emerald-400",
    },
  ];

  const arrows = [
    { label: "MCP (stdio)", sublabel: "JSON-RPC 2.0" },
    { label: "spawn process", sublabel: "CODEX_QUIET_MODE=1" },
    { label: "HTTPS", sublabel: "OPENAI_API_KEY" },
  ];

  return (
    <div className="flex flex-col gap-4 items-center p-6">
      {/* Nodes */}
      <div className="flex flex-wrap items-center justify-center gap-3">
        {nodes.map((node, i) => (
          <div key={node.id} className="flex items-center gap-3">
            <div
              className={`flex flex-col items-center gap-1.5 rounded-xl border ${node.border} ${node.bg} px-5 py-4 min-w-[120px]`}
              style={{ boxShadow: `0 0 16px ${node.color}20` }}
            >
              <span className={`text-2xl ${node.text}`} style={{ textShadow: `0 0 12px ${node.color}` }}>
                {node.icon}
              </span>
              <span className={`font-mono text-xs font-bold ${node.text}`}>{node.label}</span>
              <span className="font-mono text-[10px] text-slate-500">{node.sublabel}</span>
            </div>

            {i < arrows.length && (
              <div className="flex flex-col items-center gap-0.5 min-w-[90px]">
                <span className="font-mono text-[10px] text-slate-500">{arrows[i].label}</span>
                <div className="flex items-center gap-1">
                  <div className="w-10 h-px bg-slate-600" />
                  <svg width="8" height="8" viewBox="0 0 8 8" fill="#64748b">
                    <path d="M0 0 L8 4 L0 8 Z" />
                  </svg>
                </div>
                <span className="font-mono text-[9px] text-slate-600">{arrows[i].sublabel}</span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Protocol legend */}
      <div className="flex flex-wrap gap-4 mt-2">
        {[
          { label: "Claude Code sends tool call → MCP Server via stdin/stdout" },
          { label: "MCP Server spawns codex process with CODEX_QUIET_MODE=1" },
          { label: "Codex CLI authenticates to OpenAI with OPENAI_API_KEY" },
        ].map((item, i) => (
          <div key={i} className="flex items-center gap-2">
            <span className="font-mono text-[10px] text-slate-600">{i + 1}.</span>
            <span className="font-mono text-[10px] text-slate-500">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Tools browser ────────────────────────────────────────────────────────────

function ToolsBrowser() {
  const [selected, setSelected] = useState(0);
  const tool = TOOLS[selected];

  return (
    <div className="flex gap-4 h-full min-h-[320px]">
      {/* Sidebar */}
      <div className="flex flex-col gap-2 w-44 shrink-0">
        {TOOLS.map((t, i) => (
          <button
            key={t.name}
            onClick={() => setSelected(i)}
            className={[
              "text-left rounded-lg border px-3 py-2.5 transition-all duration-200",
              selected === i
                ? `${t.border} ${t.bg} ${t.text}`
                : "border-white/8 text-slate-500 hover:text-slate-300 hover:border-white/15",
            ].join(" ")}
          >
            <div className="font-mono text-xs font-semibold">{t.name}</div>
            <div className="font-mono text-[10px] text-slate-600 mt-0.5">{t.mode}</div>
          </button>
        ))}
      </div>

      {/* Detail panel */}
      <div
        className={`flex-1 rounded-xl border ${tool.border} ${tool.bg} p-5 flex flex-col gap-4 ${tool.glow}`}
      >
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className={`font-mono text-sm font-bold ${tool.text}`}>{tool.name}</span>
            <span
              className={`px-2 py-0.5 rounded-full border ${tool.border} font-mono text-[10px] ${tool.text}`}
            >
              {tool.mode}
            </span>
          </div>
          <p className="text-sm text-slate-400 leading-relaxed">{tool.description}</p>
        </div>

        {Object.keys(tool.input).length > 0 && (
          <div>
            <p className="font-mono text-[10px] tracking-widest text-slate-600 mb-2">INPUT SCHEMA</p>
            <div className="space-y-1">
              {Object.entries(tool.input).map(([key, type]) => (
                <div key={key} className="flex gap-3 font-mono text-xs">
                  <span className={`${tool.text} shrink-0`}>{key}</span>
                  <span className="text-slate-500">{type}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div>
          <p className="font-mono text-[10px] tracking-widest text-slate-600 mb-2">EXAMPLE OUTPUT</p>
          <pre
            className="rounded-lg p-3 text-[11px] font-mono text-slate-300 overflow-x-auto leading-relaxed"
            style={{ backgroundColor: "#0a0f1a" }}
          >
            {tool.example}
          </pre>
        </div>
      </div>
    </div>
  );
}

// ─── Terminal ─────────────────────────────────────────────────────────────────

function Terminal() {
  const [revealed, setRevealed] = useState(0);

  return (
    <div className="rounded-xl border border-white/8 overflow-hidden" style={{ backgroundColor: "#080c14" }}>
      {/* Title bar */}
      <div className="flex items-center gap-2 px-4 py-2 border-b border-white/5">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-rose-500/60" />
          <div className="w-3 h-3 rounded-full bg-amber-500/60" />
          <div className="w-3 h-3 rounded-full bg-emerald-500/60" />
        </div>
        <span className="font-mono text-[11px] text-slate-500 ml-2">claude-code — codex integration</span>
      </div>

      {/* Lines */}
      <div className="p-5 space-y-2 min-h-[280px]">
        {TERMINAL_LINES.slice(0, revealed + 1).map((line, i) => (
          <div key={i} className="flex gap-3 font-mono text-xs leading-relaxed">
            <span
              className="shrink-0 w-14 text-right text-slate-600"
              style={{ fontSize: "10px" }}
            >
              [{line.prefix}]
            </span>
            <span className={line.color}>{line.content}</span>
          </div>
        ))}
        {revealed < TERMINAL_LINES.length - 1 && (
          <div className="pt-2">
            <button
              onClick={() => setRevealed((r) => Math.min(r + 1, TERMINAL_LINES.length - 1))}
              className="font-mono text-[11px] text-slate-600 border border-white/8 rounded px-3 py-1 hover:text-slate-300 hover:border-white/20 transition-all"
            >
              ▶ next step
            </button>
          </div>
        )}
        {revealed === TERMINAL_LINES.length - 1 && (
          <div className="pt-2">
            <button
              onClick={() => setRevealed(0)}
              className="font-mono text-[11px] text-emerald-400/60 border border-emerald-400/20 rounded px-3 py-1 hover:text-emerald-400 transition-all"
            >
              ↺ replay
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Install tab ──────────────────────────────────────────────────────────────

function InstallTab() {
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    navigator.clipboard.writeText(INSTALL_SNIPPET).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <div className="flex flex-col gap-5">
      <p className="text-sm text-slate-400 leading-relaxed">
        The MCP server is a Node.js process that Claude Code spawns on startup.
        It communicates via <span className="font-mono text-slate-300">stdio</span> using{" "}
        <span className="font-mono text-slate-300">JSON-RPC 2.0</span> — no network port, no daemon.
        Your <span className="font-mono text-slate-300">OPENAI_API_KEY</span> is passed as an env
        var and used only by the Codex CLI subprocess.
      </p>

      <div className="relative">
        <pre
          className="rounded-xl border border-white/8 p-5 text-xs font-mono text-slate-300 overflow-x-auto leading-relaxed"
          style={{ backgroundColor: "#080c14" }}
        >
          {INSTALL_SNIPPET}
        </pre>
        <button
          onClick={handleCopy}
          className="absolute top-3 right-3 px-3 py-1 rounded-md border border-white/10 font-mono text-[10px] text-slate-500 hover:text-slate-300 hover:border-white/20 transition-all"
        >
          {copied ? "copied!" : "copy"}
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {[
          {
            title: "No internet required for MCP",
            body: "The MCP server itself runs locally. Only the Codex CLI subprocess calls the OpenAI API.",
            color: "text-emerald-400",
            border: "border-emerald-400/15",
          },
          {
            title: "Claude Code manages the process",
            body: "Claude Code spawns and kills the server automatically. You don't run it manually.",
            color: "text-blue-400",
            border: "border-blue-400/15",
          },
          {
            title: "OPENAI_API_KEY stays local",
            body: "The key is passed via the env block in claude_code_config.json — it never leaves your machine.",
            color: "text-violet-400",
            border: "border-violet-400/15",
          },
          {
            title: "Suggest mode is read-only",
            body: "codex_ask uses --approval-mode suggest — Codex proposes changes but never writes files.",
            color: "text-amber-400",
            border: "border-amber-400/15",
          },
        ].map((card) => (
          <div
            key={card.title}
            className={`rounded-lg border ${card.border} bg-white/[0.02] p-4`}
          >
            <p className={`font-mono text-xs font-semibold ${card.color} mb-1`}>{card.title}</p>
            <p className="text-xs text-slate-500 leading-relaxed">{card.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Root ─────────────────────────────────────────────────────────────────────

const TABS: { id: Tab; label: string }[] = [
  { id: "architecture", label: "Architecture" },
  { id: "tools", label: "Tools" },
  { id: "terminal", label: "Live trace" },
  { id: "install", label: "Install" },
];

export default function CodexExplainer() {
  const [tab, setTab] = useState<Tab>("architecture");

  return (
    <div
      className="relative overflow-hidden rounded-2xl border border-white/[0.06] font-mono"
      style={{ backgroundColor: "#080c14" }}
    >
      {/* Header */}
      <div className="flex items-center justify-between gap-4 border-b border-white/[0.06] px-6 py-3">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-violet-400/30 bg-violet-400/10">
            <span className="text-lg">⬡</span>
          </div>
          <div>
            <span className="text-sm font-bold tracking-widest text-white">CODEX</span>
            <span className="mx-2 text-sm text-slate-600">{"//"}</span>
            <span className="text-sm font-semibold tracking-widest text-violet-400">MCP BRIDGE</span>
          </div>
        </div>

        <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-1.5">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-violet-400" />
          <span className="text-xs tracking-widest text-slate-400">3 TOOLS</span>
        </div>
      </div>

      {/* Tab nav */}
      <div className="flex items-center gap-1 border-b border-white/[0.06] px-6 py-2">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={[
              "relative rounded-md px-3 py-1.5 text-[11px] font-semibold tracking-widest transition-all duration-200",
              tab === t.id ? "text-[#ffd21a]" : "text-slate-500 hover:text-slate-300",
            ].join(" ")}
          >
            {t.label.toUpperCase()}
            {tab === t.id && (
              <span className="absolute inset-x-1 bottom-0 h-[2px] rounded-full bg-[#ffd21a]" />
            )}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="p-6">
        {tab === "architecture" && <ArchitectureDiagram />}
        {tab === "tools" && <ToolsBrowser />}
        {tab === "terminal" && <Terminal />}
        {tab === "install" && <InstallTab />}
      </div>

      {/* Footer */}
      <div className="border-t border-white/[0.06] px-6 py-2 flex items-center justify-between">
        <span className="text-[10px] tracking-widest text-slate-600">
          TRANSPORT · stdio · JSON-RPC 2.0
        </span>
        <span className="text-[10px] tracking-widest text-slate-600">
          EGGTHROPIC LABS · EXP · CLAUDE CODE
        </span>
      </div>
    </div>
  );
}
