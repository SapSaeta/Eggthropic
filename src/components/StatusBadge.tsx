import { cn } from "@/lib/utils";
import type { ExperimentStatus } from "@/types";

const statusConfig: Record<
  ExperimentStatus,
  { label: string; className: string; dot: string }
> = {
  complete: {
    label: "Completo",
    className: "bg-emerald-500/10 text-emerald-700 border-emerald-500/30",
    dot: "bg-emerald-400",
  },
  "in-progress": {
    label: "En curso",
    className: "bg-blue-500/10 text-blue-700 border-blue-500/30",
    dot: "bg-blue-400",
  },
  experimental: {
    label: "Experimental",
    className: "bg-egg-500/10 text-egg-600 border-egg-500/30",
    dot: "bg-egg-400",
  },
  archived: {
    label: "Archivado",
    className: "bg-slate-500/10 text-ink-soft border-slate-500/30",
    dot: "bg-slate-400",
  },
};

interface StatusBadgeProps {
  status: ExperimentStatus;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border",
        config.className,
        className
      )}
    >
      <span
        className={cn("w-1.5 h-1.5 rounded-full flex-shrink-0", config.dot)}
      />
      {config.label}
    </span>
  );
}
