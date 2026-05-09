import { Info } from "lucide-react";

export function DisclaimerBanner() {
  return (
    <div className="w-full bg-lab-700 border-b border-zinc-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5">
        <p className="text-xs text-zinc-500 flex items-center gap-2">
          <Info className="w-3.5 h-3.5 text-egg-400/70 flex-shrink-0" />
          Eggthropic is an independent experimental project and is not affiliated
          with, endorsed by, or officially connected to Anthropic.
        </p>
      </div>
    </div>
  );
}
