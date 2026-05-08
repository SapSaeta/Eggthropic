"use client";

import { motion } from "framer-motion";

interface Props {
  active: boolean;
  color?: string;
  size?: "sm" | "md";
}

export default function StatusPulse({ active, color = "bg-egg-400", size = "md" }: Props) {
  const dim = size === "sm" ? "w-1.5 h-1.5" : "w-2 h-2";
  const pingDim = size === "sm" ? "w-1.5 h-1.5" : "w-2 h-2";

  return (
    <motion.div
      className="relative flex items-center justify-center"
      animate={{ scale: active ? 1 : 0.85 }}
      transition={{ duration: 0.3 }}
    >
      {active ? (
        <>
          <span className={`absolute inline-flex ${pingDim} rounded-full ${color} opacity-60 animate-ping`} />
          <span className={`relative inline-flex ${dim} rounded-full ${color}`} />
        </>
      ) : (
        <span className={`inline-flex ${dim} rounded-full bg-slate-700`} />
      )}
    </motion.div>
  );
}
