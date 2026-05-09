"use client";

import { SCENARIOS, COMPARE_ROWS } from "@/lib/execution-scenarios";
import type { ScenarioId } from "./types";

const HEADER_COLOR: Record<ScenarioId, string> = {
  "claude-code": "text-sky-400",
  "mcp": "text-violet-400",
  "skills": "text-egg-400",
};

const HEADER_BG: Record<ScenarioId, string> = {
  "claude-code": "bg-sky-400/8 border-sky-400/20",
  "mcp": "bg-violet-400/8 border-violet-400/20",
  "skills": "bg-egg-400/8 border-egg-400/20",
};

export default function CompareModesView() {
  return (
    <div className="glass rounded-xl overflow-hidden">
      <div className="px-4 py-3 border-b border-zinc-200 bg-white/[0.02]">
        <span className="font-mono text-[10px] tracking-widest text-zinc-500 uppercase">
          Mode Comparison
        </span>
      </div>

      {/* Mobile: stacked cards */}
      <div className="sm:hidden p-4 space-y-6">
        {COMPARE_ROWS.map((row) => (
          <div key={row.label}>
            <span className="font-mono text-[9px] tracking-widest text-zinc-400 uppercase block mb-2">
              {row.label}
            </span>
            <div className="space-y-2">
              {SCENARIOS.map((s) => (
                <div key={s.id} className={`glass rounded-lg p-2.5 border ${HEADER_BG[s.id]}`}>
                  <span className={`font-mono text-[9px] uppercase tracking-widest block mb-1 ${HEADER_COLOR[s.id]}`}>
                    {s.label}
                  </span>
                  <p className="text-[11px] text-zinc-700 leading-relaxed">{row.values[s.id]}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Desktop: table */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-zinc-200">
              <th className="py-3 px-4 font-mono text-[10px] tracking-widest text-zinc-400 uppercase w-40">
                Criterion
              </th>
              {SCENARIOS.map((s) => (
                <th
                  key={s.id}
                  className={`py-3 px-4 font-mono text-[10px] tracking-widest uppercase border-l border-zinc-200 ${HEADER_COLOR[s.id]}`}
                >
                  {s.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {COMPARE_ROWS.map((row, i) => (
              <tr
                key={row.label}
                className={`border-b border-zinc-200 ${i % 2 === 0 ? "" : "bg-white/[0.01]"}`}
              >
                <td className="py-3 px-4 font-mono text-[10px] text-zinc-500 uppercase tracking-wide align-top">
                  {row.label}
                </td>
                {SCENARIOS.map((s) => (
                  <td
                    key={s.id}
                    className="py-3 px-4 text-[11px] text-zinc-700 leading-relaxed border-l border-zinc-200 align-top"
                  >
                    {row.values[s.id]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="px-4 py-3 border-t border-zinc-200">
        <p className="text-[9px] font-mono text-zinc-700">
          Illustrative comparison. Real-world behavior depends on environment, permissions, and Claude surface configuration.
        </p>
      </div>
    </div>
  );
}
