import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink, ArrowRight } from "lucide-react";
import { artefactos, getArtefactoBySlug, AUDIENCIA_META } from "@/lib/artifacts";
import { formatDate } from "@/lib/utils";

interface Props {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return artefactos.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const a = getArtefactoBySlug(slug);
  if (!a) return {};
  return {
    title: `${a.titulo} — Artefactos`,
    description: a.descripcion,
    alternates: { canonical: `https://www.eggthropic.com/artefactos/${slug}` },
    openGraph: {
      title: `${a.titulo} — Eggthropic`,
      description: a.descripcion,
      url: `https://www.eggthropic.com/artefactos/${slug}`,
      siteName: "Eggthropic",
      type: "website",
    },
  };
}

export default async function ArtefactoPage({ params }: Props) {
  const { slug } = await params;
  const a = getArtefactoBySlug(slug);
  if (!a) notFound();

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Breadcrumb */}
      <Link
        href="/artefactos"
        className="inline-flex items-center gap-1.5 text-sm text-ink-faint hover:text-ink transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Artefactos
      </Link>

      {/* Cabecera */}
      <div className="flex flex-wrap items-center gap-2 mb-3">
        {a.audiencia.map((aud) => {
          const meta = AUDIENCIA_META[aud];
          return (
            <span
              key={aud}
              className="font-mono text-[10px] tracking-wider px-2 py-0.5 rounded border"
              style={{ color: meta.color, borderColor: `${meta.color}45`, background: `${meta.color}0f` }}
            >
              {meta.label.toUpperCase()}
            </span>
          );
        })}
        <span className="font-mono text-[11px] text-ink-faint ml-auto">{formatDate(a.fecha)}</span>
      </div>

      <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-ink mb-3">{a.titulo}</h1>
      <p className="text-ink-soft max-w-3xl leading-relaxed mb-6">{a.descripcion}</p>

      {/* El artefacto */}
      <div className="glass rounded-xl overflow-hidden border border-paper-line mb-3">
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-paper-line bg-paper-deep/50">
          <span className="font-mono text-[10px] tracking-[0.18em] text-ink-faint">
            ARTEFACTO EN VIVO · CORRE EN TU NAVEGADOR · NINGÚN DATO SALE DE LA PÁGINA
          </span>
          <a
            href={`/artifacts/${a.slug}.html`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-teja hover:text-teja-dark transition-colors shrink-0"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            Pantalla completa
          </a>
        </div>
        <iframe
          src={`/artifacts/${a.slug}.html`}
          title={a.titulo}
          sandbox="allow-scripts allow-modals"
          className="w-full bg-[#f4eee2]"
          style={{ height: a.altura }}
        />
      </div>
      <p className="text-[11px] text-ink-faint mb-10">
        El artefacto se ejecuta en un iframe con sandbox (solo scripts). Si algo no se ve bien,
        ábrelo a pantalla completa.
      </p>

      {/* Documentación */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="glass rounded-xl p-6">
          <h2 className="font-mono text-[11px] tracking-[0.2em] text-teja mb-3">— PROMPT QUE LO GENERÓ</h2>
          <p className="text-sm text-ink-soft leading-relaxed font-mono bg-lab-700/60 rounded-lg p-4 border border-paper-line">
            {a.prompt}
          </p>
        </div>

        <div className="glass rounded-xl p-6">
          <h2 className="font-mono text-[11px] tracking-[0.2em] text-teja mb-3">— CÓMO SE HIZO</h2>
          <p className="text-sm text-ink-soft leading-relaxed">{a.comoSeHizo}</p>
          {a.relacionado && (
            <Link
              href={a.relacionado.href}
              className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-teja"
            >
              {a.relacionado.label}
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          )}
        </div>

        <div className="glass rounded-xl p-6 lg:col-span-2">
          <h2 className="font-mono text-[11px] tracking-[0.2em] text-teja mb-3">— LIMITACIONES (SIN HUMO)</h2>
          <ul className="space-y-2">
            {a.limitaciones.map((l, i) => (
              <li key={i} className="text-sm text-ink-soft leading-relaxed flex gap-2.5">
                <span className="text-teja shrink-0 mt-0.5">▸</span>
                {l}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Navegación entre artefactos */}
      <div className="mt-10 pt-6 border-t border-paper-line flex flex-wrap gap-3">
        {artefactos
          .filter((x) => x.slug !== a.slug)
          .map((x) => (
            <Link
              key={x.slug}
              href={`/artefactos/${x.slug}`}
              className="glass glass-hover rounded-lg px-4 py-2.5 text-sm text-ink-soft hover:text-ink"
            >
              {x.titulo} →
            </Link>
          ))}
      </div>
    </div>
  );
}
