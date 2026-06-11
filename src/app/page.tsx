import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Code2, Cpu, Network, Palette } from "lucide-react";
import { Hero } from "@/components/Hero";
import { SectionHeader } from "@/components/SectionHeader";
import { ExperimentCard } from "@/components/ExperimentCard";
import { NoteCard } from "@/components/NoteCard";
import { LabPreview } from "@/components/LabPreview";
import { experiments } from "@/lib/experiments";
import { notes } from "@/lib/notes";

export const metadata: Metadata = {
  title: "Eggthropic — Laboratorio de Claude",
  description:
    "Un laboratorio práctico para aprender Claude construyendo experimentos reales con Claude Code, Agent Skills, MCP y la API de Anthropic. En español.",
  alternates: { canonical: "https://www.eggthropic.com" },
  openGraph: {
    title: "Eggthropic — Laboratorio de Claude",
    description:
      "Un laboratorio práctico para aprender Claude construyendo experimentos reales con Claude Code, Agent Skills, MCP y la API de Anthropic. En español.",
    url: "https://www.eggthropic.com",
    siteName: "Eggthropic",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Eggthropic — Laboratorio de Claude",
    description:
      "Un laboratorio práctico para aprender Claude construyendo experimentos reales con Claude Code, Agent Skills, MCP y la API de Anthropic. En español.",
  },
};

const labSections = [
  {
    icon: Code2,
    title: "Lab de Claude Code",
    description:
      "Experimentos con Claude Code — el CLI agéntico que lee tu base de código, ejecuta comandos y entrega código commiteado en varios archivos.",
    href: "/experiments?category=claude-code",
    color: "text-violet-400",
    bg: "bg-violet-500/10",
    border: "border-violet-500/20",
    tag: "claude-code",
  },
  {
    icon: Cpu,
    title: "Lab de Agent Skills",
    description:
      "Skills portables y reutilizables: directorios SKILL.md que dan a Claude capacidades persistentes entre proyectos y plataformas.",
    href: "/experiments?category=skills",
    color: "text-fuchsia-400",
    bg: "bg-fuchsia-500/10",
    border: "border-fuchsia-500/20",
    tag: "skills",
  },
  {
    icon: Network,
    title: "Lab de MCP",
    description:
      "Explorando el Model Context Protocol: servidores, clientes y herramientas interactivas sobre el estándar abierto JSON-RPC.",
    href: "/experiments?category=mcp",
    color: "text-cyan-400",
    bg: "bg-cyan-500/10",
    border: "border-cyan-500/20",
    tag: "mcp",
  },
  {
    icon: Palette,
    title: "Experimentos UX/UI",
    description:
      "Prototipos de interfaces nativas de IA: streaming, visualización de tool calls y modelos de interacción más allá del chat.",
    href: "/experiments?category=ux-ui",
    color: "text-amber-400",
    bg: "bg-amber-500/10",
    border: "border-amber-500/20",
    tag: "ux-ui",
  },
];

export default function HomePage() {
  const latestExperiments = experiments.slice(0, 4);
  const latestNotes = notes.slice(0, 3);

  return (
    <div>
      <Hero experimentCount={experiments.length} noteCount={notes.length} />

      {/* Lab sections */}
      <section className="py-20 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            label="Qué exploramos"
            title="Cuatro áreas, una misión"
            description="Cada área explora una capa distinta del ecosistema de desarrollo de Claude — del CLI a las integraciones a nivel de protocolo."
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {labSections.map((section) => {
              const Icon = section.icon;
              return (
                <Link
                  key={section.tag}
                  href={section.href}
                  className="glass glass-hover rounded-xl p-5 flex flex-col gap-4 group"
                >
                  <div
                    className={`w-10 h-10 rounded-lg ${section.bg} border ${section.border} flex items-center justify-center`}
                  >
                    <Icon className={`w-5 h-5 ${section.color}`} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white mb-1.5 group-hover:text-egg-300 transition-colors text-sm">
                      {section.title}
                    </h3>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      {section.description}
                    </p>
                  </div>
                  <div
                    className={`mt-auto flex items-center gap-1 text-xs ${section.color} font-mono`}
                  >
                    Explorar
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Últimos experimentos */}
      <section className="py-20 border-t border-white/5">
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
              className="hidden sm:flex items-center gap-1.5 text-sm text-egg-400 hover:text-egg-300 transition-colors font-mono"
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
              className="inline-flex items-center gap-1.5 text-sm text-egg-400"
            >
              Todos los experimentos <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Últimas notas */}
      <section className="py-20 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-10">
            <SectionHeader
              label="Últimas notas"
              title="Las novedades de Anthropic, descifradas"
              description="Artículos cortos sobre Claude y Anthropic: qué ha cambiado, por qué importa y qué se puede construir."
              className="mb-0"
            />
            <Link
              href="/notes"
              className="hidden sm:flex items-center gap-1.5 text-sm text-egg-400 hover:text-egg-300 transition-colors font-mono"
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

      {/* Lab preview */}
      <section className="py-20 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <LabPreview />
        </div>
      </section>
    </div>
  );
}
