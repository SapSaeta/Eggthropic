"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  label?: string;
  title: string;
  description?: string;
  centered?: boolean;
  className?: string;
}

export function SectionHeader({
  label,
  title,
  description,
  centered = false,
  className,
}: SectionHeaderProps) {
  return (
    <motion.div
      className={cn(
        "mb-10",
        centered && "text-center",
        className
      )}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      {label && (
        <span className="inline-flex items-center gap-2 text-xs font-mono tracking-widest text-egg-400 uppercase mb-3">
          <span className="w-6 h-px bg-egg-400/50" />
          {label}
          <span className="w-6 h-px bg-egg-400/50" />
        </span>
      )}
      <h2 className="text-2xl sm:text-3xl font-semibold text-white leading-tight">
        {title}
      </h2>
      {description && (
        <p className="mt-3 text-slate-400 max-w-2xl leading-relaxed">
          {description}
        </p>
      )}
    </motion.div>
  );
}
