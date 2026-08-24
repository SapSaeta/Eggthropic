"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ExternalLink } from "lucide-react";
import {
  artefactos,
  AUDIENCIA_META,
  type Artefacto,
  type Audiencia,
} from "@/lib/artifacts";

function AudienciaChips({ a }: { a: Artefacto }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {a.audiencia.map((aud) => {
        const meta = AUDIENCIA_META[aud];
        return (
          <span
            key={aud}
            className="font-mono text-[9.5px] tracking-wider px-2 py-0.5 rounded border"
            style={{
              color: meta.color,
              borderColor: `${meta.color}45`,
              background: `${meta.color}0f`,
            }}
          >
            {meta.label.toUpperCase()}
          </span>
        );
      })}
    </div>
  );
}

export function ArtefactosClient() {
  const [filtro, setFiltro] = useState<Audiencia | "all">("all");

  const filtrados = useMemo(
    () =>
      filtro === "all"
        ? artefactos
        : artefactos.filter((a) => a.audiencia.includes(filtro)),
    [filtro]
  );

  const audiencias = (Object.keys(AUDIENCIA_META) as Audiencia[]).filter((k) =>
    artefactos.some((a) => a.audiencia.includes(k))
  );

  return (
    <>
      {/* Filtros por audiencia */}
      <div className="flex flex-wrap gap-2 mb-8">
        <button
          onClick={() => setFiltro("all")}
          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
            filtro === "all" ? "bg-egg-400 text-ink" : "glass text-ink-soft hover:text-ink"
          }`}
        >
          Todos
        </button>
        {audiencias.map((aud) => {
          const meta = AUDIENCIA_META[aud];
          const activo = filtro === aud;
          return (
            <button
              key={aud}
              onClick={() => setFiltro(activo ? "all" : aud)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                activo ? "text-white" : "glass text-ink-soft hover:text-ink"
              }`}
              style={activo ? { background: meta.color } : undefined}
            >
              {meta.label}
            </button>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={filtro}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-5"
        >
          {filtrados.map((a, i) => (
            <motion.div
              key={a.slug}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05, duration: 0.3 }}
              className="glass glass-hover rounded-xl overflow-hidden flex flex-col group"
            >
              {/* Mini-preview del artefacto */}
              <Link
                href={`/artefactos/${a.slug}`}
                className="block relative h-52 overflow-hidden border-b border-paper-line bg-[#f4eee2]"
                aria-label={`Abrir ${a.titulo}`}
              >
                <iframe
                  src={`/artifacts/${a.slug}.html`}
                  title={`Vista previa de ${a.titulo}`}
                  loading="lazy"
                  sandbox="allow-scripts"
                  tabIndex={-1}
                  aria-hidden
                  className="absolute top-0 left-0 origin-top-left pointer-events-none select-none"
                  style={{ width: "200%", height: "200%", transform: "scale(0.5)" }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#2c2620]/25 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <span className="absolute bottom-2.5 right-3 font-mono text-[9px] tracking-widest text-white bg-ink/70 px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                  ABRIR ARTEFACTO →
                </span>
              </Link>

              <div className="p-5 flex flex-col gap-3 flex-1">
                <AudienciaChips a={a} />
                <h3 className="text-lg font-semibold text-ink group-hover:text-teja transition-colors">
                  <Link href={`/artefactos/${a.slug}`}>{a.titulo}</Link>
                </h3>
                <p className="text-sm text-ink-soft leading-relaxed flex-1">{a.descripcion}</p>
                <div className="flex items-center justify-between pt-2 border-t border-paper-line">
                  <Link
                    href={`/artefactos/${a.slug}`}
                    className="inline-flex items-center gap-1 text-sm font-medium text-teja"
                  >
                    Ver con documentación
                    <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                  </Link>
                  <a
                    href={`/artifacts/${a.slug}.html`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-ink-faint hover:text-ink transition-colors"
                    title="Abrir el HTML a pantalla completa"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    Pantalla completa
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>
    </>
  );
}

export default ArtefactosClient;
