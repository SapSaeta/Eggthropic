"use client";

import type { RiskLevel, ExecutionScenario } from "@/lib/execution-scenarios";

interface Props {
  scenario: ExecutionScenario;
}

const LEVEL_STYLES: Record<RiskLevel, { badge: string; dot: string }> = {
  Low: {
    badge: "bg-emerald-400/10 border-emerald-400/20 text-emerald-400",
    dot: "bg-emerald-400",
  },
  Medium: {
    badge: "bg-amber-400/10 border-amber-400/20 text-amber-400",
    dot: "bg-amber-400",
  },
  High: {
    badge: "bg-rose-400/10 border-rose-400/20 text-rose-400",
    dot: "bg-rose-400",
  },
};

export default function TrustSafetyPanel({ scenario }: Props) {
  return (
    <div className="glass rounded-xl overflow-hidden">
      <div className="flex items-center gap-3 px-4 py-2.5 border-b border-zinc-200 bg-white/[0.02]">
        <span className="font-mono text-[10px] tracking-widest text-zinc-500 uppercase">
          Trust &amp; Safety
        </span>
        <span className="font-mono text-[9px] text-zinc-400">— {scenario.label} mode</span>
      </div>

      <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
        {scenario.trustSafety.map((item) => {
          const s = LEVEL_STYLES[item.level];
          return (
            <div key={item.control} className="glass rounded-lg p-3 flex flex-col gap-2">
              <div className="flex items-center justify-between gap-2">
                <span className="font-mono text-[10px] text-zinc-700 font-semibold leading-tight">
                  {item.control}
                </span>
                <span
                  className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full border text-[9px] font-mono shrink-0 ${s.badge}`}
                >
                  <span className={`w-1 h-1 rounded-full ${s.dot}`} />
                  {item.level}
                </span>
              </div>
              <p className="text-[10px] text-zinc-500 leading-snug">{item.detail}</p>
            </div>
          );
        })}
      </div>

      <div className="px-4 pb-3">
        <p className="text-[9px] text-zinc-700 font-mono">
          Levels are illustrative — actual risk depends on your specific environment, permissions, and threat model.
        </p>
      </div>
    </div>
  );
}
