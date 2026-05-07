"use client";

import type { ScenarioId } from "./types";
import { SCENARIOS } from "@/lib/execution-scenarios";

interface Props {
  active: ScenarioId;
  onChange: (id: ScenarioId) => void;
  disabled?: boolean;
}

const CATEGORY_COLOR: Record<ScenarioId, string> = {
  "claude-code": "text-sky-400 border-sky-400/40 bg-sky-400/10",
  "mcp": "text-violet-400 border-violet-400/40 bg-violet-400/10",
  "skills": "text-egg-400 border-egg-400/40 bg-egg-400/10",
};

const IDLE_COLOR = "text-slate-500 border-white/8 bg-white/[0.02] hover:border-white/16 hover:text-slate-300";

export default function ModeSelector({ active, onChange, disabled }: Props) {
  return (
    <div className="mb-4">
      <span className="font-mono text-[10px] tracking-widest text-slate-500 uppercase block mb-2">
        Execution Mode
      </span>
      <div className="flex flex-wrap gap-2">
        {SCENARIOS.map((s) => {
          const isActive = s.id === active;
          return (
            <button
              key={s.id}
              onClick={() => !disabled && onChange(s.id)}
              disabled={disabled && !isActive}
              className={[
                "flex flex-col items-start gap-0.5 px-3 py-2 rounded-lg border text-left transition-all",
                isActive ? CATEGORY_COLOR[s.id] : IDLE_COLOR,
                disabled && !isActive ? "opacity-40 cursor-not-allowed" : "cursor-pointer",
              ].join(" ")}
            >
              <span className="font-mono text-[11px] font-semibold">{s.label}</span>
              <span className="font-mono text-[9px] text-slate-500 leading-tight max-w-[120px] truncate">
                {s.description}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
