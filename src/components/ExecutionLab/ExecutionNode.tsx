"use client";

import { motion } from "framer-motion";
import { Check, X } from "lucide-react";
import type { NodeStatus } from "./types";
import StatusPulse from "./StatusPulse";

interface Props {
  label: string;
  sublabel: string;
  icon: string;
  status: NodeStatus;
  phaseColor: string;
  phaseBg: string;
  phaseBorder: string;
}

const pulseColorMap: Record<string, string> = {
  "text-sky-400": "bg-sky-400",
  "text-violet-400": "bg-violet-400",
  "text-egg-400": "bg-egg-400",
  "text-amber-400": "bg-amber-400",
  "text-emerald-400": "bg-emerald-400",
};

export default function ExecutionNode({
  label,
  sublabel,
  icon,
  status,
  phaseColor,
  phaseBg,
  phaseBorder,
}: Props) {
  const isIdle = status === "idle";
  const isRunning = status === "running";
  const isSuccess = status === "success";
  const isError = status === "error";

  const pulseColor = pulseColorMap[phaseColor] ?? "bg-egg-400";

  return (
    <motion.div
      className={[
        "w-full h-full rounded-xl border flex flex-col items-center justify-center gap-1 px-2 py-2 relative overflow-hidden",
        "glass",
        isIdle && "opacity-40 border-white/10",
        isRunning && `border-opacity-60 ${phaseBorder}`,
        isSuccess && `${phaseBorder} ${phaseBg}`,
        isError && "border-rose-400/40 bg-rose-400/10",
      ]
        .filter(Boolean)
        .join(" ")}
      animate={{
        opacity: isIdle ? 0.4 : 1,
        scale: isRunning ? 1.02 : 1,
        boxShadow: isRunning
          ? `0 0 18px 2px ${pulseColorMap[phaseColor] ? pulseColorMap[phaseColor].replace("bg-", "").replace("-400", "") : "rgba(255,224,77,0.25)"}`
          : "0 0 0 0 transparent",
      }}
      transition={{ duration: 0.35 }}
      style={
        isRunning
          ? { boxShadow: `0 0 18px 2px color-mix(in srgb, transparent 60%, currentColor)` }
          : undefined
      }
    >
      {isRunning && (
        <motion.div
          className={`absolute inset-0 rounded-xl border ${phaseBorder}`}
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
        />
      )}

      <div className="flex items-center gap-1.5">
        {isRunning && <StatusPulse active size="sm" color={pulseColor} />}
        {isSuccess ? (
          <Check className="w-3.5 h-3.5 text-emerald-400" strokeWidth={2.5} />
        ) : isError ? (
          <X className="w-3.5 h-3.5 text-rose-400" strokeWidth={2.5} />
        ) : (
          <span className="text-sm leading-none">{icon}</span>
        )}
        <span
          className={[
            "text-[11px] font-semibold font-mono leading-none",
            isIdle && "text-slate-500",
            isRunning && phaseColor,
            isSuccess && phaseColor,
            isError && "text-rose-400",
          ]
            .filter(Boolean)
            .join(" ")}
        >
          {label}
        </span>
      </div>
      <span className="text-[9px] font-mono text-slate-600 tracking-wide uppercase">{sublabel}</span>
    </motion.div>
  );
}
