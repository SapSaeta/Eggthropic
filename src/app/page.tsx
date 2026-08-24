import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Hero } from "@/components/Hero";
import { SectionHeader } from "@/components/SectionHeader";
import { ExperimentCard } from "@/components/ExperimentCard";
import { NoteCard } from "@/components/NoteCard";
import { ArtefactosHomePreview } from "@/components/ArtefactosHomePreview";
import { experiments } from "@/lib/experiments";
import { notes } from "@/lib/notes";
import { artefactos } from "@/lib/artifacts";

export const metadata: Metadata = {
  title: "Eggthropic — Laboratorio de Claude",
  description:
    "Un laboratorio práctico para aprender Claude construyendo artefactos y experimentos reales con Claude Code, Agent Skills, MCP y la API de Anthropic. En español.",
  alternates: { canonical: "https://www.eggthropic.com" },
  openGraph: {
    title: "Eggthropic — Laboratorio de Claude",
    description:
      "Un laboratorio práctico para aprender Claude construyendo artefactos y experimentos reales con Claude Code, Agent Skills, MCP y la API de Anthropic. En español.",
    url: "https://www.eggthropic.com",
    siteName: "Eggthropic",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Eggthropic — Laboratorio de Claude",
    description:
      "Un laboratorio práctico para aprender Claude construyendo artefactos y experimentos reales con Claude Code, Agent Skills, MCP y la API de Anthropic. En español.",
  },
};

export default function HomePage() {
  const latestExperiments = experiments.slice(0, 4);
  const latestNotes = notes.slice(0, 3);

  return (
    <div>
      <Hero experimentCount={experiments.length} noteCount={notes.length} artefactoCount={artefactos.length} />

      {/* Artefactos destacados */}
      <section className="py-20 border-t border-paper-line">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-10">
            <SectionHeader
              label="Cosas que se pueden tocar"
              title="Artefactos en vivo"
              description="Herramientas HTML autocontenidas: corren enteras en tu navegador, sin nada que instalar. Prueba una ahora mismo."
              className="mb-0"
            />
            <Link
              href="/artefactos"
              className="hidden sm:flex items-center gap-1.5 text-sm text-egg-600 hover:text-egg-600 transition-colors font-mono"
            >
              Todos los artefactos ({artefactos.length})
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <ArtefactosHomePreview />

          <div className="mt-6 sm:hidden">
            <Link
              href="/artefactos"
              className="inline-flex items-center gap-1.5 text-sm text-egg-600"
            >
              Todos los artefactos <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Últimos experimentos */}
      <section className="py-20 border-t border-paper-line">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-10">
            <SectionHeader
              label="Últimos experimentos"
              title="Desde el laboratorio"
              description="Cada experimento documenta el objetivo, el prompt, lo que funcionó y lo que falló."
              className="mb-0"
            />
            <Link
              href="/experiments"
              className="hidden sm:flex items-center gap-1.5 text-sm text-egg-600 hover:text-egg-600 transition-colors font-mono"
            >
              Todos los experimentos
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {latestExperiments.map((exp, i) => (
              <ExperimentCard key={exp.slug} experiment={exp} index={i} />
            ))}
          </div>

          <div className="mt-6 sm:hidden">
            <Link
              href="/experiments"
              className="inline-flex items-center gap-1.5 text-sm text-egg-600"
            >
              Todos los experimentos <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Últimas notas */}
      <section className="py-20 border-t border-paper-line">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-10">
            <SectionHeader
              label="Últimas notas"
              title="Las novedades de Anthropic, descifradas"
              description="Artículos cortos sobre Claude y Anthropic: qué ha cambiado, por qué importa y qué se puede construir."
              className="mb-0"
            />
            <Link
              href="/experiments?view=notes"
              className="hidden sm:flex items-center gap-1.5 text-sm text-egg-600 hover:text-egg-600 transition-colors font-mono"
            >
              Todas las notas
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {latestNotes.map((note, i) => (
              <NoteCard key={note.slug} note={note} index={i} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
