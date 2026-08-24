import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  CircleDashed,
  Loader2,
  FileCode2,
  MessageSquareText,
  FileSpreadsheet,
} from "lucide-react";
import { GithubIcon } from "@/components/GithubIcon";
import SapLabBoard from "@/components/SapLabBoard";
import { etiquetas, fases, sapStats } from "@/lib/sap-lab";
import { artefactos } from "@/lib/artifacts";

export const metadata: Metadata = {
  title: "SAP Lab",
  description:
    "SAP x Claude Lab: un laboratorio continuo de casos reales de Claude aplicado al ecosistema SAP — ABAP, HCM, Fiori, RAP y CAP. Documentado sin humo: hecho, hipótesis, resultado propio o pendiente.",
  alternates: { canonical: "https://www.eggthropic.com/sap" },
  openGraph: {
    title: "SAP Lab — Eggthropic",
    description:
      "Casos reales de Claude aplicado a SAP: 25 casos puntuados, 3 desarrollados, 1 prueba ejecutada con evidencia.",
    url: "https://www.eggthropic.com/sap",
    siteName: "Eggthropic",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "SAP Lab — Eggthropic",
    description:
      "Casos reales de Claude aplicado a SAP: 25 casos puntuados, 3 desarrollados, 1 prueba ejecutada con evidencia.",
  },
};

const casosDestacados = [
  {
    icon: FileCode2,
    id: "SAP-001",
    titulo: "Refactor ABAP a Clean Code",
    resumen:
      "Un report de ausencias legacy con 13 defectos plantados → revisión con severidades, refactor a clase local con JOIN único y criterios de cuándo NO refactorizar.",
    resultado: "13/13 defectos detectados · sintaxis pendiente de validar en sistema real",
    slug: "sap-abap-clean-code-refactor",
    color: "#0a6ed1",
  },
  {
    icon: MessageSquareText,
    id: "SAP-002",
    titulo: "Explicador de ABAP legacy",
    resumen:
      "Un cálculo de plus de antigüedad HCM sin documentación → explicación funcional sin jerga + explicación técnica con flujo de datos y un bug latente detectado.",
    resultado: "7/7 elementos detectados · convenciones de cliente marcadas como preguntas",
    slug: "sap-abap-legacy-explainer",
    color: "#c2542b",
  },
  {
    icon: FileSpreadsheet,
    id: "SAP-004",
    titulo: "Validador de Excel para cargas HCM",
    resumen:
      "12 reglas de validación → validador Python → Excel con 10 errores plantados. La única prueba de la primera tanda ejecutada de verdad, con evidencia sin editar.",
    resultado: "10/10 detecciones · 0 falsos positivos · a la primera ejecución",
    slug: "sap-hcm-excel-validator",
    color: "#0d9488",
  },
];

const FASE_ICON = {
  completada: CheckCircle2,
  "en-curso": Loader2,
  pendiente: CircleDashed,
} as const;

const FASE_STYLE = {
  completada: "text-emerald-700",
  "en-curso": "text-[#0a6ed1]",
  pendiente: "text-ink-faint",
} as const;

export default function SapLabPage() {
  return (
    <div>
      {/* ── Hero ── */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-60" aria-hidden />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass border border-[#0a6ed1]/25 mb-6">
            <span className="h-1.5 w-1.5 rounded-full bg-[#0a6ed1] animate-pulse" />
            <span className="font-mono text-[11px] tracking-widest text-[#0a6ed1]">
              SAP × CLAUDE LAB
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-ink max-w-3xl leading-tight">
            Claude aplicado a SAP,{" "}
            <span className="gradient-text">probado con método</span> y contado
            sin humo.
          </h1>

          <p className="mt-5 text-lg text-ink-soft max-w-2xl leading-relaxed">
            Un laboratorio continuo de casos reales para consultores y
            desarrolladores SAP: ABAP y Clean Code, HCM, Fiori, RAP y CAP. Cada
            caso se investiga con fuentes, se puntúa, se prueba con un experimento
            reproducible y termina en un artefacto: prompt, script, checklist o
            skill.
          </p>

          {/* Stats */}
          <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl">
            {sapStats.map((s) => (
              <div key={s.etiqueta} className="glass rounded-xl px-4 py-3">
                <p className="text-2xl font-bold text-ink tabular-nums">{s.valor}</p>
                <p className="mt-0.5 text-[11px] text-ink-faint leading-snug">{s.etiqueta}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Etiquetas de rigor ── */}
      <section className="py-14 border-t border-paper-line">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="font-mono text-[11px] tracking-[0.2em] text-teja mb-2">
            LA REGLA NO NEGOCIABLE
          </p>
          <h2 className="text-2xl sm:text-3xl font-bold text-ink mb-3">
            Toda afirmación lleva etiqueta
          </h2>
          <p className="text-ink-soft max-w-2xl mb-8">
            Nada de «la IA revoluciona SAP». Cada afirmación del laboratorio se
            clasifica en una de estas cuatro categorías — y lo que no está
            probado, se dice.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {etiquetas.map((e) => (
              <div key={e.tag} className="glass glass-hover rounded-xl p-5">
                <span
                  className="inline-block px-2 py-1 rounded font-mono text-[10px] tracking-widest border"
                  style={{
                    color: e.color,
                    borderColor: `${e.color}55`,
                    background: `${e.color}12`,
                  }}
                >
                  [{e.tag}]
                </span>
                <p className="mt-3 text-sm text-ink-soft leading-relaxed">{e.descripcion}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Casos desarrollados ── */}
      <section className="py-14 border-t border-paper-line">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="font-mono text-[11px] tracking-[0.2em] text-teja mb-2">
            PRIMERA TANDA · JULIO 2026
          </p>
          <h2 className="text-2xl sm:text-3xl font-bold text-ink mb-8">
            Tres casos desarrollados, uno probado con evidencia
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {casosDestacados.map((c) => {
              const Icon = c.icon;
              const artefactosCaso = artefactos.filter(
                (a) => a.relacionado?.href === `/experiments/${c.slug}`
              );
              return (
                <div key={c.id} className="glass glass-hover rounded-xl p-6 flex flex-col gap-4 group">
                  <Link href={`/experiments/${c.slug}`} className="flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                      <div
                        className="w-10 h-10 rounded-lg border flex items-center justify-center transition-transform duration-300 group-hover:-rotate-12 group-hover:scale-110"
                        style={{ background: `${c.color}12`, borderColor: `${c.color}30` }}
                      >
                        <Icon className="w-5 h-5" style={{ color: c.color }} />
                      </div>
                      <span className="font-mono text-[10px] tracking-widest text-ink-faint">
                        {c.id}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-ink group-hover:text-teja transition-colors">
                        {c.titulo}
                      </h3>
                      <p className="mt-2 text-sm text-ink-soft leading-relaxed">{c.resumen}</p>
                    </div>
                  </Link>

                  <div className="mt-auto pt-3 border-t border-paper-line">
                    <p className="font-mono text-[10px] tracking-wide text-ink-faint leading-relaxed">
                      {c.resultado}
                    </p>
                    <Link
                      href={`/experiments/${c.slug}`}
                      className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-teja"
                    >
                      Leer el experimento
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                    {artefactosCaso.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-2">
                        {artefactosCaso.map((a) => (
                          <Link
                            key={a.slug}
                            href={`/artefactos/${a.slug}`}
                            className="inline-flex items-center gap-1 text-xs font-mono text-egg-600 hover:text-egg-600/80 transition-colors"
                          >
                            ▸ Ver artefacto: {a.titulo}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <p className="mt-6 text-xs text-ink-faint max-w-3xl leading-relaxed">
            Honestidad metodológica: en los casos 001 y 002 el mismo modelo creó el
            código defectuoso y lo revisó, así que sus detecciones perfectas son
            cota superior, no benchmark. El caso 004 sí tiene verificación
            objetiva: el script se ejecutó contra datos y la salida se comparó
            mecánicamente con lo esperado.
          </p>
        </div>
      </section>

      {/* ── Tablón del backlog ── */}
      <section className="py-14 border-t border-paper-line">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="font-mono text-[11px] tracking-[0.2em] text-teja mb-2">
            EL TABLÓN SAP
          </p>
          <h2 className="text-2xl sm:text-3xl font-bold text-ink mb-3">
            25 casos, 8 líneas de investigación
          </h2>
          <p className="text-ink-soft max-w-2xl mb-8">
            Cada caso se puntúa de 10 a 50 con diez criterios: utilidad SAP real,
            facilidad de prueba, reutilización, riesgo, impacto profesional… Filtra
            por línea y sigue el estado de cada uno.
          </p>

          <SapLabBoard />
        </div>
      </section>

      {/* ── Roadmap de fases ── */}
      <section className="py-14 border-t border-paper-line">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="font-mono text-[11px] tracking-[0.2em] text-teja mb-2">
            HOJA DE RUTA
          </p>
          <h2 className="text-2xl sm:text-3xl font-bold text-ink mb-8">
            Cinco fases, de la base al portfolio
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {fases.map((f) => {
              const Icon = FASE_ICON[f.estado];
              return (
                <div key={f.n} className="glass rounded-xl p-5 flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] tracking-widest text-ink-faint">
                      FASE {f.n}
                    </span>
                    <Icon
                      className={`w-4 h-4 ${FASE_STYLE[f.estado]} ${
                        f.estado === "en-curso" ? "animate-spin [animation-duration:3s]" : ""
                      }`}
                    />
                  </div>
                  <h3 className="text-sm font-semibold text-ink leading-snug">{f.nombre}</h3>
                  <p className="text-xs text-ink-soft leading-relaxed">{f.detalle}</p>
                  <span
                    className={`mt-auto font-mono text-[9px] tracking-widest uppercase ${FASE_STYLE[f.estado]}`}
                  >
                    {f.estado === "completada"
                      ? "✓ completada"
                      : f.estado === "en-curso"
                        ? "● en curso"
                        : "○ pendiente"}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-16 border-t border-paper-line">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="glass rounded-2xl p-8 sm:p-10 text-center border border-[#0a6ed1]/20 glow-blue">
            <h2 className="text-2xl sm:text-3xl font-bold text-ink">
              ¿Trabajas con SAP y quieres proponer un caso?
            </h2>
            <p className="mt-3 text-ink-soft max-w-xl mx-auto">
              El laboratorio está abierto: propón un caso por pull request con el
              mismo formato — problema real, hipótesis, prueba mínima y artefacto.
              En SaetaIA publicamos los resultados en español.
            </p>
            <div className="mt-7 flex flex-col sm:flex-row items-center justify-center gap-3">
              <a
                href="https://github.com/sapsaeta/eggthropic"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-egg-400 text-ink text-sm font-semibold hover:bg-egg-300 transition-colors"
              >
                <GithubIcon className="w-4 h-4" />
                Abrir el repositorio
              </a>
              <a
                href="https://saetaia.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg glass glass-hover text-sm font-medium text-ink"
              >
                SaetaIA — Claude × SAP en español
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
