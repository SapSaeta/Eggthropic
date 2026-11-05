import { Check } from "lucide-react";
import { fasesRuta, progreso, todosLosPasos } from "@/lib/ruta";

/** Mapa de la ruta: barra de bloques y tres fases; solo la fase activa viene abierta. */
export function RutaFases() {
  return (
    <section className="space-y-4">
      <div>
        <div className="flex items-baseline justify-between mb-2">
          <p className="text-sm font-semibold text-ink tabular-nums">
            {progreso.hechos} de {progreso.total} pasos de la ruta
          </p>
          <p className="font-mono text-xs text-ink-faint">{Math.round((progreso.hechos / progreso.total) * 100)}%</p>
        </div>
        <div className="flex gap-1" role="img" aria-label={`${progreso.hechos} de ${progreso.total} pasos`}>
          {todosLosPasos.map((p) => (
            <span
              key={p.id}
              title={p.titulo}
              className={`h-3 flex-1 rounded-sm ${p.estado === "ahora" ? "animate-pulse" : ""}`}
              style={{ background: p.estado === "pendiente" ? "#e0d6c2" : p.fase.color, opacity: p.estado === "ahora" ? 0.65 : 1 }}
            />
          ))}
        </div>
      </div>

      {fasesRuta.map((fase) => {
        const hechos = fase.pasos.filter((p) => p.estado === "hecho").length;
        const activa = fase.pasos.some((p) => p.estado === "ahora");
        return (
          <details key={fase.n} open={activa} className="glass rounded-2xl overflow-hidden group">
            <summary className="list-none cursor-pointer px-4 py-3.5 text-white flex items-center justify-between gap-3 min-h-14" style={{ background: fase.color }}>
              <span>
                <span className="block font-mono text-[10px] tracking-widest opacity-80">{fase.cuando.toUpperCase()}</span>
                <span className="block text-lg font-bold">
                  {fase.n} · {fase.nombre}
                </span>
              </span>
              <span className="font-mono text-sm tabular-nums opacity-90">
                {hechos}/{fase.pasos.length}
              </span>
            </summary>
            <ol className="p-4 flex flex-col gap-4">
              {fase.pasos.map((p) => (
                <li key={p.id} className="flex gap-3">
                  <span
                    className={`mt-0.5 h-6 w-6 shrink-0 rounded-full flex items-center justify-center border-2 ${p.estado === "ahora" ? "animate-pulse" : ""}`}
                    style={{ borderColor: p.estado === "pendiente" ? "#d8ccb4" : fase.color, background: p.estado === "hecho" ? fase.color : "transparent" }}
                  >
                    {p.estado === "hecho" && <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />}
                    {p.estado === "ahora" && <span className="h-2 w-2 rounded-full" style={{ background: fase.color }} />}
                  </span>
                  <div>
                    <p className={`text-[15px] leading-snug ${p.estado === "hecho" ? "text-ink-faint line-through" : p.estado === "ahora" ? "text-ink font-semibold" : "text-ink-soft"}`}>
                      {p.titulo}
                    </p>
                    {p.estado === "ahora" && p.detalle && <p className="text-xs text-ink-faint mt-1">{p.detalle}</p>}
                  </div>
                </li>
              ))}
            </ol>
          </details>
        );
      })}
    </section>
  );
}
