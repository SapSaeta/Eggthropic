"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { StatusBadge } from "./StatusBadge";
import { TiltCard } from "./TiltCard";
import { ToolBadge } from "./ToolBadge";
import { formatDate } from "@/lib/utils";
import type { Experiment } from "@/types";

const categoryLabel: Record<string, string> = {
  "claude-code": "Claude Code",
  skills: "Skills",
  mcp: "MCP",
  api: "API",
  "ux-ui": "UX/UI",
  automation: "Automatización",
};

const difficultyLabel: Record<string, string> = {
  beginner: "principiante",
  intermediate: "intermedio",
  advanced: "avanzado",
};
const difficultyColor: Record<string, string> = {
  beginner: "text-emerald-700",
  intermediate: "text-amber-700",
  advanced: "text-rose-600",
};

interface ExperimentCardProps {
  experiment: Experiment;
  index?: number;
}

export function ExperimentCard({ experiment, index = 0 }: ExperimentCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.07 }}
    >
      <Link href={`/experiments/${experiment.slug}`} className="block group h-full">
        <TiltCard className="group h-full">
          <div className="glass glass-hover rounded-xl p-5 h-full flex flex-col gap-4">
          {/* Header */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-mono text-ink-faint">
                  {categoryLabel[experiment.category]}
                </span>
                <span className="text-ink-faint/60">·</span>
                <span
                  className={`text-xs font-medium capitalize ${difficultyColor[experiment.difficulty]}`}
                >
                  {difficultyLabel[experiment.difficulty] ?? experiment.difficulty}
                </span>
              </div>
              <h3 className="font-semibold text-ink leading-snug group-hover:text-egg-600 transition-colors">
                {experiment.title}
              </h3>
            </div>
            <ArrowRight className="w-4 h-4 text-ink-faint group-hover:text-egg-600 group-hover:translate-x-1 transition-all flex-shrink-0 mt-0.5" />
          </div>

          {/* Description */}
          <p className="text-sm text-ink-soft leading-relaxed flex-1">
            {experiment.description}
          </p>

          {/* Tools */}
          <div className="flex flex-wrap gap-1.5">
            {experiment.tools.slice(0, 4).map((tool) => (
              <ToolBadge key={tool} tool={tool} />
            ))}
            {experiment.tools.length > 4 && (
              <span className="text-xs text-ink-faint py-0.5">
                +{experiment.tools.length - 4} más
              </span>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between pt-1 border-t border-paper-line">
            <StatusBadge status={experiment.status} />
            <time className="text-xs text-ink-faint font-mono">
              {formatDate(experiment.date)}
            </time>
          </div>
          </div>
        </TiltCard>
      </Link>
    </motion.div>
  );
}
