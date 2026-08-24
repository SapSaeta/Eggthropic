import type { Metadata } from "next";
import { GithubIcon } from "@/components/GithubIcon";
import ArtefactosClient from "@/components/ArtefactosClient";

export const metadata: Metadata = {
  title: "Artefactos",
  description:
    "Galería de artefactos HTML del laboratorio: herramientas interactivas autocontenidas generadas con Claude para consultores SAP — validadores, checklists, comparativas y explicadores. Cada uno con su prompt y sus limitaciones.",
  alternates: { canonical: "https://www.eggthropic.com/artefactos" },
  openGraph: {
    title: "Artefactos — Eggthropic",
    description:
      "Herramientas HTML interactivas generadas con Claude para consultores SAP, documentadas con prompt y limitaciones.",
    url: "https://www.eggthropic.com/artefactos",
    siteName: "Eggthropic",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Artefactos — Eggthropic",
    description:
      "Herramientas HTML interactivas generadas con Claude para consultores SAP, documentadas con prompt y limitaciones.",
  },
};

export default function ArtefactosPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass border border-egg-500/40 mb-6">
        <span className="h-1.5 w-1.5 rounded-full bg-egg-500 animate-pulse" />
        <span className="font-mono text-[11px] tracking-widest text-egg-700">
          LABORATORIO DE ARTEFACTOS
        </span>
      </div>

      <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-ink max-w-3xl leading-tight">
        Artefactos: herramientas que{" "}
        <span className="gradient-text">caben en un HTML</span>
      </h1>

      <p className="mt-5 text-lg text-ink-soft max-w-2xl leading-relaxed">
        Como los artifacts de Claude: cada pieza es un único archivo HTML
        autocontenido que corre entero en tu navegador — ningún dato sale de la
        página. Pensados para el día a día de consultores SAP técnicos y
        funcionales, y documentados como todo en este laboratorio: con el prompt
        que los generó y sus limitaciones, sin humo.
      </p>

      <div className="mt-10">
        <ArtefactosClient />
      </div>

      {/* Propón el tuyo */}
      <div className="mt-14 glass rounded-2xl p-8 text-center border border-egg-500/25">
        <h2 className="text-xl font-bold text-ink">¿Se te ocurre un artefacto útil?</h2>
        <p className="mt-2 text-sm text-ink-soft max-w-xl mx-auto">
          La galería está abierta por pull request: un HTML autocontenido (sin
          llamadas externas, datos ficticios) más su entrada en{" "}
          <code className="font-mono text-xs bg-lab-700 px-1.5 py-0.5 rounded">src/lib/artifacts.ts</code>{" "}
          con prompt y limitaciones. Lo revisamos y se publica con tu crédito.
        </p>
        <a
          href="https://github.com/sapsaeta/eggthropic"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-egg-400 text-ink text-sm font-semibold hover:bg-egg-300 transition-colors"
        >
          <GithubIcon className="w-4 h-4" />
          Abrir el repositorio
        </a>
      </div>
    </div>
  );
}
