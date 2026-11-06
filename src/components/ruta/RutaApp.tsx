"use client";

import { useState } from "react";
import { BadgeCheck, Egg, Flame, GraduationCap, Radar as RadarIcon, Target } from "lucide-react";
import { MODULOS, lecciones, lecciones_por_id, nivelConocimiento } from "@/lib/lecciones";
import { estadosPasos, todosLosPasos } from "@/lib/ruta";
import { calcularRacha, parseFecha, reiniciar, useHoy, useRuta } from "@/lib/ruta-store";
import { Heatmap } from "./Heatmap";
import { LeccionCard } from "./LeccionCard";
import { PerfilCv } from "./PerfilCv";
import { Programa } from "./Programa";
import { Radar } from "./Radar";
import { RutaFases } from "./RutaFases";
import { C } from "./ui";

type Tab = "hoy" | "programa" | "progreso" | "cv";

const TABS: { id: Tab; label: string; icon: typeof Target }[] = [
  { id: "hoy", label: "Hoy", icon: Target },
  { id: "programa", label: "Programa", icon: GraduationCap },
  { id: "progreso", label: "Progreso", icon: RadarIcon },
  { id: "cv", label: "CV", icon: BadgeCheck },
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
  const pct = (nHechas / lecciones.length) * 100;
  const racha = calcularRacha(hechas, hoy);
  const dia = Math.max(1, Math.round((parseFecha(hoy).getTime() - parseFecha(INICIO).getTime()) / 86_400_000) + 1);

  const sugerida = lecciones.find((l) => !(l.id in hechas)) ?? lecciones[(dia - 1) % lecciones.length];
  const leccion = abierta ? lecciones_por_id[abierta] : sugerida;
  const modulo = MODULOS.find((m) => m.id === leccion.modulo)!;

  const estadosRuta = estadosPasos(estado.pasos);
  const hitos = todosLosPasos.filter((p) => estadosRuta[p.id] === "hecho").length;

  const otra = () => {
    const sig = lecciones.find((l) => !(l.id in hechas) && l.id !== leccion.id);
    setAbierta(sig ? sig.id : null);
    window.scrollTo({ top: 0 });
  };

  return (
    <div className="max-w-xl mx-auto px-4 pt-5 pb-[calc(6rem+env(safe-area-inset-bottom))]">
      <header className="no-print flex items-center gap-3 mb-5">
        <span className="h-11 w-11 shrink-0 rounded-xl bg-ink flex items-center justify-center">
          <Egg className="w-6 h-6 text-[#ffd21a]" />
        </span>
        <div className="flex-1 min-w-0">
          <p className="font-mono text-[10px] tracking-[0.2em] text-teja">MI RUTA · DÍA {dia}</p>
          <p className="text-base font-bold text-ink leading-tight truncate">Business AI · HCM</p>
        </div>
        <div className="flex items-center gap-1 rounded-full bg-white border border-paper-line px-3 py-1.5" title="Días seguidos con una lección completada">
          <Flame className="w-4 h-4" style={{ color: racha > 0 ? C.teja : C.line }} fill={racha > 0 ? C.teja : "none"} />
          <span className="font-bold tabular-nums text-ink">{racha}</span>
        </div>
        <Anillo hechas={nHechas} total={lecciones.length} />
      </header>

      {tab === "hoy" && (
        <div>
          {abierta && abierta !== sugerida.id && (
            <button onClick={() => setAbierta(null)} className="mb-3 min-h-10 text-sm font-semibold text-teja">
              ← Volver a la siguiente del programa
            </button>
          )}
          <div className="mb-4 flex items-center gap-3 rounded-xl border border-paper-line bg-white px-3 py-2.5">
            <span className="h-8 w-8 rounded-lg text-white text-sm font-bold flex items-center justify-center" style={{ background: modulo.color }}>
              {MODULOS.indexOf(modulo) + 1}
            </span>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-ink truncate">{modulo.nombre}</p>
              <p className="font-mono text-[10px] tracking-widest text-ink-faint">
                LECCIÓN {leccion.n} DE {lecciones.length}
              </p>
            </div>
          </div>
          <LeccionCard key={leccion.id} leccion={leccion} estado={estado} hoy={hoy} onHecha={() => setAbierta(leccion.id)} onSiguiente={otra} />
        </div>
      )}

      {tab === "programa" && (
        <Programa
          estado={estado}
          actualId={leccion.id}
          onAbrir={(id) => {
            setAbierta(id);
            irA("hoy");
          }}
        />
      )}

      {tab === "progreso" && (
        <section className="space-y-5">
          <div className="grid grid-cols-2 gap-2">
            {[
              { v: racha, l: racha === 1 ? "día seguido" : "días seguidos", c: C.teja },
              { v: `${nHechas}/${lecciones.length}`, l: "lecciones completadas", c: C.teal },
              { v: nivelConocimiento(pct), l: "nivel de conocimiento", c: C.violet },
              { v: `${hitos}/${todosLosPasos.length}`, l: "hitos de la ruta", c: C.joule },
            ].map((s) => (
              <div key={s.l} className="glass rounded-2xl px-4 py-3">
                <p className="text-2xl font-bold tabular-nums leading-tight" style={{ color: s.c }}>
                  {s.v}
                </p>
                <p className="text-xs text-ink-faint leading-tight mt-0.5">{s.l}</p>
              </div>
            ))}
          </div>
          <Radar hechas={hechas} />
          <Heatmap hechas={hechas} hoy={hoy} />
          <RutaFases local={estado.pasos} />
          <button
            onClick={() => {
              if (window.confirm("¿Borrar el progreso guardado en este dispositivo?")) reiniciar();
            }}
            className="block mx-auto min-h-10 text-xs text-ink-faint underline underline-offset-2"
          >
            Reiniciar progreso de este dispositivo
          </button>
        </section>
      )}

      {tab === "cv" && <PerfilCv estado={estado} />}

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
