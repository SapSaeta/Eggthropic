"use client";

import { motion } from "framer-motion";
import { EJES, lecciones, type Eje } from "@/lib/lecciones";
import { C, Marco } from "./ui";

const ORDEN = Object.keys(EJES) as Eje[];
const CX = 160;
const CY = 128;
const R = 88;

const punto = (i: number, frac: number) => {
  const ang = (-90 + (360 / ORDEN.length) * i) * (Math.PI / 180);
  return { x: CX + R * frac * Math.cos(ang), y: CY + R * frac * Math.sin(ang) };
};
const poli = (fr: number[]) => fr.map((f, i) => { const p = punto(i, f); return `${p.x.toFixed(1)},${p.y.toFixed(1)}`; }).join(" ");

/** Radar de conocimiento: lecciones hechas / lecciones totales de cada eje. */
export function Radar({ hechas }: { hechas: Record<string, string> }) {
  const frac = ORDEN.map((e) => {
    const todas = lecciones.filter((l) => l.eje === e);
    const ok = todas.filter((l) => l.id in hechas).length;
    return todas.length ? ok / todas.length : 0;
  });
  // Un mínimo visible para que el polígono nunca se colapse del todo.
  const dibujo = frac.map((f) => Math.max(f, 0.06));

  return (
    <Marco etiqueta="Radar de conocimiento · crece con cada lección">
      <svg viewBox="0 0 320 256" className="w-full" role="img" aria-label="Radar de seis ejes">
        {[0.25, 0.5, 0.75, 1].map((f) => (
          <polygon key={f} points={poli(ORDEN.map(() => f))} fill="none" stroke={C.line} strokeWidth="1" />
        ))}
        {ORDEN.map((e, i) => {
          const p = punto(i, 1);
          return <line key={e} x1={CX} y1={CY} x2={p.x} y2={p.y} stroke={C.line} />;
        })}
        <motion.polygon
          initial={false}
          animate={{ points: poli(dibujo) }}
          transition={{ type: "spring", stiffness: 90, damping: 16 }}
          fill={`${C.teja}33`}
          stroke={C.teja}
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
        {ORDEN.map((e, i) => {
          const p = punto(i, 1.2);
          const v = punto(i, dibujo[i]);
          return (
            <g key={e}>
              <circle cx={v.x} cy={v.y} r="4" fill={EJES[e].color} stroke="#fff" strokeWidth="1.5" />
              <text x={p.x} y={p.y + 3} textAnchor="middle" fontSize="10" fontWeight="700" fill={EJES[e].color}>
                {EJES[e].nombre}
              </text>
            </g>
          );
        })}
      </svg>
      <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-ink-soft">
        {ORDEN.map((e, i) => {
          const todas = lecciones.filter((l) => l.eje === e).length;
          return (
            <div key={e} className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full" style={{ background: EJES[e].color }} />
              <span className="flex-1">{EJES[e].nombre}</span>
              <span className="font-mono tabular-nums">
                {Math.round(frac[i] * todas)}/{todas}
              </span>
            </div>
          );
        })}
      </div>
    </Marco>
  );
}
