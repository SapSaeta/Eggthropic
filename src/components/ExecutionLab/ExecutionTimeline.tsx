"use client";

import { motion } from "framer-motion";
import type { NodeStatuses } from "./types";
import StatusPulse from "./StatusPulse";

interface Props {
  nodes: NodeStatuses;
}

const PHASES = [
  {
    id: "analyze" as const,
    label: "Analyze",
    badge: "INPUT",
    color: "text-sky-400",
    bg: "bg-sky-400/10",
    border: "border-sky-400/20",
    pulse: "bg-sky-400",
  },
  {
    id: "plan" as const,
    label: "Plan",
    badge: "PLAN",
    color: "text-violet-400",
    bg: "bg-violet-400/10",
    border: "border-violet-400/20",
    pulse: "bg-violet-400",
  },
  {
    id: "tools" as const,
    label: "Select Tools",
    badge: "PLAN",
    color: "text-violet-400",
    bg: "bg-violet-400/10",
    border: "border-violet-400/20",
    pulse: "bg-violet-400",
  },
  {
    id: "generate" as const,
    label: "Generate",
    badge: "EXECUTE",
    color: "text-egg-400",
    bg: "bg-egg-400/10",
    border: "border-egg-400/20",
    pulse: "bg-egg-400",
  },
  {
    id: "review" as const,
    label: "Review",
    badge: "REVIEW",
    color: "text-amber-400",
    bg: "bg-amber-400/10",
    border: "border-amber-400/20",
    pulse: "bg-amber-400",
  },
  {
    id: "deliver" as const,
    label: "Deliver",
    badge: "OUTPUT",
    color: "text-emerald-400",
    bg: "bg-emerald-400/10",
    border: "border-emerald-400/20",
    pulse: "bg-emerald-400",
  },
] as const;

export default function ExecutionTimeline({ nodes }: Props) {
  return (
    <div className="glass rounded-xl p-4">
      <span className="font-mono text-[10px] tracking-widest text-slate-500 uppercase block mb-4">
        Timeline
      </span>
      <div className="flex flex-col">
        {PHASES.map((phase, i) => {
          const status = nodes[phase.id];
          const isActive = status === "running";
          const isDone = status === "success";
          const isNextDone = i < PHASES.length - 1 && nodes[PHASES[i + 1].id] === "success";
          const isLast = i === PHASES.length - 1;

          return (
            <div key={phase.id} className="flex gap-3">
              {/* Left: dot + line */}
              <div className="flex flex-col items-center">
                <StatusPulse
                  active={isActive}
                  color={phase.pulse}
                  size="sm"
                />
                {!isLast && (
                  <div className="relative w-px flex-1 mt-1 mb-1 bg-white/8 overflow-hidden" style={{ minHeight: 20 }}>
                    {(isDone || isNextDone) && (
                      <motion.div
                        className="absolute inset-x-0 top-0"
                        style={{ background: phase.pulse.replace("bg-", "var(--color-") + ")" }}
                        initial={{ height: 0 }}
                        animate={{ height: "100%" }}
                        transition={{ duration: 0.4, ease: "easeInOut" }}
                      />
                    )}
                  </div>
                )}
              </div>

              {/* Right: content */}
              <div className={`flex items-center gap-2 pb-${isLast ? "0" : "3"} flex-1 min-w-0`}>
                <span
                  className={[
                    "inline-flex items-center px-1.5 py-0.5 rounded-full text-[9px] font-mono border shrink-0",
                    isDone || isActive ? `${phase.bg} ${phase.border} ${phase.color}` : "bg-white/5 border-white/10 text-slate-600",
                  ].join(" ")}
                >
                  {phase.badge}
                </span>
                <span
                  className={[
                    "text-[11px] font-mono truncate",
                    status === "idle" && "text-slate-600",
                    isActive && phase.color,
                    isDone && "text-slate-400",
                    status === "error" && "text-rose-400",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                >
                  {phase.label}
                </span>
                {isDone && (
                  <span className="text-emerald-400 text-[10px] ml-auto shrink-0">✓</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
