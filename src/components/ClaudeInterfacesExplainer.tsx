"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ─── Types ─────────────────────────────────────────────────────────────────────

type Category = "Web & Chat" | "Code & IDE" | "Browser" | "API & Dev" | "Enterprise" | "Labs";
type Scene = "directory" | "quickstart" | "fit";

type Surface = {
  id: string;
  name: string;
  tagline: string;
  category: Category;
  icon: string;
  availability: string;
  availKind: "free" | "paid" | "api" | "enterprise";
  bestFor: string[];
  access: { label: string; value: string; type: "url" | "command" | "store" };
  quickStart: { step: string; detail?: string }[];
  notes?: string;
};

// ─── Data ──────────────────────────────────────────────────────────────────────

const SURFACES: Surface[] = [
  // ── Web & Chat ──────────────────────────────────────────────────────────────
  {
    id: "claude-web",
    name: "Claude.ai",
    tagline: "The main Claude interface — chat, write, analyze",
    category: "Web & Chat",
    icon: "◉",
    availability: "Free · Pro · Max",
    availKind: "free",
    bestFor: ["Writing and editing", "Research and document analysis", "Long multi-turn conversations", "Uploading images and files"],
    access: { label: "Open browser", value: "claude.ai", type: "url" },
    quickStart: [
      { step: "Go to claude.ai", detail: "No install required" },
      { step: "Sign up — free tier uses Claude Haiku" },
    ],
  },
  {
    id: "claude-ios",
    name: "Claude for iOS",
    tagline: "Native iPhone & iPad app with voice input",
    category: "Web & Chat",
    icon: "📱",
    availability: "Free · Pro · Max",
    availKind: "free",
    bestFor: ["On-the-go conversations", "Voice-to-text input", "Continuing desktop sessions on mobile"],
    access: { label: "App Store", value: "apps.apple.com → search Claude", type: "store" },
    quickStart: [
      { step: "Search 'Claude' on the App Store", detail: "By Anthropic" },
      { step: "Sign in with your Claude.ai account" },
    ],
  },
  {
    id: "claude-android",
    name: "Claude for Android",
    tagline: "Native Android app with Google Play integration",
    category: "Web & Chat",
    icon: "📲",
    availability: "Free · Pro · Max",
    availKind: "free",
    bestFor: ["On-the-go conversations", "Voice input", "Cross-device continuity"],
    access: { label: "Google Play", value: "play.google.com → search Claude", type: "store" },
    quickStart: [
      { step: "Search 'Claude' on Google Play", detail: "By Anthropic" },
      { step: "Sign in with your Claude.ai account" },
    ],
  },
  // ── Code & IDE ──────────────────────────────────────────────────────────────
  {
    id: "claude-code-cli",
    name: "Claude Code CLI",
    tagline: "Agentic coding in your terminal — reads, edits, and commits code",
    category: "Code & IDE",
    icon: "⌨",
    availability: "Pro · Max · API key",
    availKind: "paid",
    bestFor: ["Multi-file code edits across a full repo", "Automated refactors and test loops", "Scheduled routines and sub-agent orchestration", "Git-aware commits and PR workflows"],
    access: { label: "Install", value: "npm install -g @anthropic-ai/claude-code", type: "command" },
    quickStart: [
      { step: "npm install -g @anthropic-ai/claude-code", detail: "Node.js 18+ required" },
      { step: "claude", detail: "Run from any project directory" },
    ],
    notes: "Requires a Claude.ai Pro/Max subscription or an Anthropic API key.",
  },
  {
    id: "claude-code-desktop",
    name: "Claude Code Desktop",
    tagline: "Native Mac & Windows app — persistent sessions with GUI and Remote Control",
    category: "Code & IDE",
    icon: "🖥",
    availability: "Pro · Max",
    availKind: "paid",
    bestFor: ["Persistent Claude Code sessions without a terminal window", "GUI for non-terminal users", "Remote Control: run Claude Code on servers or CI and interact via API"],
    access: { label: "Download", value: "claude.ai/download", type: "url" },
    quickStart: [
      { step: "Download from claude.ai/download", detail: "Mac (Apple Silicon + Intel) · Windows" },
      { step: "Sign in with your Claude.ai Pro or Max account" },
    ],
  },
  {
    id: "claude-vscode",
    name: "Claude Code · VS Code",
    tagline: "Claude Code embedded in VS Code — inline edits, chat panel, full context",
    category: "Code & IDE",
    icon: "💠",
    availability: "Pro · Max",
    availKind: "paid",
    bestFor: ["Inline code generation without leaving the editor", "Chat panel alongside your code", "Context-aware refactors using open files"],
    access: { label: "VS Code Marketplace", value: "Search 'Claude Code' in Extensions", type: "store" },
    quickStart: [
      { step: "Open VS Code → Extensions panel" },
      { step: "Search 'Claude Code' and install", detail: "By Anthropic" },
      { step: "Sign in with your Claude.ai account" },
    ],
  },
  {
    id: "claude-jetbrains",
    name: "Claude Code · JetBrains",
    tagline: "Claude Code for IntelliJ, PyCharm, WebStorm, and all JetBrains IDEs",
    category: "Code & IDE",
    icon: "🟠",
    availability: "Pro · Max",
    availKind: "paid",
    bestFor: ["Java, Kotlin, Python, Go workflows in JetBrains", "Full project context for refactors", "Multi-file edits with JetBrains' refactoring tools"],
    access: { label: "JetBrains Marketplace", value: "Preferences → Plugins → search Claude Code", type: "store" },
    quickStart: [
      { step: "Open Preferences → Plugins in any JetBrains IDE" },
      { step: "Search 'Claude Code' and install", detail: "By Anthropic" },
      { step: "Sign in with your Claude.ai account" },
    ],
  },
  // ── Browser ─────────────────────────────────────────────────────────────────
  {
    id: "claude-chrome",
    name: "Claude in Chrome",
    tagline: "Browser automation agent — navigate pages, fill forms, and run web workflows",
    category: "Browser",
    icon: "🔵",
    availability: "Pro · Max · Team · Enterprise",
    availKind: "paid",
    bestFor: ["Automating multi-step web workflows", "Navigating sites and extracting data", "Filling forms and interacting with web apps", "Claude Code integration for in-browser context"],
    access: { label: "Chrome Web Store", value: "Search 'Claude in Chrome' by Anthropic", type: "store" },
    quickStart: [
      { step: "Open Chrome Web Store", detail: "Search 'Claude in Chrome' by Anthropic" },
      { step: "Install and pin the extension" },
      { step: "Sign in with your paid Claude.ai account" },
    ],
    notes: "Requires a paid Claude plan (Pro or higher). Pro uses Claude Haiku 4.5; Max and above get more capable models.",
  },
  // ── API & Dev ───────────────────────────────────────────────────────────────
  {
    id: "anthropic-api",
    name: "Anthropic API",
    tagline: "Direct REST access to all Claude models via TypeScript and Python SDKs",
    category: "API & Dev",
    icon: "⚡",
    availability: "Pay-per-token",
    availKind: "api",
    bestFor: ["Building Claude-powered products", "Custom system prompts and tool use", "Batch processing at scale", "Streaming and extended thinking"],
    access: { label: "Get API key", value: "console.anthropic.com", type: "url" },
    quickStart: [
      { step: "console.anthropic.com → API Keys → Create key" },
      { step: "npm install @anthropic-ai/sdk", detail: "TypeScript" },
      { step: "pip install anthropic", detail: "Python" },
    ],
  },
  {
    id: "anthropic-console",
    name: "Anthropic Console",
    tagline: "Prompt playground, model explorer, and eval workbench for developers",
    category: "API & Dev",
    icon: "🧪",
    availability: "Free with API account",
    availKind: "api",
    bestFor: ["Iterating on prompts before writing code", "Comparing model outputs side by side", "Evals and regression benchmarking", "Team workspaces for shared prompt libraries"],
    access: { label: "Open Console", value: "console.anthropic.com", type: "url" },
    quickStart: [
      { step: "Go to console.anthropic.com", detail: "Free Anthropic account required" },
      { step: "Open Workbench to start testing prompts" },
    ],
  },
  {
    id: "claude-agent-sdk",
    name: "Claude Agent SDK",
    tagline: "Build production multi-agent systems with orchestration and tool use",
    category: "API & Dev",
    icon: "🤖",
    availability: "API key required",
    availKind: "api",
    bestFor: ["Orchestrated multi-agent pipelines", "Custom tool integrations via function calling", "Autonomous task runners with human-in-the-loop", "Agent teams: Opus coordinating parallel sub-agents"],
    access: { label: "Install SDK", value: "npm install @anthropic-ai/claude-agent-sdk", type: "command" },
    quickStart: [
      { step: "npm install @anthropic-ai/claude-agent-sdk", detail: "TypeScript" },
      { step: "pip install claude-agent-sdk", detail: "Python" },
      { step: "Set ANTHROPIC_API_KEY in your environment" },
    ],
  },
  {
    id: "amazon-bedrock",
    name: "Claude on Amazon Bedrock",
    tagline: "All Claude models via AWS infrastructure — VPC, IAM, and data residency",
    category: "API & Dev",
    icon: "☁",
    availability: "AWS pricing",
    availKind: "api",
    bestFor: ["AWS-native integrations with IAM and VPC", "Enterprise data residency in specific AWS regions", "Multi-model orchestration alongside other Bedrock models"],
    access: { label: "AWS Console", value: "console.aws.amazon.com → Bedrock → Model access", type: "url" },
    quickStart: [
      { step: "Enable Claude in Amazon Bedrock console", detail: "Requires AWS account" },
      { step: "Use Bedrock SDK with your AWS credentials" },
    ],
  },
  {
    id: "google-vertex",
    name: "Claude on Vertex AI",
    tagline: "Claude models via Google Cloud — for GCP-native teams",
    category: "API & Dev",
    icon: "🔹",
    availability: "GCP pricing",
    availKind: "api",
    bestFor: ["Google Cloud-native integrations", "Combined with Vertex AI features (embeddings, search)", "Enterprise GCP deployments with existing IAM"],
    access: { label: "Google Cloud Console", value: "console.cloud.google.com → Vertex AI → Model Garden", type: "url" },
    quickStart: [
      { step: "Enable Claude API in Google Cloud Console", detail: "Requires GCP project" },
      { step: "Use Vertex AI SDK with your GCP credentials" },
    ],
  },
  // ── Enterprise ──────────────────────────────────────────────────────────────
  {
    id: "claude-teams",
    name: "Claude for Teams",
    tagline: "Shared workspace with team management and higher usage limits",
    category: "Enterprise",
    icon: "👥",
    availability: "Team plan",
    availKind: "enterprise",
    bestFor: ["Shared conversation history across a team", "Team admin controls and usage visibility", "Higher rate limits than Pro/Max", "SSO and centralized access management"],
    access: { label: "Sign up", value: "claude.ai/team", type: "url" },
    quickStart: [
      { step: "Go to claude.ai/team", detail: "Minimum 5 users" },
      { step: "Admin sets up workspace and sends invites" },
    ],
  },
  {
    id: "claude-enterprise",
    name: "Claude Enterprise",
    tagline: "Enterprise-grade Claude with custom context, compliance, and SLAs",
    category: "Enterprise",
    icon: "🏢",
    availability: "Custom pricing",
    availKind: "enterprise",
    bestFor: ["Large orgs with compliance requirements (SOC 2, HIPAA)", "Custom system prompts deployed org-wide", "Priority access, SLAs, and dedicated support", "Audit logs and granular data controls"],
    access: { label: "Contact sales", value: "anthropic.com/contact-sales", type: "url" },
    quickStart: [
      { step: "anthropic.com/contact-sales" },
      { step: "Custom onboarding with dedicated account team" },
    ],
  },
  // ── Labs ────────────────────────────────────────────────────────────────────
  {
    id: "claude-design",
    name: "Claude Design",
    tagline: "Turn written briefs into interactive prototypes — hand off to Claude Code",
    category: "Labs",
    icon: "🎨",
    availability: "Pro · Max · Team · Enterprise",
    availKind: "paid",
    bestFor: ["UI/UX prototyping through conversation", "Presentations and one-pagers in minutes", "Design system-aware mockups", "Claude Code handoff bundles — zero manual translation"],
    access: { label: "claude.ai (Labs section)", value: "claude.ai → Labs", type: "url" },
    quickStart: [
      { step: "Open claude.ai with Pro or higher plan" },
      { step: "Access Claude Design from the Labs section in the sidebar" },
    ],
    notes: "Research preview by Anthropic Labs. Powered by Claude Opus 4.7. Counts against subscription limits.",
  },
];

// ─── Category config ────────────────────────────────────────────────────────────

type CatConf = { color: string; bg: string; border: string; dot: string };

const CAT: Record<Category, CatConf> = {
  "Web & Chat": { color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20", dot: "bg-emerald-400" },
  "Code & IDE": { color: "text-violet-400", bg: "bg-violet-500/10", border: "border-violet-500/20", dot: "bg-violet-400" },
  "Browser":    { color: "text-amber-400",  bg: "bg-amber-500/10",  border: "border-amber-500/20",  dot: "bg-amber-400" },
  "API & Dev":  { color: "text-cyan-400",   bg: "bg-cyan-500/10",   border: "border-cyan-500/20",   dot: "bg-cyan-400" },
  "Enterprise": { color: "text-blue-400",   bg: "bg-blue-500/10",   border: "border-blue-500/20",   dot: "bg-blue-400" },
  "Labs":       { color: "text-rose-400",   bg: "bg-rose-500/10",   border: "border-rose-500/20",   dot: "bg-rose-400" },
};

const AVAIL_STYLE: Record<Surface["availKind"], string> = {
  free:       "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
  paid:       "text-violet-400 bg-violet-500/10 border-violet-500/20",
  api:        "text-cyan-400 bg-cyan-500/10 border-cyan-500/20",
  enterprise: "text-blue-400 bg-blue-500/10 border-blue-500/20",
};

// ─── Find Your Fit config ──────────────────────────────────────────────────────

type FitOption = {
  id: string;
  emoji: string;
  label: string;
  description: string;
  recommend: string[];
  reason: string;
};

const FIT_OPTIONS: FitOption[] = [
  {
    id: "chat",
    emoji: "💬",
    label: "Chat & write",
    description: "General conversations, writing, research, document analysis",
    recommend: ["claude-web", "claude-ios", "claude-android", "claude-chrome"],
    reason: "Claude.ai on web or mobile is the fastest path — free tier available, no install needed. Add the Chrome extension to bring Claude to any page you're already reading.",
  },
  {
    id: "code",
    emoji: "⌨",
    label: "Code",
    description: "Writing code, refactoring, multi-file edits, full repo context",
    recommend: ["claude-code-cli", "claude-code-desktop", "claude-vscode", "claude-jetbrains"],
    reason: "Claude Code is purpose-built for agentic coding. Use the CLI for full terminal control, or the IDE extension to stay inside VS Code or JetBrains without context-switching.",
  },
  {
    id: "build",
    emoji: "🔧",
    label: "Build a product",
    description: "Integrating Claude into your app or service via the API",
    recommend: ["anthropic-api", "anthropic-console", "claude-agent-sdk", "amazon-bedrock", "google-vertex"],
    reason: "Start in the Anthropic Console to iterate on prompts, then integrate via the REST API or TypeScript/Python SDKs. For cloud-native deployments, Claude is available on both Amazon Bedrock and Google Vertex AI.",
  },
  {
    id: "team",
    emoji: "👥",
    label: "My whole team",
    description: "Company-wide rollout, shared workspace, admin controls",
    recommend: ["claude-teams", "claude-enterprise", "anthropic-console"],
    reason: "Claude for Teams adds a shared workspace and admin controls for groups of 5+. For larger orgs with compliance requirements (SSO, SOC 2, audit logs), Claude Enterprise is the right tier.",
  },
];

// ─── Helpers ───────────────────────────────────────────────────────────────────

function CopyButton({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);
  function copy() {
    navigator.clipboard.writeText(value).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }
  return (
    <button
      onClick={copy}
      className="ml-auto px-2 py-1 rounded text-[10px] font-mono transition-colors text-slate-500 hover:text-slate-300 hover:bg-white/5"
    >
      {copied ? "✓ copied" : "copy"}
    </button>
  );
}

// ─── Scene: Directory ──────────────────────────────────────────────────────────

const ALL_CATS: (Category | "All")[] = ["All", "Web & Chat", "Code & IDE", "Browser", "API & Dev", "Enterprise", "Labs"];

function DirectoryScene() {
  const [filter, setFilter] = useState<Category | "All">("All");
  const [selected, setSelected] = useState<Surface | null>(null);

  const visible = filter === "All" ? SURFACES : SURFACES.filter((s) => s.category === filter);
  const cat = selected ? CAT[selected.category] : null;

  return (
    <div>
      {/* Category filter */}
      <div className="flex flex-wrap gap-2 mb-5">
        {ALL_CATS.map((c) => {
          const conf = c !== "All" ? CAT[c] : null;
          const count = c === "All" ? SURFACES.length : SURFACES.filter((s) => s.category === c).length;
          return (
            <button
              key={c}
              onClick={() => { setFilter(c); setSelected(null); }}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono border transition-all duration-150 flex items-center gap-1.5 ${
                filter === c
                  ? conf
                    ? `${conf.bg} ${conf.border} ${conf.color}`
                    : "bg-egg-400/15 border-egg-400/25 text-egg-300"
                  : "bg-white/[0.02] border-white/8 text-slate-500 hover:text-slate-300"
              }`}
            >
              {c !== "All" && conf && (
                <span className={`w-1.5 h-1.5 rounded-full ${conf.dot}`} />
              )}
              {c}
              <span className="opacity-50 text-[9px]">{count}</span>
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Card grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 content-start">
          <AnimatePresence mode="popLayout">
            {visible.map((surface) => {
              const c = CAT[surface.category];
              const isSelected = selected?.id === surface.id;
              return (
                <motion.button
                  key={surface.id}
                  layout
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.97 }}
                  transition={{ duration: 0.15 }}
                  onClick={() => setSelected(isSelected ? null : surface)}
                  className={`text-left glass rounded-xl p-4 border transition-all duration-150 ${
                    isSelected
                      ? `${c.border} ${c.bg}`
                      : "border-white/8 hover:border-white/15"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className="text-xl leading-none">{surface.icon}</span>
                    <span className={`text-[9px] px-1.5 py-0.5 rounded font-mono border ${c.bg} ${c.border} ${c.color}`}>
                      {surface.category}
                    </span>
                  </div>
                  <p className="text-sm font-semibold text-white mb-1">{surface.name}</p>
                  <p className="text-[11px] text-slate-500 leading-relaxed line-clamp-2">{surface.tagline}</p>
                  <div className="mt-2.5">
                    <span className={`text-[9px] px-1.5 py-0.5 rounded border font-mono ${AVAIL_STYLE[surface.availKind]}`}>
                      {surface.availability}
                    </span>
                  </div>
                </motion.button>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Detail panel */}
        <div className="lg:sticky lg:top-0">
          <AnimatePresence mode="wait">
            {selected && cat ? (
              <motion.div
                key={selected.id}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
                className={`glass rounded-2xl p-6 border ${cat.border} h-full`}
              >
                <div className="flex items-start gap-3 mb-4">
                  <span className="text-3xl">{selected.icon}</span>
                  <div>
                    <p className="font-semibold text-white">{selected.name}</p>
                    <p className={`text-xs font-mono ${cat.color}`}>{selected.category}</p>
                  </div>
                </div>
                <p className="text-sm text-slate-400 leading-relaxed mb-4">{selected.tagline}</p>

                <div className="mb-4">
                  <p className="text-[10px] font-mono text-slate-600 uppercase tracking-widest mb-2">Best for</p>
                  <ul className="space-y-1">
                    {selected.bestFor.map((item) => (
                      <li key={item} className="flex items-start gap-2 text-xs text-slate-400">
                        <span className={`mt-1 w-1.5 h-1.5 rounded-full ${cat.dot} shrink-0`} />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className={`rounded-xl p-3 ${cat.bg} border ${cat.border}`}>
                  <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-1.5">
                    {selected.access.type === "command" ? "Install" : selected.access.type === "store" ? "Get it" : "Access"}
                  </p>
                  <div className="flex items-center gap-2">
                    <code className={`text-xs font-mono ${cat.color} flex-1 break-all`}>
                      {selected.access.value}
                    </code>
                    {selected.access.type === "command" && <CopyButton value={selected.access.value} />}
                  </div>
                </div>

                {selected.notes && (
                  <p className="mt-3 text-[11px] text-slate-600 leading-relaxed">{selected.notes}</p>
                )}
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="glass rounded-2xl p-6 border border-white/5 h-full flex items-center justify-center"
              >
                <p className="text-sm text-slate-600 font-mono">Select a surface to see details</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

// ─── Scene: Quick Start ────────────────────────────────────────────────────────

const CATS_ORDER: Category[] = ["Web & Chat", "Code & IDE", "Browser", "API & Dev", "Enterprise", "Labs"];

function QuickStartScene() {
  const grouped = CATS_ORDER.map((cat) => ({
    cat,
    surfaces: SURFACES.filter((s) => s.category === cat),
  }));

  return (
    <div className="space-y-6">
      {grouped.map(({ cat, surfaces }) => {
        const c = CAT[cat];
        return (
          <div key={cat}>
            <div className="flex items-center gap-2 mb-3">
              <span className={`w-2 h-2 rounded-full ${c.dot}`} />
              <p className={`text-[10px] font-mono uppercase tracking-widest ${c.color}`}>{cat}</p>
            </div>
            <div className="space-y-2">
              {surfaces.map((s) => {
                const isCommand = s.access.type === "command";
                return (
                  <div
                    key={s.id}
                    className={`glass rounded-xl px-4 py-3 border border-white/8 flex items-center gap-3 flex-wrap`}
                  >
                    <span className="text-base shrink-0">{s.icon}</span>
                    <p className="text-sm font-semibold text-white min-w-[120px]">{s.name}</p>
                    <div className={`flex-1 flex items-center gap-2 rounded-lg px-3 py-1.5 ${c.bg} border ${c.border} min-w-0`}>
                      <code className={`text-xs font-mono ${c.color} truncate flex-1`}>
                        {isCommand ? "$ " : ""}{s.access.value}
                      </code>
                      {isCommand && <CopyButton value={s.access.value} />}
                    </div>
                    <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded border shrink-0 ${AVAIL_STYLE[s.availKind]}`}>
                      {s.availKind === "free" ? "free" : s.availKind === "paid" ? "subscription" : s.availKind === "api" ? "API" : "enterprise"}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── Scene: Find Your Fit ─────────────────────────────────────────────────────

function FitScene() {
  const [active, setActive] = useState<FitOption | null>(null);

  const recommended = active
    ? SURFACES.filter((s) => active.recommend.includes(s.id))
    : [];

  return (
    <div>
      {/* Option buttons */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        {FIT_OPTIONS.map((opt) => (
          <button
            key={opt.id}
            onClick={() => setActive(active?.id === opt.id ? null : opt)}
            className={`glass rounded-xl p-4 border text-left transition-all duration-150 ${
              active?.id === opt.id
                ? "border-egg-400/30 bg-egg-400/10"
                : "border-white/8 hover:border-white/15"
            }`}
          >
            <span className="text-2xl mb-2 block">{opt.emoji}</span>
            <p className="text-sm font-semibold text-white mb-1">{opt.label}</p>
            <p className="text-[11px] text-slate-600 leading-relaxed">{opt.description}</p>
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {active && (
          <motion.div
            key={active.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
          >
            {/* Reason */}
            <div className="glass rounded-xl p-4 border border-egg-400/15 mb-4">
              <p className="text-sm text-slate-300 leading-relaxed">{active.reason}</p>
            </div>

            {/* Recommended cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {recommended.map((surface, i) => {
                const c = CAT[surface.category];
                return (
                  <motion.div
                    key={surface.id}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.06 }}
                    className={`glass rounded-xl p-4 border ${c.border}`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <span className="text-xl">{surface.icon}</span>
                      <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded border ${c.bg} ${c.border} ${c.color}`}>
                        {surface.category}
                      </span>
                    </div>
                    <p className="text-sm font-semibold text-white mb-1">{surface.name}</p>
                    <p className="text-[11px] text-slate-500 leading-relaxed">{surface.tagline}</p>
                    {surface.access.type === "command" ? (
                      <div className={`mt-3 rounded-lg px-2.5 py-1.5 ${c.bg} border ${c.border} flex items-center gap-1`}>
                        <code className={`text-[10px] font-mono ${c.color} truncate`}>$ {surface.access.value}</code>
                        <CopyButton value={surface.access.value} />
                      </div>
                    ) : (
                      <p className={`mt-3 text-[10px] font-mono ${c.color}`}>{surface.access.value}</p>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}
        {!active && (
          <motion.p
            key="hint"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-sm text-slate-600 font-mono text-center py-8"
          >
            Select a use case above to see recommended surfaces
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Scene config ──────────────────────────────────────────────────────────────

const SCENES: { id: Scene; label: string; icon: string }[] = [
  { id: "directory", label: "01 · All Surfaces", icon: "🗂" },
  { id: "quickstart", label: "02 · Quick Start", icon: "⚡" },
  { id: "fit", label: "03 · Find Your Fit", icon: "🎯" },
];

// ─── Main export ───────────────────────────────────────────────────────────────

export default function ClaudeInterfacesExplainer() {
  const [scene, setScene] = useState<Scene>("directory");

  return (
    <div className="rounded-2xl border border-white/8 bg-[#080c14] overflow-hidden">
      {/* Header */}
      <div className="border-b border-white/5 px-5 py-4 flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-lg bg-egg-400/15 border border-egg-400/20 flex items-center justify-center text-sm">
            ◉
          </div>
          <div>
            <p className="text-sm font-semibold text-white leading-none">All Ways to Use Claude</p>
            <p className="text-[10px] font-mono text-slate-600 mt-0.5">
              {SURFACES.length} surfaces · web · mobile · IDE · API · enterprise · labs
            </p>
          </div>
        </div>

        {/* Scene tabs */}
        <div className="flex items-center gap-1 p-1 rounded-xl bg-white/[0.03] border border-white/5">
          {SCENES.map((s) => (
            <button
              key={s.id}
              onClick={() => setScene(s.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all duration-150 whitespace-nowrap ${
                scene === s.id
                  ? "bg-egg-400/20 text-egg-300 border border-egg-400/25"
                  : "text-slate-500 hover:text-slate-300"
              }`}
            >
              <span className="mr-1">{s.icon}</span>
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* Scene body */}
      <div className="p-5">
        <AnimatePresence mode="wait">
          <motion.div
            key={scene}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2 }}
          >
            {scene === "directory" && <DirectoryScene />}
            {scene === "quickstart" && <QuickStartScene />}
            {scene === "fit" && <FitScene />}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Footer */}
      <div className="border-t border-white/5 px-5 py-3 flex items-center justify-between gap-2">
        <p className="text-[10px] font-mono text-slate-700">
          Eggthropic-curated directory · verified May 2026
        </p>
        <a
          href="https://www.anthropic.com/claude"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[10px] font-mono text-slate-600 hover:text-slate-400 transition-colors"
        >
          anthropic.com/claude ↗
        </a>
      </div>
    </div>
  );
}
