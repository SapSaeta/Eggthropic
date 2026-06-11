import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, AlertCircle } from "lucide-react";
import { GithubIcon } from "@/components/GithubIcon";

export const metadata: Metadata = {
  title: "Sobre el lab",
  description:
    "Qué es Eggthropic, por qué existe y para quién es. Un proyecto experimental independiente que documenta flujos reales de desarrollo con Claude y Anthropic, en español.",
  alternates: { canonical: "https://www.eggthropic.com/about" },
  openGraph: {
    title: "Sobre el lab — Eggthropic",
    description:
      "Qué es Eggthropic, por qué existe y para quién es. Experimentos reales con Claude, documentados con honestidad.",
    url: "https://www.eggthropic.com/about",
    siteName: "Eggthropic",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sobre el lab — Eggthropic",
    description:
      "Qué es Eggthropic, por qué existe y para quién es. Experimentos reales con Claude, documentados con honestidad.",
  },
};

const forList = [
  "Desarrolladores que quieren saber qué hace Claude Code de verdad en la práctica, no en el folleto de marketing",
  "Ingenieros evaluando MCP para herramientas internas o arquitecturas de agentes",
  "Builders con curiosidad por las Agent Skills y cómo estructurar capacidades reutilizables",
  "Cualquiera que busque experimentos de IA documentados con honestidad — análisis de fallos incluido",
  "Gente que quiere seguir las novedades de Anthropic y Claude con mirada crítica y práctica",
];

const notList = [
  "Un producto, partner o recurso oficial de Anthropic",
  "Una web de tutoriales con papilla para principiantes",
  "Una plataforma que maquilla los fallos o finge que todos los experimentos salen perfectos",
  "Un sitio de hype, especulación o features inventadas",
];

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="mb-10">
        <span className="inline-flex items-center gap-2 text-xs font-mono tracking-widest text-egg-600 uppercase mb-3">
          <span className="w-6 h-px bg-egg-400/50" />
          Sobre el lab
          <span className="w-6 h-px bg-egg-400/50" />
        </span>
        <h1 className="text-4xl font-bold text-ink mb-4">¿Qué es Eggthropic?</h1>
        <p className="text-lg text-ink-soft leading-relaxed">
          Eggthropic es un laboratorio experimental independiente para aprender
          Claude construyendo experimentos reales — y documentándolo todo,
          incluido lo que falla.
        </p>
      </div>

      <div className="space-y-12">
        {/* Qué hacemos */}
        <Section title="Qué hacemos">
          <p className="text-ink-soft leading-relaxed mb-4">
            Construimos experimentos con Claude Code, Agent Skills, servidores
            MCP, la API de Anthropic y patrones de UX para IA. Cada experimento
            se documenta entero: objetivo, contexto, herramientas, prompts
            exactos, notas de implementación, resultados y un análisis honesto
            de qué funcionó y qué no.
          </p>
          <p className="text-ink-soft leading-relaxed">
            También publicamos notas cortas sobre las novedades de Anthropic y
            Claude: qué ha cambiado, por qué importa a quien desarrolla, qué
            permite construir y qué limitaciones o riesgos tiene. Sin
            especulación. Sin features inventadas. Todo sale de fuentes
            oficiales.
          </p>
        </Section>

        {/* Por qué existe */}
        <Section title="Por qué existe Eggthropic">
          <p className="text-ink-soft leading-relaxed mb-4">
            El ecosistema de desarrollo de Claude evoluciona deprisa. Claude
            Code, las Agent Skills y MCP son herramientas serias — pero
            entenderlas exige práctica, no solo leer documentación. Eggthropic
            existe para cubrir ese hueco: tomarse la documentación en serio,
            construir cosas de verdad y publicar lo que pasa de verdad.
          </p>
          <p className="text-ink-soft leading-relaxed">
            El huevo del nombre es un guiño a la experimentación: un huevo es un
            comienzo, no un producto terminado. Es el marco mental correcto para
            trabajar con herramientas de IA que cambian cada semana.
          </p>
        </Section>

        {/* Para quién */}
        <Section title="Para quién es">
          <ul className="space-y-3">
            {forList.map((item, i) => (
              <li key={i} className="flex items-start gap-2.5">
                <ArrowRight className="w-4 h-4 text-egg-600/70 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-ink-soft leading-relaxed">
                  {item}
                </span>
              </li>
            ))}
          </ul>
        </Section>

        {/* Qué NO es */}
        <Section title="Qué no es Eggthropic">
          <ul className="space-y-3">
            {notList.map((item, i) => (
              <li key={i} className="flex items-start gap-2.5">
                <span className="w-4 h-4 flex-shrink-0 mt-0.5 flex items-center justify-center text-rose-600 font-bold text-xs">
                  ×
                </span>
                <span className="text-sm text-ink-soft leading-relaxed">
                  {item}
                </span>
              </li>
            ))}
          </ul>
        </Section>

        {/* Proyecto hermano */}
        <Section title="El proyecto hermano: SaetaIA">
          <p className="text-ink-soft leading-relaxed">
            Eggthropic es el taller;{" "}
            <a
              href="https://saetaia.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-egg-600 hover:text-egg-600 underline underline-offset-2"
            >
              SaetaIA
            </a>{" "}
            es el periódico. SaetaIA cubre cada día las noticias de Claude y SAP
            en español y enseña desde cero; cuando un experimento de este
            laboratorio merece la pena, allí aparece su crónica. Si trabajas con
            SAP, empieza por allí.
          </p>
        </Section>

        {/* Disclaimer */}
        <div className="glass rounded-xl p-5 border border-amber-400/20">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-700 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-ink mb-2">
                Aviso de proyecto independiente
              </h3>
              <p className="text-sm text-ink-soft leading-relaxed">
                Eggthropic es un proyecto experimental independiente, sin
                afiliación, respaldo, patrocinio ni conexión oficial con
                Anthropic. Claude, Anthropic, Claude Code y los nombres
                relacionados son marcas de Anthropic. Toda referencia a sus
                productos tiene fines exclusivamente educativos e informativos.
              </p>
            </div>
          </div>
        </div>

        {/* Participa */}
        <Section title="Participa">
          <p className="text-ink-soft leading-relaxed mb-5">
            Eggthropic es open source. Si ves un error factual, quieres sugerir
            un experimento o te interesa contribuir al laboratorio comunitario,
            el mejor sitio para empezar es GitHub.
          </p>
          <div className="flex flex-wrap gap-3">
            <a
              href="https://github.com/sapsaeta/eggthropic"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg glass border border-paper-line text-sm text-ink hover:border-teja/50 transition-colors"
            >
              <GithubIcon className="w-4 h-4" />
              Ver en GitHub
            </a>
            <Link
              href="/experiments"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-egg-400 text-ink font-semibold text-sm hover:bg-egg-300 transition-colors"
            >
              Explorar experimentos
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </Section>
      </div>
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h2 className="text-xs font-mono tracking-widest text-egg-600/70 uppercase mb-4 flex items-center gap-2">
        <span className="w-4 h-px bg-egg-400/30" />
        {title}
      </h2>
      {children}
    </div>
  );
}
