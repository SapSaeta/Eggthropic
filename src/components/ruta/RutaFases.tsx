"use client";

import { Check } from "lucide-react";
import { estadosPasos, fasesRuta, todosLosPasos } from "@/lib/ruta";
import { marcarPaso } from "@/lib/ruta-store";

/** Ruta de 3 fases. Toca el círculo de un paso para marcarlo (solo en este dispositivo). */
export function RutaFases({ local }: { local: Record<string, boolean> }) {
  const estados = estadosPasos(local);
  const hechos = todosLosPasos.filter((p) => estados[p.id] === "hecho").length;
  const total = todosLosPasos.length;

  return (
    <section className="space-y-4">
      <div>
        <div className="flex items-baseline justify-between mb-2">
          <p className="text-sm font-semibold text-ink tabular-nums">
            {hechos} de {total} hitos de la ruta
          </p>
          <p className="font-mono text-xs text-ink-faint">{Math.round((hechos / total) * 100)}%</p>
        </div>
        <div className="flex gap-1" role="img" aria-label={`${hechos} de ${total} hitos`}>
          {todosLosPasos.map((p) => (
            <span
              key={p.id}
              title={p.titulo}
              className={`h-3 flex-1 rounded-sm ${estados[p.id] === "ahora" ? "animate-pulse" : ""}`}
              style={{ background: estados[p.id] === "pendiente" ? "#e0d6c2" : p.fase.color, opacity: estados[p.id] === "ahora" ? 0.65 : 1 }}
            />
          ))}
        </div>
      </div>

      {fasesRuta.map((fase) => {
        const h = fase.pasos.filter((p) => estados[p.id] === "hecho").length;
        const activa = fase.pasos.some((p) => estados[p.id] === "ahora");
        return (
          <details key={fase.n} open={activa} className="glass rounded-2xl overflow-hidden">
            <summary className="list-none cursor-pointer px-4 py-3.5 text-white flex items-center justify-between gap-3 min-h-14" style={{ background: fase.color }}>
              <span>
                <span className="block font-mono text-[10px] tracking-widest opacity-80">{fase.cuando.toUpperCase()}</span>
                <span className="block text-lg font-bold">
                  {fase.n} · {fase.nombre}
                </span>
              </span>
              <span className="font-mono text-sm tabular-nums opacity-90">
                {h}/{fase.pasos.length}
              </span>
            </summary>
            <ol className="p-4 flex flex-col gap-1">
              {fase.pasos.map((p) => {
                const e = estados[p.id];
                return (
                  <li key={p.id}>
                    <button
                      onClick={() => marcarPaso(p.id, e !== "hecho")}
                      aria-pressed={e === "hecho"}
                      aria-label={`${e === "hecho" ? "Desmarcar" : "Marcar como hecho"}: ${p.titulo}`}
                      className="w-full flex gap-3 text-left min-h-12 py-2"
                    >
                      <span
                        className={`mt-0.5 h-6 w-6 shrink-0 rounded-full flex items-center justify-center border-2 ${e === "ahora" ? "animate-pulse" : ""}`}
                        style={{ borderColor: e === "pendiente" ? "#d8ccb4" : fase.color, background: e === "hecho" ? fase.color : "transparent" }}
                      >
                        {e === "hecho" && <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />}
                        {e === "ahora" && <span className="h-2 w-2 rounded-full" style={{ background: fase.color }} />}
                      </span>
                      <span>
                        <span className={`block text-[15px] leading-snug ${e === "hecho" ? "text-ink-faint line-through" : e === "ahora" ? "text-ink font-semibold" : "text-ink-soft"}`}>{p.titulo}</span>
                        {e === "ahora" && p.detalle && <span className="block text-xs text-ink-faint mt-1">{p.detalle}</span>}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ol>
          </details>
        );
      })}
      <p className="text-xs text-ink-faint leading-relaxed">
        Marca un hito solo cuando puedas enseñar la prueba. Las marcas se guardan en este dispositivo; lo que aparece en el CV público lo actualiza el repositorio.
      </p>
    </section>
  );
}
