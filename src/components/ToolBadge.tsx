import { cn } from "@/lib/utils";

interface ToolBadgeProps {
  tool: string;
  className?: string;
}

export function ToolBadge({ tool, className }: ToolBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 rounded text-xs font-mono border border-zinc-200 bg-zinc-50 text-zinc-600",
        className
      )}
    >
      {tool}
    </span>
  );
}
