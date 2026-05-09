"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  Loader2,
  ChevronDown,
  ChevronUp,
  Eye,
  EyeOff,
  Key,
  X,
} from "lucide-react";
import Anthropic from "@anthropic-ai/sdk";
import { LIVE_CASES, type SapHrCase } from "@/lib/sap-hr-knowledge";

const LS_KEY = "eggthropic_anthropic_key";

const SYSTEM_PROMPT = `You are a functional assistant for SAP HR On-Premise (HCM). You answer questions about infotypes, transactions, configuration, and process flows based only on the knowledge base context provided.

Rules:
- Answer accurately based on the provided context only
- Use correct SAP terminology (PERNR, BEGDA, ENDDA, infotype, wage type, etc.)
- If the answer requires knowledge not in the context, say so explicitly — do not invent field names or configuration values
- Structure your answer clearly: short paragraphs, bullet points for lists, bold for key terms
- Be practical and direct — your audience is functional SAP HR consultants
- Do not claim to have access to a live SAP system`;

type LiveStatus = "idle" | "streaming" | "done" | "error";

export function LivePanel() {
  const [apiKey, setApiKey] = useState("");
  const [showKey, setShowKey] = useState(false);
  const [selectedCase, setSelectedCase] = useState<SapHrCase | null>(null);
  const [status, setStatus] = useState<LiveStatus>("idle");
  const [response, setResponse] = useState("");
  const [showContext, setShowContext] = useState(false);
  const cancelledRef = useRef(false);

  useEffect(() => {
    const stored = localStorage.getItem(LS_KEY);
    if (stored) setApiKey(stored);
  }, []);

  function saveKey(val: string) {
    setApiKey(val);
    if (val.trim()) {
      localStorage.setItem(LS_KEY, val.trim());
    } else {
      localStorage.removeItem(LS_KEY);
    }
  }

  function clearKey() {
    saveKey("");
    reset();
  }

  async function ask() {
    if (!selectedCase || !apiKey.trim()) return;

    cancelledRef.current = false;
    setStatus("streaming");
    setResponse("");
    setShowContext(false);

    try {
      const client = new Anthropic({
        apiKey: apiKey.trim(),
        dangerouslyAllowBrowser: true,
      });

      const stream = client.messages.stream({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 1024,
        system: `${SYSTEM_PROMPT}\n\n# Knowledge Base\n\n${selectedCase.kbContext}`,
        messages: [{ role: "user", content: selectedCase.question }],
      });

      await new Promise<void>((resolve, reject) => {
        stream.on("text", (text: string) => {
          if (!cancelledRef.current) setResponse((r) => r + text);
        });
        stream.on("finalMessage", () => resolve());
        stream.on("error", (err) => reject(err));
        stream.on("abort", () => resolve());
      });

      if (!cancelledRef.current) setStatus("done");
    } catch (err) {
      if (cancelledRef.current) return;
      const msg = (err as Error).message ?? "";
      if (msg.includes("401") || msg.toLowerCase().includes("auth")) {
        setResponse("Invalid API key — check your key and try again.");
      } else {
        setResponse(`Error: ${msg || "Something went wrong."}`);
      }
      setStatus("error");
    }
  }

  function reset() {
    cancelledRef.current = true;
    setStatus("idle");
    setResponse("");
    setSelectedCase(null);
    setShowContext(false);
  }

  const isRunning = status === "streaming";
  const hasKey = apiKey.trim().length > 0;

  return (
    <div className="space-y-6">
      {/* API key input */}
      <div className="glass rounded-xl p-4 border border-zinc-200 space-y-3">
        <div className="flex items-center gap-2">
          <Key className="w-3.5 h-3.5 text-zinc-600" />
          <span className="text-xs font-mono text-zinc-600">
            Your Anthropic API key
          </span>
          {hasKey && (
            <span className="ml-auto text-[10px] font-mono text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded-full border border-emerald-400/20">
              saved
            </span>
          )}
        </div>

        <div className="relative">
          <input
            type={showKey ? "text" : "password"}
            value={apiKey}
            onChange={(e) => saveKey(e.target.value)}
            placeholder="sk-ant-..."
            className="w-full pr-16 pl-3 py-2 rounded-lg bg-zinc-50 border border-zinc-200 text-sm font-mono text-zinc-900 placeholder-slate-600 focus:outline-none focus:border-egg-400/50 transition-colors"
          />
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
            <button
              onClick={() => setShowKey((v) => !v)}
              className="p-1 text-zinc-500 hover:text-zinc-700 transition-colors"
              aria-label={showKey ? "Hide key" : "Show key"}
            >
              {showKey ? (
                <EyeOff className="w-3.5 h-3.5" />
              ) : (
                <Eye className="w-3.5 h-3.5" />
              )}
            </button>
            {hasKey && (
              <button
                onClick={clearKey}
                className="p-1 text-zinc-500 hover:text-rose-400 transition-colors"
                aria-label="Clear key"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        <p className="text-[10px] text-zinc-400 leading-relaxed">
          Your key goes directly from your browser to the Anthropic API — this
          server never sees it. Stored in{" "}
          <code className="font-mono">localStorage</code>. Clear it with the ×
          button.{" "}
          {!hasKey && (
            <a
              href="https://console.anthropic.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-500 hover:text-zinc-700 transition-colors"
            >
              Get a key →
            </a>
          )}
        </p>
      </div>

      {/* Case selector */}
      <div>
        <p className="text-xs font-mono text-zinc-500 mb-3">
          Select a question:
        </p>
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
                  ? "border-egg-400/50 bg-egg-400/5 text-zinc-900"
                  : "border-zinc-200 glass text-zinc-600 hover:text-zinc-900 hover:border-zinc-300"
              } disabled:cursor-not-allowed disabled:opacity-50`}
            >
              <span className="font-mono">{c.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3 flex-wrap">
        <button
          onClick={ask}
          disabled={!selectedCase || !hasKey || isRunning}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-egg-400 text-zinc-900 text-sm font-semibold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-egg-300 transition-colors"
        >
          {isRunning ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <Sparkles className="w-3.5 h-3.5" />
          )}
          {isRunning ? "Streaming…" : "Ask Claude"}
        </button>
        {(status === "done" || status === "error") && (
          <button
            onClick={reset}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg glass border border-zinc-200 text-sm text-zinc-600 hover:text-zinc-900 transition-colors"
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
            {/* Context panel */}
            {selectedCase && status !== "error" && (
              <div className="glass rounded-xl border border-zinc-200 overflow-hidden">
                <button
                  onClick={() => setShowContext((v) => !v)}
                  className="w-full flex items-center justify-between px-4 py-2.5 text-xs font-mono text-zinc-500 hover:text-zinc-700 transition-colors"
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
                      <div className="px-4 pb-3 border-t border-zinc-200 pt-2">
                        <p className="text-[10px] text-zinc-500 mb-1.5">
                          KB sources included:
                        </p>
                        <ul className="space-y-1">
                          {selectedCase.kbSources.map((src) => (
                            <li
                              key={src}
                              className="text-[11px] font-mono text-zinc-600"
                            >
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

            {/* Response box */}
            <div
              className={`glass rounded-xl p-5 border ${
                status === "error"
                  ? "border-rose-400/20"
                  : "border-egg-400/15"
              }`}
            >
              <div className="flex items-center gap-2 mb-3">
                <span className="text-[10px] font-mono text-egg-400/70 uppercase tracking-widest">
                  {status === "error" ? "error" : "claude · live"}
                </span>
                {status === "streaming" && (
                  <span className="w-1.5 h-1.5 rounded-full bg-egg-400 animate-pulse" />
                )}
              </div>
              <div
                className={`text-sm leading-relaxed whitespace-pre-line ${
                  status === "error" ? "text-rose-300" : "text-zinc-700"
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
