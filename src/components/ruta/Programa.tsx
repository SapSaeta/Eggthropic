"use client";

import { Check } from "lucide-react";
import { EJES, MODULOS, leccionesDeModulo, lecciones } from "@/lib/lecciones";
import type { RutaState } from "@/lib/ruta-store";

/** Programa completo: 7 módulos con su progreso. Toca una lección para abrirla. */
export function Programa({
  estado,
  actualId,
  onAbrir,
}: {
  estado: RutaState;
  actualId: string;
  onAbrir: (id: string) => void;
}) {
  return (
    <section>
      <h2 className="text-2xl font-bold text-ink">Programa completo</h2>
      <p className="text-ink-soft mt-1 mb-5">
        {MODULOS.length} módulos y {lecciones.length} lecciones. Sin orden obligatorio, aunque el recomendado es de arriba abajo.
      </p>
      <div className="space-y-3">
        {MODULOS.map((m, mi) => {
          const ls = leccionesDeModulo(m.id);
          const hechas = ls.filter((l) => l.id in estado.hechas).length;
          const abierto = ls.some((l) => l.id === actualId);
          return (
            <details key={m.id} open={abierto} className="glass rounded-2xl overflow-hidden">
              <summary className="list-none cursor-pointer px-4 py-3.5 flex items-center gap-3 min-h-16">
                <span className="h-10 w-10 shrink-0 rounded-xl text-white font-bold flex items-center justify-center" style={{ background: m.color }}>
                  {mi + 1}
                </span>
                <span className="flex-1">
                  <span className="block font-semibold text-ink leading-snug">{m.nombre}</span>
                  <span className="block text-xs text-ink-faint leading-snug">{m.resumen}</span>
                  <span className="mt-2 block h-1.5 rounded-full bg-paper-deep overflow-hidden">
                    <span className="block h-full rounded-full" style={{ width: `${(hechas / ls.length) * 100}%`, background: m.color }} />
                  </span>
                </span>
                <span className="font-mono text-xs tabular-nums text-ink-faint">
                  {hechas}/{ls.length}
                </span>
              </summary>
              <ul className="border-t border-paper-line">
                {ls.map((l) => {
                  const hecha = l.id in estado.hechas;
                  return (
                    <li key={l.id}>
                      <button onClick={() => onAbrir(l.id)} className="w-full min-h-14 px-4 py-2.5 flex items-center gap-3 text-left border-b border-paper-line last:border-0 active:bg-paper-deep/50">
                        <span
                          className="h-7 w-7 shrink-0 rounded-full flex items-center justify-center text-xs font-bold"
                          style={hecha ? { background: "#2e9e5b", color: "#fff" } : { background: `${EJES[l.eje].color}1a`, color: EJES[l.eje].color }}
                        >
                          {hecha ? <Check className="w-3.5 h-3.5" strokeWidth={3} /> : l.n}
                        </span>
                        <span className="flex-1">
                          <span className={`block text-[15px] leading-snug ${l.id === actualId ? "font-bold text-ink" : "text-ink"}`}>{l.titulo}</span>
                          <span className="block font-mono text-[10px] tracking-widest mt-0.5" style={{ color: EJES[l.eje].color }}>
                            {EJES[l.eje].nombre.toUpperCase()} · {l.minutos + l.practica.minutos} MIN
                          </span>
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </details>
          );
        })}
      </div>
    </section>
  );
}
