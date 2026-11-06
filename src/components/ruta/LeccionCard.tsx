"use client";

import { useState, type ReactNode } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Award, Check, Clock, Quote } from "lucide-react";
import { EJES, type Leccion } from "@/lib/lecciones";
import { marcarHecha, responderQuiz, type RutaState } from "@/lib/ruta-store";
import { C } from "./ui";
import { Visual } from "./visuales";

function Seccion({ n, titulo, children }: { n: string; titulo: string; children: ReactNode }) {
  return (
    <section className="border-t border-ink/10 pt-4">
      <h3 className="flex items-baseline gap-2 font-mono text-[11px] tracking-[0.18em] text-ink-faint mb-3">
        <span className="text-teja">{n}</span>
        {titulo.toUpperCase()}
      </h3>
      {children}
    </section>
  );
}

function PreguntaQuiz({
  idLeccion,
  n,
  q,
  respuesta,
}: {
  idLeccion: string;
  n: number;
  q: Leccion["quiz"][number];
  respuesta: number | undefined;
}) {
  const respondida = respuesta !== undefined;
  return (
    <div className="rounded-2xl border border-ink/10 bg-paper-card p-4">
      <p className="font-mono text-[10px] tracking-widest text-ink-faint">PREGUNTA {n + 1} DE 2</p>
      <p className="mt-1 text-[17px] font-semibold text-ink leading-snug">{q.pregunta}</p>
      <div className="mt-3 space-y-2">
        {q.opciones.map((o, i) => {
          const esCorrecta = i === q.correcta;
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
              whileTap={respondida ? undefined : { scale: 0.98 }}
              disabled={respondida}
              onClick={() => responderQuiz(idLeccion, n, i)}
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
          <b style={{ color: respuesta === q.correcta ? C.green : C.red }}>{respuesta === q.correcta ? "Correcto. " : "No exactamente. "}</b>
          {q.explicacion}
        </motion.p>
      )}
    </div>
  );
}

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
  const [practicados, setPracticados] = useState<boolean[]>(() => leccion.practica.pasos.map(() => false));
  const respuestas = leccion.quiz.map((_, i) => estado.quiz[`${leccion.id}#${i}`]);
  const todas = respuestas.every((r) => r !== undefined);
  const aciertos = respuestas.filter((r, i) => r === leccion.quiz[i].correcta).length;
  const hecha = leccion.id in estado.hechas;
  const tagColor = leccion.etiqueta === "HECHO" ? C.teal : C.joule;

  return (
    <article className="space-y-6">
      <header>
        <h2 className="text-[28px] font-bold leading-tight text-ink">{leccion.titulo}</h2>
        <p className="mt-2 text-lg text-ink-soft leading-snug">{leccion.gancho}</p>
        <div className="mt-3 flex flex-wrap items-center gap-2 font-mono text-[10px] tracking-widest">
          <span className="px-2 py-1 rounded text-white" style={{ background: eje.color }}>
            {eje.nombre.toUpperCase()}
          </span>
          <span className="flex items-center gap-1 text-ink-faint">
            <Clock className="w-3 h-3" /> LECCIÓN {leccion.minutos} MIN + PRÁCTICA {leccion.practica.minutos} MIN
          </span>
          <span className="px-2 py-1 rounded border" style={{ color: tagColor, borderColor: `${tagColor}55`, background: `${tagColor}12` }}>
            [{leccion.etiqueta}]
          </span>
        </div>
      </header>

      <Seccion n="01" titulo="Objetivo">
        <p className="text-[17px] leading-snug text-ink">
          <span className="text-ink-faint">Al terminar podrás: </span>
          {leccion.objetivo.charAt(0).toLowerCase() + leccion.objetivo.slice(1)}
        </p>
      </Seccion>

      <Seccion n="02" titulo="Visual">
        <Visual k={leccion.visual} />
      </Seccion>

      <Seccion n="03" titulo="Ideas clave">
        <ol className="space-y-3">
          {leccion.puntos.map((p, i) => (
            <li key={i} className="flex gap-3 items-start">
              <span className="h-7 w-7 shrink-0 rounded-md flex items-center justify-center text-sm font-bold text-white" style={{ background: eje.color }}>
                {i + 1}
              </span>
              <p className="text-[16px] leading-snug text-ink pt-0.5">{p}</p>
            </li>
          ))}
        </ol>
      </Seccion>

      <Seccion n="04" titulo="En SuccessFactors y HCM">
        <p className="rounded-xl border-l-4 bg-paper-card px-4 py-3 text-[16px] leading-relaxed text-ink" style={{ borderColor: eje.color }}>
          {leccion.hcm}
        </p>
      </Seccion>

      <Seccion n="05" titulo={`Práctica · ${leccion.practica.minutos} min`}>
        <p className="text-[17px] font-semibold text-ink leading-snug">{leccion.practica.titulo}</p>
        <ul className="mt-3 space-y-2">
          {leccion.practica.pasos.map((p, i) => (
            <li key={i}>
              <button
                onClick={() => setPracticados((s) => s.map((v, k) => (k === i ? !v : v)))}
                aria-pressed={practicados[i]}
                className="w-full min-h-12 rounded-xl border px-3 py-2.5 text-left flex items-start gap-3 transition-colors"
                style={{ borderColor: practicados[i] ? C.green : C.line, background: practicados[i] ? "#e5f4ec" : "#fff" }}
              >
                <span className={`mt-0.5 h-5 w-5 shrink-0 rounded flex items-center justify-center ${practicados[i] ? "bg-[#2e9e5b]" : "border-2 border-paper-line"}`}>
                  {practicados[i] && <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />}
                </span>
                <span className={`text-[15px] leading-snug ${practicados[i] ? "text-ink-soft" : "text-ink"}`}>{p}</span>
              </button>
            </li>
          ))}
        </ul>
      </Seccion>

      <Seccion n="06" titulo="Comprobación">
        <div className="space-y-3">
          {leccion.quiz.map((q, i) => (
            <PreguntaQuiz key={i} idLeccion={leccion.id} n={i} q={q} respuesta={respuestas[i]} />
          ))}
        </div>
      </Seccion>

      <Seccion n="07" titulo="Para la entrevista">
        <blockquote className="relative rounded-xl bg-ink px-5 py-4 text-[16px] leading-relaxed text-white">
          <Quote className="absolute right-3 top-3 w-5 h-5 text-white/20" />
          {leccion.entrevista}
        </blockquote>
      </Seccion>

      {leccion.fuente && (
        <p className="text-xs text-ink-faint leading-relaxed">
          Fuente:{" "}
          {leccion.fuente.href ? (
            <a
              href={leccion.fuente.href}
              {...(leccion.fuente.href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              className="underline underline-offset-2"
            >
              {leccion.fuente.label}
            </a>
          ) : (
            leccion.fuente.label
          )}
          . Orientación formativa, no asesoría jurídica.
        </p>
      )}

      {hecha ? (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl border border-ink/10 bg-paper-card p-5">
          <div className="flex items-center gap-3">
            <span className="h-11 w-11 rounded-full bg-[#2e9e5b] flex items-center justify-center">
              <Award className="w-6 h-6 text-white" />
            </span>
            <div>
              <p className="text-lg font-bold text-ink leading-tight">Lección completada</p>
              <p className="text-sm text-ink-soft">
                Respuestas correctas: {aciertos} de {leccion.quiz.length}
              </p>
            </div>
          </div>
          {onSiguiente && (
            <button onClick={onSiguiente} className="mt-4 w-full min-h-12 rounded-xl bg-ink text-white font-semibold inline-flex items-center justify-center gap-2">
              Abrir la siguiente lección <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </motion.div>
      ) : (
        <button
          disabled={!todas}
          onClick={() => {
            marcarHecha(leccion.id, hoy);
            onHecha?.();
          }}
          className="w-full min-h-14 rounded-2xl bg-ink text-white text-lg font-bold disabled:opacity-35 active:scale-[0.98] transition-transform"
        >
          {todas ? "Marcar lección como completada" : "Responde las 2 preguntas para cerrar"}
        </button>
      )}
    </article>
  );
}
