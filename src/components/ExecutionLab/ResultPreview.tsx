"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import type { ScenarioResult } from "@/lib/execution-scenarios";

interface Props {
  visible: boolean;
  result: ScenarioResult;
}

function colorize(raw: string, language: "tsx" | "json" | "md"): string {
  let s = raw.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

  if (language === "json") {
    s = s.replace(/"([^"]+)"(\s*:)/g, '<span class="text-sky-400">"$1"</span>$2');
    s = s.replace(/:\s*"([^"]+)"/g, (_m, v: string) => `: <span class="text-emerald-400">"${v}"</span>`);
    s = s.replace(/:\s*(-?\d+\.?\d*)/g, (_m, v: string) => `: <span class="text-amber-400">${v}</span>`);
    s = s.replace(/\b(true|false|null)\b/g, '<span class="text-violet-400">$1</span>');
    return s;
  }

  if (language === "md") {
    return s
      .split("\n")
      .map((line) => {
        if (/^##\s/.test(line)) return `<span class="text-egg-400">${line}</span>`;
        if (/^#\s/.test(line)) return `<span class="text-egg-400">${line}</span>`;
        if (/^- \[x\]/.test(line)) return `<span class="text-emerald-400">${line}</span>`;
        if (/^- \[ \]/.test(line)) return `<span class="text-amber-400">${line}</span>`;
        if (/^\*\*/.test(line)) return `<span class="text-white">${line}</span>`;
        if (/^-\s/.test(line)) return `<span class="text-slate-300">${line}</span>`;
        return `<span class="text-slate-400">${line}</span>`;
      })
      .join("\n");
  }

  // TSX
  s = s.replace(/(\/\/.+)/g, '<span class="text-slate-500">$1</span>');
  s = s.replace(
    /\b(export|function|return|const|let|var|import|from|default)\b/g,
    '<span class="text-violet-400">$1</span>'
  );
  s = s.replace(/(&lt;\/?)([\w]+)/g, '$1<span class="text-sky-400">$2</span>');
  s = s.replace(/(className=")([^"]+)(")/g, '$1<span class="text-amber-400">$2</span>$3');
  s = s.replace(/(?<![>=])"([^"<>]+)"/g, '<span class="text-emerald-400">"$1"</span>');
  return s;
}

export default function ResultPreview({ visible, result }: Props) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 8 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="glass rounded-2xl overflow-hidden mt-4"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-3 border-b border-white/8 bg-white/[0.02]">
            <span className="font-mono text-[10px] tracking-widest text-slate-500 uppercase">
              Simulation Output
            </span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-400/10 border border-emerald-400/20 text-emerald-400 text-[10px] font-mono">
              ✓ Complete
            </span>
          </div>

          <div className="p-5 flex flex-col lg:flex-row gap-6">
            {/* Left: metrics + list */}
            <div className="lg:w-64 shrink-0 flex flex-col gap-4">
              {/* Metrics */}
              <div className="flex flex-wrap gap-2">
                {result.metrics.map((m) => (
                  <div key={m.label} className="glass rounded-lg px-2.5 py-1.5 flex items-baseline gap-1.5">
                    <span className="font-mono text-[10px] text-slate-500 uppercase tracking-wide">
                      {m.label}:
                    </span>
                    <span className="font-mono text-xs text-white">{m.value}</span>
                  </div>
                ))}
              </div>

              {/* List */}
              <div className="glass rounded-xl overflow-hidden">
                <div className="px-3 py-2 border-b border-white/8">
                  <span className="font-mono text-[10px] tracking-widest text-slate-500 uppercase">
                    {result.listTitle}
                  </span>
                </div>
                <div className="divide-y divide-white/5">
                  {result.listItems.map((item) => (
                    <div key={item.label} className="flex items-center justify-between px-3 py-2">
                      <span className="font-mono text-[11px] text-slate-300 truncate">{item.label}</span>
                      <span className="font-mono text-[9px] text-slate-500 ml-2 shrink-0">{item.badge}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Safety notes */}
              {result.safetyNotes.length > 0 && (
                <div className="rounded-xl border border-amber-400/10 bg-amber-400/5 p-3">
                  <span className="font-mono text-[9px] tracking-widest text-amber-400 uppercase block mb-2">
                    Safety Notes
                  </span>
                  <ul className="space-y-1.5">
                    {result.safetyNotes.map((note, i) => (
                      <li key={i} className="text-[10px] text-slate-400 leading-snug flex gap-1.5">
                        <span className="text-amber-400 shrink-0 mt-px">·</span>
                        {note}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Related links */}
              {result.links.length > 0 && (
                <div className="flex flex-col gap-1.5">
                  <span className="font-mono text-[9px] tracking-widest text-slate-600 uppercase">
                    Related
                  </span>
                  {result.links.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="text-[11px] font-mono text-egg-400/80 hover:text-egg-400 transition-colors"
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Right: code preview */}
            <div className="flex-1 min-w-0">
              <div className="rounded-xl overflow-hidden border border-white/8">
                <div className="flex items-center justify-between px-3 py-2 bg-white/[0.03] border-b border-white/8">
                  <span className="font-mono text-[10px] text-slate-500">{result.codeFile}</span>
                  <span className="font-mono text-[9px] text-slate-600 uppercase tracking-wide">
                    {result.codeLanguage}
                  </span>
                </div>
                <div
                  className="p-4 font-mono text-[11px] leading-relaxed overflow-x-auto whitespace-pre"
                  style={{ background: "#060a11" }}
                  dangerouslySetInnerHTML={{ __html: colorize(result.codeContent, result.codeLanguage) }}
                />
              </div>
            </div>
          </div>

          <div className="px-5 pb-4">
            <p className="text-[10px] text-slate-600">
              Illustrative output only. Generated by Eggthropic Execution Lab — not an official Anthropic interface. This lab visualizes common agentic workflow patterns and does not reflect Claude&apos;s private reasoning or internal execution.
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
