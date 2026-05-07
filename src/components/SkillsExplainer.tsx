"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ─── Types ────────────────────────────────────────────────────────────────────

type Scene = "structure" | "anatomy" | "invocation";
type AnatomyField = "name" | "description" | "tools" | "examples" | "instructions";

// ─── File tree ────────────────────────────────────────────────────────────────

type FileNode = {
  name: string;
  type: "dir" | "file";
  depth: number;
  ext?: string;
  active?: boolean;
};

const FILE_TREE: FileNode[] = [
  { name: ".claude/", type: "dir", depth: 0 },
  { name: "skills/", type: "dir", depth: 1 },
  { name: "pr-describe/", type: "dir", depth: 2, active: true },
  { name: "SKILL.md", type: "file", depth: 3, ext: "md", active: true },
  { name: "get-diff.sh", type: "file", depth: 3, ext: "sh" },
  { name: "sample-output.md", type: "file", depth: 3, ext: "md" },
];

// ─── Discovery steps ──────────────────────────────────────────────────────────

type DiscoveryStep = {
  id: number;
  label: string;
  description: string;
  highlightFile?: string;
  badge?: string;
};

const DISCOVERY_STEPS: DiscoveryStep[] = [
  {
    id: 1,
    label: "Discover skills directory",
    description:
      "Claude Code looks for .claude/skills/ in the project workspace. Each subdirectory is a candidate skill — Claude reads its SKILL.md to learn what it does.",
    highlightFile: "skills/",
  },
  {
    id: 2,
    label: "Read SKILL.md frontmatter",
    description:
      "For each subdirectory, Claude reads SKILL.md and parses the YAML frontmatter — name, description, tools, examples.",
    highlightFile: "SKILL.md",
  },
  {
    id: 3,
    label: "Available as slash command",
    description:
      "In Claude Code, the skill name becomes a slash command. /pr-describe is now invocable — no extra configuration needed beyond the directory.",
    badge: "/pr-describe",
  },
  {
    id: 4,
    label: "Load on invocation",
    description:
      "When /pr-describe runs, Claude loads the full SKILL.md into context and executes the instructions with access to any listed tools.",
    badge: "Instructions active",
  },
];

// ─── Anatomy fields ───────────────────────────────────────────────────────────

type FieldConfig = {
  label: string;
  required: boolean;
  description: string;
  example: string;
  color: string;
  bgClass: string;
  borderClass: string;
};

const ANATOMY_FIELDS: Record<AnatomyField, FieldConfig> = {
  name: {
    label: "name",
    required: true,
    description:
      "The skill identifier — becomes the slash command name automatically. Must be kebab-case. This single field is enough to make /pr-describe available in Claude Code.",
    example: "name: pr-describe",
    color: "text-sky-400",
    bgClass: "bg-sky-500/10",
    borderClass: "border-sky-500/25",
  },
  description: {
    label: "description",
    required: true,
    description:
      "Plain-language description of what the skill does. Claude uses this to understand when the skill is relevant; it may also surface the skill in autocomplete suggestions.",
    example: "description: Generate a structured PR description\n  from staged git changes following\n  conventional commits.",
    color: "text-emerald-400",
    bgClass: "bg-emerald-500/10",
    borderClass: "border-emerald-500/25",
  },
  tools: {
    label: "tools",
    required: false,
    description:
      "Tools the skill needs access to. Claude Code requests permission for these when the skill runs. Common values: bash, read, edit, web_fetch. Omit if the skill only generates text.",
    example: "tools:\n  - bash\n  - read",
    color: "text-violet-400",
    bgClass: "bg-violet-500/10",
    borderClass: "border-violet-500/25",
  },
  examples: {
    label: "examples",
    required: false,
    description:
      'Natural language phrases that trigger this skill. Helps Claude surface the skill via autocomplete when users type similar requests — even without the leading slash.',
    example: 'examples:\n  - "Generate a PR description"\n  - "Describe my staged changes"\n  - "/pr-describe"',
    color: "text-amber-400",
    bgClass: "bg-amber-500/10",
    borderClass: "border-amber-500/25",
  },
  instructions: {
    label: "instructions (body)",
    required: true,
    description:
      "Everything after the YAML frontmatter. Written in Markdown. This is what Claude executes — treat it like a precise, step-by-step system prompt scoped to this task. Supporting files in the same directory are automatically available.",
    example: "## Instructions\n\n1. Run bash get-diff.sh\n2. Identify change type\n3. Generate PR body",
    color: "text-rose-400",
    bgClass: "bg-rose-500/10",
    borderClass: "border-rose-500/25",
  },
};

const FIELD_ORDER: AnatomyField[] = ["name", "description", "tools", "examples", "instructions"];

// ─── Invocation trace ─────────────────────────────────────────────────────────

type TraceEntry = {
  delay: number;
  kind: "input" | "system" | "diff" | "title" | "body";
  content: string;
};

const INVOCATION_TRACE: TraceEntry[] = [
  { delay: 0, kind: "input", content: "/pr-describe" },
  { delay: 700, kind: "system", content: "▸ Loading skill: pr-describe" },
  { delay: 1300, kind: "system", content: "▸ Reading SKILL.md..." },
  { delay: 1900, kind: "system", content: "▸ Tool access granted: bash" },
  { delay: 2500, kind: "system", content: "▸ Running: bash get-diff.sh" },
  {
    delay: 3300,
    kind: "diff",
    content: `diff --git a/src/components/Button.tsx b/src/components/Button.tsx
index 3a1f2b..9c8e45 100644
--- a/src/components/Button.tsx
+++ b/src/components/Button.tsx
@@ -8,6 +8,12 @@ interface ButtonProps {
   children: React.ReactNode;
   onClick?: () => void;
+  variant?: "primary" | "ghost";
+  size?: "sm" | "md" | "lg";`,
  },
  { delay: 4400, kind: "system", content: "▸ Generating PR description..." },
  { delay: 5100, kind: "title", content: "feat(Button): add variant and size props" },
  {
    delay: 5500,
    kind: "body",
    content: `## Summary
- Add \`variant\` prop (primary | ghost) for style control
- Add \`size\` prop (sm | md | lg) for sizing variants
- Maintain backward compatibility — new props default to previous behaviour

## Test Plan
1. Render Button with each variant, verify visual output matches spec
2. Test all three size values at mobile and desktop breakpoints
3. Confirm no visual regression on existing Button usage across the codebase

## Breaking Changes
None — new props are optional with safe defaults.`,
  },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function FileIcon({ ext, type }: { ext?: string; type: "dir" | "file" }) {
  if (type === "dir") return <span className="text-slate-400">📁</span>;
  if (ext === "md") return <span>📄</span>;
  if (ext === "sh") return <span>⚙️</span>;
  return <span>📝</span>;
}

function StructureScene() {
  const [step, setStep] = useState(0);
  const [running, setRunning] = useState(true);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!running) return;
    if (step >= DISCOVERY_STEPS.length - 1) {
      const t = setTimeout(() => setRunning(false), 0);
      return () => clearTimeout(t);
    }
    timerRef.current = setTimeout(() => setStep((s) => s + 1), 2000);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [step, running]);

  function reset() {
    setStep(0);
    setRunning(true);
  }

  const currentStep = DISCOVERY_STEPS[step];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
      {/* File tree */}
      <div className="glass rounded-2xl p-6 border border-white/8">
        <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-4">
          Project workspace
        </p>
        <div className="space-y-1 font-mono text-sm">
          {FILE_TREE.map((node, i) => {
            const isHighlighted =
              (currentStep.highlightFile && node.name === currentStep.highlightFile) ||
              (currentStep.id === 1 && node.name === "skills/");
            return (
              <motion.div
                key={node.name}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.08 }}
                className={`flex items-center gap-2 px-2 py-1 rounded-lg transition-colors duration-300 ${
                  isHighlighted
                    ? "bg-egg-400/15 text-egg-300"
                    : node.active
                    ? "text-slate-300"
                    : "text-slate-600"
                }`}
                style={{ paddingLeft: `${node.depth * 16 + 8}px` }}
              >
                <FileIcon ext={node.ext} type={node.type} />
                <span>{node.name}</span>
                {isHighlighted && (
                  <motion.span
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="ml-auto text-[9px] px-1.5 py-0.5 rounded bg-egg-400/20 text-egg-400 tracking-wide"
                  >
                    ← scanning
                  </motion.span>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Marketplace note */}
        <div className="mt-5 pt-4 border-t border-white/5">
          <p className="text-[11px] text-slate-600 leading-relaxed">
            Skills are also installable from{" "}
            <span className="text-slate-500 font-mono">anthropics/skills</span>{" "}
            — copy the directory and they load automatically.
          </p>
        </div>
      </div>

      {/* Discovery step card */}
      <div className="flex flex-col gap-4">
        {/* Progress dots */}
        <div className="flex items-center gap-2">
          {DISCOVERY_STEPS.map((s, i) => (
            <button
              key={s.id}
              onClick={() => { setStep(i); setRunning(false); }}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === step
                  ? "w-6 bg-egg-400"
                  : i < step
                  ? "w-3 bg-egg-400/40"
                  : "w-3 bg-white/10"
              }`}
            />
          ))}
          <span className="ml-auto text-[10px] font-mono text-slate-600">
            {step + 1}/{DISCOVERY_STEPS.length}
          </span>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
            className="glass rounded-2xl p-6 border border-egg-400/15 flex-1"
          >
            <div className="flex items-center gap-2 mb-3">
              <span className="w-5 h-5 rounded-full bg-egg-400/20 border border-egg-400/30 flex items-center justify-center text-[10px] font-mono text-egg-400">
                {step + 1}
              </span>
              <span className="text-xs font-semibold text-egg-300">
                {currentStep.label}
              </span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed mb-4">
              {currentStep.description}
            </p>
            {currentStep.badge && (
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-egg-400/10 border border-egg-400/20 font-mono text-sm text-egg-300">
                {currentStep.badge}
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        <button
          onClick={reset}
          className="self-start text-xs font-mono text-slate-500 hover:text-slate-300 transition-colors flex items-center gap-1.5"
        >
          <span>↺</span> Replay
        </button>
      </div>
    </div>
  );
}

function AnatomyScene() {
  const [active, setActive] = useState<AnatomyField>("name");
  const field = ANATOMY_FIELDS[active];

  const SKILL_LINES = [
    { text: "---", kind: "delimiter" },
    { text: `name: pr-describe`, kind: "name" },
    {
      text: "description: Generate a structured PR description",
      kind: "description",
    },
    { text: "  from staged git changes following conventional commits.", kind: "description" },
    { text: "tools:", kind: "tools" },
    { text: "  - bash", kind: "tools" },
    { text: "examples:", kind: "examples" },
    { text: '  - "Generate a PR description for my changes"', kind: "examples" },
    { text: '  - "/pr-describe"', kind: "examples" },
    { text: "---", kind: "delimiter" },
    { text: "", kind: "blank" },
    { text: "## Instructions", kind: "instructions" },
    { text: "", kind: "blank" },
    { text: "When invoked, run the following steps:", kind: "instructions" },
    { text: "", kind: "blank" },
    { text: "1. Execute `bash get-diff.sh` to capture staged changes", kind: "instructions" },
    { text: "2. Identify: change type, affected modules, and intent", kind: "instructions" },
    { text: "3. Generate a PR description with:", kind: "instructions" },
    { text: "   - **Title**: `type(scope): description` (≤72 chars)", kind: "instructions" },
    { text: "   - **Summary**: 3 bullet points max", kind: "instructions" },
    { text: "   - **Test Plan**: numbered checklist", kind: "instructions" },
    { text: '   - **Breaking Changes**: list or "None"', kind: "instructions" },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
      {/* SKILL.md viewer */}
      <div className="glass rounded-2xl border border-white/8 overflow-hidden">
        <div className="flex items-center gap-2 px-4 py-2.5 border-b border-white/5 bg-white/[0.02]">
          <span className="text-[10px] font-mono text-slate-500">📄 SKILL.md</span>
          <span className="ml-auto text-[10px] text-slate-600 font-mono">
            .claude/skills/pr-describe/
          </span>
        </div>
        <div className="p-4 font-mono text-xs leading-6 overflow-auto max-h-80">
          {SKILL_LINES.map((line, i) => {
            const fieldKey = line.kind as AnatomyField;
            const isActive = active === fieldKey && line.kind !== "delimiter" && line.kind !== "blank";
            const fieldConf = ANATOMY_FIELDS[fieldKey];
            return (
              <div
                key={i}
                onClick={() => {
                  if (fieldKey && ANATOMY_FIELDS[fieldKey]) setActive(fieldKey);
                }}
                className={`px-2 -mx-2 rounded transition-colors duration-150 ${
                  isActive
                    ? `${fieldConf?.bgClass ?? ""} cursor-pointer`
                    : fieldConf
                    ? "hover:bg-white/[0.03] cursor-pointer"
                    : ""
                }`}
              >
                <span
                  className={
                    isActive && fieldConf
                      ? fieldConf.color
                      : line.kind === "delimiter"
                      ? "text-slate-600"
                      : "text-slate-400"
                  }
                >
                  {line.text || " "}
                </span>
              </div>
            );
          })}
        </div>
        <div className="px-4 py-2 border-t border-white/5 bg-white/[0.02]">
          <p className="text-[10px] text-slate-600">Click any line to inspect that field →</p>
        </div>
      </div>

      {/* Field detail */}
      <div className="flex flex-col gap-3">
        {/* Field tabs */}
        <div className="flex flex-wrap gap-2">
          {FIELD_ORDER.map((f) => {
            const fc = ANATOMY_FIELDS[f];
            return (
              <button
                key={f}
                onClick={() => setActive(f)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono border transition-all duration-150 ${
                  active === f
                    ? `${fc.bgClass} ${fc.borderClass} ${fc.color}`
                    : "bg-white/[0.02] border-white/8 text-slate-500 hover:text-slate-300"
                }`}
              >
                {fc.label}
              </button>
            );
          })}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.2 }}
            className={`glass rounded-2xl p-6 border ${field.borderClass} flex-1`}
          >
            <div className="flex items-center gap-2 mb-3">
              <span className={`font-mono text-sm font-semibold ${field.color}`}>
                {field.label}
              </span>
              <span
                className={`text-[9px] px-1.5 py-0.5 rounded font-mono uppercase tracking-wide ${
                  field.required
                    ? "bg-rose-500/15 text-rose-400 border border-rose-500/20"
                    : "bg-slate-500/15 text-slate-500 border border-slate-500/20"
                }`}
              >
                {field.required ? "required" : "optional"}
              </span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed mb-4">
              {field.description}
            </p>
            <div className={`rounded-xl p-3 ${field.bgClass} border ${field.borderClass}`}>
              <pre className={`text-xs font-mono leading-5 ${field.color} whitespace-pre-wrap`}>
                {field.example}
              </pre>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

function InvocationScene() {
  const [visible, setVisible] = useState<number[]>([]);
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(false);
  const termRef = useRef<HTMLDivElement>(null);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  function clearTimers() {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
  }

  function start() {
    clearTimers();
    setVisible([]);
    setDone(false);
    setRunning(true);
    INVOCATION_TRACE.forEach((entry, i) => {
      const t = setTimeout(() => {
        setVisible((v) => [...v, i]);
        if (termRef.current) {
          termRef.current.scrollTop = termRef.current.scrollHeight;
        }
        if (i === INVOCATION_TRACE.length - 1) {
          setRunning(false);
          setDone(true);
        }
      }, entry.delay);
      timersRef.current.push(t);
    });
  }

  useEffect(() => () => clearTimers(), []);

  function lineColor(kind: TraceEntry["kind"]) {
    switch (kind) {
      case "input": return "text-egg-300";
      case "system": return "text-slate-500";
      case "diff": return "text-cyan-400/80";
      case "title": return "text-emerald-300 font-semibold";
      case "body": return "text-slate-300";
    }
  }

  function linePrefix(kind: TraceEntry["kind"]) {
    switch (kind) {
      case "input": return "$ ";
      case "system": return "";
      case "diff": return "";
      case "title": return "✦ ";
      case "body": return "";
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
      {/* Terminal */}
      <div className="lg:col-span-3 glass rounded-2xl border border-white/8 overflow-hidden flex flex-col">
        <div className="flex items-center gap-2 px-4 py-2.5 border-b border-white/5 bg-white/[0.02]">
          <div className="flex gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500/50" />
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500/50" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/50" />
          </div>
          <span className="text-[10px] font-mono text-slate-500 ml-2">
            claude-code — bash
          </span>
          {running && (
            <span className="ml-auto flex items-center gap-1 text-[10px] font-mono text-egg-400">
              <span className="w-1.5 h-1.5 rounded-full bg-egg-400 animate-pulse" />
              running
            </span>
          )}
          {done && (
            <span className="ml-auto text-[10px] font-mono text-emerald-400">✓ complete</span>
          )}
        </div>
        <div
          ref={termRef}
          className="flex-1 p-4 font-mono text-xs leading-5 overflow-auto max-h-80 space-y-0.5"
        >
          {visible.length === 0 && !running && (
            <p className="text-slate-600">Press &ldquo;Run /pr-describe&rdquo; to start the trace.</p>
          )}
          {INVOCATION_TRACE.map((entry, i) =>
            visible.includes(i) ? (
              <motion.div
                key={i}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.15 }}
                className={lineColor(entry.kind)}
              >
                {entry.kind === "body" || entry.kind === "diff" ? (
                  <pre className={`whitespace-pre-wrap ${lineColor(entry.kind)}`}>
                    {linePrefix(entry.kind)}{entry.content}
                  </pre>
                ) : (
                  <span>
                    {linePrefix(entry.kind)}{entry.content}
                  </span>
                )}
              </motion.div>
            ) : null
          )}
        </div>
      </div>

      {/* Controls + explainer */}
      <div className="lg:col-span-2 flex flex-col gap-4">
        <button
          onClick={start}
          disabled={running}
          className="w-full py-3 rounded-xl bg-egg-400/15 border border-egg-400/25 text-egg-300 text-sm font-mono hover:bg-egg-400/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {running ? "Running..." : done ? "↺ Run again" : "▶ Run /pr-describe"}
        </button>

        <div className="glass rounded-2xl p-5 border border-white/8 flex-1 space-y-4">
          <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">
            What just happened
          </p>
          {[
            { color: "bg-egg-400", label: "Skill loaded", detail: "Claude read SKILL.md and activated the tool permissions listed in the frontmatter." },
            { color: "bg-cyan-400", label: "Helper executed", detail: "bash get-diff.sh ran in the project directory and piped staged changes back to Claude." },
            { color: "bg-emerald-400", label: "Output generated", detail: "Claude followed the instructions in the SKILL.md body to produce a structured, conventional-commits PR description." },
          ].map((item) => (
            <div key={item.label} className="flex gap-3">
              <span className={`mt-1.5 w-2 h-2 rounded-full ${item.color} shrink-0`} />
              <div>
                <p className="text-xs font-semibold text-white mb-0.5">{item.label}</p>
                <p className="text-xs text-slate-500 leading-relaxed">{item.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Scene config ─────────────────────────────────────────────────────────────

const SCENES: { id: Scene; label: string; icon: string }[] = [
  { id: "structure", label: "01 · File Structure", icon: "🗂️" },
  { id: "anatomy", label: "02 · Anatomy", icon: "🔬" },
  { id: "invocation", label: "03 · Invocation", icon: "⚡" },
];

// ─── Main component ───────────────────────────────────────────────────────────

export default function SkillsExplainer() {
  const [scene, setScene] = useState<Scene>("structure");

  return (
    <div className="rounded-2xl border border-white/8 bg-[#080c14] overflow-hidden">
      {/* Header */}
      <div className="border-b border-white/5 px-5 py-4 flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-lg bg-egg-400/15 border border-egg-400/20 flex items-center justify-center text-sm">
            ⚡
          </div>
          <div>
            <p className="text-sm font-semibold text-white leading-none">Agent Skills</p>
            <p className="text-[10px] font-mono text-slate-600 mt-0.5">interactive explainer</p>
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
            {scene === "structure" && <StructureScene />}
            {scene === "anatomy" && <AnatomyScene />}
            {scene === "invocation" && <InvocationScene />}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Footer */}
      <div className="border-t border-white/5 px-5 py-3 flex items-center justify-between gap-2">
        <p className="text-[10px] font-mono text-slate-700">
          Skills format · SKILL.md + YAML frontmatter
        </p>
        <a
          href="https://www.anthropic.com/news/skills"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[10px] font-mono text-slate-600 hover:text-slate-400 transition-colors"
        >
          anthropic.com/news/skills ↗
        </a>
      </div>
    </div>
  );
}
