"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, FlaskConical } from "lucide-react";
import {
  sapCasos,
  LINEAS,
  CLASIFICACION_META,
  type SapLinea,
  type SapCaso,
} from "@/lib/sap-lab";

// ─── Metadatos de estado ──────────────────────────────────────────────────────

const ESTADO_META = {
  probado: {
    label: "PROBADO",
    dot: "bg-emerald-500",
    text: "text-emerald-700",
    detail: "prueba ejecutada con evidencia",
  },
  desarrollado: {
    label: "DESARROLLADO",
    dot: "bg-[#0a6ed1]",
    text: "text-[#0a6ed1]",
    detail: "artefactos creados, validación externa pendiente",
  },
  backlog: {
    label: "BACKLOG",
    dot: "bg-lab-400",
    text: "text-ink-faint",
    detail: "puntuado, pendiente de desarrollo",
  },
} as const;

const CLASIF_STYLE: Record<string, string> = {
  "prioridad-maxima": "bg-teja/10 text-teja border-teja/30",
  "muy-interesante": "bg-[#0a6ed1]/10 text-[#0a6ed1] border-[#0a6ed1]/25",
  explorar: "bg-lab-100/5 text-ink-faint border-paper-line",
};

// ─── Sub-componentes ──────────────────────────────────────────────────────────

function ScoreBar({ score, color }: { score: number; color: string }) {
  const pct = (score / 50) * 100;
  return (
    <div className="flex items-center gap-2 min-w-[110px]">
      <div className="h-1.5 flex-1 rounded-full bg-lab-600 overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: `${pct}%` }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="h-full rounded-full"
          style={{ background: color }}
        />
      </div>
      <span className="font-mono text-[11px] text-ink-soft tabular-nums w-10 text-right">
        {score}/50
      </span>
    </div>
  );
}

function CasoRow({ caso, index }: { caso: SapCaso; index: number }) {
  const linea = LINEAS[caso.linea];
  const estado = ESTADO_META[caso.estado];
  const clasif = CLASIFICACION_META[caso.clasificacion];

  const inner = (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.025, duration: 0.25 }}
      className={`glass rounded-lg px-4 py-3 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 ${
        caso.slug ? "glass-hover cursor-pointer" : ""
      }`}
    >
      <span className="font-mono text-[11px] text-ink-faint w-14 shrink-0">
        SAP-{caso.id}
      </span>

      <span className="flex items-center gap-1.5 shrink-0 w-40">
        <span style={{ color: linea.color }} className="text-sm leading-none">
          {linea.icon}
        </span>
        <span className="font-mono text-[10px] tracking-wider text-ink-soft uppercase">
          {linea.nombre}
        </span>
      </span>

      <span className="text-sm text-ink flex-1 leading-snug">
        {caso.titulo}
        {caso.slug && (
          <ArrowUpRight className="inline w-3.5 h-3.5 ml-1 text-teja align-text-top" />
        )}
      </span>

      <span
        className={`hidden md:inline-flex px-2 py-0.5 rounded border font-mono text-[9px] tracking-widest shrink-0 ${CLASIF_STYLE[caso.clasificacion]}`}
        title={`Clasificación por scoring (≥${clasif.min} puntos)`}
      >
        {clasif.label}
      </span>

      <ScoreBar score={caso.score} color={linea.color} />

      <span className="flex items-center gap-1.5 shrink-0 sm:w-32 sm:justify-end">
        <span className={`h-1.5 w-1.5 rounded-full ${estado.dot}`} />
        <span
          className={`font-mono text-[10px] tracking-wider ${estado.text}`}
          title={estado.detail}
        >
          {estado.label}
        </span>
      </span>
    </motion.div>
  );

  return caso.slug ? (
    <Link href={`/experiments/${caso.slug}`} className="block">
      {inner}
    </Link>
  ) : (
    inner
  );
}

// ─── Tablón principal ─────────────────────────────────────────────────────────

export function SapLabBoard() {
  const [filtroLinea, setFiltroLinea] = useState<SapLinea | "ALL">("ALL");

  const filtrados = useMemo(
    () =>
      (filtroLinea === "ALL"
        ? sapCasos
        : sapCasos.filter((c) => c.linea === filtroLinea)
      )
        .slice()
        .sort((a, b) => b.score - a.score),
    [filtroLinea]
  );

  const lineasConCasos = (Object.keys(LINEAS) as SapLinea[]).filter((l) =>
    sapCasos.some((c) => c.linea === l)
  );

  const desarrollados = sapCasos.filter((c) => c.estado !== "backlog").length;
  const probados = sapCasos.filter((c) => c.estado === "probado").length;

  return (
    <div className="glass rounded-2xl p-4 sm:p-6 border border-paper-line">
      {/* Cabecera del tablón */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 pb-4 border-b border-paper-line">
        <div className="flex items-center gap-2.5">
          <FlaskConical className="w-4 h-4 text-[#0a6ed1]" />
          <span className="font-mono text-[11px] tracking-[0.2em] text-ink-soft">
            SAP×CLAUDE//BACKLOG
          </span>
        </div>
        <div className="flex items-center gap-4 font-mono text-[10px] tracking-wider text-ink-faint">
          <span>
            CASOS <span className="text-ink">{sapCasos.length}</span>
          </span>
          <span>
            DESARROLLADOS <span className="text-[#0a6ed1]">{desarrollados}</span>
          </span>
          <span>
            PROBADOS <span className="text-emerald-700">{probados}</span>
          </span>
        </div>
      </div>

      {/* Filtros por línea */}
      <div className="flex flex-wrap gap-1.5 mb-5">
        <button
          onClick={() => setFiltroLinea("ALL")}
          className={`px-2.5 py-1 rounded font-mono text-[10px] tracking-wider border transition-colors ${
            filtroLinea === "ALL"
              ? "bg-egg-400 text-ink border-egg-500"
              : "glass text-ink-soft hover:text-ink border-paper-line"
          }`}
        >
          TODAS
        </button>
        {lineasConCasos.map((l) => {
          const meta = LINEAS[l];
          const activo = filtroLinea === l;
          return (
            <button
              key={l}
              onClick={() => setFiltroLinea(activo ? "ALL" : l)}
              className={`px-2.5 py-1 rounded font-mono text-[10px] tracking-wider border transition-colors inline-flex items-center gap-1.5 ${
                activo
                  ? "text-ink border-current"
                  : "glass text-ink-soft hover:text-ink border-paper-line"
              }`}
              style={activo ? { background: `${meta.color}18`, color: meta.color } : undefined}
            >
              <span style={{ color: meta.color }}>{meta.icon}</span>
              {meta.nombre.toUpperCase()}
              <span className="text-ink-faint">
                {sapCasos.filter((c) => c.linea === l).length}
              </span>
            </button>
          );
        })}
      </div>

      {/* Filas */}
      <AnimatePresence mode="popLayout">
        <div className="space-y-1.5">
          {filtrados.map((caso, i) => (
            <CasoRow key={caso.id} caso={caso} index={i} />
          ))}
        </div>
      </AnimatePresence>

      {/* Pie del tablón */}
      <div className="mt-5 pt-4 border-t border-paper-line flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
        <p className="font-mono text-[10px] tracking-wider text-ink-faint">
          MOSTRANDO {filtrados.length}/{sapCasos.length} · ORDENADO POR SCORING
        </p>
        <p className="text-[11px] text-ink-faint">
          Puntuación inicial estimada (10 criterios × 5) — se revisa tras la primera
          prueba de cada caso. Los casos con flecha enlazan a su experimento documentado.
        </p>
      </div>
    </div>
  );
}

export default SapLabBoard;
