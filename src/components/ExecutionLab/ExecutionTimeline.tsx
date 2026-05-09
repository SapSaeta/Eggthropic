"use client";

import { motion } from "framer-motion";
import type { NodeStatuses } from "./types";
import type { ScenarioPhaseConfig } from "@/lib/execution-scenarios";
import StatusPulse from "./StatusPulse";

interface Props {
  nodes: NodeStatuses;
  phaseConfigs: ScenarioPhaseConfig[];
}

export default function ExecutionTimeline({ nodes, phaseConfigs }: Props) {
  return (
    <div className="glass rounded-xl p-4">
      <span className="font-mono text-[10px] tracking-widest text-zinc-500 uppercase block mb-4">
        Timeline
      </span>
      <div className="flex flex-col">
        {phaseConfigs.map((phase, i) => {
          const status = nodes[phase.id];
          const isActive = status === "running";
          const isDone = status === "success";
          const isNextDone = i < phaseConfigs.length - 1 && nodes[phaseConfigs[i + 1].id] === "success";
          const isLast = i === phaseConfigs.length - 1;

          return (
            <div key={phase.id} className="flex gap-3">
              <div className="flex flex-col items-center">
                <StatusPulse active={isActive} color={phase.pulse} size="sm" />
                {!isLast && (
                  <div className="relative w-px flex-1 mt-1 mb-1 bg-zinc-100 overflow-hidden" style={{ minHeight: 20 }}>
                    {(isDone || isNextDone) && (
                      <motion.div
                        className="absolute inset-x-0 top-0"
                        style={{ background: `var(--tw-${phase.pulse.replace("bg-", "")}, currentColor)` }}
                        initial={{ height: 0 }}
                        animate={{ height: "100%" }}
                        transition={{ duration: 0.4, ease: "easeInOut" }}
                      />
                    )}
                  </div>
                )}
              </div>

              <div className={`flex items-center gap-2 ${isLast ? "pb-0" : "pb-3"} flex-1 min-w-0`}>
                <span
                  className={[
                    "inline-flex items-center px-1.5 py-0.5 rounded-full text-[9px] font-mono border shrink-0",
                    isDone || isActive
                      ? `${phase.bg} ${phase.border} ${phase.color}`
                      : "bg-zinc-50 border-zinc-200 text-zinc-400",
                  ].join(" ")}
                >
                  {phase.badge}
                </span>
                <span
                  className={[
                    "text-[11px] font-mono truncate",
                    status === "idle" && "text-zinc-400",
                    isActive && phase.color,
                    isDone && "text-zinc-600",
                    status === "error" && "text-rose-400",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                >
                  {phase.label}
                </span>
                {isDone && <span className="text-emerald-400 text-[10px] ml-auto shrink-0">✓</span>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
