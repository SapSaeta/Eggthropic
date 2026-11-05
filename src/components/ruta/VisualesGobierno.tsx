"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Copy } from "lucide-react";
import { C, Marco, Segmentos } from "./ui";

// ─── 8 · Matriz de permisos mínimos ──────────────────────────────────────────

const COLS = ["Mis datos", "Datos ajenos", "Escribir", "Borrar"];
const PESOS = [1, 3, 5, 8];
const MAXIMO = PESOS.reduce((a, b) => a + b, 0);

const FILAS = [
  { id: "politicas", nombre: "Asistente de políticas", min: [0, 0, 0, 0] },
  { id: "autoservicio", nombre: "Autoservicio del empleado", min: [1, 0, 0, 0] },
  { id: "analista", nombre: "Analista de HR", min: [1, 1, 0, 0] },
];

export function MatrizPermisos() {
  const [perm, setPerm] = useState<Record<string, number[]>>(() =>
    Object.fromEntries(FILAS.map((f) => [f.id, [1, 1, 1, 1]]))
  );

  const alternar = (id: string, c: number) =>
    setPerm((p) => ({ ...p, [id]: p[id].map((v, k) => (k === c ? 1 - v : v)) }));
  const aplicarMinimo = () => setPerm(Object.fromEntries(FILAS.map((f) => [f.id, [...f.min]])));

  const exceso = (f: (typeof FILAS)[number]) =>
    perm[f.id].reduce((a, v, k) => a + (v && !f.min[k] ? PESOS[k] : 0), 0);
  const falta = (f: (typeof FILAS)[number]) => f.min.some((m, k) => m && !perm[f.id][k]);
  const total = FILAS.reduce((a, f) => a + exceso(f), 0);

  return (
    <Marco etiqueta="Dale a cada agente el mínimo · toca los permisos">
      <div className="space-y-3">
        {FILAS.map((f) => {
          const e = exceso(f);
          const radio = perm[f.id].reduce((a, v, k) => a + v * PESOS[k], 0) / MAXIMO;
          const perfecto = e === 0 && !falta(f);
          return (
            <div key={f.id} className="rounded-xl border border-paper-line bg-white p-3">
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-semibold text-ink">{f.nombre}</p>
                {perfecto ? (
                  <span className="font-mono text-[10px] tracking-widest text-[#2e9e5b]">✓ MÍNIMO</span>
                ) : falta(f) ? (
                  <span className="font-mono text-[10px] tracking-widest text-[#c79b00]">FALTA ALGO</span>
                ) : (
                  <span className="font-mono text-[10px] tracking-widest text-[#d6455d]">+{e} DE EXCESO</span>
                )}
              </div>
              <div className="mt-2 h-2 rounded-full bg-paper-deep overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  animate={{ width: `${Math.max(4, radio * 100)}%`, background: radio > 0.6 ? C.red : radio > 0.25 ? C.gold : C.green }}
                />
              </div>
              <div className="mt-2 grid grid-cols-4 gap-1.5">
                {COLS.map((col, k) => (
                  <button
                    key={col}
                    onClick={() => alternar(f.id, k)}
                    aria-pressed={!!perm[f.id][k]}
                    className="min-h-11 rounded-lg border-2 text-[11px] font-semibold leading-tight px-1 transition-colors"
                    style={{
                      borderColor: perm[f.id][k] ? (f.min[k] ? C.green : C.red) : C.line,
                      background: perm[f.id][k] ? (f.min[k] ? "#e5f4ec" : "#fbe3e7") : "#fff",
                      color: perm[f.id][k] ? C.ink : C.faint,
                    }}
                  >
                    {col}
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>
      <div className="mt-3 flex items-center justify-between gap-3">
        <p className="text-sm text-ink-soft">
          Exceso total: <b className={total === 0 ? "text-[#2e9e5b]" : "text-[#d6455d]"}>{total}</b>
        </p>
        <button onClick={aplicarMinimo} className="min-h-11 rounded-xl bg-ink text-white text-sm font-semibold px-4">
          Aplicar el mínimo
        </button>
      </div>
      <p className="mt-2 text-[11px] text-ink-faint">Ilustración: los pesos del riesgo son un ejemplo, no una métrica oficial.</p>
    </Marco>
  );
}

// ─── 10 · Trazas ─────────────────────────────────────────────────────────────

const EVENTOS = [
  { t: "09:12:04", quien: "agente-hr-01", accion: "consulta get_leave_balance", motivo: "petición del usuario U-104", res: "OK", c: C.green },
  { t: "09:12:41", quien: "agente-hr-01", accion: "propone update_address", motivo: "petición del usuario U-104", res: "pendiente de aprobación", c: C.gold },
  { t: "09:13:10", quien: "humano · RRHH-07", accion: "aprueba update_address", motivo: "documento verificado", res: "OK", c: C.green },
  { t: "09:13:11", quien: "servidor-mcp", accion: "ejecuta update_address", motivo: "aprobación #A-552", res: "1 registro cambiado", c: C.green },
];

export function LineaTrazas() {
  const [con, setCon] = useState<"con" | "sin">("con");
  const [abierto, setAbierto] = useState<number | null>(3);
  return (
    <Marco etiqueta="¿Quién cambió esta dirección? · con y sin trazas">
      <Segmentos
        valor={con}
        onChange={setCon}
        opciones={[
          { id: "con", label: "Con trazas" },
          { id: "sin", label: "Sin trazas" },
        ]}
      />
      <ol className="mt-3 relative space-y-2">
        <span className="absolute left-[13px] top-3 bottom-3 w-0.5 bg-paper-line" aria-hidden />
        {EVENTOS.map((e, k) => (
          <li key={k} className="relative pl-9">
            <motion.span
              className="absolute left-1.5 top-3 h-4 w-4 rounded-full border-2 border-white"
              animate={{ background: con === "con" ? e.c : C.line }}
            />
            <button
              disabled={con === "sin"}
              onClick={() => setAbierto(abierto === k ? null : k)}
              className="w-full text-left rounded-xl border border-paper-line bg-white px-3 py-2.5 min-h-12"
            >
              {con === "con" ? (
                <>
                  <div className="flex items-baseline justify-between gap-2">
                    <span className="text-sm font-semibold text-ink">{e.accion}</span>
                    <span className="font-mono text-[10px] text-ink-faint">{e.t}</span>
                  </div>
                  <AnimatePresence initial={false}>
                    {abierto === k && (
                      <motion.dl
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden grid grid-cols-[4.5rem_1fr] gap-x-2 gap-y-0.5 text-xs pt-2"
                      >
                        <dt className="text-ink-faint">Quién</dt>
                        <dd className="text-ink">{e.quien}</dd>
                        <dt className="text-ink-faint">Cuándo</dt>
                        <dd className="text-ink">{e.t}</dd>
                        <dt className="text-ink-faint">Por qué</dt>
                        <dd className="text-ink">{e.motivo}</dd>
                        <dt className="text-ink-faint">Resultado</dt>
                        <dd style={{ color: e.c }} className="font-semibold">
                          {e.res}
                        </dd>
                      </motion.dl>
                    )}
                  </AnimatePresence>
                </>
              ) : (
                <span className="text-sm text-ink-faint blur-[3px] select-none">¿¿¿ ??? ???</span>
              )}
            </button>
          </li>
        ))}
      </ol>
      <p className="mt-3 text-sm text-ink-soft">
        {con === "con" ? (
          <>
            <b className="text-[#2e9e5b]">Se reconstruye todo:</b> pidió el usuario, aprobó una persona concreta y ejecutó el servidor.
          </>
        ) : (
          <>
            <b className="text-[#d6455d]">No se puede saber.</b> Sin traza no hay auditoría ni defensa ante un incidente.
          </>
        )}
      </p>
      <p className="mt-1 text-[11px] text-ink-faint">Datos de ejemplo ficticios.</p>
    </Marco>
  );
}

// ─── 11 · Pirámide de riesgo del AI Act ──────────────────────────────────────

const NIVELES = [
  { id: "inaceptable", t: "PROHIBIDO", c: "#d6455d", d: "Prácticas que se prohíben: por ejemplo, puntuación social o inferir emociones de personas en el trabajo (con excepciones médicas y de seguridad)." },
  { id: "alto", t: "ALTO", c: "#e8853c", d: "Aquí está RRHH: el Anexo III incluye empleo y gestión de trabajadores (selección, ascensos, despidos, asignación de tareas, evaluación). Exige gestión de riesgos, calidad de datos, registro y supervisión humana." },
  { id: "limitado", t: "LIMITADO", c: "#f2c14e", d: "Obligaciones de transparencia: por ejemplo, avisar de que la persona habla con una IA." },
  { id: "minimo", t: "MÍNIMO", c: "#2e9e5b", d: "Sin obligaciones específicas: por ejemplo, filtros antispam." },
];

const hw = (y: number) => 30 + (120 * (y - 20)) / 210;

export function PiramideRiesgo() {
  const [sel, setSel] = useState("alto");
  const activo = NIVELES.find((n) => n.id === sel)!;
  return (
    <Marco etiqueta="Pirámide del AI Act · toca un nivel">
      <svg viewBox="0 0 320 250" className="w-full" role="img" aria-label="Pirámide de cuatro niveles de riesgo">
        {NIVELES.map((n, k) => {
          const yt = 20 + k * 52.5;
          const yb = yt + 52.5;
          const pts = `${160 - hw(yt)},${yt} ${160 + hw(yt)},${yt} ${160 + hw(yb)},${yb} ${160 - hw(yb)},${yb}`;
          const on = n.id === sel;
          return (
            <g key={n.id} onClick={() => setSel(n.id)} style={{ cursor: "pointer" }}>
              <motion.polygon
                points={pts}
                fill={n.c}
                stroke="#fffdf6"
                strokeWidth="3"
                animate={{ opacity: on ? 1 : 0.45 }}
              />
              <text x="160" y={(yt + yb) / 2 + 4} textAnchor="middle" fontSize="12" fontWeight="800" fill={n.id === "limitado" ? "#5a3d00" : "#fff"} pointerEvents="none">
                {n.t}
              </text>
            </g>
          );
        })}
        <motion.g
          animate={{ x: [0, 4, 0] }}
          transition={{ repeat: Infinity, duration: 1.4 }}
          onClick={() => setSel("alto")}
          style={{ cursor: "pointer" }}
        >
          <rect x="232" y="84" width="74" height="26" rx="13" fill={C.ink} />
          <text x="269" y="101" textAnchor="middle" fontSize="11" fontWeight="800" fill="#ffd21a">
            ← RRHH
          </text>
        </motion.g>
      </svg>
      <p className="text-sm text-ink-soft leading-relaxed min-h-[5rem]">
        <b style={{ color: activo.c === "#f2c14e" ? "#9a7800" : activo.c }}>{activo.t}.</b> {activo.d}
      </p>
    </Marco>
  );
}

// ─── 12 · Anonimizar antes de salir ──────────────────────────────────────────

const CAMPOS = [
  { k: "Nombre", real: "Marta Gómez Ruiz", fic: "Persona Ficticia 001" },
  { k: "Documento", real: "12345678Z", fic: "DOC-FICTICIO-001" },
  { k: "IBAN", real: "ES91 2100 0418 4502…", fic: "ES00 0000 0000 0000…" },
  { k: "Salario", real: "41.250 €", fic: "30.000 € (rango)" },
  { k: "Nacimiento", real: "14/03/1988", fic: "01/01/1980" },
];

export function Anonimizador() {
  const [prot, setProt] = useState<Record<string, boolean>>({});
  const n = CAMPOS.filter((c) => prot[c.k]).length;
  const listo = n === CAMPOS.length;
  return (
    <Marco etiqueta="Protege el registro · toca cada campo">
      <ul className="space-y-2">
        {CAMPOS.map((c) => {
          const on = !!prot[c.k];
          return (
            <li key={c.k}>
              <button
                onClick={() => setProt((p) => ({ ...p, [c.k]: !p[c.k] }))}
                aria-pressed={on}
                className="w-full min-h-14 rounded-xl border-2 px-3 py-2 text-left flex items-center gap-3 transition-colors"
                style={{ borderColor: on ? C.green : C.line, background: on ? "#e5f4ec" : "#fff" }}
              >
                <span className="font-mono text-[10px] tracking-widest text-ink-faint w-16 shrink-0">{c.k.toUpperCase()}</span>
                <span className="flex-1 text-sm">
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.span
                      key={on ? "f" : "r"}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      className={on ? "text-[#2e9e5b] font-semibold" : "text-ink"}
                    >
                      {on ? c.fic : c.real}
                    </motion.span>
                  </AnimatePresence>
                </span>
                <span className={`h-6 w-6 rounded-full flex items-center justify-center ${on ? "bg-[#2e9e5b]" : "border-2 border-paper-line"}`}>
                  {on && <Check className="w-4 h-4 text-white" strokeWidth={3} />}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
      <div className="mt-3 h-2 rounded-full bg-paper-deep overflow-hidden">
        <motion.div className="h-full rounded-full bg-[#2e9e5b]" animate={{ width: `${(n / CAMPOS.length) * 100}%` }} />
      </div>
      <p className="mt-2 text-sm font-semibold" style={{ color: listo ? C.green : C.soft }}>
        {listo ? "Listo: ya puede salir al entorno de pruebas." : `${n} de ${CAMPOS.length} campos protegidos`}
      </p>
      <p className="mt-1 text-[11px] text-ink-faint">Registro inventado, no es de ninguna persona real.</p>
    </Marco>
  );
}

// ─── 13 · Joule Studio o servidor propio ─────────────────────────────────────

const CAPAS_PLAT = [
  { t: "Agente en Joule Studio", c: C.joule, desde: 0 },
  { t: "Herramientas vía MCP", c: C.violet, desde: 34 },
  { t: "Servidor MCP propio", c: C.teja, desde: 67 },
  { t: "Pruebas automáticas y trazas propias", c: C.green, desde: 67 },
];

export function ElegirPlataforma() {
  const [control, setControl] = useState(20);
  const zona = control < 34 ? "Rápido y declarativo" : control < 67 ? "Mezcla" : "Control fino";
  return (
    <Marco etiqueta="¿Cuánto control necesitas? · desliza">
      <label className="block">
        <div className="flex justify-between text-[11px] font-mono text-ink-faint">
          <span>MENOS CONTROL</span>
          <span>MÁS CONTROL</span>
        </div>
        <input
          type="range"
          min={0}
          max={100}
          value={control}
          onChange={(e) => setControl(Number(e.target.value))}
          className="w-full mt-2 h-10 accent-[#c2542b]"
          aria-label="Cuánto control necesitas"
        />
      </label>
      <p className="mt-1 font-semibold text-ink">{zona}</p>
      <div className="mt-3 flex flex-col-reverse gap-1.5">
        {CAPAS_PLAT.map((l) => {
          const on = control >= l.desde;
          return (
            <motion.div
              key={l.t}
              animate={{ opacity: on ? 1 : 0.25, scale: on ? 1 : 0.97 }}
              className="rounded-xl px-3 py-2.5 text-sm font-semibold text-white"
              style={{ background: l.c }}
            >
              {l.t}
            </motion.div>
          );
        })}
      </div>
      <p className="mt-3 text-[11px] text-ink-faint">Heurística propia (hipótesis): valídala con tu caso.</p>
    </Marco>
  );
}

// ─── 14 · Tu frase de 30 segundos ────────────────────────────────────────────

const SLOTS = [
  { id: "quien", etiqueta: "A quién", opciones: ["empresas con SAP HCM", "equipos de RRHH", "consultoras SAP"] },
  { id: "que", etiqueta: "Qué", opciones: ["poner agentes de IA fiables", "automatizar el autoservicio", "gobernar agentes de IA"] },
  { id: "donde", etiqueta: "Dónde", opciones: ["en SuccessFactors", "sobre SAP HCM", "en Employee Central"] },
  { id: "como", etiqueta: "Cómo", opciones: ["APIs limpias, permisos mínimos y trazas", "aprobación humana y cumplimiento del AI Act", "pruebas y gobierno desde el primer día"] },
];

export function ConstructorPitch() {
  const [elec, setElec] = useState<Record<string, number>>({ quien: 0, que: 0, donde: 0, como: 0 });
  const [copiado, setCopiado] = useState(false);
  const v = (id: string) => SLOTS.find((s) => s.id === id)!.opciones[elec[id]];
  const frase = `Ayudo a ${v("quien")} a ${v("que")} ${v("donde")}, con ${v("como")}.`;

  const copiar = async () => {
    try {
      await navigator.clipboard.writeText(frase);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 1800);
    } catch {
      // sin portapapeles: el texto sigue visible para copiarlo a mano
    }
  };

  return (
    <Marco etiqueta="Monta tu frase · elige una opción por hueco">
      <div className="rounded-xl bg-[#2c2620] p-4">
        <AnimatePresence mode="wait" initial={false}>
          <motion.p key={frase} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="text-base leading-relaxed text-white">
            {frase}
          </motion.p>
        </AnimatePresence>
      </div>
      <div className="mt-3 space-y-3">
        {SLOTS.map((s) => (
          <div key={s.id}>
            <p className="font-mono text-[10px] tracking-widest text-ink-faint mb-1">{s.etiqueta.toUpperCase()}</p>
            <div className="flex flex-wrap gap-1.5">
              {s.opciones.map((o, k) => (
                <button
                  key={o}
                  onClick={() => setElec((e) => ({ ...e, [s.id]: k }))}
                  aria-pressed={elec[s.id] === k}
                  className="min-h-10 rounded-full border-2 px-3 text-xs font-semibold transition-colors"
                  style={{
                    borderColor: elec[s.id] === k ? C.teja : C.line,
                    background: elec[s.id] === k ? C.teja : "#fff",
                    color: elec[s.id] === k ? "#fff" : C.soft,
                  }}
                >
                  {o}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
      <button onClick={copiar} className="mt-4 w-full min-h-12 rounded-xl bg-ink text-white font-semibold flex items-center justify-center gap-2">
        {copiado ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
        {copiado ? "Copiada" : "Copiar frase"}
      </button>
    </Marco>
  );
}
