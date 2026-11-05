"use client";

import { motion } from "framer-motion";
import { parseFecha, sumarDias } from "@/lib/ruta-store";
import { C, Marco } from "./ui";

const SEMANAS = 12;

/** Mapa de calor tipo calendario: las últimas 12 semanas, una celda por día. */
export function Heatmap({ hechas, hoy }: { hechas: Record<string, string>; hoy: string }) {
  if (!hoy) return null;

  const porDia: Record<string, number> = {};
  Object.values(hechas).forEach((d) => (porDia[d] = (porDia[d] ?? 0) + 1));

  const diaSemana = (parseFecha(hoy).getDay() + 6) % 7; // lunes = 0
  const inicio = sumarDias(hoy, -((SEMANAS - 1) * 7 + diaSemana));

  const columnas = Array.from({ length: SEMANAS }, (_, w) =>
    Array.from({ length: 7 }, (_, d) => {
      const fecha = sumarDias(inicio, w * 7 + d);
      return { fecha, n: porDia[fecha] ?? 0, futuro: fecha > hoy };
    })
  );
  const color = (n: number) => (n === 0 ? "#e8dfcc" : n === 1 ? "#7fd1c9" : C.teal);

  return (
    <Marco etiqueta="Tus últimas 12 semanas">
      <div className="flex gap-1" role="img" aria-label="Calendario de actividad">
        {columnas.map((col, w) => (
          <div key={w} className="flex-1 flex flex-col gap-1">
            {col.map((c) => (
              <motion.div
                key={c.fecha}
                title={c.futuro ? "" : `${c.fecha}: ${c.n} lección(es)`}
                initial={{ scale: 0.4, opacity: 0 }}
                animate={{ scale: 1, opacity: c.futuro ? 0.25 : 1 }}
                transition={{ delay: w * 0.02 }}
                className="aspect-square rounded-[4px]"
                style={{
                  background: color(c.n),
                  outline: c.fecha === hoy ? `2px solid ${C.teja}` : "none",
                  outlineOffset: 1,
                }}
              />
            ))}
          </div>
        ))}
      </div>
      <div className="mt-2 flex items-center justify-between text-[10px] font-mono text-ink-faint">
        <span>menos</span>
        <span className="flex gap-1">
          {[0, 1, 2].map((n) => (
            <span key={n} className="h-3 w-3 rounded-[3px]" style={{ background: color(n) }} />
          ))}
        </span>
        <span>más</span>
      </div>
    </Marco>
  );
}
