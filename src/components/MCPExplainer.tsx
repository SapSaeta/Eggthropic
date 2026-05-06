"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ─── Types ────────────────────────────────────────────────────────────────────

type TraceStep = {
  id: number;
  direction: "request" | "response";
  from: string;
  to: string;
  method: string;
  payload: object;
  label: string;
  description: string;
};

type Primitive = "tools" | "resources" | "prompts";
type Scene = "architecture" | "primitives" | "trace";

// ─── MCP trace steps ──────────────────────────────────────────────────────────

const TRACE_STEPS: TraceStep[] = [
  {
    id: 1,
    direction: "request",
    from: "HOST",
    to: "CLIENT",
    method: "tools/list",
    label: "Discover tools",
    description: "Claude asks the MCP client what tools are available on the server.",
    payload: { jsonrpc: "2.0", id: 1, method: "tools/list", params: {} },
  },
  {
    id: 2,
    direction: "request",
    from: "CLIENT",
    to: "SERVER",
    method: "tools/list",
    label: "Forward to server",
    description: "The client forwards the request to the MCP server over stdio/SSE.",
    payload: { jsonrpc: "2.0", id: 1, method: "tools/list", params: {} },
  },
  {
    id: 3,
    direction: "response",
    from: "SERVER",
    to: "CLIENT",
    method: "tools/list result",
    label: "Server responds",
    description: "The MCP server returns its tool definitions as a JSON schema list.",
    payload: {
      jsonrpc: "2.0",
      id: 1,
      result: {
        tools: [
          {
            name: "search_docs",
            description: "Search the MCP documentation",
            inputSchema: {
              type: "object",
              properties: { query: { type: "string" } },
              required: ["query"],
            },
          },
        ],
      },
    },
  },
  {
    id: 4,
    direction: "request",
    from: "HOST",
    to: "SERVER",
    method: "tools/call",
    label: "Claude calls a tool",
    description: "Claude decides to call search_docs with a query argument.",
    payload: {
      jsonrpc: "2.0",
      id: 2,
      method: "tools/call",
      params: { name: "search_docs", arguments: { query: "MCP server transport" } },
    },
  },
  {
    id: 5,
    direction: "response",
    from: "SERVER",
    to: "HOST",
    method: "tools/call result",
    label: "Tool result returned",
    description: "The server executes the tool and returns structured content to Claude.",
    payload: {
      jsonrpc: "2.0",
      id: 2,
      result: {
        content: [
          {
            type: "text",
            text: "MCP supports two transports: stdio (local) and SSE (remote). Stdio uses standard input/output for local processes. SSE uses HTTP Server-Sent Events for remote servers.",
          },
        ],
        isError: false,
      },
    },
  },
];

// ─── Primitives data ──────────────────────────────────────────────────────────

const PRIMITIVES = {
  tools: {
    color: "#00d4ff",
    colorClass: "text-cyan-400",
    borderClass: "border-cyan-400/30",
    bgClass: "bg-cyan-400/10",
    icon: "⚙",
    title: "Tools",
    tagline: "Executable functions the model can call",
    description:
      "Tools are actions. Claude can call a tool to fetch data, run code, write a file, or trigger an API — anything with a side effect or external dependency. Each tool has a name, description, and a JSON Schema input definition.",
    example: {
      label: "Tool definition",
      code: JSON.stringify(
        {
          name: "get_weather",
          description: "Get current weather for a city",
          inputSchema: {
            type: "object",
            properties: {
              city: { type: "string", description: "City name" },
              units: { type: "string", enum: ["celsius", "fahrenheit"] },
            },
            required: ["city"],
          },
        },
        null,
        2
      ),
    },
    callExample: {
      label: "Tool call (from Claude)",
      code: JSON.stringify(
        {
          jsonrpc: "2.0",
          id: 1,
          method: "tools/call",
          params: {
            name: "get_weather",
            arguments: { city: "Barcelona", units: "celsius" },
          },
        },
        null,
        2
      ),
    },
  },
  resources: {
    color: "#a855f7",
    colorClass: "text-purple-400",
    borderClass: "border-purple-400/30",
    bgClass: "bg-purple-400/10",
    icon: "◈",
    title: "Resources",
    tagline: "Structured data included in the model's context",
    description:
      "Resources are read-only data sources. A resource has a URI and returns content (text, JSON, binary) when read. Claude uses resources to include context — a file, a database record, a configuration — without needing to call a tool.",
    example: {
      label: "Resource definition",
      code: JSON.stringify(
        {
          uri: "file:///project/README.md",
          name: "Project README",
          description: "Main project documentation",
          mimeType: "text/markdown",
        },
        null,
        2
      ),
    },
    callExample: {
      label: "Resource read request",
      code: JSON.stringify(
        {
          jsonrpc: "2.0",
          id: 1,
          method: "resources/read",
          params: { uri: "file:///project/README.md" },
        },
        null,
        2
      ),
    },
  },
  prompts: {
    color: "#f59e0b",
    colorClass: "text-amber-400",
    borderClass: "border-amber-400/30",
    bgClass: "bg-amber-400/10",
    icon: "✦",
    title: "Prompts",
    tagline: "Reusable instruction templates with arguments",
    description:
      "Prompts are parameterised templates. A server can expose a prompt like 'explain this code' or 'summarise this ticket' — with typed arguments. Claude can discover and invoke them, keeping complex instructions out of the client.",
    example: {
      label: "Prompt definition",
      code: JSON.stringify(
        {
          name: "code_review",
          description: "Review a code snippet for bugs and style issues",
          arguments: [
            { name: "code", description: "The code to review", required: true },
            { name: "language", description: "Programming language", required: false },
          ],
        },
        null,
        2
      ),
    },
    callExample: {
      label: "Prompt get request",
      code: JSON.stringify(
        {
          jsonrpc: "2.0",
          id: 1,
          method: "prompts/get",
          params: {
            name: "code_review",
            arguments: { code: "const x = 1", language: "javascript" },
          },
        },
        null,
        2
      ),
    },
  },
};

// ─── Architecture diagram ─────────────────────────────────────────────────────

const NODES = [
  {
    id: "HOST",
    label: "HOST",
    sublabel: "Claude",
    color: "#ffd21a",
    border: "border-[#ffd21a]/40",
    bg: "bg-[#ffd21a]/10",
    text: "text-[#ffd21a]",
    icon: "🥚",
  },
  {
    id: "CLIENT",
    label: "CLIENT",
    sublabel: "MCP Client",
    color: "#00d4ff",
    border: "border-cyan-400/40",
    bg: "bg-cyan-400/10",
    text: "text-cyan-400",
    icon: "⬡",
  },
  {
    id: "SERVER",
    label: "SERVER",
    sublabel: "MCP Server",
    color: "#a855f7",
    border: "border-purple-400/40",
    bg: "bg-purple-400/10",
    text: "text-purple-400",
    icon: "◈",
  },
];

function ArchitectureScene() {
  const [activeStep, setActiveStep] = useState<number>(-1);
  const [running, setRunning] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const step = TRACE_STEPS[activeStep];

  function runTrace() {
    setRunning(true);
    setActiveStep(0);
  }

  function reset() {
    if (timerRef.current) clearTimeout(timerRef.current);
    setRunning(false);
    setActiveStep(-1);
  }

  useEffect(() => {
    if (!running) return;
    if (activeStep >= TRACE_STEPS.length - 1) {
      const t = setTimeout(() => setRunning(false), 0);
      return () => clearTimeout(t);
    }
    timerRef.current = setTimeout(() => {
      setActiveStep((s) => s + 1);
    }, 1800);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [running, activeStep]);

  const activeFrom = step?.from;
  const activeTo = step?.to;

  function isArrowActive(a: string, b: string) {
    if (!step) return false;
    if (step.direction === "request") return step.from === a && step.to === b;
    return step.from === b && step.to === a;
  }

  function isNodeActive(id: string) {
    if (!step) return false;
    return step.from === id || step.to === id;
  }

  return (
    <div className="space-y-8">
      {/* Diagram */}
      <div className="relative flex items-center justify-between gap-2 py-8">
        {/* Background grid */}
        <div
          className="absolute inset-0 rounded-2xl opacity-[0.03]"
          style={{
            backgroundImage: "linear-gradient(rgba(255,255,255,.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.5) 1px, transparent 1px)",
            backgroundSize: "30px 30px",
          }}
        />

        {NODES.map((node, i) => (
          <div key={node.id} className="relative flex-1 flex items-center">
            {/* Node */}
            <motion.div
              className={`relative z-10 w-full rounded-2xl border p-4 text-center transition-all duration-300 ${node.border} ${
                isNodeActive(node.id)
                  ? `${node.bg} opacity-100`
                  : "bg-white/[0.02] opacity-60"
              }`}
              animate={isNodeActive(node.id) ? { scale: 1.03 } : { scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <div className="text-2xl mb-1">{node.icon}</div>
              <div className={`font-mono text-xs font-bold tracking-widest ${node.text}`}>
                {node.label}
              </div>
              <div className="text-[10px] text-slate-500 mt-0.5">{node.sublabel}</div>
              {isNodeActive(node.id) && (
                <motion.div
                  className="absolute inset-0 rounded-2xl pointer-events-none"
                  style={{ boxShadow: `0 0 20px ${node.color}40` }}
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 1, repeat: Infinity }}
                />
              )}
            </motion.div>

            {/* Arrow to next */}
            {i < NODES.length - 1 && (
              <div className="relative flex-shrink-0 w-12 flex flex-col items-center">
                {/* Forward arrow */}
                <div className={`relative w-full h-[2px] transition-colors duration-300 ${
                  isArrowActive(NODES[i].id, NODES[i + 1].id)
                    ? "bg-cyan-400"
                    : "bg-white/10"
                }`}>
                  <span className={`absolute right-0 top-1/2 -translate-y-1/2 text-xs transition-colors duration-300 ${
                    isArrowActive(NODES[i].id, NODES[i + 1].id) ? "text-cyan-400" : "text-white/10"
                  }`}>▶</span>
                  {isArrowActive(NODES[i].id, NODES[i + 1].id) && (
                    <motion.div
                      className="absolute top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-cyan-400"
                      initial={{ left: "0%" }}
                      animate={{ left: "90%" }}
                      transition={{ duration: 0.6, ease: "easeInOut" }}
                    />
                  )}
                </div>

                {/* JSON-RPC label */}
                <span className="text-[9px] font-mono text-slate-600 mt-1 whitespace-nowrap">
                  JSON-RPC 2.0
                </span>

                {/* Reverse arrow */}
                <div className={`relative w-full h-[2px] mt-1 transition-colors duration-300 ${
                  isArrowActive(NODES[i + 1].id, NODES[i].id)
                    ? "bg-purple-400"
                    : "bg-white/10"
                }`}>
                  <span className={`absolute left-0 top-1/2 -translate-y-1/2 text-xs transition-colors duration-300 ${
                    isArrowActive(NODES[i + 1].id, NODES[i].id) ? "text-purple-400" : "text-white/10"
                  }`}>◀</span>
                  {isArrowActive(NODES[i + 1].id, NODES[i].id) && (
                    <motion.div
                      className="absolute top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-purple-400"
                      initial={{ left: "90%" }}
                      animate={{ left: "0%" }}
                      transition={{ duration: 0.6, ease: "easeInOut" }}
                    />
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Data sources below server */}
      <div className="flex justify-end gap-3 -mt-4 pr-0">
        {["Database", "REST API", "File System"].map((src) => (
          <div
            key={src}
            className={`px-3 py-1.5 rounded-lg border border-purple-400/20 bg-purple-400/5 font-mono text-[10px] text-purple-300/60 transition-opacity duration-300 ${
              step && (activeFrom === "SERVER" || activeTo === "SERVER") ? "opacity-100" : "opacity-40"
            }`}
          >
            {src}
          </div>
        ))}
      </div>

      {/* Step info card */}
      <div className="min-h-[120px]">
        <AnimatePresence mode="wait">
          {step ? (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
              className="glass rounded-xl p-5 border border-white/10"
            >
              <div className="flex items-center gap-3 mb-2">
                <span className={`font-mono text-[10px] tracking-widest px-2 py-0.5 rounded-full border ${
                  step.direction === "request"
                    ? "text-cyan-400 border-cyan-400/30 bg-cyan-400/10"
                    : "text-purple-400 border-purple-400/30 bg-purple-400/10"
                }`}>
                  {step.direction === "request" ? "→ REQUEST" : "← RESPONSE"}
                </span>
                <span className="font-mono text-xs text-slate-400">{step.from} → {step.to}</span>
                <span className="font-mono text-xs text-egg-400 ml-auto">
                  Step {step.id}/{TRACE_STEPS.length}
                </span>
              </div>
              <p className="text-sm font-semibold text-white mb-1">{step.label}</p>
              <p className="text-sm text-slate-400">{step.description}</p>
            </motion.div>
          ) : (
            <motion.div
              key="idle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="glass rounded-xl p-5 border border-white/5 flex items-center justify-center"
            >
              <p className="text-sm text-slate-500 font-mono">
                Press <span className="text-egg-400">Run Trace</span> to watch a live MCP request flow step by step.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-3">
        <button
          onClick={runTrace}
          disabled={running}
          className="px-5 py-2.5 rounded-lg bg-egg-400 text-lab-900 font-semibold text-sm hover:bg-egg-300 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {running ? "Running…" : activeStep >= 0 ? "Run again" : "Run Trace"}
        </button>
        {activeStep >= 0 && (
          <button
            onClick={reset}
            className="px-4 py-2.5 rounded-lg glass border border-white/10 text-slate-400 text-sm hover:text-white transition-colors"
          >
            Reset
          </button>
        )}
        {/* Progress dots */}
        <div className="flex gap-1.5 ml-auto">
          {TRACE_STEPS.map((_, i) => (
            <div
              key={i}
              className={`w-1.5 h-1.5 rounded-full transition-colors duration-300 ${
                i <= activeStep ? "bg-egg-400" : "bg-white/10"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Primitives scene ─────────────────────────────────────────────────────────

function PrimitivesScene() {
  const [active, setActive] = useState<Primitive>("tools");
  const [showCall, setShowCall] = useState(false);
  const prim = PRIMITIVES[active];

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex gap-2">
        {(Object.keys(PRIMITIVES) as Primitive[]).map((key) => {
          const p = PRIMITIVES[key];
          const isActive = active === key;
          return (
            <button
              key={key}
              onClick={() => { setActive(key); setShowCall(false); }}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-mono text-sm font-semibold transition-all duration-200 border ${
                isActive
                  ? `${p.bgClass} ${p.borderClass} ${p.colorClass}`
                  : "bg-white/[0.02] border-white/10 text-slate-500 hover:text-slate-300"
              }`}
            >
              <span>{p.icon}</span>
              {p.title}
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
          className="grid grid-cols-1 lg:grid-cols-2 gap-5"
        >
          {/* Description */}
          <div className={`glass rounded-2xl p-6 border ${prim.borderClass}`}>
            <div className="flex items-center gap-3 mb-4">
              <span
                className="text-3xl"
                style={{ textShadow: `0 0 20px ${prim.color}` }}
              >
                {prim.icon}
              </span>
              <div>
                <h3 className={`font-bold text-lg ${prim.colorClass}`}>{prim.title}</h3>
                <p className="text-xs text-slate-500 font-mono">{prim.tagline}</p>
              </div>
            </div>
            <p className="text-sm text-slate-300 leading-relaxed">{prim.description}</p>

            <div className="mt-5 flex gap-2">
              <button
                onClick={() => setShowCall(false)}
                className={`text-xs font-mono px-3 py-1.5 rounded-lg border transition-colors ${
                  !showCall ? `${prim.bgClass} ${prim.borderClass} ${prim.colorClass}` : "bg-white/5 border-white/10 text-slate-500"
                }`}
              >
                Definition
              </button>
              <button
                onClick={() => setShowCall(true)}
                className={`text-xs font-mono px-3 py-1.5 rounded-lg border transition-colors ${
                  showCall ? `${prim.bgClass} ${prim.borderClass} ${prim.colorClass}` : "bg-white/5 border-white/10 text-slate-500"
                }`}
              >
                JSON-RPC call
              </button>
            </div>
          </div>

          {/* Code panel */}
          <div className="rounded-2xl border border-white/10 bg-[#060a11] overflow-hidden">
            <div className="flex items-center gap-2 px-4 py-2.5 border-b border-white/5">
              <div className="flex gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-white/10" />
                <span className="w-2.5 h-2.5 rounded-full bg-white/10" />
                <span className="w-2.5 h-2.5 rounded-full bg-white/10" />
              </div>
              <span className="font-mono text-[10px] text-slate-500 ml-2">
                {showCall ? prim.callExample.label : prim.example.label}
              </span>
            </div>
            <AnimatePresence mode="wait">
              <motion.pre
                key={showCall ? "call" : "def"}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="p-4 text-xs font-mono text-slate-300 overflow-auto leading-relaxed"
                style={{ maxHeight: "280px" }}
              >
                <JsonHighlight code={showCall ? prim.callExample.code : prim.example.code} />
              </motion.pre>
            </AnimatePresence>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

// ─── Message trace scene ──────────────────────────────────────────────────────

function TraceScene() {
  const [visibleSteps, setVisibleSteps] = useState<number>(0);
  const [running, setRunning] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  function start() {
    setVisibleSteps(0);
    setRunning(true);
  }

  useEffect(() => {
    if (!running) return;
    if (visibleSteps >= TRACE_STEPS.length) { const t = setTimeout(() => setRunning(false), 0); return () => clearTimeout(t); }
    const t = setTimeout(() => setVisibleSteps((v) => v + 1), 900);
    return () => clearTimeout(t);
  }, [running, visibleSteps]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [visibleSteps]);

  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-white/10 bg-[#060a11] overflow-hidden">
        <div className="flex items-center gap-2 px-4 py-2.5 border-b border-white/5">
          <div className="flex gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-400/60" />
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400/60" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400/60" />
          </div>
          <span className="font-mono text-[10px] text-slate-500 ml-2">MCP message trace</span>
          {running && (
            <span className="ml-auto flex items-center gap-1.5 font-mono text-[10px] text-emerald-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              LIVE
            </span>
          )}
        </div>

        <div className="p-4 space-y-3 overflow-y-auto" style={{ maxHeight: "420px" }}>
          <AnimatePresence>
            {TRACE_STEPS.slice(0, visibleSteps).map((step) => (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-1"
              >
                <div className={`flex items-center gap-2 font-mono text-[10px] ${
                  step.direction === "request" ? "text-cyan-400" : "text-purple-400"
                }`}>
                  <span>{step.direction === "request" ? "→" : "←"}</span>
                  <span>{step.from} → {step.to}</span>
                  <span className="text-slate-600">·</span>
                  <span className="text-slate-500">{step.label}</span>
                </div>
                <pre className="text-xs text-slate-400 font-mono bg-white/[0.02] rounded-lg p-3 overflow-x-auto leading-relaxed">
                  <JsonHighlight code={JSON.stringify(step.payload, null, 2)} />
                </pre>
              </motion.div>
            ))}
          </AnimatePresence>

          {visibleSteps === 0 && (
            <p className="text-sm text-slate-600 font-mono text-center py-8">
              Press <span className="text-egg-400">Start Trace</span> to replay a full MCP conversation.
            </p>
          )}

          {running && visibleSteps < TRACE_STEPS.length && (
            <motion.div
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 0.8, repeat: Infinity }}
              className="font-mono text-[10px] text-slate-600"
            >
              waiting for response…
            </motion.div>
          )}

          <div ref={bottomRef} />
        </div>
      </div>

      <div className="flex gap-3">
        <button
          onClick={start}
          disabled={running}
          className="px-5 py-2.5 rounded-lg bg-egg-400 text-lab-900 font-semibold text-sm hover:bg-egg-300 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {running ? "Tracing…" : visibleSteps > 0 ? "Replay" : "Start Trace"}
        </button>
        {visibleSteps > 0 && !running && (
          <button
            onClick={() => setVisibleSteps(0)}
            className="px-4 py-2.5 rounded-lg glass border border-white/10 text-slate-400 text-sm hover:text-white transition-colors"
          >
            Clear
          </button>
        )}
      </div>
    </div>
  );
}

// ─── JSON syntax highlight ────────────────────────────────────────────────────

function JsonHighlight({ code }: { code: string }) {
  const html = code
    .replace(/("(?:[^"\\]|\\.)*")(\s*:)/g, '<span style="color:#7dd3fc">$1</span>$2')
    .replace(/:\s*("(?:[^"\\]|\\.)*")/g, ': <span style="color:#86efac">$1</span>')
    .replace(/:\s*(true|false|null)/g, ': <span style="color:#fb923c">$1</span>')
    .replace(/:\s*(-?\d+\.?\d*)/g, ': <span style="color:#c4b5fd">$1</span>');
  return <span dangerouslySetInnerHTML={{ __html: html }} />;
}

// ─── Main component ───────────────────────────────────────────────────────────

const SCENES: { id: Scene; label: string; description: string }[] = [
  { id: "architecture", label: "Architecture", description: "How the pieces connect" },
  { id: "primitives", label: "3 Primitives", description: "Tools · Resources · Prompts" },
  { id: "trace", label: "Message Trace", description: "Raw JSON-RPC in motion" },
];

export default function MCPExplainer() {
  const [scene, setScene] = useState<Scene>("architecture");

  return (
    <div
      className="relative rounded-2xl border border-white/[0.06] overflow-hidden"
      style={{ backgroundColor: "#080c14" }}
    >
      {/* Scene tabs */}
      <div className="flex border-b border-white/[0.06]">
        {SCENES.map((s, i) => (
          <button
            key={s.id}
            onClick={() => setScene(s.id)}
            className={`flex-1 flex flex-col items-center gap-0.5 px-4 py-3.5 transition-colors border-r border-white/[0.06] last:border-r-0 ${
              scene === s.id
                ? "bg-white/[0.04] text-white"
                : "text-slate-500 hover:text-slate-300 hover:bg-white/[0.02]"
            }`}
          >
            <span className="font-mono text-xs font-semibold tracking-wider">
              {String(i + 1).padStart(2, "0")} · {s.label}
            </span>
            <span className="font-mono text-[10px] text-slate-600">{s.description}</span>
            {scene === s.id && (
              <motion.div
                layoutId="scene-indicator"
                className="absolute bottom-0 h-[2px] w-16 bg-egg-400 rounded-full"
              />
            )}
          </button>
        ))}
      </div>

      {/* Scene content */}
      <div className="p-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={scene}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25 }}
          >
            {scene === "architecture" && <ArchitectureScene />}
            {scene === "primitives" && <PrimitivesScene />}
            {scene === "trace" && <TraceScene />}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Footer */}
      <div className="border-t border-white/[0.04] px-6 py-3 flex items-center justify-between">
        <span className="font-mono text-[10px] text-slate-600">
          MCP Spec 2025-11-25 · JSON-RPC 2.0 · stdio / SSE transport
        </span>
        <a
          href="https://modelcontextprotocol.io/specification/2025-11-25"
          target="_blank"
          rel="noopener noreferrer"
          className="font-mono text-[10px] text-slate-500 hover:text-egg-400 transition-colors"
        >
          Official spec ↗
        </a>
      </div>
    </div>
  );
}
