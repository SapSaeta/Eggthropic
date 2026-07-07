"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search } from "lucide-react";
import { ExperimentCard } from "@/components/ExperimentCard";
import type { Experiment, ExperimentCategory } from "@/types";

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

interface Props {
  experiments: Experiment[];
  initialCategory?: string;
}

export function ExperimentsClient({ experiments, initialCategory = "all" }: Props) {
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
  );
}
