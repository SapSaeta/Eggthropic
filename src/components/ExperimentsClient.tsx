"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, LayoutGrid, ListChecks, BookOpen } from "lucide-react";
import { ExperimentCard } from "@/components/ExperimentCard";
import { NoteCard } from "@/components/NoteCard";
import LabStatusBoard, { type BoardExperiment } from "@/components/LabStatusBoard";
import type { Experiment, ExperimentCategory, Note } from "@/types";

const categories: { value: "all" | ExperimentCategory; label: string }[] = [
  { value: "all", label: "Todos" },
  { value: "claude-code", label: "Claude Code" },
  { value: "skills", label: "Skills" },
  { value: "mcp", label: "MCP" },
  { value: "api", label: "API" },
  { value: "ux-ui", label: "UX/UI" },
  { value: "automation", label: "Automatización" },
  { value: "enterprise-ai", label: "Enterprise AI" },
  { value: "sap", label: "SAP" },
];

type View = "cards" | "board" | "notes";

const views: { value: View; label: string; icon: typeof LayoutGrid }[] = [
  { value: "cards", label: "Tarjetas", icon: LayoutGrid },
  { value: "board", label: "Tablón", icon: ListChecks },
  { value: "notes", label: "Notas", icon: BookOpen },
];

interface Props {
  experiments: Experiment[];
  notes: Note[];
  boardExperiments: BoardExperiment[];
  initialCategory?: string;
  initialView?: View;
}

export function ExperimentsClient({ experiments, notes, boardExperiments, initialCategory = "all", initialView = "cards" }: Props) {
  const [view, setView] = useState<View>(initialView);
  const [activeCategory, setActiveCategory] = useState<"all" | ExperimentCategory>(
    initialCategory as "all" | ExperimentCategory
  );
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    return experiments.filter((exp) => {
      const matchesCategory = activeCategory === "all" || exp.category === activeCategory;
      const matchesSearch =
        !search ||
        exp.title.toLowerCase().includes(search.toLowerCase()) ||
        exp.description.toLowerCase().includes(search.toLowerCase()) ||
        exp.tools.some((t) => t.toLowerCase().includes(search.toLowerCase()));
      return matchesCategory && matchesSearch;
    });
  }, [experiments, activeCategory, search]);

  return (
    <>
      {/* Selector de vista */}
      <div className="flex gap-1.5 mb-6 p-1 rounded-lg glass border border-paper-line w-fit">
        {views.map((v) => {
          const Icon = v.icon;
          return (
            <button
              key={v.value}
              onClick={() => setView(v.value)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                view === v.value
                  ? "bg-egg-400 text-ink"
                  : "text-ink-soft hover:text-ink"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {v.label}
              {v.value === "notes" && (
                <span className="text-xs font-mono opacity-60">({notes.length})</span>
              )}
            </button>
          );
        })}
      </div>

      {view === "cards" && (
        <>
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat.value}
                  onClick={() => setActiveCategory(cat.value)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    activeCategory === cat.value
                      ? "bg-egg-400 text-ink"
                      : "glass text-ink-soft hover:text-ink"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            <div className="relative sm:ml-auto">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-faint" />
              <input
                type="text"
                placeholder="Buscar experimentos…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full sm:w-64 pl-9 pr-4 py-1.5 rounded-lg glass border border-paper-line text-sm text-ink placeholder-slate-500 focus:outline-none focus:border-egg-400/50"
              />
            </div>
          </div>

          {/* Count */}
          <p className="text-xs text-ink-faint font-mono mb-6">
            {filtered.length} experimento{filtered.length !== 1 ? "s" : ""} encontrado{filtered.length !== 1 ? "s" : ""}
          </p>

          {/* Grid */}
          <AnimatePresence mode="wait">
            {filtered.length > 0 ? (
              <motion.div
                key={`${activeCategory}-${search}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
              >
                {filtered.map((exp, i) => (
                  <ExperimentCard key={exp.slug} experiment={exp} index={i} />
                ))}
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="py-20 text-center"
              >
                <p className="text-ink-faint text-sm">
                  No hay experimentos con ese filtro. Prueba otra categoría o búsqueda.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}

      {view === "board" && (
        <div>
          <p className="text-xs text-ink-faint font-mono mb-6">
            Estado en vivo de los mismos experimentos, en formato tablón.
          </p>
          <LabStatusBoard experiments={boardExperiments} />
        </div>
      )}

      {view === "notes" && (
        <div>
          <p className="text-xs text-ink-faint font-mono mb-6">
            {notes.length} nota{notes.length !== 1 ? "s" : ""} sobre novedades de Claude y Anthropic.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {notes.map((note, i) => (
              <NoteCard key={note.slug} note={note} index={i} />
            ))}
          </div>
        </div>
      )}
    </>
  );
}
