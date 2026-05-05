import { cn } from "@/lib/utils";

const toolColors: Record<string, string> = {
  "Claude Design": "bg-rose-500/10 text-rose-300 border-rose-500/20",
  "Claude Opus 4.7": "bg-orange-500/10 text-orange-300 border-orange-500/20",
  "Claude Code": "bg-violet-500/10 text-violet-300 border-violet-500/20",
  "Agent Skills": "bg-fuchsia-500/10 text-fuchsia-300 border-fuchsia-500/20",
  MCP: "bg-cyan-500/10 text-cyan-300 border-cyan-500/20",
  "Claude API": "bg-indigo-500/10 text-indigo-300 border-indigo-500/20",
  "Next.js": "bg-slate-500/10 text-slate-300 border-slate-500/20",
  "Tailwind CSS": "bg-teal-500/10 text-teal-300 border-teal-500/20",
  "Framer Motion": "bg-pink-500/10 text-pink-300 border-pink-500/20",
  TypeScript: "bg-blue-500/10 text-blue-300 border-blue-500/20",
  React: "bg-sky-500/10 text-sky-300 border-sky-500/20",
  Git: "bg-orange-500/10 text-orange-300 border-orange-500/20",
  Bash: "bg-stone-500/10 text-stone-300 border-stone-500/20",
  Zod: "bg-rose-500/10 text-rose-300 border-rose-500/20",
  SSE: "bg-amber-500/10 text-amber-300 border-amber-500/20",
};

const defaultColor = "bg-lab-500/50 text-slate-300 border-lab-400/30";

interface ToolBadgeProps {
  tool: string;
  className?: string;
}

export function ToolBadge({ tool, className }: ToolBadgeProps) {
  const color = toolColors[tool] ?? defaultColor;
  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 rounded text-xs font-mono border",
        color,
        className
      )}
    >
      {tool}
    </span>
  );
}
