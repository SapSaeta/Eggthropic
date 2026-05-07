"use client";

import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { LogEntry, SimulationStatus } from "./types";

interface Props {
  logs: LogEntry[];
  status: SimulationStatus;
}

const kindColor: Record<string, string> = {
  system: "text-slate-400",
  success: "text-emerald-400",
  warning: "text-amber-400",
  input: "text-egg-300",
};

export default function ExecutionTerminal({ logs, status }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <div className="glass rounded-xl overflow-hidden flex flex-col h-full min-h-[320px]">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-white/8 bg-white/[0.02] shrink-0">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-500/50" />
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500/50" />
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/50" />
        </div>
        <span className="font-mono text-[10px] tracking-widest text-slate-500 uppercase">
          Exec Log
        </span>
        <div className="w-16 flex justify-end">
          {status === "running" && (
            <motion.span
              className="font-mono text-[10px] text-emerald-400 animate-pulse"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              ● LIVE
            </motion.span>
          )}
        </div>
      </div>

      {/* Log body */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-3 font-mono text-[11px] leading-relaxed"
        style={{ background: "#060a11", maxHeight: "420px" }}
      >
        {logs.length === 0 ? (
          <p className="text-slate-600 text-[11px]">
            Press Run Simulation to start the trace.
          </p>
        ) : (
          <AnimatePresence initial={false}>
            {logs.map((log, i) => (
              <motion.div
                key={log.id}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className="flex gap-2 mb-0.5"
              >
                <span className="text-slate-600 select-none shrink-0">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className={kindColor[log.kind] ?? "text-slate-400"}>
                  {log.text}
                </span>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
