"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, ChevronLeft, ChevronRight, RotateCcw } from "lucide-react";
import type { Tono, VisualSpec } from "@/lib/lecciones";
import { C, Marco, Segmentos } from "./ui";

type Spec<T extends VisualSpec["tipo"]> = Extract<VisualSpec, { tipo: T }>;

const colorTono = (t?: Tono) => (t === "ok" ? C.green : t === "warn" ? C.gold : t === "bad" ? C.red : C.violet);

function lineas(texto: string): string[] {
  if (texto.length <= 12) return [texto];
  const out: string[] = [];
  let cur = "";
  for (const w of texto.split(" ")) {
    if ((cur + " " + w).trim().length > 13 && cur) {
      out.push(cur);
      cur = w;
    } else cur = (cur + " " + w).trim();
  }
  if (cur) out.push(cur);
  return out;
}

// ─── Secuencia ───────────────────────────────────────────────────────────────

function Secuencia({ spec }: { spec: Spec<"secuencia"> }) {
  const [vid, setVid] = useState(spec.variantes[0].id);
  const [paso, setPaso] = useState(0);
  const v = spec.variantes.find((x) => x.id === vid)!;
  const n = spec.actores.length;
  const sep = n > 1 ? 220 / (n - 1) : 0;
  const xs = spec.actores.map((_, i) => (n === 1 ? 160 : 50 + i * sep));
  const caja = Math.min(98, sep - 6 || 98);
  const msgs = v.mensajes;
  const alto = 84 + msgs.length * 36;
  const p = Math.min(paso, msgs.length - 1);
  const actual = msgs[p];

  const cambiar = (id: string) => {
    setVid(id);
    setPaso(0);
  };

  return (
    <Marco etiqueta={spec.etiqueta}>
      {spec.variantes.length > 1 && (
        <div className="mb-3">
          <Segmentos valor={vid} onChange={cambiar} opciones={spec.variantes.map((x) => ({ id: x.id, label: x.label }))} />
        </div>
      )}
      <svg viewBox={`0 0 320 ${alto}`} className="w-full" role="img" aria-label="Diagrama de secuencia">
        <defs>
          {(["ok", "warn", "bad", undefined] as (Tono | undefined)[]).map((t) => (
            <marker key={t ?? "n"} id={`flecha-${t ?? "n"}`} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M0,0 L10,5 L0,10 z" fill={colorTono(t)} />
            </marker>
          ))}
        </defs>
        {spec.actores.map((a, i) => {
          const ls = lineas(a);
          return (
            <g key={a}>
              <line x1={xs[i]} y1="50" x2={xs[i]} y2={alto - 8} stroke={C.line} strokeWidth="2" strokeDasharray="4 5" />
              <rect x={xs[i] - caja / 2} y="6" width={caja} height="40" rx="9" fill="#fff" stroke={C.ink} strokeWidth="1.6" />
              {ls.map((l, k) => (
                <text key={k} x={xs[i]} y={ls.length === 1 ? 30 : 22 + k * 12} textAnchor="middle" fontSize="9" fontWeight="700" fill={C.ink}>
                  {l}
                </text>
              ))}
            </g>
          );
        })}
        {msgs.map((m, k) => {
          const y = 76 + k * 36;
          const visible = k <= p;
          const x1 = xs[m.de];
          const x2 = xs[m.a];
          const dir = x2 > x1 ? -7 : 7;
          const color = colorTono(m.tono);
          return (
            <g key={`${vid}-${k}`}>
              {visible ? (
                <motion.line
                  x1={x1}
                  y1={y}
                  x2={x2 + dir}
                  y2={y}
                  stroke={color}
                  strokeWidth={k === p ? 3 : 2}
                  markerEnd={`url(#flecha-${m.tono ?? "n"})`}
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1, opacity: k === p ? 1 : 0.5 }}
                  transition={{ duration: 0.4 }}
                />
              ) : (
                <line x1={x1} y1={y} x2={x2} y2={y} stroke={C.line} strokeWidth="1.5" strokeDasharray="3 4" />
              )}
              <circle cx={(x1 + x2) / 2} cy={y - 12} r="8.5" fill={visible ? color : C.line} />
              <text x={(x1 + x2) / 2} y={y - 9} textAnchor="middle" fontSize="9" fontWeight="800" fill="#fff">
                {k + 1}
              </text>
            </g>
          );
        })}
      </svg>
      <div className="mt-1 rounded-xl bg-paper-deep/60 p-3">
        <p className="font-mono text-[10px] tracking-widest text-ink-faint">
          PASO {p + 1} DE {msgs.length} · {spec.actores[actual.de].toUpperCase()} → {spec.actores[actual.a].toUpperCase()}
        </p>
        <p className="mt-1 text-[15px] font-semibold leading-snug" style={{ color: colorTono(actual.tono) }}>
          {actual.texto}
        </p>
        {p === msgs.length - 1 && v.nota && <p className="mt-2 text-sm text-ink-soft">{v.nota}</p>}
      </div>
      <div className="mt-3 flex gap-2">
        <button onClick={() => setPaso(Math.max(0, p - 1))} disabled={p === 0} aria-label="Paso anterior" className="min-h-12 w-14 rounded-xl border border-paper-line bg-white flex items-center justify-center disabled:opacity-30">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button onClick={() => setPaso(p + 1)} disabled={p >= msgs.length - 1} className="flex-1 min-h-12 rounded-xl bg-ink text-white font-semibold flex items-center justify-center gap-1 disabled:opacity-30">
          Siguiente <ChevronRight className="w-5 h-5" />
        </button>
        <button onClick={() => setPaso(0)} aria-label="Empezar de nuevo" className="min-h-12 w-14 rounded-xl border border-paper-line bg-white flex items-center justify-center">
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>
    </Marco>
  );
}

// ─── Árbol de decisión ───────────────────────────────────────────────────────

function Decision({ spec }: { spec: Spec<"decision"> }) {
  const [actual, setActual] = useState(spec.inicio);
  const [camino, setCamino] = useState<{ pregunta: string; resp: "Sí" | "No" }[]>([]);
  const nodo = spec.nodos[actual];

  const responder = (resp: "Sí" | "No") => {
    const sig = resp === "Sí" ? nodo.si : nodo.no;
    if (!sig || !nodo.pregunta) return;
    setCamino((c) => [...c, { pregunta: nodo.pregunta!, resp }]);
    setActual(sig);
  };
  const reiniciar = () => {
    setActual(spec.inicio);
    setCamino([]);
  };

  return (
    <Marco etiqueta={spec.etiqueta}>
      {camino.length > 0 && (
        <ol className="mb-3 space-y-1">
          {camino.map((c, i) => (
            <li key={i} className="flex gap-2 text-xs text-ink-faint">
              <Check className="w-3.5 h-3.5 mt-0.5 shrink-0 text-[#2e9e5b]" strokeWidth={3} />
              <span>
                {c.pregunta} <b className="text-ink">{c.resp}</b>
              </span>
            </li>
          ))}
        </ol>
      )}
      <AnimatePresence mode="wait" initial={false}>
        <motion.div key={actual} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}>
          {nodo.pregunta ? (
            <div className="rounded-xl border-2 border-ink/15 bg-white p-4">
              <p className="font-mono text-[10px] tracking-widest text-ink-faint">PREGUNTA {camino.length + 1}</p>
              <p className="mt-1 text-lg font-semibold leading-snug text-ink">{nodo.pregunta}</p>
              <div className="mt-4 grid grid-cols-2 gap-2">
                <button onClick={() => responder("Sí")} className="min-h-12 rounded-xl bg-ink text-white font-semibold">
                  Sí
                </button>
                <button onClick={() => responder("No")} className="min-h-12 rounded-xl border-2 border-ink/20 bg-white font-semibold text-ink">
                  No
                </button>
              </div>
            </div>
          ) : (
            <div className="rounded-xl border-2 p-4" style={{ borderColor: colorTono(nodo.tono), background: `${colorTono(nodo.tono)}12` }}>
              <p className="font-mono text-[10px] tracking-widest" style={{ color: colorTono(nodo.tono) }}>
                RESULTADO
              </p>
              <p className="mt-1 text-lg font-bold text-ink leading-snug">{nodo.resultado}</p>
              {nodo.detalle && <p className="mt-1 text-[15px] text-ink-soft leading-snug">{nodo.detalle}</p>}
              <button onClick={reiniciar} className="mt-4 min-h-11 px-4 rounded-xl border-2 border-ink/20 bg-white font-semibold text-sm inline-flex items-center gap-2">
                <RotateCcw className="w-4 h-4" /> Empezar de nuevo
              </button>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </Marco>
  );
}

// ─── Lista de verificación con medidor ───────────────────────────────────────

function Checklist({ spec }: { spec: Spec<"checklist"> }) {
  const [on, setOn] = useState<boolean[]>(() => spec.items.map(() => false));
  const n = on.filter(Boolean).length;
  const total = spec.items.length;
  const veredicto = [...spec.veredictos].reverse().find((v) => n >= v.desde) ?? spec.veredictos[0];
  const color = colorTono(veredicto.tono);
  const r = 34;
  const circ = Math.PI * r; // semicírculo

  return (
    <Marco etiqueta={spec.etiqueta}>
      <div className="flex items-center gap-4 mb-3">
        <svg viewBox="0 0 90 56" className="w-24 shrink-0" role="img" aria-label={`${n} de ${total}`}>
          <path d="M11,48 A34,34 0 0 1 79,48" fill="none" stroke={C.line} strokeWidth="9" strokeLinecap="round" />
          <motion.path
            d="M11,48 A34,34 0 0 1 79,48"
            fill="none"
            strokeWidth="9"
            strokeLinecap="round"
            strokeDasharray={circ}
            animate={{ strokeDashoffset: circ * (1 - n / total), stroke: color }}
            transition={{ duration: 0.5 }}
          />
          <text x="45" y="46" textAnchor="middle" fontSize="16" fontWeight="800" fill={C.ink}>
            {n}/{total}
          </text>
        </svg>
        <p className="text-[15px] font-semibold leading-snug" style={{ color }}>
          {veredicto.texto}
        </p>
      </div>
      <ul className="space-y-2">
        {spec.items.map((it, i) => (
          <li key={it.t}>
            <button
              onClick={() => setOn((s) => s.map((v, k) => (k === i ? !v : v)))}
              aria-pressed={on[i]}
              className="w-full min-h-14 rounded-xl border-2 px-3 py-2.5 text-left flex items-start gap-3 transition-colors"
              style={{ borderColor: on[i] ? C.green : C.line, background: on[i] ? "#e5f4ec" : "#fff" }}
            >
              <span className={`mt-0.5 h-6 w-6 shrink-0 rounded-md flex items-center justify-center ${on[i] ? "bg-[#2e9e5b]" : "border-2 border-paper-line"}`}>
                {on[i] && <Check className="w-4 h-4 text-white" strokeWidth={3} />}
              </span>
              <span>
                <span className="block text-[15px] font-semibold leading-snug text-ink">{it.t}</span>
                <span className="block text-xs text-ink-faint mt-0.5 leading-snug">{it.porque}</span>
              </span>
            </button>
          </li>
        ))}
      </ul>
    </Marco>
  );
}

// ─── Comparar ────────────────────────────────────────────────────────────────

function Comparar({ spec }: { spec: Spec<"comparar"> }) {
  return (
    <Marco etiqueta={spec.etiqueta}>
      <div className="space-y-3">
        {[spec.izq, spec.der].map((lado, i) => (
          <motion.div
            key={lado.t}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.12 }}
            className="rounded-xl overflow-hidden border border-paper-line bg-white"
          >
            <p className="px-4 py-2.5 text-sm font-bold text-white" style={{ background: lado.color }}>
              {lado.t}
            </p>
            <ul className="p-4 space-y-2">
              {lado.puntos.map((p) => (
                <li key={p} className="flex gap-2 text-[15px] leading-snug text-ink">
                  <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full" style={{ background: lado.color }} />
                  {p}
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>
      <p className="mt-3 rounded-xl bg-paper-deep/60 p-3 text-[15px] leading-snug text-ink">
        <b>Idea clave. </b>
        {spec.clave}
      </p>
    </Marco>
  );
}

// ─── Capas con detalle ───────────────────────────────────────────────────────

function Capas({ spec }: { spec: Spec<"capas"> }) {
  const [sel, setSel] = useState(0);
  return (
    <Marco etiqueta={spec.etiqueta}>
      <ul className="space-y-1.5">
        {spec.capas.map((c, i) => {
          const on = sel === i;
          return (
            <li key={c.t}>
              <button
                onClick={() => setSel(i)}
                aria-expanded={on}
                className="w-full rounded-xl text-left transition-colors overflow-hidden border-2"
                style={{ borderColor: on ? c.color : C.line, background: on ? `${c.color}10` : "#fff" }}
              >
                <span className="flex items-center gap-3 px-3 min-h-12">
                  <span className="h-7 w-7 shrink-0 rounded-lg text-xs font-bold text-white flex items-center justify-center" style={{ background: c.color }}>
                    {i + 1}
                  </span>
                  <span className="text-[15px] font-semibold text-ink leading-snug">{c.t}</span>
                </span>
                <AnimatePresence initial={false}>
                  {on && (
                    <motion.span initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="block overflow-hidden">
                      <span className="block px-3 pb-3 pl-[3.25rem] text-sm text-ink-soft leading-relaxed">{c.d}</span>
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>
            </li>
          );
        })}
      </ul>
    </Marco>
  );
}

// ─── Ecuación ────────────────────────────────────────────────────────────────

function Ecuacion({ spec }: { spec: Spec<"ecuacion"> }) {
  const [sel, setSel] = useState(0);
  const parte = spec.partes[sel];
  return (
    <Marco etiqueta={spec.etiqueta}>
      <div className="flex flex-col items-stretch gap-1.5">
        {spec.partes.map((p, i) => (
          <div key={p.t} className="contents">
            {i > 0 && <span className="text-center text-xl font-bold text-ink-faint leading-none">+</span>}
            <motion.button
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              onClick={() => setSel(i)}
              aria-pressed={sel === i}
              className="min-h-12 rounded-xl px-4 text-left font-semibold border-2 transition-colors"
              style={{ borderColor: p.color, background: sel === i ? p.color : "#fff", color: sel === i ? "#fff" : p.color }}
            >
              {p.t}
            </motion.button>
          </div>
        ))}
        <span className="text-center text-xl font-bold text-ink-faint leading-none">=</span>
        <div className="rounded-xl bg-ink text-white px-4 py-3">
          <p className="font-semibold">{spec.resultado.t}</p>
          <p className="text-sm text-stone-300 mt-0.5 leading-snug">{spec.resultado.d}</p>
        </div>
      </div>
      <AnimatePresence mode="wait" initial={false}>
        <motion.p key={sel} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="mt-3 text-[15px] leading-snug text-ink-soft">
          <b style={{ color: parte.color }}>{parte.t}. </b>
          {parte.d}
        </motion.p>
      </AnimatePresence>
    </Marco>
  );
}

// ─── Línea de tiempo ─────────────────────────────────────────────────────────

function Linea({ spec }: { spec: Spec<"linea"> }) {
  const inicial = Math.max(0, spec.eventos.findIndex((e) => e.tono === "warn"));
  const [sel, setSel] = useState(inicial);
  return (
    <Marco etiqueta={spec.etiqueta}>
      <ol className="relative">
        <span className="absolute left-[11px] top-3 bottom-3 w-0.5 bg-paper-line" aria-hidden />
        {spec.eventos.map((e, i) => {
          const on = sel === i;
          const color = e.tono ? colorTono(e.tono) : C.ink;
          return (
            <li key={e.fecha} className="relative pl-9 pb-2">
              <motion.span className="absolute left-1 top-4 h-5 w-5 rounded-full border-[3px] border-[#fffdf6]" animate={{ background: on ? color : C.line, scale: on ? 1.2 : 1 }} />
              <button onClick={() => setSel(i)} aria-expanded={on} className="w-full text-left rounded-xl border px-3 py-2.5 min-h-12 transition-colors" style={{ borderColor: on ? color : C.line, background: on ? `${color}0f` : "#fff" }}>
                <span className="block font-mono text-[10px] tracking-widest" style={{ color }}>
                  {e.fecha.toUpperCase()}
                </span>
                <span className="block text-[15px] font-semibold leading-snug text-ink">{e.t}</span>
                <AnimatePresence initial={false}>
                  {on && (
                    <motion.span initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="block overflow-hidden">
                      <span className="block pt-1.5 text-sm text-ink-soft leading-relaxed">{e.d}</span>
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>
            </li>
          );
        })}
      </ol>
    </Marco>
  );
}

export function VisualGenerico({ spec }: { spec: VisualSpec }) {
  switch (spec.tipo) {
    case "secuencia":
      return <Secuencia spec={spec} />;
    case "decision":
      return <Decision spec={spec} />;
    case "checklist":
      return <Checklist spec={spec} />;
    case "comparar":
      return <Comparar spec={spec} />;
    case "capas":
      return <Capas spec={spec} />;
    case "ecuacion":
      return <Ecuacion spec={spec} />;
    case "linea":
      return <Linea spec={spec} />;
  }
}
