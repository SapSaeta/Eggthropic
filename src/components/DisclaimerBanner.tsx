import { Info } from "lucide-react";

export function DisclaimerBanner() {
  return (
    <div className="w-full bg-lab-800/80 border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5">
        <p className="text-xs text-slate-400 flex items-center gap-2">
          <Info className="w-3.5 h-3.5 text-egg-400/70 flex-shrink-0" />
          Eggthropic es un proyecto experimental independiente, sin afiliación ni respaldo de Anthropic.
        </p>
      </div>
    </div>
  );
}
