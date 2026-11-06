"use client";

import { useState } from "react";
import { AlertTriangle, Check, Copy, Lock, Target } from "lucide-react";
import { pasosHechos, todosLosPasos } from "@/lib/ruta";
import { fijarBase, marcarPaso, type RutaState } from "@/lib/ruta-store";
import { BASES, TIERS, calcularTitulo } from "@/lib/titulo-cv";
import { C } from "./ui";

const titulosPaso = Object.fromEntries(todosLosPasos.map((p) => [p.id, p.titulo]));

function Copiar({ texto, etiqueta }: { texto: string; etiqueta: string }) {
  const [ok, setOk] = useState(false);
  return (
    <button
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(texto);
          setOk(true);
          setTimeout(() => setOk(false), 1600);
        } catch {
          // sin portapapeles: el texto sigue visible
        }
      }}
      className="min-h-11 rounded-lg border border-white/25 px-3 text-sm font-semibold inline-flex items-center gap-1.5 text-white active:bg-white/10"
    >
      {ok ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
      {ok ? "Copiado" : etiqueta}
    </button>
  );
}

/** Calcula tu título de CV según lo que has demostrado y te dice qué falta para el siguiente. */
export function TituloCv({ estado }: { estado: RutaState }) {
  const hechos = pasosHechos(estado.pasos);
  const res = calcularTitulo(hechos, estado.base);
  const [abierto, setAbierto] = useState<number | null>(null);

  const reqSig = res.siguiente?.requisitos ?? [];
  const cumplidos = reqSig.filter((r) => hechos.has(r)).length;

  return (
    <section className="space-y-5">
      {/* título actual */}
      <div className="rounded-2xl bg-ink p-5 text-white">
        <p className="font-mono text-[10px] tracking-[0.2em] text-[#ffd21a]">TÍTULO QUE PUEDES USAR HOY · NIVEL {res.indice + 1} DE {TIERS.length}</p>
        <p className="mt-2 text-2xl font-bold leading-tight">{res.es}</p>
        <p className="mt-1 text-sm text-stone-300 leading-snug">{res.en}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Copiar texto={res.es} etiqueta="Copiar en español" />
          <Copiar texto={res.en} etiqueta="Copiar en inglés" />
        </div>
      </div>

      {/* base */}
      <div>
        <p className="font-mono text-[10px] tracking-widest text-ink-faint mb-2">TU BASE PROFESIONAL (CÁMBIALA SI NO ES LA TUYA)</p>
        <div className="flex flex-wrap gap-1.5">
          {BASES.map((b) => (
            <button
              key={b.id}
              onClick={() => fijarBase(b.id)}
              aria-pressed={estado.base === b.id}
              className="min-h-10 rounded-full border-2 px-3 text-xs font-semibold"
              style={{ borderColor: estado.base === b.id ? C.teja : C.line, background: estado.base === b.id ? C.teja : "#fff", color: estado.base === b.id ? "#fff" : C.soft }}
            >
              {b.es}
            </button>
          ))}
        </div>
      </div>

      {/* siguiente título */}
      {res.siguiente ? (
        <div className="rounded-2xl border-2 border-ink/10 bg-paper-card p-4">
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4 text-teja" />
            <p className="font-mono text-[10px] tracking-[0.18em] text-teja">SIGUIENTE TÍTULO · {res.siguiente.nivel.toUpperCase()}</p>
          </div>
          <p className="mt-1 text-lg font-bold text-ink leading-snug">{res.siguiente.es(res.base)}</p>
          <div className="mt-3 h-2 rounded-full bg-paper-deep overflow-hidden">
            <div className="h-full rounded-full bg-teja transition-all" style={{ width: `${(cumplidos / reqSig.length) * 100}%` }} />
          </div>
          <p className="mt-1 text-xs text-ink-faint tabular-nums">
            {cumplidos} de {reqSig.length} requisitos
          </p>
          <p className="mt-3 text-sm font-semibold text-ink">Te falta demostrar:</p>
          <ul className="mt-1 space-y-1.5">
            {res.faltan.map((f) => (
              <li key={f.id} className="flex items-start gap-3">
                <span className="flex-1 text-[15px] text-ink leading-snug">{f.titulo}</span>
                <button onClick={() => marcarPaso(f.id, true)} className="min-h-10 shrink-0 rounded-lg border border-ink/20 bg-white px-2.5 text-xs font-semibold text-ink">
                  Ya lo tengo
                </button>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div className="rounded-2xl border-2 border-[#2e9e5b] bg-[#e5f4ec] p-4">
          <p className="font-bold text-[#1f7a45]">Has alcanzado el máximo nivel del programa.</p>
          <p className="text-sm text-ink-soft mt-1">Mantén las pruebas públicas actualizadas: son lo que respalda el título.</p>
        </div>
      )}

      {/* qué no poner */}
      <div className="rounded-2xl border border-[#c79b00]/50 bg-[#fff6dc] p-4 flex gap-3">
        <AlertTriangle className="w-5 h-5 shrink-0 text-[#9a7800] mt-0.5" />
        <div>
          <p className="text-sm font-bold text-[#6b5200]">Todavía no pongas</p>
          <p className="text-sm text-[#6b5200] leading-snug mt-0.5">{res.tier.evitar}</p>
        </div>
      </div>

      {/* titular */}
      <div className="rounded-2xl border border-ink/10 bg-white p-4">
        <p className="font-mono text-[10px] tracking-[0.18em] text-ink-faint">TITULAR DE LINKEDIN · {res.titular.length} DE 220 CARACTERES</p>
        <p className="mt-2 text-[15px] leading-snug text-ink">{res.titular}</p>
        <div className="mt-3 [&_button]:text-ink [&_button]:border-ink/20 [&_button]:active:bg-paper-deep">
          <Copiar texto={res.titular} etiqueta="Copiar titular" />
        </div>
      </div>

      {/* escalera */}
      <div>
        <p className="font-mono text-[10px] tracking-widest text-ink-faint mb-2">LA ESCALERA COMPLETA · TOCA UN NIVEL</p>
        <ol className="space-y-1.5">
          {TIERS.map((t, i) => {
            const alcanzado = i <= res.indice;
            const actual = i === res.indice;
            return (
              <li key={t.id}>
                <button
                  onClick={() => setAbierto(abierto === i ? null : i)}
                  aria-expanded={abierto === i}
                  className="w-full rounded-xl border-2 px-3 py-2.5 text-left transition-colors"
                  style={{ borderColor: actual ? C.teja : C.line, background: actual ? "#f3ddd2" : alcanzado ? "#fff" : "#f4eee2" }}
                >
                  <span className="flex items-center gap-3">
                    <span className="h-7 w-7 shrink-0 rounded-full flex items-center justify-center text-xs font-bold" style={{ background: alcanzado ? C.teja : C.line, color: alcanzado ? "#fff" : C.faint }}>
                      {alcanzado ? <Check className="w-4 h-4" strokeWidth={3} /> : <Lock className="w-3.5 h-3.5" />}
                    </span>
                    <span className="flex-1">
                      <span className="block font-mono text-[10px] tracking-widest" style={{ color: alcanzado ? C.teja : C.faint }}>
                        NIVEL {i + 1} · {t.nivel.toUpperCase()}
                      </span>
                      <span className={`block text-sm leading-snug ${alcanzado ? "text-ink font-semibold" : "text-ink-soft"}`}>{t.es(res.base)}</span>
                    </span>
                  </span>
                  {abierto === i && (
                    <span className="block mt-3 pl-10">
                      {t.requisitos.length === 0 ? (
                        <span className="block text-xs text-ink-soft">Sin requisitos: es tu punto de partida.</span>
                      ) : (
                        <span className="block space-y-1">
                          {t.requisitos.map((r) => (
                            <span key={r} className="flex gap-2 text-xs leading-snug">
                              <span className={hechos.has(r) ? "text-[#2e9e5b]" : "text-ink-faint"}>{hechos.has(r) ? "✓" : "○"}</span>
                              <span className={hechos.has(r) ? "text-ink" : "text-ink-soft"}>{titulosPaso[r]}</span>
                            </span>
                          ))}
                        </span>
                      )}
                    </span>
                  )}
                </button>
              </li>
            );
          })}
        </ol>
      </div>

      <p className="text-xs text-ink-faint leading-relaxed">
        Cada título exige pasos demostrados, no solo estudiar. Las marcas se guardan en este dispositivo; el CV público (/cv) refleja solo lo publicado en el repositorio.
      </p>
    </section>
  );
}
