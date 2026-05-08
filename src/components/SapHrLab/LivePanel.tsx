"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Loader2, ChevronDown, ChevronUp, AlertTriangle } from "lucide-react";
import { LIVE_CASES, type SapHrCase } from "@/lib/sap-hr-knowledge";

type LiveStatus = "idle" | "loading" | "streaming" | "done" | "error";

export function LivePanel() {
  const [selectedCase, setSelectedCase] = useState<SapHrCase | null>(null);
  const [status, setStatus] = useState<LiveStatus>("idle");
  const [response, setResponse] = useState("");
  const [showContext, setShowContext] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  async function ask() {
    if (!selectedCase) return;
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setStatus("loading");
    setResponse("");
    setShowContext(false);

    try {
      const res = await fetch("/api/sap-hr", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ caseId: selectedCase.id }),
        signal: controller.signal,
      });

      if (!res.ok) {
        if (res.status === 503) {
          setResponse(
            "API key not configured. Set ANTHROPIC_API_KEY in your environment variables to enable live queries."
          );
          setStatus("error");
          return;
        }
        throw new Error(`HTTP ${res.status}`);
      }

      setStatus("streaming");
      const reader = res.body?.getReader();
      if (!reader) throw new Error("No response body");

      const decoder = new TextDecoder();
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        setResponse((r) => r + decoder.decode(value, { stream: true }));
      }
      setStatus("done");
    } catch (err) {
      if ((err as Error).name === "AbortError") return;
      setStatus("error");
      setResponse("Something went wrong. Check that ANTHROPIC_API_KEY is set.");
    }
  }

  function reset() {
    abortRef.current?.abort();
    setStatus("idle");
    setResponse("");
    setSelectedCase(null);
    setShowContext(false);
  }

  const isRunning = status === "loading" || status === "streaming";

  return (
    <div className="space-y-6">
      {/* API notice */}
      <div className="flex items-start gap-2.5 p-3 rounded-lg bg-amber-400/5 border border-amber-400/15">
        <AlertTriangle className="w-3.5 h-3.5 text-amber-400 flex-shrink-0 mt-0.5" />
        <p className="text-[11px] text-amber-300/70 leading-relaxed">
          This tab makes real Claude API calls using an embedded SAP HR knowledge base.
          Requires <code className="font-mono bg-white/5 px-1 rounded">ANTHROPIC_API_KEY</code> in environment variables.
          No SAP system connection — all knowledge is curated and static.
        </p>
      </div>

      {/* Case selector */}
      <div>
        <p className="text-xs font-mono text-slate-500 mb-3">Select a question:</p>
        <div className="space-y-2">
          {LIVE_CASES.map((c) => (
            <button
              key={c.id}
              onClick={() => {
                setSelectedCase(c);
                setStatus("idle");
                setResponse("");
              }}
              disabled={isRunning}
              className={`w-full text-left px-4 py-3 rounded-xl border text-sm transition-all ${
                selectedCase?.id === c.id
                  ? "border-egg-400/50 bg-egg-400/5 text-white"
                  : "border-white/8 glass text-slate-400 hover:text-white hover:border-white/16"
              } disabled:cursor-not-allowed disabled:opacity-50`}
            >
              <span className="font-mono">{c.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex gap-3 flex-wrap">
        <button
          onClick={ask}
          disabled={!selectedCase || isRunning}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-egg-400 text-lab-900 text-sm font-semibold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-egg-300 transition-colors"
        >
          {isRunning ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <Sparkles className="w-3.5 h-3.5" />
          )}
          {status === "loading" ? "Connecting…" : status === "streaming" ? "Streaming…" : "Ask Claude"}
        </button>
        {(status === "done" || status === "error") && (
          <button
            onClick={reset}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg glass border border-white/10 text-sm text-slate-400 hover:text-white transition-colors"
          >
            Reset
          </button>
        )}
      </div>

      {/* Response */}
      <AnimatePresence>
        {(status === "streaming" || status === "done" || status === "error") && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-3"
          >
            {/* Context used */}
            {selectedCase && status !== "error" && (
              <div className="glass rounded-xl border border-white/8 overflow-hidden">
                <button
                  onClick={() => setShowContext((v) => !v)}
                  className="w-full flex items-center justify-between px-4 py-2.5 text-xs font-mono text-slate-500 hover:text-slate-300 transition-colors"
                >
                  <span>Context sent to Claude</span>
                  {showContext ? (
                    <ChevronUp className="w-3 h-3" />
                  ) : (
                    <ChevronDown className="w-3 h-3" />
                  )}
                </button>
                <AnimatePresence>
                  {showContext && (
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: "auto" }}
                      exit={{ height: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="px-4 pb-3 border-t border-white/5 pt-2">
                        <p className="text-[10px] text-slate-500 mb-1.5">KB sources included:</p>
                        <ul className="space-y-1">
                          {selectedCase.kbSources.map((src) => (
                            <li key={src} className="text-[11px] font-mono text-slate-400">
                              · {src}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {/* Response area */}
            <div
              className={`glass rounded-xl p-5 border ${
                status === "error" ? "border-rose-400/20" : "border-egg-400/15"
              }`}
            >
              <div className="flex items-center gap-2 mb-3">
                <span className="text-[10px] font-mono text-egg-400/70 uppercase tracking-widest">
                  {status === "error" ? "error" : "claude · live response"}
                </span>
                {status === "streaming" && (
                  <span className="w-1.5 h-1.5 rounded-full bg-egg-400 animate-pulse" />
                )}
              </div>
              <div
                className={`text-sm leading-relaxed whitespace-pre-line ${
                  status === "error" ? "text-rose-300" : "text-slate-300"
                }`}
              >
                {response}
                {status === "streaming" && (
                  <span className="inline-block w-0.5 h-4 bg-egg-400 ml-0.5 animate-pulse align-middle" />
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
