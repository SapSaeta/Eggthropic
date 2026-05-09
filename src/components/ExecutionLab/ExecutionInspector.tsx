"use client";

import { motion, AnimatePresence } from "framer-motion";
import type { NodeId } from "./types";
import type { ExecutionScenario } from "@/lib/execution-scenarios";

interface Props {
  scenario: ExecutionScenario;
  activeNodeId: NodeId | undefined;
}

const FIELD_CONFIG = [
  { key: "what" as const, label: "What is happening", color: "text-zinc-700" },
  { key: "why" as const, label: "Why it matters", color: "text-sky-300" },
  { key: "risk" as const, label: "What can go wrong", color: "text-amber-300" },
  { key: "humanReview" as const, label: "Human review", color: "text-emerald-300" },
] as const;

export default function ExecutionInspector({ scenario, activeNodeId }: Props) {
  const entry = activeNodeId
    ? scenario.inspector.find((i) => i.nodeId === activeNodeId)
    : undefined;

  const nodeLabel = activeNodeId
    ? (scenario.nodeConfigs.find((n) => n.id === activeNodeId)?.label ?? activeNodeId)
    : null;

  return (
    <div className="glass rounded-xl overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-zinc-200 bg-white/[0.02]">
        <span className="font-mono text-[10px] tracking-widest text-zinc-500 uppercase">
          Step Inspector
        </span>
        {nodeLabel && (
          <span className="font-mono text-[10px] text-egg-400 tracking-wide">
            {nodeLabel}
          </span>
        )}
      </div>

      <AnimatePresence mode="wait">
        {entry ? (
          <motion.div
            key={`${scenario.id}-${activeNodeId}`}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.25 }}
            className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
          >
            {FIELD_CONFIG.map(({ key, label, color }) => (
              <div key={key}>
                <span className="font-mono text-[9px] tracking-widest text-zinc-400 uppercase block mb-1.5">
                  {label}
                </span>
                <p className={`text-[11px] leading-relaxed ${color}`}>{entry[key]}</p>
              </div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="px-4 py-6 text-center"
          >
            <p className="text-[11px] text-zinc-400 font-mono">
              Run the simulation to see step-by-step context here.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
