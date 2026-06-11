import type { Metadata } from "next";
import Link from "next/link";
import { FlaskConical, GitPullRequest, Shield, Cpu, ArrowRight } from "lucide-react";
import { GithubIcon } from "@/components/GithubIcon";
import LabStatusBoard from "@/components/LabStatusBoard";
import MCPExplainer from "@/components/MCPExplainer";
import { experiments } from "@/lib/experiments";
import type { BoardExperiment, BoardCategory, BoardDifficulty, BoardStatus } from "@/components/LabStatusBoard";

export const metadata: Metadata = {
  title: "Laboratorio",
  description:
    "El tablón del laboratorio de Eggthropic: estado en vivo de los experimentos y cómo proponer el tuyo por pull request.",
  alternates: { canonical: "https://www.eggthropic.com/lab" },
  openGraph: {
    title: "Laboratorio — Eggthropic",
    description:
      "Estado en vivo de los experimentos y cómo proponer el tuyo por pull request.",
    url: "https://www.eggthropic.com/lab",
    siteName: "Eggthropic",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Laboratorio — Eggthropic",
    description:
      "Estado en vivo de los experimentos y cómo proponer el tuyo por pull request.",
  },
};

// ─── Mapeo de datos → modelo del tablón ──────────────────────────────────────

const categoryMap: Record<string, BoardCategory> = {
  "claude-code": "Claude Code",
  skills: "Skills",
  mcp: "MCP",
  "ux-ui": "UX-UI",
};

const difficultyMap: Record<string, BoardDifficulty> = {
  beginner: "INICIAL",
  intermediate: "INTERMEDIO",
  advanced: "AVANZADO",
};

const statusMap: Record<string, BoardStatus> = {
  complete: "complete",
  "in-progress": "in-progress",
  experimental: "experimental",
  archived: "complete",
};

const progressMap: Record<string, number> = {
  complete: 100,
  "in-progress": 65,
  experimental: 30,
  archived: 100,
};

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return "hoy";
  if (days === 1) return "hace 1 d";
  return `hace ${days} d`;
}

const boardExperiments: BoardExperiment[] = experiments
  .filter((e) => categoryMap[e.category])
  .map((e, i) => ({
    id: `EXP-${String(i + 1).padStart(3, "0")}`,
    title: e.title,
    category: categoryMap[e.category],
    status: statusMap[e.status] ?? "experimental",
    difficulty: difficultyMap[e.difficulty] ?? "INTERMEDIO",
    progress: progressMap[e.status] ?? 50,
    lastRun: timeAgo(e.date),
    runId: e.date.replace(/-/g, "").slice(2),
    slug: e.slug,
  }));

// ─── Principios del laboratorio comunitario ──────────────────────────────────

const principios = [
  {
    icon: GitPullRequest,
    title: "Propuestas por PR",
    description:
      "Propón un experimento abriendo un pull request con la plantilla del repo. Si se acepta, se ejecuta y sus resultados se publican aquí.",
    color: "text-violet-700",
    bg: "bg-violet-500/10",
    border: "border-violet-500/20",
  },
  {
    icon: Shield,
    title: "Ejecución aislada",
    description:
      "Los experimentos corren en entornos aislados — sin acceso a sistemas de producción ni estado persistente entre ejecuciones.",
    color: "text-emerald-700",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
  },
  {
    icon: Cpu,
    title: "Con Claude dentro",
    description:
      "Los experimentos aceptados pasan por infraestructura de revisión controlada y con límites. Quien contribuye nunca recibe credenciales.",
    color: "text-cyan-700",
    bg: "bg-cyan-500/10",
    border: "border-cyan-500/20",
  },
  {
    icon: FlaskConical,
    title: "Resultados documentados",
    description:
      "Todo experimento aceptado se documenta con el mismo formato que los nuestros: objetivo, prompt, resultado y análisis honesto de los fallos.",
    color: "text-egg-600",
    bg: "bg-egg-400/10",
    border: "border-egg-400/20",
  },
];

const pasos = [
  "Haz fork del repositorio y copia la plantilla de experimento del README.",
  "Rellena objetivo, contexto, herramientas y el prompt o código que propones — en español.",
  "Abre un pull request. Lo revisamos, te damos feedback y, si encaja, se ejecuta y se publica con tu crédito.",
];

// ─── Página ──────────────────────────────────────────────────────────────────

export default function LabPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Cabecera */}
      <div className="mb-12">
        <span className="inline-flex items-center gap-2 text-xs font-mono tracking-widest text-egg-600 uppercase mb-3">
          <span className="w-6 h-px bg-egg-400/50" />
          Laboratorio
          <span className="w-6 h-px bg-egg-400/50" />
        </span>
        <h1 className="text-3xl sm:text-4xl font-bold text-ink mb-3">
          El tablón del laboratorio
        </h1>
        <p className="text-ink-soft max-w-2xl leading-relaxed">
          Estado en vivo de todos los experimentos: qué está completo, qué sigue en
          curso y qué acaba de entrar en el nido. Cada fila enlaza a la
          documentación completa.
        </p>
      </div>

      {/* Tablón */}
      <section className="mb-20">
        <LabStatusBoard experiments={boardExperiments} />
        <p className="mt-3 text-xs text-ink-faint">
          Este tablón se prototipó con{" "}
          <Link
            href="/experiments/claude-design-prototype-to-code"
            className="text-rose-600 hover:text-rose-600 transition-colors"
          >
            Claude Design — léelo como experimento
          </Link>
          .
        </p>
      </section>

      {/* Cómo contribuir */}
      <section className="mb-20">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-ink mb-2">
            Propón tu experimento
          </h2>
          <p className="text-ink-soft max-w-2xl leading-relaxed">
            Eggthropic es open source y el laboratorio está abierto a la
            comunidad. Así funciona:
          </p>
        </div>

        <ol className="space-y-3 mb-8 max-w-2xl">
          {pasos.map((paso, i) => (
            <li key={i} className="flex items-start gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-egg-400/15 border border-egg-400/30 font-mono text-xs text-egg-600">
                {i + 1}
              </span>
              <span className="text-sm text-ink-soft leading-relaxed">{paso}</span>
            </li>
          ))}
        </ol>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {principios.map((p) => {
            const Icon = p.icon;
            return (
              <div key={p.title} className="glass rounded-xl p-5">
                <div
                  className={`w-10 h-10 rounded-lg ${p.bg} border ${p.border} flex items-center justify-center mb-4`}
                >
                  <Icon className={`w-5 h-5 ${p.color}`} />
                </div>
                <h3 className="font-semibold text-ink text-sm mb-1.5">{p.title}</h3>
                <p className="text-xs text-ink-faint leading-relaxed">{p.description}</p>
              </div>
            );
          })}
        </div>

        <div className="flex flex-wrap gap-3">
          <a
            href="https://github.com/sapsaeta/eggthropic"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-egg-400 text-ink font-semibold text-sm hover:bg-egg-300 transition-colors"
          >
            <GithubIcon className="w-4 h-4" />
            Abrir el repositorio
          </a>
          <Link
            href="/experiments"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg glass border border-paper-line text-ink text-sm font-medium hover:border-teja/50 transition-colors"
          >
            Ver el formato de un experimento
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Recurso didáctico */}
      <section>
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-ink mb-2">
            Bonus: cómo funciona MCP, en un diagrama
          </h2>
          <p className="text-ink-soft max-w-2xl leading-relaxed">
            El recurso didáctico que salió de nuestro explicador visual de MCP:
            host, cliente y servidor, y qué viaja entre ellos.
          </p>
        </div>
        <MCPExplainer />
      </section>
    </div>
  );
}
