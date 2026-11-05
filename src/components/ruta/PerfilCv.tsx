"use client";

import Link from "next/link";
import { ArrowRight, FlaskConical, Hammer, Printer, ShieldCheck } from "lucide-react";
import { habilidades, type PerfilEstado } from "@/lib/ruta";

const META: Record<PerfilEstado, { label: string; icon: typeof FlaskConical; color: string }> = {
  certificado: { label: "CERTIFICADO", icon: ShieldCheck, color: "#0a6ed1" },
  probado: { label: "PROBADO", icon: FlaskConical, color: "#0d9488" },
  construyendo: { label: "EN CONSTRUCCIÓN", icon: Hammer, color: "#8a7e6d" },
};

/** Perfil / CV: cada habilidad con su prueba pública. */
export function PerfilCv() {
  return (
    <section className="space-y-4">
      <div>
        <p className="font-mono text-[11px] tracking-[0.2em] text-teja mb-1">PERFIL</p>
        <h2 className="text-2xl font-bold text-ink leading-tight">
          SAP HCM + <span className="gradient-text">IA agéntica</span>
        </h2>
        <p className="mt-2 text-ink-soft">
          Objetivo: SAP Business AI / Agentic Solutions Architect, empezando por HCM. Solo cuenta lo certificado o probado con evidencia.
        </p>
      </div>

      <div className="space-y-3">
        {habilidades.map((h) => {
          const m = META[h.estado];
          const Icon = m.icon;
          const construyendo = h.estado === "construyendo";
          return (
            <div
              key={h.titulo}
              className={`rounded-2xl p-4 ${construyendo ? "border-2 border-dashed border-paper-line" : "glass"}`}
              style={{ breakInside: "avoid" }}
            >
              <span
                className="inline-flex items-center gap-1.5 px-2 py-1 rounded font-mono text-[10px] tracking-widest border"
                style={{ color: m.color, borderColor: `${m.color}55`, background: `${m.color}12` }}
              >
                <Icon className="w-3 h-3" /> {m.label}
              </span>
              <h3 className="mt-2 text-lg font-semibold text-ink leading-snug">{h.titulo}</h3>
              <p className="mt-1 text-[15px] text-ink-soft leading-relaxed">{h.resumen}</p>
              {h.prueba && (
                <Link href={h.prueba.href} className="mt-2 inline-flex items-center gap-1 text-sm font-semibold text-teja min-h-10">
                  {h.prueba.label} <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              )}
            </div>
          );
        })}
      </div>

      <p className="text-xs text-ink-faint leading-relaxed">
        Todo el laboratorio usa datos ficticios. Nunca datos reales de empleados: en RRHH son de alto riesgo según el AI Act.
      </p>

      <button
        onClick={() => window.print()}
        className="no-print w-full min-h-12 rounded-xl border-2 border-ink/15 bg-white font-semibold flex items-center justify-center gap-2"
      >
        <Printer className="w-4 h-4" /> Guardar como PDF
      </button>
    </section>
  );
}
