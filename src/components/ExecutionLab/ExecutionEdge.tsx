"use client";

import { motion } from "framer-motion";

interface Props {
  d: string;
  isActive: boolean;
  color: string;
}

export default function ExecutionEdge({ d, isActive, color }: Props) {
  return (
    <>
      <path
        d={d}
        fill="none"
        stroke="#ffffff"
        strokeOpacity={0.12}
        strokeWidth={1.5}
        strokeLinecap="round"
      />
      <motion.path
        d={d}
        fill="none"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{
          pathLength: isActive ? 1 : 0,
          opacity: isActive ? 1 : 0,
        }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
        style={{
          filter: isActive ? `drop-shadow(0 0 4px ${color}88)` : "none",
        }}
      />
    </>
  );
}
