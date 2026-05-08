"use client";

import { useState } from "react";
import { FlaskConical, Sparkles } from "lucide-react";
import { SimPanel } from "./SimPanel";
import { LivePanel } from "./LivePanel";

type TabId = "sim" | "live";

const TABS: { id: TabId; label: string; icon: React.ReactNode; badge?: string }[] = [
  {
    id: "sim",
    label: "Simulation",
    icon: <FlaskConical className="w-3.5 h-3.5" />,
  },
  {
    id: "live",
    label: "Live — Claude API",
    icon: <Sparkles className="w-3.5 h-3.5" />,
    badge: "real API",
  },
];

export default function SapHrShell() {
  const [tab, setTab] = useState<TabId>("sim");

  return (
    <div className="glass rounded-2xl border border-white/8 overflow-hidden">
      {/* Tab bar */}
      <div className="flex items-center border-b border-white/8 px-4 pt-4 gap-1">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-t-lg text-xs font-mono transition-colors ${
              tab === t.id
                ? "bg-white/8 text-white border border-b-0 border-white/10"
                : "text-slate-500 hover:text-slate-300"
            }`}
          >
            {t.icon}
            {t.label}
            {t.badge && (
              <span className="px-1.5 py-0.5 rounded-full bg-egg-400/15 border border-egg-400/25 text-egg-400 text-[9px]">
                {t.badge}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="p-6">
        {tab === "sim" ? <SimPanel /> : <LivePanel />}
      </div>
    </div>
  );
}
