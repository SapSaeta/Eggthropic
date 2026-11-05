"use client";

import { useState } from "react";
import { BookOpen, Check, Flame, IdCard, Radar as RadarIcon, Sun } from "lucide-react";
import { EJES, lecciones, lecciones_por_id } from "@/lib/lecciones";
import { calcularRacha, parseFecha, reiniciar, useHoy, useRuta } from "@/lib/ruta-store";
import { progreso } from "@/lib/ruta";
import { Heatmap } from "./Heatmap";
import { LeccionCard } from "./LeccionCard";
import { PerfilCv } from "./PerfilCv";
import { Radar } from "./Radar";
import { RutaFases } from "./RutaFases";
import { C } from "./ui";

type Tab = "hoy" | "biblioteca" | "progreso" | "cv";

const TABS: { id: Tab; label: string; icon: typeof Sun }[] = [
  { id: "hoy", label: "Hoy", icon: Sun },
  { id: "biblioteca", label: "Lecciones", icon: BookOpen },
  { id: "progreso", label: "Progreso", icon: RadarIcon },
  { id: "cv", label: "CV", icon: IdCard },
];

const INICIO = "2026-11-06";

function Anillo({ hechas, total }: { hechas: number; total: number }) {
  const r = 18;
  const circ = 2 * Math.PI * r;
  return (
    <div className="relative h-12 w-12 shrink-0" role="img" aria-label={`${hechas} de ${total} lecciones`}>
      <svg viewBox="0 0 44 44" className="h-12 w-12 -rotate-90">
        <circle cx="22" cy="22" r={r} fill="none" stroke={C.line} strokeWidth="5" />
        <circle
          cx="22"
          cy="22"
          r={r}
          fill="none"
          stroke={C.teja}
          strokeWidth="5"
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={circ * (1 - hechas / total)}
          style={{ transition: "stroke-dashoffset 0.6s ease" }}
        />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-[11px] font-bold tabular-nums text-ink">
        {hechas}/{total}
      </span>
    </div>
  );
}

export function RutaApp() {
  const estado = useRuta();
  const hoy = useHoy();
  const [tab, setTab] = useState<Tab>("hoy");
  const [abierta, setAbierta] = useState<string | null>(null);

  const irA = (t: Tab) => {
    setTab(t);
    window.scrollTo({ top: 0 });
  };

  if (!hoy) {
    return <div className="max-w-xl mx-auto px-4 py-10 h-[60vh] animate-pulse" aria-busy />;
  }

  const hechas = estado.hechas;
  const nHechas = lecciones.filter((l) => l.id in hechas).length;
  const racha = calcularRacha(hechas, hoy);
  const hechaHoy = Object.values(hechas).includes(hoy);
  const dia = Math.max(1, Math.round((parseFecha(hoy).getTime() - parseFecha(INICIO).getTime()) / 86_400_000) + 1);

  const sugerida = lecciones.find((l) => !(l.id in hechas)) ?? lecciones[(dia - 1) % lecciones.length];
  const leccion = abierta ? lecciones_por_id[abierta] : sugerida;

  const otra = () => {
    const sig = lecciones.find((l) => !(l.id in hechas) && l.id !== leccion.id);
    setAbierta(sig ? sig.id : null);
    window.scrollTo({ top: 0 });
  };

  return (
    <div className="max-w-xl mx-auto px-4 pt-5 pb-[calc(6rem+env(safe-area-inset-bottom))]">
      {/* cabecera fija de contexto */}
      <header className="no-print flex items-center gap-3 mb-5">
        <span className="text-4xl leading-none" aria-hidden>
          {hechaHoy ? "🐣" : "🥚"}
        </span>
        <div className="flex-1">
          <p className="font-mono text-[10px] tracking-[0.2em] text-teja">MI RUTA · DÍA {dia}</p>
          <p className="text-base font-bold text-ink leading-tight">
            {hechaHoy ? "Hoy ya cumpliste" : "Una lección, un minuto"}
          </p>
        </div>
        <div className="flex items-center gap-1 rounded-full bg-white border border-paper-line px-3 py-1.5" title="Días seguidos">
          <Flame className="w-4 h-4" style={{ color: racha > 0 ? C.teja : C.line }} fill={racha > 0 ? C.teja : "none"} />
          <span className="font-bold tabular-nums text-ink">{racha}</span>
        </div>
        <Anillo hechas={nHechas} total={lecciones.length} />
      </header>

      {/* HOY */}
      {tab === "hoy" && (
        <div>
          {abierta && abierta !== sugerida.id && (
            <button onClick={() => setAbierta(null)} className="mb-3 min-h-10 text-sm font-semibold text-teja">
              ← Volver a la de hoy
            </button>
          )}
          <p className="font-mono text-[11px] tracking-[0.2em] text-ink-faint mb-3">
            LECCIÓN {leccion.n} DE {lecciones.length}
          </p>
          <LeccionCard
            key={leccion.id}
            leccion={leccion}
            estado={estado}
            hoy={hoy}
            onHecha={() => setAbierta(leccion.id)}
            onSiguiente={otra}
          />
        </div>
      )}

      {/* LECCIONES */}
      {tab === "biblioteca" && (
        <section>
          <h2 className="text-2xl font-bold text-ink">Todas las lecciones</h2>
          <p className="text-ink-soft mt-1 mb-4">Toca una para abrirla. Sin orden obligatorio.</p>
          <ul className="space-y-2">
            {lecciones.map((l) => {
              const hecha = l.id in hechas;
              const eje = EJES[l.eje];
              return (
                <li key={l.id}>
                  <button
                    onClick={() => {
                      setAbierta(l.id);
                      irA("hoy");
                    }}
                    className="w-full min-h-16 rounded-2xl glass glass-hover px-4 py-3 flex items-center gap-3 text-left"
                  >
                    <span
                      className="h-9 w-9 shrink-0 rounded-full flex items-center justify-center text-sm font-bold"
                      style={hecha ? { background: C.green, color: "#fff" } : { background: `${eje.color}1a`, color: eje.color }}
                    >
                      {hecha ? <Check className="w-4 h-4" strokeWidth={3} /> : l.n}
                    </span>
                    <span className="flex-1">
                      <span className="block font-semibold text-ink leading-snug">{l.titulo}</span>
                      <span className="block font-mono text-[10px] tracking-widest mt-0.5" style={{ color: eje.color }}>
                        {eje.nombre.toUpperCase()} · {l.minutos} MIN
                      </span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </section>
      )}

      {/* PROGRESO */}
      {tab === "progreso" && (
        <section className="space-y-5">
          <div className="grid grid-cols-3 gap-2">
            {[
              { v: racha, l: racha === 1 ? "día seguido" : "días seguidos", c: C.teja },
              { v: `${nHechas}/${lecciones.length}`, l: "lecciones", c: C.teal },
              { v: `${progreso.hechos}/${progreso.total}`, l: "pasos de la ruta", c: C.joule },
            ].map((s) => (
              <div key={s.l} className="glass rounded-2xl px-3 py-3 text-center">
                <p className="text-2xl font-bold tabular-nums" style={{ color: s.c }}>
                  {s.v}
                </p>
                <p className="text-[11px] text-ink-faint leading-tight">{s.l}</p>
              </div>
            ))}
          </div>
          <Radar hechas={hechas} />
          <Heatmap hechas={hechas} hoy={hoy} />
          <RutaFases />
          <button
            onClick={() => {
              if (window.confirm("¿Borrar el progreso guardado en este móvil?")) reiniciar();
            }}
            className="block mx-auto min-h-10 text-xs text-ink-faint underline underline-offset-2"
          >
            Reiniciar progreso de este dispositivo
          </button>
        </section>
      )}

      {/* CV */}
      {tab === "cv" && <PerfilCv />}

      {/* barra inferior */}
      <nav
        aria-label="Secciones de Mi ruta"
        className="no-print fixed bottom-0 inset-x-0 z-40 border-t border-white/10 bg-[#262019]/95 backdrop-blur-md pb-[env(safe-area-inset-bottom)]"
      >
        <div className="max-w-xl mx-auto grid grid-cols-4">
          {TABS.map((t) => {
            const Icon = t.icon;
            const on = tab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => irA(t.id)}
                aria-current={on ? "page" : undefined}
                className={`min-h-16 flex flex-col items-center justify-center gap-1 text-[11px] font-semibold transition-colors ${on ? "text-egg-400" : "text-stone-400"}`}
              >
                <Icon className="w-6 h-6" />
                {t.label}
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
