"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { formatDate } from "@/lib/utils";
import type { Note } from "@/types";

interface NoteCardProps {
  note: Note;
  index?: number;
}

const categoryColors: Record<string, string> = {
  "Claude Code": "text-violet-400",
  "Agent Skills": "text-fuchsia-400",
  MCP: "text-cyan-400",
  Workflows: "text-amber-400",
  "Claude Design": "text-rose-400",
};

export function NoteCard({ note, index = 0 }: NoteCardProps) {
  const catColor = categoryColors[note.category] ?? "text-slate-400";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.07 }}
    >
      <Link href={`/notes/${note.slug}`} className="block group">
        <div className="glass glass-hover rounded-xl p-5 h-full flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className={`text-xs font-mono font-medium ${catColor}`}>
              {note.category}
            </span>
            <time className="text-xs text-slate-500 font-mono">
              {formatDate(note.date)}
            </time>
          </div>

          <div className="flex items-start justify-between gap-3">
            <h3 className="font-semibold text-white leading-snug group-hover:text-egg-300 transition-colors flex-1">
              {note.title}
            </h3>
            <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-egg-400 group-hover:translate-x-1 transition-all flex-shrink-0 mt-0.5" />
          </div>

          <p className="text-sm text-slate-400 leading-relaxed flex-1">
            {note.summary}
          </p>

          <div className="pt-2 border-t border-white/5">
            <p className="text-xs text-slate-500">
              <span className="text-slate-400">What can be built: </span>
              {note.whatCanBeBuilt[0]}
              {note.whatCanBeBuilt.length > 1 &&
                ` + ${note.whatCanBeBuilt.length - 1} more`}
            </p>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
