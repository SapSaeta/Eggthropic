"use client";

import { useState, useRef } from "react";
import { ArrowRight, AlertCircle, Loader2, ArrowLeftRight } from "lucide-react";

type Direction = "tecnico-funcional" | "funcional-tecnico";

const DIRECTIONS: { id: Direction; label: string; soon?: boolean }[] = [
  { id: "tecnico-funcional", label: "Técnico → Funcional" },
  { id: "funcional-tecnico", label: "Funcional → Técnico", soon: true },
];

const PLACEHOLDER = `Pega aquí tu código ABAP o comentario de cambio.

Ejemplo:
*INI bnqbs CH00123
  IF pa0001-werks = '1000'.
    lv_activo = abap_true.
  ENDIF.
*FIN bnqbs CH00123`;

export default function TraductorPage() {
  const [direction, setDirection] = useState<Direction>("tecnico-funcional");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const abortRef = useRef<AbortController | null>(null);

  const charCount = input.length;
  const overLimit = charCount > 12_000;

  async function handleTranslate() {
    if (!input.trim() || overLimit || loading) return;

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setOutput("");
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/traductor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input, direction }),
        signal: controller.signal,
      });

      if (!res.ok) {
        const msg = await res.text();
        setError(msg || "Error inesperado.");
        return;
      }

      const reader = res.body?.getReader();
      if (!reader) return;

      const decoder = new TextDecoder();
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        setOutput((prev) => prev + decoder.decode(value, { stream: true }));
      }
    } catch (err: unknown) {
      if (err instanceof Error && err.name !== "AbortError") {
        setError("Error de red. Comprueba tu conexión e inténtalo de nuevo.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-lab-900 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <span className="font-mono text-[10px] tracking-widest text-zinc-400 uppercase">
            Herramientas / SAP HCM
          </span>
          <h1
            className="mt-2 text-3xl font-bold text-zinc-900"
            style={{ fontFamily: "var(--font-playfair, serif)" }}
          >
            Traductor Técnico ↔ Funcional
          </h1>
          <p className="mt-2 text-sm text-zinc-500 max-w-xl">
            Convierte código ABAP o comentarios de cambio SAP HCM en documentación
            funcional comprensible para personas de negocio.
          </p>
        </div>

        {/* Direction selector */}
        <div className="flex gap-2 mb-6">
          {DIRECTIONS.map((d) => (
            <button
              key={d.id}
              onClick={() => !d.soon && setDirection(d.id)}
              disabled={!!d.soon}
              title={d.soon ? "Próximamente" : undefined}
              className={[
                "inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-mono transition-all border",
                direction === d.id && !d.soon
                  ? "bg-zinc-900 text-white border-zinc-900"
                  : d.soon
                  ? "text-zinc-400 border-zinc-200 cursor-not-allowed opacity-60"
                  : "text-zinc-600 border-zinc-200 hover:border-zinc-400",
              ].join(" ")}
            >
              <ArrowLeftRight className="w-3.5 h-3.5" />
              {d.label}
              {d.soon && (
                <span className="px-1.5 py-0.5 rounded-full bg-zinc-100 text-zinc-400 text-[9px] font-mono">
                  próximamente
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Main panels */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Input */}
          <div className="glass rounded-xl p-4 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] tracking-widest text-zinc-400 uppercase">
                Entrada — Código ABAP / Comentario
              </span>
              <span
                className={`font-mono text-[10px] ${
                  overLimit ? "text-red-500" : "text-zinc-400"
                }`}
              >
                {charCount.toLocaleString()} / 12 000
              </span>
            </div>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={PLACEHOLDER}
              rows={18}
              className={[
                "w-full resize-none font-mono text-xs text-zinc-800 bg-transparent",
                "placeholder:text-zinc-300 focus:outline-none leading-relaxed",
                overLimit ? "text-red-500" : "",
              ].join(" ")}
            />
            {overLimit && (
              <p className="flex items-center gap-1 text-xs text-red-500">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                Supera el límite de 12 000 caracteres.
              </p>
            )}
            <button
              onClick={handleTranslate}
              disabled={loading || !input.trim() || overLimit}
              className={[
                "self-end inline-flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-mono",
                "transition-all",
                loading || !input.trim() || overLimit
                  ? "bg-zinc-100 text-zinc-400 cursor-not-allowed"
                  : "bg-zinc-900 text-white hover:bg-zinc-700",
              ].join(" ")}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Traduciendo…
                </>
              ) : (
                <>
                  Traducir
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>

          {/* Output */}
          <div className="glass rounded-xl p-4 flex flex-col gap-3">
            <span className="font-mono text-[10px] tracking-widest text-zinc-400 uppercase">
              Resultado — Documentación Funcional
            </span>

            {error ? (
              <div className="flex items-start gap-2 text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                <AlertCircle className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                {error}
              </div>
            ) : null}

            <div className="flex-1 min-h-[300px]">
              {output ? (
                <pre className="whitespace-pre-wrap text-xs text-zinc-800 font-sans leading-relaxed">
                  {output}
                  {loading && (
                    <span className="inline-block w-1.5 h-3.5 bg-zinc-400 animate-pulse ml-0.5 align-middle" />
                  )}
                </pre>
              ) : (
                <div className="h-full flex items-center justify-center text-zinc-300 text-xs font-mono">
                  {loading ? "Generando…" : "Aquí aparecerá la traducción"}
                </div>
              )}
            </div>

            {/* Disclaimer */}
            <p className="text-[10px] text-zinc-400 border-t border-zinc-100 pt-2 leading-relaxed">
              Borrador generado por IA — verifícalo antes de usarlo en documentación
              oficial. Powered by Claude (Anthropic).
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
