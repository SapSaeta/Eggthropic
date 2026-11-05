"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { C, Marco, Segmentos } from "./ui";

// ─── 5 · Clean core: núcleo limpio vs sucio ──────────────────────────────────

const CX = 160;
const CY = 130;
const polar = (r: number, deg: number) => ({
  x: CX + r * Math.cos((deg * Math.PI) / 180),
  y: CY + r * Math.sin((deg * Math.PI) / 180),
});

const SATS = [
  { t: "Extensiones BTP", deg: -90 },
  { t: "Agente de IA", deg: 30 },
  { t: "Apps Fiori", deg: 150 },
];

function zigzag(deg: number) {
  const a = polar(104, deg);
  const b = polar(36, deg);
  const px = -Math.sin((deg * Math.PI) / 180);
  const py = Math.cos((deg * Math.PI) / 180);
  const pt = (t: number, o: number) => {
    const x = a.x + (b.x - a.x) * t + px * o;
    const y = a.y + (b.y - a.y) * t + py * o;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  };
  return `${a.x.toFixed(1)},${a.y.toFixed(1)} ${pt(0.25, 12)} ${pt(0.5, -12)} ${pt(0.75, 10)} ${b.x.toFixed(1)},${b.y.toFixed(1)}`;
}

export function CleanCore() {
  const [modo, setModo] = useState<"limpio" | "sucio">("limpio");
  const limpio = modo === "limpio";
  return (
    <Marco etiqueta="Núcleo limpio vs sucio · cambia">
      <Segmentos
        valor={modo}
        onChange={setModo}
        opciones={[
          { id: "limpio", label: "Clean core" },
          { id: "sucio", label: "Core modificado" },
        ]}
      />
      <svg viewBox="0 0 320 262" className="w-full mt-2" role="img" aria-label={limpio ? "Satélites conectados por la corona de APIs" : "Satélites enredados con el núcleo"}>
        {/* corona de APIs */}
        <motion.circle
          cx={CX}
          cy={CY}
          r="72"
          fill="none"
          strokeWidth="6"
          animate={{ stroke: limpio ? C.green : C.line, opacity: limpio ? 1 : 0.5 }}
          strokeDasharray={limpio ? "0" : "5 7"}
        />
        {limpio && (
          <motion.circle
            cx={CX}
            cy={CY}
            r="72"
            fill="none"
            stroke={C.green}
            strokeWidth="2"
            initial={{ r: 72, opacity: 0.5 }}
            animate={{ r: [72, 82], opacity: [0.5, 0] }}
            transition={{ repeat: Infinity, duration: 1.8, ease: "easeOut" }}
          />
        )}
        <text x={CX} y={CY - 77} textAnchor="middle" fontSize="9" fontWeight="700" fill={limpio ? C.green : C.faint}>
          APIs liberadas
        </text>
        {/* núcleo */}
        <motion.circle cx={CX} cy={CY} r="36" animate={{ fill: limpio ? "#f3ddd2" : "#fbd9de", stroke: limpio ? C.teja : C.red }} strokeWidth="3" />
        <text x={CX} y={CY - 2} textAnchor="middle" fontSize="11" fontWeight="800" fill={limpio ? C.teja : C.red}>
          Núcleo
        </text>
        <text x={CX} y={CY + 12} textAnchor="middle" fontSize="9" fill={C.soft}>
          {limpio ? "estándar" : "con Z-código"}
        </text>
        {/* conexiones */}
        {SATS.map((s) => {
          const borde = polar(72, s.deg);
          const sat = polar(104, s.deg);
          return limpio ? (
            <motion.line
              key={s.t}
              x1={sat.x}
              y1={sat.y}
              x2={borde.x}
              y2={borde.y}
              stroke={C.green}
              strokeWidth="3"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.5 }}
            />
          ) : (
            <motion.polyline
              key={s.t}
              points={zigzag(s.deg)}
              fill="none"
              stroke={C.red}
              strokeWidth="2.5"
              strokeLinejoin="round"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            />
          );
        })}
        {/* satélites */}
        {SATS.map((s) => {
          const p = polar(118, s.deg);
          const esAgente = s.t === "Agente de IA";
          return (
            <g key={s.t}>
              <rect x={p.x - 46} y={p.y - 14} width="92" height="28" rx="14" fill="#fff" stroke={esAgente ? C.joule : C.soft} strokeWidth="2" />
              <text x={p.x} y={p.y + 4} textAnchor="middle" fontSize="10.5" fontWeight="700" fill={esAgente ? C.joule : C.soft}>
                {s.t}
              </text>
              {!limpio && esAgente && (
                <motion.g animate={{ scale: [1, 1.25, 1] }} transition={{ repeat: Infinity, duration: 1.2 }} style={{ transformOrigin: `${p.x + 46}px ${p.y - 14}px` }}>
                  <circle cx={p.x + 46} cy={p.y - 14} r="10" fill={C.red} />
                  <text x={p.x + 46} y={p.y - 10} textAnchor="middle" fontSize="12" fontWeight="800" fill="#fff">
                    ?
                  </text>
                </motion.g>
              )}
            </g>
          );
        })}
      </svg>
      <p className="text-sm text-ink-soft leading-relaxed">
        {limpio ? (
          <>
            <b className="text-[#2e9e5b]">Todo pasa por la corona de APIs.</b> El agente solo toca lo que se expone, con permisos claros.
          </>
        ) : (
          <>
            <b className="text-[#d6455d]">Cables directos al núcleo.</b> ¿Qué toca el agente por dentro? Nadie lo sabe, así que no se puede darle permisos mínimos.
          </>
        )}
      </p>
    </Marco>
  );
}

// ─── 6 · Grafo de Employee Central ───────────────────────────────────────────

interface NodoEC {
  x: number;
  y: number;
  padre: string | null;
  nav: string | null;
  ok: boolean;
  d: string;
  ex: string;
}

const EC: Record<string, NodoEC> = {
  PerPerson: { x: 160, y: 30, padre: null, nav: null, ok: true, d: "La persona. Su clave es personIdExternal.", ex: "/odata/v2/PerPerson" },
  EmpEmployment: { x: 160, y: 105, padre: "PerPerson", nav: "employmentNav", ok: true, d: "La relación laboral de esa persona: alta y baja.", ex: "$expand=employmentNav" },
  EmpJob: { x: 160, y: 180, padre: "EmpEmployment", nav: "jobInfoNav", ok: true, d: "Información del puesto, con historial por fechas.", ex: "$expand=employmentNav/jobInfoNav" },
  FODepartment: { x: 80, y: 262, padre: "EmpJob", nav: "departmentNav", ok: true, d: "El departamento del puesto (objeto de fundación).", ex: "$expand=employmentNav/jobInfoNav/departmentNav" },
  FOCompany: { x: 240, y: 262, padre: "EmpJob", nav: "companyNav", ok: false, d: "La sociedad a la que pertenece el puesto.", ex: "$expand=employmentNav/jobInfoNav/companyNav" },
  PerPersonal: { x: 55, y: 105, padre: "PerPerson", nav: "personalInfoNav", ok: false, d: "Datos personales (nombre, etc.). Dato sensible.", ex: "$expand=personalInfoNav" },
  PerEmail: { x: 265, y: 105, padre: "PerPerson", nav: "emailNav", ok: false, d: "Correos electrónicos de la persona. Dato personal.", ex: "$expand=emailNav" },
};

function rutaA(id: string): string[] {
  const out: string[] = [];
  let cur: string | null = id;
  while (cur) {
    out.push(cur);
    cur = EC[cur].padre;
  }
  return out;
}

export function GrafoEC() {
  const [sel, setSel] = useState("EmpJob");
  const ruta = new Set(rutaA(sel));
  const n = EC[sel];
  return (
    <Marco etiqueta="Employee Central · toca una entidad">
      <svg viewBox="0 0 320 295" className="w-full" role="img" aria-label="Grafo de entidades de Employee Central">
        {Object.entries(EC).map(([id, nodo]) => {
          if (!nodo.padre) return null;
          const p = EC[nodo.padre];
          const dentro = ruta.has(id);
          const lateral = nodo.x !== p.x;
          const t = lateral ? 0.72 : 0.5;
          const mx = p.x + (nodo.x - p.x) * t;
          const my = p.y + 14 + (nodo.y - 14 - (p.y + 14)) * t;
          return (
            <g key={id}>
              <motion.line
                x1={p.x}
                y1={p.y + 14}
                x2={nodo.x}
                y2={nodo.y - 14}
                strokeWidth={dentro ? 3.5 : 2}
                strokeDasharray={nodo.ok ? "0" : "5 5"}
                animate={{ stroke: dentro ? C.teal : C.line }}
              />
              <text x={mx + (!lateral ? 8 : nodo.x < p.x ? -5 : 5)} y={my + 3} fontSize="8" fill={dentro ? C.teal : C.faint} fontFamily="ui-monospace, monospace" textAnchor={!lateral || nodo.x > p.x ? "start" : "end"}>
                {nodo.nav}
              </text>
            </g>
          );
        })}
        {Object.entries(EC).map(([id, nodo]) => {
          const on = id === sel;
          const dentro = ruta.has(id);
          return (
            <g key={id} onClick={() => setSel(id)} style={{ cursor: "pointer" }}>
              <motion.rect
                x={nodo.x - 50}
                y={nodo.y - 14}
                width="100"
                height="28"
                rx="8"
                strokeWidth="2"
                strokeDasharray={nodo.ok ? "0" : "4 3"}
                animate={{ fill: on ? C.teal : "#fff", stroke: dentro ? C.teal : C.line }}
              />
              <text x={nodo.x} y={nodo.y + 4} textAnchor="middle" fontSize="10.5" fontWeight="700" fill={on ? "#fff" : dentro ? C.teal : C.soft} pointerEvents="none">
                {id}
              </text>
            </g>
          );
        })}
      </svg>
      <div className="rounded-xl bg-paper-deep/60 p-3 text-sm">
        <p className="font-semibold text-ink">{sel}</p>
        <p className="text-ink-soft mt-0.5">{n.d}</p>
        <p className="mt-2 font-mono text-[11px] text-ink break-all bg-white rounded-lg px-2 py-1.5 border border-paper-line">{n.ex}</p>
        <p className="mt-2 font-mono text-[10px] tracking-wide" style={{ color: n.ok ? C.green : C.gold }}>
          {n.ok ? "✓ CONFIRMADO en el ejemplo oficial de SAP Learning" : "◌ A VERIFICAR en el $metadata de tu instancia"}
        </p>
      </div>
    </Marco>
  );
}

// ─── 7 · Constructor de una llamada OData ────────────────────────────────────

const OPTS = [
  { id: "select", t: "$select", frag: "$select=personIdExternal", d: "Limita las columnas: pides solo lo necesario.", k: 0.35, c: C.violet },
  { id: "filter", t: "$filter", frag: "$filter=personIdExternal eq 'EMP001'", d: "Limita las filas: solo las que cumplen la condición.", k: 0.15, c: C.joule },
  { id: "top", t: "$top", frag: "$top=10", d: "Limita cuántos registros devuelve.", k: 0.5, c: C.teal },
  { id: "expand", t: "$expand", frag: "$expand=employmentNav/jobInfoNav", d: "Trae entidades relacionadas en la misma llamada.", k: 1.6, c: C.teja },
] as const;

export function ConstructorOData() {
  const [on, setOn] = useState<Record<string, boolean>>({ select: false, filter: false, top: false, expand: false });
  const activos = OPTS.filter((o) => on[o.id]);
  const tam = Math.min(100, Math.round(activos.reduce((a, o) => a * o.k, 100)));
  const ultimo = activos[activos.length - 1];
  return (
    <Marco etiqueta="Construye una llamada · activa piezas">
      <div className="rounded-xl bg-[#2c2620] p-3 font-mono text-[11px] leading-relaxed text-stone-300 break-all">
        <span className="text-stone-500">GET </span>
        <span>/odata/v2/</span>
        <span className="text-[#ffd21a]">PerPerson</span>
        {activos.map((o, k) => (
          <motion.span key={o.id} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} className="block pl-3" style={{ color: o.c === C.violet ? "#c4b0f5" : o.c === C.joule ? "#8ec1ff" : o.c === C.teal ? "#6fd6cc" : "#f0a27f" }}>
            {k === 0 ? "?" : "&"}
            {o.frag}
          </motion.span>
        ))}
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2">
        {OPTS.map((o) => (
          <button
            key={o.id}
            onClick={() => setOn((s) => ({ ...s, [o.id]: !s[o.id] }))}
            aria-pressed={on[o.id]}
            className="min-h-11 rounded-xl border-2 font-mono text-sm font-bold transition-colors"
            style={{
              borderColor: o.c,
              background: on[o.id] ? o.c : "#fff",
              color: on[o.id] ? "#fff" : o.c,
            }}
          >
            {o.t}
          </button>
        ))}
      </div>

      <p className="mt-3 text-sm text-ink-soft min-h-[2.75rem]">
        {ultimo ? (
          <>
            <b style={{ color: ultimo.c }}>{ultimo.t}.</b> {ultimo.d}
          </>
        ) : (
          "Sin parámetros, pides todo. Activa piezas para ver cómo cambia la llamada."
        )}
      </p>

      <div className="mt-1">
        <div className="flex items-baseline justify-between text-[11px] font-mono text-ink-faint">
          <span>DATOS QUE VIAJAN (ilustrativo)</span>
          <span>{tam}%</span>
        </div>
        <div className="mt-1 h-3 rounded-full bg-paper-deep overflow-hidden">
          <motion.div className="h-full rounded-full" animate={{ width: `${tam}%`, background: tam > 60 ? C.red : tam > 25 ? C.gold : C.green }} />
        </div>
      </div>
    </Marco>
  );
}
