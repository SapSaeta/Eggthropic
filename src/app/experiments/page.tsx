"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search } from "lucide-react";
import { ExperimentCard } from "@/components/ExperimentCard";
import { SectionHeader } from "@/components/SectionHeader";
import { experiments } from "@/lib/experiments";
import type { ExperimentCategory } from "@/types";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

const categories: { value: "all" | ExperimentCategory; label: string }[] = [
  { value: "all", label: "All" },
  { value: "claude-code", label: "Claude Code" },
  { value: "skills", label: "Skills" },
  { value: "mcp", label: "MCP" },
  { value: "api", label: "API" },
  { value: "ux-ui", label: "UX/UI" },
  { value: "automation", label: "Automation" },
];

function ExperimentsContent() {
  const searchParams = useSearchParams();
  const initialCategory =
    (searchParams.get("category") as ExperimentCategory) ?? "all";

  const [activeCategory, setActiveCategory] = useState<
    "all" | ExperimentCategory
  >(initialCategory);
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    return experiments.filter((exp) => {
      const matchesCategory =
        activeCategory === "all" || exp.category === activeCategory;
      const matchesSearch =
        !search ||
        exp.title.toLowerCase().includes(search.toLowerCase()) ||
        exp.description.toLowerCase().includes(search.toLowerCase()) ||
        exp.tools.some((t) =>
          t.toLowerCase().includes(search.toLowerCase())
        );
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, search]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <SectionHeader
        label="Experiments"
        title="What we've built and documented"
        description="Every experiment includes the goal, context, tools used, prompts, implementation notes, results, and honest failure analysis."
      />

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        {/* Category pills */}
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setActiveCategory(cat.value)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                activeCategory === cat.value
                  ? "bg-egg-400 text-lab-900"
                  : "glass text-slate-400 hover:text-white"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative sm:ml-auto">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search experiments..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full sm:w-64 pl-9 pr-4 py-1.5 rounded-lg glass border border-white/10 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-egg-400/50"
          />
        </div>
      </div>

      {/* Count */}
      <p className="text-xs text-slate-500 font-mono mb-6">
        {filtered.length} experiment{filtered.length !== 1 ? "s" : ""} found
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
            <p className="text-slate-500 text-sm">
              No experiments found. Try a different filter or search.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function ExperimentsPage() {
  return (
    <Suspense fallback={<div className="py-20 text-center text-slate-500 text-sm">Loading...</div>}>
      <ExperimentsContent />
    </Suspense>
  );
}
