"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { TiltCard } from "./TiltCard";
import type { Note } from "@/types";

interface NoteCardProps {
  note: Note;
  index?: number;
}

const categoryColors: Record<string, string> = {
  "Claude Code": "text-violet-700",
  "Agent Skills": "text-fuchsia-700",
  MCP: "text-cyan-700",
  Workflows: "text-amber-700",
  "Claude Design": "text-rose-600",
};

export function NoteCard({ note, index = 0 }: NoteCardProps) {
  const catColor = categoryColors[note.category] ?? "text-ink-soft";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.07 }}
    >
      <Link href={`/notes/${note.slug}`} className="block group h-full">
        <TiltCard className="group h-full" intensity={5} glowColor="rgba(94, 234, 212, 0.08)">
          <div className="glass glass-hover rounded-xl p-5 h-full flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className={`text-xs font-mono font-medium ${catColor}`}>
              {note.category}
            </span>
            <time className="text-xs text-ink-faint font-mono">
              {formatDate(note.date)}
            </time>
          </div>

          <div className="flex items-start justify-between gap-3">
            <h3 className="font-semibold text-ink leading-snug group-hover:text-egg-600 transition-colors flex-1">
              {note.title}
            </h3>
            <ArrowRight className="w-4 h-4 text-ink-faint group-hover:text-egg-600 group-hover:translate-x-1 transition-all flex-shrink-0 mt-0.5" />
          </div>

          <p className="text-sm text-ink-soft leading-relaxed flex-1">
            {note.summary}
          </p>

          <div className="pt-2 border-t border-paper-line">
            <p className="text-xs text-ink-faint">
              <span className="text-ink-soft">Qué se puede construir: </span>
              {note.whatCanBeBuilt[0]}
              {note.whatCanBeBuilt.length > 1 &&
                ` y ${note.whatCanBeBuilt.length - 1} más`}
            </p>
          </div>
          </div>
        </TiltCard>
      </Link>
    </motion.div>
  );
}
