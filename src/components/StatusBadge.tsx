import { cn } from "@/lib/utils";
import type { ExperimentStatus } from "@/types";

const statusConfig: Record<
  ExperimentStatus,
  { label: string; className: string; dot: string }
> = {
  complete: {
    label: "Complete",
    className: "bg-emerald-50 text-emerald-700 border-emerald-200",
    dot: "bg-emerald-500",
  },
  "in-progress": {
    label: "In Progress",
    className: "bg-indigo-50 text-indigo-700 border-indigo-200",
    dot: "bg-indigo-500",
  },
  experimental: {
    label: "Experimental",
    className: "bg-amber-50 text-amber-700 border-amber-200",
    dot: "bg-amber-500",
  },
  archived: {
    label: "Archived",
    className: "bg-zinc-50 text-zinc-600 border-zinc-300",
    dot: "bg-zinc-400",
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
