"use client";

import { motion } from "framer-motion";
import type { SimulationStatus } from "./types";

interface Props {
  status: SimulationStatus;
  onRun: () => void;
  onReset: () => void;
}

export default function PromptPanel({ status, onRun, onReset }: Props) {
  const isIdle = status === "idle";
  const isRunning = status === "running";
  const isComplete = status === "complete";

  return (
    <div className="glass rounded-xl p-4 flex flex-col gap-4">
      <div>
        <span className="font-mono text-[10px] tracking-widest text-slate-500 uppercase block mb-2">
          Scenario
        </span>
        <div className="rounded-lg border border-white/8 bg-white/[0.02] px-3 py-2.5">
          <p className="font-mono text-xs text-slate-300 leading-relaxed">
            Create a landing page for a SaaS product
          </p>
        </div>
      </div>

      <p className="text-[11px] text-slate-500 leading-relaxed">
        A multi-step agent task broken into 6 phases: analyze, plan, select tools, generate, review, and deliver.
      </p>

      <p className="text-[10px] text-slate-600 leading-relaxed border-t border-white/5 pt-3">
        Educational visualization. Does not reflect Claude&apos;s actual internal architecture.
      </p>

      <div className="flex flex-col gap-2 pt-1">
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

        {!isIdle && (
          <motion.button
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={onReset}
            className="w-full px-4 py-2 rounded-lg text-xs font-mono text-slate-400 hover:text-slate-300 glass border border-white/8 hover:border-white/14 transition-all active:scale-95"
          >
            Reset
          </motion.button>
        )}
      </div>
    </div>
  );
}
