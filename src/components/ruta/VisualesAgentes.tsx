"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, RotateCcw } from "lucide-react";
import { C, Marco, Segmentos } from "./ui";

// ─── 1 · Bucle del agente ────────────────────────────────────────────────────

const BUCLE = [
  { id: "objetivo", x: 160, y: 35, t: "Objetivo", c: C.joule, d: "Lo que pides: «Resuelve esta solicitud de vacaciones». Un objetivo, no una pregunta." },
  { id: "plan", x: 255, y: 130, t: "Plan", c: C.violet, d: "El agente decide qué pasos dar y en qué orden." },
  { id: "herramienta", x: 160, y: 225, t: "Herramienta", c: C.teja, d: "Llama a una API o a un servidor MCP. Aquí es donde actúa de verdad." },
  { id: "observa", x: 65, y: 130, t: "Observa", c: C.teal, d: "Lee el resultado. ¿Basta? Si no, vuelve a planificar y repite." },
];

export function BucleAgente() {
  const [sel, setSel] = useState("objetivo");
  const activo = BUCLE.find((n) => n.id === sel)!;
  return (
    <Marco etiqueta="El bucle del agente · toca un paso">
      <svg viewBox="0 0 320 260" className="w-full" role="img" aria-label="Bucle: objetivo, plan, herramienta, observa">
        <circle cx="160" cy="130" r="95" fill="none" stroke={C.line} strokeWidth="2" strokeDasharray="4 6" />
        <path id="bucle-ruta" d="M160,35 A95,95 0 0 1 160,225 A95,95 0 0 1 160,35" fill="none" />
        <circle r="7" fill={activo.c}>
          <animateMotion dur="6s" repeatCount="indefinite">
            <mpath href="#bucle-ruta" />
          </animateMotion>
        </circle>
        <text x="160" y="126" textAnchor="middle" fontSize="13" fontWeight="700" fill={C.ink}>
          bucle
        </text>
        <text x="160" y="143" textAnchor="middle" fontSize="10" fill={C.faint}>
          hasta cumplir
        </text>
        {BUCLE.map((n) => (
          <g key={n.id} onClick={() => setSel(n.id)} style={{ cursor: "pointer" }}>
            <motion.rect
              x={n.x - 48}
              y={n.y - 17}
              width="96"
              height="34"
              rx="17"
              fill={n.id === sel ? n.c : "#fff"}
              stroke={n.c}
              strokeWidth="2"
              animate={{ scale: n.id === sel ? 1.08 : 1 }}
              style={{ transformOrigin: `${n.x}px ${n.y}px` }}
            />
            <text
              x={n.x}
              y={n.y + 4}
              textAnchor="middle"
              fontSize="12"
              fontWeight="700"
              fill={n.id === sel ? "#fff" : n.c}
              pointerEvents="none"
            >
              {n.t}
            </text>
          </g>
        ))}
      </svg>
      <p className="mt-1 text-sm text-ink-soft leading-relaxed min-h-[3.5rem]">
        <b style={{ color: activo.c }}>{activo.t}.</b> {activo.d}
      </p>
    </Marco>
  );
}

// ─── 2 · Las 4 capas (pila isométrica) ───────────────────────────────────────

const CAPAS = [
  { id: "work", t: "JOULE WORK", c: C.joule, d: "La interfaz: pides un objetivo y Joule planifica y coordina agentes.", f: "Ya en disponibilidad general, despliegue progresivo." },
  { id: "studio", t: "JOULE STUDIO", c: C.teal, d: "Donde se crean y amplían agentes: lenguaje natural, CLI, MCP, n8n.", f: "Integración con BDC y flujos n8n: Q1 2027." },
  { id: "datos", t: "DATOS Y CONTEXTO", c: C.violet, d: "Business Data Cloud, Knowledge Graph, Ontology Manager, SAP-RPT.", f: "Ontology Manager en beta: nov 2026." },
  { id: "gob", t: "GOBIERNO", c: C.red, d: "Enterprise AI Gateway, AI Agent Hub y AI Governance Assistant.", f: "AI Gateway: Q1 2027. Auditoría, permisos, costes y AI Act." },
];

function cara(cx: number, y: number, w: number, h: number, t: number) {
  return {
    top: `${cx},${y} ${cx + w},${y + h} ${cx},${y + 2 * h} ${cx - w},${y + h}`,
    izq: `${cx - w},${y + h} ${cx},${y + 2 * h} ${cx},${y + 2 * h + t} ${cx - w},${y + h + t}`,
    der: `${cx + w},${y + h} ${cx},${y + 2 * h} ${cx},${y + 2 * h + t} ${cx + w},${y + h + t}`,
  };
}

export function PilaCapas() {
  const [sel, setSel] = useState("gob");
  const activa = CAPAS.find((c) => c.id === sel)!;
  return (
    <Marco etiqueta="Las 4 capas · toca una">
      <svg viewBox="0 0 320 262" className="w-full" role="img" aria-label="Pila de cuatro capas">
        {[...CAPAS].reverse().map((cp) => {
          const i = CAPAS.indexOf(cp);
          const y = 14 + i * 52;
          const p = cara(160, y, 100, 32, 14);
          const on = cp.id === sel;
          return (
            <motion.g
              key={cp.id}
              onClick={() => setSel(cp.id)}
              style={{ cursor: "pointer" }}
              animate={{ x: on ? 16 : 0, opacity: on ? 1 : 0.55 }}
              transition={{ type: "spring", stiffness: 260, damping: 22 }}
            >
              <polygon points={p.izq} fill={cp.c} opacity="0.72" />
              <polygon points={p.der} fill={cp.c} opacity="0.5" />
              <polygon points={p.top} fill={cp.c} stroke="#fff" strokeWidth="1.5" />
              <text x="160" y={y + 37} textAnchor="middle" fontSize="11" fontWeight="800" fill="#fff" pointerEvents="none">
                {cp.t}
              </text>
            </motion.g>
          );
        })}
      </svg>
      <div className="text-sm leading-relaxed">
        <p className="text-ink">
          <b style={{ color: activa.c }}>{activa.t}.</b> {activa.d}
        </p>
        <p className="mt-1 font-mono text-[11px] text-ink-faint">{activa.f}</p>
      </div>
    </Marco>
  );
}

// ─── 3 y 4 · MCP y A2A ───────────────────────────────────────────────────────

function Hilo({ x1, y1, x2, y2, c }: { x1: number; y1: number; x2: number; y2: number; c: string }) {
  return (
    <motion.line
      x1={x1}
      y1={y1}
      x2={x2}
      y2={y2}
      stroke={c}
      strokeWidth="2.5"
      strokeDasharray="6 6"
      strokeLinecap="round"
      animate={{ strokeDashoffset: [0, -24] }}
      transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}
    />
  );
}

function Caja({
  x,
  y,
  w,
  h,
  c,
  t,
  s,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  c: string;
  t: string;
  s?: string;
}) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx="10" fill="#fff" stroke={c} strokeWidth="2" />
      <text x={x + w / 2} y={y + (s ? h / 2 - 2 : h / 2 + 4)} textAnchor="middle" fontSize="11" fontWeight="700" fill={c}>
        {t}
      </text>
      {s && (
        <text x={x + w / 2} y={y + h / 2 + 12} textAnchor="middle" fontSize="8.5" fill={C.faint} fontFamily="ui-monospace, monospace">
          {s}
        </text>
      )}
    </g>
  );
}

export function MapaProtocolos({ inicial }: { inicial: "mcp" | "a2a" }) {
  const [modo, setModo] = useState<"mcp" | "a2a">(inicial);
  return (
    <Marco etiqueta="MCP vs A2A · compara">
      <Segmentos
        valor={modo}
        onChange={setModo}
        opciones={[
          { id: "mcp", label: "MCP · agente ↔ herramienta" },
          { id: "a2a", label: "A2A · agente ↔ agente" },
        ]}
      />
      <svg viewBox="0 0 320 250" className="w-full mt-3" role="img" aria-label={modo === "mcp" ? "Agente conectado a tres servidores MCP" : "Tres agentes conectados entre sí"}>
        {modo === "mcp" ? (
          <>
            <Hilo x1={110} y1={125} x2={190} y2={50} c={C.violet} />
            <Hilo x1={110} y1={125} x2={190} y2={125} c={C.violet} />
            <Hilo x1={110} y1={125} x2={190} y2={200} c={C.violet} />
            <Caja x={14} y={92} w={98} h={66} c={C.joule} t="Agente" s="cliente MCP" />
            <Caja x={190} y={22} w={116} h={56} c={C.teja} t="Servidor MCP" s="get_employee" />
            <Caja x={190} y={97} w={116} h={56} c={C.teja} t="Servidor MCP" s="list_leave" />
            <Caja x={190} y={172} w={116} h={56} c={C.teja} t="Servidor MCP" s="search_docs" />
            <text x="150" y="243" textAnchor="middle" fontSize="9" fill={C.faint}>
              un servidor se escribe una vez y sirve a muchos agentes
            </text>
          </>
        ) : (
          <>
            <Hilo x1={160} y1={72} x2={72} y2={158} c={C.violet} />
            <Hilo x1={160} y1={72} x2={248} y2={158} c={C.violet} />
            <Hilo x1={100} y1={190} x2={220} y2={190} c={C.violet} />
            <Caja x={100} y={14} w={120} h={58} c={C.joule} t="Agente coordinador" s="Agent Card" />
            <Caja x={10} y={158} w={110} h={58} c={C.teal} t="Agente nómina" s="Agent Card" />
            <Caja x={200} y={158} w={110} h={58} c={C.teal} t="Agente contratos" s="Agent Card" />
            <text x="160" y="240" textAnchor="middle" fontSize="9" fill={C.faint}>
              cada agente se anuncia con su ficha y se delegan tareas
            </text>
          </>
        )}
      </svg>
    </Marco>
  );
}

// ─── 9 · Flujo del agente con puerta de aprobación (el visual estrella) ──────

type Esc = "lectura" | "escritura";
type Dec = "si" | "no" | null;
type Tono = "info" | "ok" | "warn" | "bad";
interface Paso {
  nodo: number;
  titulo: string;
  log: string;
  tono: Tono;
}

const NODOS_FLUJO = [
  { t: "Usuario", c: C.joule, y: 34 },
  { t: "Agente", c: C.violet, y: 104 },
  { t: "Puerta de permisos", c: C.red, y: 174 },
  { t: "Servidor MCP", c: C.teja, y: 244 },
  { t: "API SuccessFactors", c: C.teal, y: 314 },
];

const TONO_COLOR: Record<Tono, string> = { info: C.soft, ok: C.green, warn: C.gold, bad: C.red };

function pasosDe(esc: Esc, dec: Dec): Paso[] {
  const lect = esc === "lectura";
  const pasos: Paso[] = [
    {
      nodo: 0,
      titulo: "El usuario pide algo",
      log: lect ? 'usuario → agente «¿Cuántos días de vacaciones me quedan?»' : 'usuario → agente «Cambia mi dirección postal»',
      tono: "info",
    },
    {
      nodo: 1,
      titulo: "El agente planifica",
      log: lect ? "agente: plan = consultar saldo (solo lectura)" : "agente: plan = actualizar dirección (ESCRITURA)",
      tono: "info",
    },
  ];
  if (lect) {
    pasos.push({ nodo: 2, titulo: "Permisos: lectura permitida", log: "permisos: scope read OK · sin aprobación", tono: "ok" });
  } else if (dec === null) {
    pasos.push({ nodo: 2, titulo: "Esperando aprobación humana", log: "permisos: scope write · requiere aprobación", tono: "warn" });
    return pasos;
  } else if (dec === "no") {
    pasos.push({ nodo: 2, titulo: "Un humano rechaza", log: "humano: RECHAZADO", tono: "bad" });
    pasos.push({ nodo: 1, titulo: "Acción cancelada", log: "agente: acción cancelada · sin cambios en SAP", tono: "bad" });
    return pasos;
  } else {
    pasos.push({ nodo: 2, titulo: "Un humano aprueba", log: "humano: APROBADO · registrado con su identidad", tono: "ok" });
  }
  pasos.push(
    {
      nodo: 3,
      titulo: "El servidor MCP ejecuta la herramienta",
      log: lect ? "mcp: get_leave_balance(userId)" : "mcp: update_address(userId, …)",
      tono: "info",
    },
    {
      nodo: 4,
      titulo: "SuccessFactors responde",
      log: lect ? "api: 200 · 1 registro" : "api: 200 · 1 registro actualizado",
      tono: "ok",
    },
    {
      nodo: 1,
      titulo: "El agente responde y queda la traza",
      log: lect ? "agente → usuario «Te quedan 12 días» (dato de ejemplo)" : "agente → usuario «Dirección actualizada»",
      tono: "ok",
    }
  );
  return pasos;
}

export function FlujoAgente() {
  const [esc, setEsc] = useState<Esc>("escritura");
  const [dec, setDec] = useState<Dec>(null);
  const [paso, setPaso] = useState(0);

  const pasos = pasosDe(esc, dec);
  const i = Math.min(paso, pasos.length - 1);
  const actual = pasos[i];
  const esperando = esc === "escritura" && dec === null && i === 2;
  const visitados = new Set(pasos.slice(0, i + 1).map((p) => p.nodo));
  const maxNodo = Math.max(...pasos.slice(0, i + 1).map((p) => p.nodo));

  const reiniciar = (nuevo: Esc = esc) => {
    setEsc(nuevo);
    setDec(null);
    setPaso(0);
  };

  return (
    <Marco etiqueta="Flujo de un agente · avanza paso a paso">
      <Segmentos
        valor={esc}
        onChange={(v) => reiniciar(v)}
        opciones={[
          { id: "lectura", label: "Leer un dato" },
          { id: "escritura", label: "Cambiar un dato" },
        ]}
      />

      <svg viewBox="0 0 320 350" className="w-full mt-3" role="img" aria-label="Flujo usuario, agente, permisos, MCP, API">
        {/* hilos */}
        {NODOS_FLUJO.slice(0, -1).map((n, k) => (
          <motion.line
            key={k}
            x1="110"
            y1={n.y + 18}
            x2="110"
            y2={NODOS_FLUJO[k + 1].y - 18}
            strokeWidth="3"
            strokeLinecap="round"
            animate={{ stroke: k < maxNodo ? C.violet : C.line }}
          />
        ))}
        {/* nodos */}
        {NODOS_FLUJO.map((n, k) => {
          const on = visitados.has(k);
          const bloqueado = k === 2 && esperando;
          return (
            <g key={n.t}>
              <motion.rect
                x="30"
                y={n.y - 18}
                width="160"
                height="36"
                rx={k === 2 ? 18 : 10}
                animate={{
                  fill: bloqueado ? "#fff6dc" : on ? "#fff" : "#f4eee2",
                  stroke: bloqueado ? C.gold : on ? n.c : C.line,
                }}
                strokeWidth="2.5"
              />
              <text x="110" y={n.y + 4} textAnchor="middle" fontSize="12" fontWeight="700" fill={on ? n.c : C.faint}>
                {n.t}
              </text>
            </g>
          );
        })}
        {/* carril del paquete */}
        <line x1="14" y1={NODOS_FLUJO[0].y} x2="14" y2={NODOS_FLUJO[4].y} stroke={C.line} strokeWidth="3" strokeLinecap="round" />
        {NODOS_FLUJO.map((n) => (
          <line key={n.t} x1="14" y1={n.y} x2="30" y2={n.y} stroke={C.line} strokeWidth="3" strokeLinecap="round" />
        ))}
        {/* paquete */}
        <motion.circle
          r="8"
          cx="14"
          initial={{ cy: NODOS_FLUJO[0].y, fill: C.soft }}
          animate={{ cy: NODOS_FLUJO[actual.nodo].y, fill: TONO_COLOR[actual.tono] }}
          transition={{ type: "spring", stiffness: 140, damping: 16 }}
          stroke="#fff"
          strokeWidth="2.5"
        />
        {/* registro de auditoría (columna) */}
        <text x="252" y="22" textAnchor="middle" fontSize="9" fontWeight="700" fill={C.faint}>
          REGISTRO
        </text>
        {pasos.slice(0, i + 1).map((p, k) => (
          <motion.rect
            key={`${esc}-${dec}-${k}`}
            x="212"
            y={34 + k * 22}
            height="16"
            rx="4"
            fill={TONO_COLOR[p.tono]}
            initial={{ width: 0 }}
            animate={{ width: 80 }}
            transition={{ duration: 0.35 }}
          />
        ))}
        {Array.from({ length: Math.max(0, 6 - (i + 1)) }).map((_, k) => (
          <rect key={`v${k}`} x="212" y={34 + (i + 1 + k) * 22} width="80" height="16" rx="4" fill="none" stroke={C.line} strokeDasharray="3 3" />
        ))}
      </svg>

      {/* paso actual */}
      <div className="rounded-xl bg-paper-deep/60 p-3">
        <p className="text-[11px] font-mono tracking-widest text-ink-faint">
          PASO {i + 1} DE {esperando ? "…" : pasos.length}
        </p>
        <p className="mt-0.5 font-semibold text-ink" style={{ color: TONO_COLOR[actual.tono] }}>
          {actual.titulo}
        </p>
      </div>

      {esperando && (
        <div className="mt-3 grid grid-cols-2 gap-2">
          <button
            onClick={() => setDec("si")}
            className="min-h-12 rounded-xl bg-[#2e9e5b] text-white font-semibold active:scale-95 transition-transform"
          >
            ✓ Aprobar
          </button>
          <button
            onClick={() => setDec("no")}
            className="min-h-12 rounded-xl bg-[#d6455d] text-white font-semibold active:scale-95 transition-transform"
          >
            ✕ Rechazar
          </button>
        </div>
      )}

      <div className="mt-3 flex gap-2">
        <button
          onClick={() => setPaso(Math.max(0, i - 1))}
          disabled={i === 0}
          aria-label="Paso anterior"
          className="min-h-12 w-14 rounded-xl border border-paper-line bg-white flex items-center justify-center disabled:opacity-30"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={() => setPaso(i + 1)}
          disabled={i >= pasos.length - 1}
          className="flex-1 min-h-12 rounded-xl bg-ink text-white font-semibold flex items-center justify-center gap-1 disabled:opacity-30"
        >
          Siguiente <ChevronRight className="w-5 h-5" />
        </button>
        <button
          onClick={() => reiniciar()}
          aria-label="Empezar de nuevo"
          className="min-h-12 w-14 rounded-xl border border-paper-line bg-white flex items-center justify-center"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* traza en texto */}
      <ul className="mt-3 rounded-xl bg-[#2c2620] p-3 font-mono text-[11px] leading-relaxed text-stone-300 space-y-1">
        {pasos.slice(0, i + 1).map((p, k) => (
          <li key={k}>
            <span className="text-stone-500">{String(k + 1).padStart(2, "0")}</span>{" "}
            <span style={{ color: p.tono === "info" ? "#d6d0c4" : TONO_COLOR[p.tono] }}>{p.log}</span>
          </li>
        ))}
      </ul>
      <p className="mt-2 text-[11px] text-ink-faint">Datos de ejemplo ficticios.</p>
    </Marco>
  );
}
