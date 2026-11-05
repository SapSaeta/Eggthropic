"use client";

import { motion } from "framer-motion";
import { ArrowRight, Check, Clock } from "lucide-react";
import { EJES, type Leccion } from "@/lib/lecciones";
import { marcarHecha, responderQuiz, type RutaState } from "@/lib/ruta-store";
import { C } from "./ui";
import { Visual } from "./visuales";

export function LeccionCard({
  leccion,
  estado,
  hoy,
  onHecha,
  onSiguiente,
}: {
  leccion: Leccion;
  estado: RutaState;
  hoy: string;
  onHecha?: () => void;
  onSiguiente?: () => void;
}) {
  const eje = EJES[leccion.eje];
  const respuesta = estado.quiz[leccion.id];
  const respondida = respuesta !== undefined;
  const hecha = leccion.id in estado.hechas;
  const tagColor = leccion.etiqueta === "HECHO" ? C.teal : C.joule;

  return (
    <article className="space-y-5">
      {/* cabecera */}
      <header>
        <div className="flex flex-wrap items-center gap-2 font-mono text-[10px] tracking-widest">
          <span className="px-2 py-1 rounded text-white" style={{ background: eje.color }}>
            {eje.nombre.toUpperCase()}
          </span>
          <span className="flex items-center gap-1 text-ink-faint">
            <Clock className="w-3 h-3" /> {leccion.minutos} MIN
          </span>
          <span className="px-2 py-1 rounded border" style={{ color: tagColor, borderColor: `${tagColor}55`, background: `${tagColor}12` }}>
            [{leccion.etiqueta}]
          </span>
        </div>
        <h2 className="mt-3 text-3xl font-bold leading-tight text-ink">{leccion.titulo}</h2>
        <p className="mt-2 text-lg text-ink-soft leading-snug">{leccion.gancho}</p>
      </header>

      {/* visual */}
      <Visual k={leccion.visual} />

      {/* tres ideas */}
      <ol className="space-y-3">
        {leccion.puntos.map((p, i) => (
          <li key={i} className="flex gap-3 items-start">
            <span className="h-8 w-8 shrink-0 rounded-full flex items-center justify-center text-sm font-bold text-white" style={{ background: eje.color }}>
              {i + 1}
            </span>
            <p className="text-[17px] leading-snug text-ink pt-0.5">{p}</p>
          </li>
        ))}
      </ol>

      {/* quiz */}
      <section className="rounded-2xl border-2 border-ink/10 bg-paper-card p-4">
        <p className="font-mono text-[10px] tracking-[0.18em] text-teja">COMPRUEBA</p>
        <p className="mt-1 text-lg font-semibold text-ink leading-snug">{leccion.quiz.pregunta}</p>
        <div className="mt-3 space-y-2">
          {leccion.quiz.opciones.map((o, i) => {
            const esCorrecta = i === leccion.quiz.correcta;
            const elegida = respuesta === i;
            const estilo = !respondida
              ? { borderColor: C.line, background: "#fff", color: C.ink }
              : esCorrecta
                ? { borderColor: C.green, background: "#e5f4ec", color: C.ink }
                : elegida
                  ? { borderColor: C.red, background: "#fbe3e7", color: C.ink }
                  : { borderColor: C.line, background: "#fff", color: C.faint };
            return (
              <motion.button
                key={i}
                whileTap={respondida ? undefined : { scale: 0.97 }}
                disabled={respondida}
                onClick={() => responderQuiz(leccion.id, i)}
                className="w-full min-h-14 rounded-xl border-2 px-4 py-3 text-left text-[15px] font-medium flex items-center gap-3"
                style={estilo}
              >
                <span className="flex-1">{o}</span>
                {respondida && esCorrecta && <Check className="w-5 h-5 text-[#2e9e5b]" strokeWidth={3} />}
                {respondida && elegida && !esCorrecta && <span className="text-[#d6455d] font-bold">✕</span>}
              </motion.button>
            );
          })}
        </div>
        {respondida && (
          <motion.p initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="mt-3 text-sm text-ink-soft leading-relaxed">
            <b style={{ color: respuesta === leccion.quiz.correcta ? C.green : C.red }}>
              {respuesta === leccion.quiz.correcta ? "Correcto. " : "Casi. "}
            </b>
            {leccion.quiz.explicacion}
          </motion.p>
        )}
      </section>

      {leccion.fuente && (
        <p className="text-xs text-ink-faint leading-relaxed">
          Fuente:{" "}
          {leccion.fuente.href ? (
            <a href={leccion.fuente.href} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2">
              {leccion.fuente.label}
            </a>
          ) : (
            leccion.fuente.label
          )}
        </p>
      )}

      {/* cierre */}
      {hecha ? (
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="rounded-2xl bg-[#e5f4ec] border-2 border-[#2e9e5b] p-5 text-center"
        >
          <motion.div
            className="text-5xl"
            initial={{ rotate: -12, scale: 0.6 }}
            animate={{ rotate: [0, -10, 10, 0], scale: 1 }}
            transition={{ duration: 0.7 }}
          >
            🐣
          </motion.div>
          <p className="mt-2 text-lg font-bold text-[#1f7a45]">¡Lección hecha!</p>
          <p className="text-sm text-ink-soft">Con esto basta por hoy. Mañana, otra.</p>
          {onSiguiente && (
            <button onClick={onSiguiente} className="mt-4 min-h-11 px-4 rounded-xl border-2 border-[#2e9e5b] text-[#1f7a45] font-semibold inline-flex items-center gap-1">
              Quiero otra ahora <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </motion.div>
      ) : (
        <button
          disabled={!respondida}
          onClick={() => {
            marcarHecha(leccion.id, hoy);
            onHecha?.();
          }}
          className="w-full min-h-14 rounded-2xl bg-ink text-white text-lg font-bold disabled:opacity-35 active:scale-[0.98] transition-transform flex items-center justify-center gap-2"
        >
          <span>🥚</span> {respondida ? "Marcar como hecha" : "Responde el quiz para cerrar"}
        </button>
      )}
    </article>
  );
}
