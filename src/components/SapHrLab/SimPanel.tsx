"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, RotateCcw, CheckCircle2, Loader2, Circle } from "lucide-react";
import { SIM_SCENARIOS, type SimScenario } from "@/lib/sap-hr-knowledge";

type PhaseStatus = "idle" | "running" | "done";

interface SimState {
  running: boolean;
  phaseStatuses: PhaseStatus[];
  phaseDetails: (string | null)[];
  showAnswer: boolean;
  complete: boolean;
}

const INITIAL_STATE: SimState = {
  running: false,
  phaseStatuses: [],
  phaseDetails: [],
  showAnswer: false,
  complete: false,
};

export function SimPanel() {
  const [scenarioIdx, setScenarioIdx] = useState(0);
  const [sim, setSim] = useState<SimState>(INITIAL_STATE);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  const scenario: SimScenario = SIM_SCENARIOS[scenarioIdx];

  function clearTimers() {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
  }

  function reset() {
    clearTimers();
    setSim(INITIAL_STATE);
  }

  function changeScenario(idx: number) {
    reset();
    setScenarioIdx(idx);
  }

  function runSim() {
    reset();
    const phases = scenario.phases;
    const n = phases.length;

    setSim({
      running: true,
      phaseStatuses: Array(n).fill("idle"),
      phaseDetails: Array(n).fill(null),
      showAnswer: false,
      complete: false,
    });

    let elapsed = 0;

    phases.forEach((phase, i) => {
      // start phase i
      const t1 = setTimeout(() => {
        setSim((s) => {
          const ps = [...s.phaseStatuses];
          ps[i] = "running";
          return { ...s, phaseStatuses: ps };
        });
      }, elapsed);
      timersRef.current.push(t1);

      elapsed += phase.durationMs;

      // complete phase i + show detail
      const t2 = setTimeout(() => {
        setSim((s) => {
          const ps = [...s.phaseStatuses];
          const pd = [...s.phaseDetails];
          ps[i] = "done";
          pd[i] = phase.detail;
          return { ...s, phaseStatuses: ps, phaseDetails: pd };
        });
      }, elapsed);
      timersRef.current.push(t2);

      elapsed += 200;
    });

    // show answer
    const t3 = setTimeout(() => {
      setSim((s) => ({ ...s, showAnswer: true }));
    }, elapsed + 100);
    timersRef.current.push(t3);

    // complete
    const t4 = setTimeout(() => {
      setSim((s) => ({ ...s, running: false, complete: true }));
    }, elapsed + 400);
    timersRef.current.push(t4);
  }

  useEffect(() => () => clearTimers(), []);

  const canRun = !sim.running;

  return (
    <div className="space-y-6">
      {/* Scenario selector */}
      <div className="flex flex-wrap gap-2">
        {SIM_SCENARIOS.map((s, i) => (
          <button
            key={s.id}
            onClick={() => changeScenario(i)}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-colors ${
              i === scenarioIdx
                ? "bg-egg-400 text-zinc-900 font-semibold"
                : "glass text-zinc-600 hover:text-zinc-900"
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* Question display */}
      <div className="glass rounded-xl p-4 border border-zinc-200">
        <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest block mb-2">
          user query
        </span>
        <p className="text-sm text-zinc-700 font-mono">&ldquo;{scenario.question}&rdquo;</p>
      </div>

      {/* Controls */}
      <div className="flex gap-3">
        <button
          onClick={runSim}
          disabled={!canRun}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-egg-400 text-zinc-900 text-sm font-semibold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-egg-300 transition-colors"
        >
          <Play className="w-3.5 h-3.5" />
          Run simulation
        </button>
        {(sim.running || sim.complete) && (
          <button
            onClick={reset}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg glass border border-zinc-200 text-sm text-zinc-600 hover:text-zinc-900 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset
          </button>
        )}
      </div>

      {/* Phases */}
      {sim.phaseStatuses.length > 0 && (
        <div className="space-y-2">
          {scenario.phases.map((phase, i) => {
            const status = sim.phaseStatuses[i] ?? "idle";
            const detail = sim.phaseDetails[i];
            return (
              <motion.div
                key={phase.label}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className={`glass rounded-lg p-3 border transition-colors ${
                  status === "running"
                    ? "border-egg-400/40"
                    : status === "done"
                    ? "border-emerald-400/20"
                    : "border-zinc-200"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  {status === "done" ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                  ) : status === "running" ? (
                    <Loader2 className="w-3.5 h-3.5 text-egg-400 flex-shrink-0 animate-spin" />
                  ) : (
                    <Circle className="w-3.5 h-3.5 text-zinc-400 flex-shrink-0" />
                  )}
                  <span
                    className={`text-xs font-mono ${
                      status === "running"
                        ? "text-egg-400"
                        : status === "done"
                        ? "text-zinc-700"
                        : "text-zinc-400"
                    }`}
                  >
                    {phase.label}
                  </span>
                </div>
                <AnimatePresence>
                  {detail && (
                    <motion.p
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="text-[11px] text-zinc-500 font-mono mt-1.5 ml-6"
                    >
                      {detail}
                    </motion.p>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Answer */}
      <AnimatePresence>
        {sim.showAnswer && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass rounded-xl p-5 border border-egg-400/15"
          >
            <span className="text-[10px] font-mono text-egg-400/70 uppercase tracking-widest block mb-3">
              assistant response · simulated
            </span>
            <div className="text-sm text-zinc-700 leading-relaxed whitespace-pre-line">
              {scenario.answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
