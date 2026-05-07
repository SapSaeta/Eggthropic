"use client";

import { motion } from "framer-motion";
import type { SimulationStatus } from "./types";
import type { ExecutionScenario } from "@/lib/execution-scenarios";

interface Props {
  scenario: ExecutionScenario;
  status: SimulationStatus;
  currentPhaseIndex: number;
  onRun: () => void;
  onPause: () => void;
  onResume: () => void;
  onStepForward: () => void;
  onReset: () => void;
}

const TOTAL_PHASES = 6;

export default function PromptPanel({
  scenario,
  status,
  currentPhaseIndex,
  onRun,
  onPause,
  onResume,
  onStepForward,
  onReset,
}: Props) {
  const isIdle = status === "idle";
  const isRunning = status === "running";
  const isPaused = status === "paused";
  const isComplete = status === "complete";

  const canStep = isIdle || isPaused;
  const phaseDisplay = currentPhaseIndex >= 0 ? currentPhaseIndex + 1 : null;

  return (
    <div className="glass rounded-xl p-4 flex flex-col gap-4">
      <div>
        <span className="font-mono text-[10px] tracking-widest text-slate-500 uppercase block mb-2">
          Prompt
        </span>
        <div className="rounded-lg border border-white/8 bg-white/[0.02] px-3 py-2.5">
          <p className="font-mono text-xs text-slate-300 leading-relaxed">{scenario.prompt}</p>
        </div>
      </div>

      <p className="text-[11px] text-slate-500 leading-relaxed">{scenario.description}</p>

      {/* Phase indicator */}
      {!isIdle && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center gap-2"
        >
          <div className="flex gap-0.5 flex-1">
            {Array.from({ length: TOTAL_PHASES }, (_, i) => (
              <div
                key={i}
                className={[
                  "h-1 flex-1 rounded-full transition-all duration-300",
                  isComplete
                    ? "bg-emerald-400"
                    : phaseDisplay !== null && i < phaseDisplay
                    ? "bg-egg-400"
                    : phaseDisplay !== null && i === phaseDisplay - 1 && isRunning
                    ? "bg-egg-400 animate-pulse"
                    : "bg-white/10",
                ].join(" ")}
              />
            ))}
          </div>
          <span className="font-mono text-[9px] text-slate-600 shrink-0">
            {isComplete ? "done" : phaseDisplay ? `${phaseDisplay}/${TOTAL_PHASES}` : "—"}
          </span>
        </motion.div>
      )}

      <div className="flex flex-col gap-2 pt-1">
        {/* Primary: Resume or Run */}
        {isPaused ? (
          <button
            onClick={onResume}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-xs font-mono font-semibold transition-all bg-egg-400 text-lab-900 hover:bg-egg-300 active:scale-95"
          >
            ▶ Resume
          </button>
        ) : (
          <button
            onClick={onRun}
            disabled={isRunning}
            className={[
              "w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-xs font-mono font-semibold transition-all",
              isRunning
                ? "bg-egg-400/30 text-egg-400/60 cursor-not-allowed"
                : "bg-egg-400 text-lab-900 hover:bg-egg-300 active:scale-95",
            ].join(" ")}
          >
            {isRunning ? (
              <>
                <motion.span
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="inline-block"
                >
                  ◌
                </motion.span>
                Running...
              </>
            ) : isComplete ? (
              "↺ Run Again"
            ) : (
              "▶ Run Simulation"
            )}
          </button>
        )}

        {/* Step Forward */}
        {canStep && !isComplete && (
          <motion.button
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={onStepForward}
            className="w-full px-4 py-2 rounded-lg text-xs font-mono text-slate-300 glass border border-white/12 hover:border-white/20 hover:text-white transition-all active:scale-95"
          >
            ⏭ Step Forward
          </motion.button>
        )}

        {/* Pause */}
        {isRunning && (
          <motion.button
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={onPause}
            className="w-full px-4 py-2 rounded-lg text-xs font-mono text-slate-400 hover:text-slate-300 glass border border-white/8 hover:border-white/14 transition-all active:scale-95"
          >
            ‖ Pause
          </motion.button>
        )}

        {/* Reset */}
        {!isIdle && (
          <motion.button
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={onReset}
            className="w-full px-4 py-2 rounded-lg text-xs font-mono text-slate-600 hover:text-slate-400 glass border border-white/5 hover:border-white/10 transition-all active:scale-95"
          >
            ↺ Reset
          </motion.button>
        )}
      </div>
    </div>
  );
}
